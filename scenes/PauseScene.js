// Importa o sistema de música, usado para pausar, retomar e ajustar o volume.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe PauseScene, responsável pelo menu de pausa.
export default class PauseScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "PauseScene".
        super('PauseScene');
    }

    // Função chamada quando a cena recebe dados ao iniciar.
    init(data) {

        // Guarda a cena do nível que foi pausada.
        this.levelScene = data?.levelScene || 'Level1';
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e a altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Índice da opção atualmente selecionada.
        this.selectedIndex = 0;

        // Controla se a cena já está a trocar para outra.
        this.isChangingScene = false;

        // Lista dos botões do menu de pausa.
        this.pauseButtons = [];

        // Guarda qual painel está aberto.
        this.currentPanel = null;

        // Guarda os objetos criados dentro do painel.
        this.panelObjects = [];

        // Texto da percentagem do volume.
        this.volumeText = null;

        // Parte preenchida da barra de volume.
        this.volumeBarFill = null;

        // Botão circular da barra de volume.
        this.volumeKnob = null;

        // Dados da barra de volume.
        this.volumeBarData = null;

        // Guarda se a música foi pausada por esta cena de pausa.
        this.musicWasPausedByPause = false;

        // Pausa a música quando entra na pausa
        this.pauseCurrentMusic();

        // Fundo escuro.

        // Cria uma camada preta transparente por cima do jogo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da camada.
            .setAlpha(0.65)

            // Define a profundidade da camada.
            .setDepth(1);

        // Título.

        // Adiciona a caixa visual do título.
        this.add.image(width / 2, height * 0.20, 'caixaTitulo')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da caixa.
            .setScale(0.2)

            // Define a profundidade da caixa.
            .setDepth(2);

        // Adiciona o texto "PAUSA".
        this.add.text(width / 2, height * 0.22, 'PAUSA', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '34px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto por cima da caixa.
        .setDepth(3);

        // Teclas.

        // Cria a tecla cima.
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Cria a tecla baixo.
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Cria a tecla esquerda.
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        // Cria a tecla direita.
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla SPACE.
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cria a tecla ESC.
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Opções.

        // Cria a lista de opções do menu de pausa.
        this.pauseOptions = [
            {
                // Texto da primeira opção.
                text: 'CONTINUAR',

                // Caixa visual usada nesta opção.
                box: 'btnControlsRed',

                // Ação para continuar o jogo.
                action: () => this.resumeGame()
            },
            {
                // Texto da segunda opção.
                text: 'CONTROLES',

                // Caixa visual usada nesta opção.
                box: 'btnControlsCav',

                // Ação para abrir o painel de controlos.
                action: () => this.openControlsPanel()
            },
            {
                // Texto da terceira opção.
                text: 'REINICIAR',

                // Caixa visual usada nesta opção.
                box: 'btnControlsLos',

                // Ação para reiniciar o nível.
                action: () => this.restartLevel()
            },
            {
                // Texto da quarta opção.
                text: 'VOLTAR AO MENU',

                // Caixa visual usada nesta opção.
                box: 'btnControlsEsc',

                // Ação para voltar ao menu principal.
                action: () => this.backToMenu()
            }
        ];

        // Cria visualmente o menu de pausa.
        this.createPauseMenu();

        // Atualiza a seleção inicial.
        this.updateSelection();
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena já estiver a mudar, não aceita inputs.
        if (this.isChangingScene) return;

        // Painel aberto.

        // Se existir um painel aberto.
        if (this.currentPanel) {

            // Se o painel aberto for o painel de controlos.
            if (this.currentPanel === 'CONTROLES') {

                // Atualiza a interface do volume.
                this.refreshVolumeUI();

                // Se carregar na tecla esquerda.
                if (Phaser.Input.Keyboard.JustDown(this.keyLeft)) {

                    // Diminui o volume.
                    this.applyMusicVolume(this.getMusicVolume() - 0.1);
                }

                // Se carregar na tecla direita.
                if (Phaser.Input.Keyboard.JustDown(this.keyRight)) {

                    // Aumenta o volume.
                    this.applyMusicVolume(this.getMusicVolume() + 0.1);
                }
            }

            // Se carregar ESC com painel aberto.
            if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

                // Fecha o painel.
                this.closePanel();
            }

            // Para aqui para não controlar o menu principal.
            return;
        }

        // Menu principal.

        // Se carregar na tecla cima.
        if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

            // Move a seleção para cima.
            this.selectedIndex--;

            // Se passar da primeira opção, vai para a última.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.pauseButtons.length - 1;
            }

            // Atualiza visualmente a seleção.
            this.updateSelection();
        }

        // Se carregar na tecla baixo.
        if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {

            // Move a seleção para baixo.
            this.selectedIndex++;

            // Se passar da última opção, volta para a primeira.
            if (this.selectedIndex >= this.pauseButtons.length) {
                this.selectedIndex = 0;
            }

            // Atualiza visualmente a seleção.
            this.updateSelection();
        }

        // Se carregar ENTER ou SPACE.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            Phaser.Input.Keyboard.JustDown(this.keySpace)
        ) {

            // Executa a opção selecionada.
            this.pauseOptions[this.selectedIndex].action();
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

            // Continua o jogo.
            this.resumeGame();
        }
    }

    // Música.

    // Pausa a música atual.
    pauseCurrentMusic() {

        // Verifica se existe música a tocar e se ela pode ser pausada.
        if (
            MusicSystem.currentMusic &&
            MusicSystem.currentMusic.isPlaying &&
            MusicSystem.currentMusic.pause
        ) {

            // Pausa a música atual.
            MusicSystem.currentMusic.pause();

            // Marca que a música foi pausada pela PauseScene.
            this.musicWasPausedByPause = true;
        }
    }

    // Retoma a música pausada pela PauseScene.
    resumeCurrentMusic() {

        // Verifica se a música foi pausada por esta cena e se pode ser retomada.
        if (
            this.musicWasPausedByPause &&
            MusicSystem.currentMusic &&
            MusicSystem.currentMusic.resume
        ) {

            // Retoma a música.
            MusicSystem.currentMusic.resume();
        }

        // Limpa o estado de música pausada pela PauseScene.
        this.musicWasPausedByPause = false;
    }

    // Vai buscar o volume atual da música.
    getMusicVolume() {

        // Tenta buscar o volume no registry.
        let value = this.registry.get('musicVolume');

        // Se o valor não for um número válido.
        if (typeof value !== 'number' || Number.isNaN(value)) {

            // Tenta buscar o volume no localStorage.
            const savedVolume = localStorage.getItem('musicVolume');

            // Se existir volume guardado.
            if (savedVolume !== null) {

                // Converte o valor para número.
                value = Number(savedVolume);
            }
        }

        // Se ainda não houver valor válido.
        if (typeof value !== 'number' || Number.isNaN(value)) {

            // Usa o volume global do MusicSystem ou 0.45 como padrão.
            value =
                MusicSystem.masterVolume ??
                MusicSystem.volume ??
                0.45;
        }

        // Limita o volume entre 0 e 1.
        return Phaser.Math.Clamp(value, 0, 1);
    }

    // Interatividade segura.

    // Torna um objeto interativo.
    makeInteractive(gameObject) {

        // Se o objeto não existir, não faz nada.
        if (!gameObject) return;

        // Ativa interatividade.
        gameObject.setInteractive();

        // Se o input existir.
        if (gameObject.input) {

            // Muda o cursor para mão.
            gameObject.input.cursor = 'pointer';
        }
    }

    // Torna um container interativo com uma hitbox retangular.
    makeContainerInteractive(container, width, height) {

        // Se o container não existir, não faz nada.
        if (!container) return;

        // Se o container já tiver input.
        if (container.input) {

            // Desativa a interatividade anterior.
            container.disableInteractive();
        }

        // Define o tamanho do container.
        container.setSize(width, height);

        // Define uma área retangular clicável personalizada.
        container.setInteractive(
            new Phaser.Geom.Rectangle(
                -width / 2,
                -height / 2,
                width,
                height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // Se o input existir.
        if (container.input) {

            // Muda o cursor para mão.
            container.input.cursor = 'pointer';
        }
    }

    // Menu de pausa.

    // Cria o menu principal da pausa.
    createPauseMenu() {

        // Guarda a largura e a altura da câmara.
        const { width, height } = this.cameras.main;

        // Calcula o centro horizontal.
        const centerX = width / 2;

        // Define a posição Y inicial dos botões.
        const startY = height * 0.38;

        // Define o espaço vertical entre botões.
        const gapY = 82;

        // Limpa a lista de botões.
        this.pauseButtons = [];

        // Percorre todas as opções da pausa.
        for (let i = 0; i < this.pauseOptions.length; i++) {

            // Guarda a opção atual.
            const option = this.pauseOptions[i];

            // Calcula o Y deste botão.
            const y = startY + i * gapY;

            // Cria o botão da pausa.
            const button = this.createPauseButton(
                centerX,
                y,
                option.text,
                option.box,
                () => {

                    // Atualiza o índice selecionado.
                    this.selectedIndex = i;

                    // Atualiza a seleção visual.
                    this.updateSelection();

                    // Executa a ação da opção.
                    option.action();
                }
            );

            // Quando o rato passa por cima do container.
            button.container.on('pointerover', () => {

                // Seleciona este botão.
                this.selectedIndex = i;

                // Atualiza visualmente.
                this.updateSelection();
            });

            // Quando o rato passa por cima da caixa.
            button.box.on('pointerover', () => {

                // Seleciona este botão.
                this.selectedIndex = i;

                // Atualiza visualmente.
                this.updateSelection();
            });

            // Quando o rato passa por cima do texto.
            button.label.on('pointerover', () => {

                // Seleciona este botão.
                this.selectedIndex = i;

                // Atualiza visualmente.
                this.updateSelection();
            });

            // Guarda o botão criado.
            this.pauseButtons.push(button);
        }

        // Cria o losango seletor da pausa.
        this.pauseSelector = this.add.polygon(
            centerX - 165,
            startY,
            [
                0, 8,
                13, 0,
                26, 8,
                13, 16
            ],
            0xffd36a
        )

        // Centra o losango.
        .setOrigin(0.5)

        // Define a profundidade do losango.
        .setDepth(10);

        // Anima o losango seletor.
        this.tweens.add({

            // Define o alvo da animação.
            targets: this.pauseSelector,

            // Move o losango para a esquerda.
            x: this.pauseSelector.x - 8,

            // Define a duração.
            duration: 500,

            // Faz voltar ao início.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

        // Cria o texto de ajuda do menu de pausa.
        this.helpText = this.add.text(
            centerX,
            height * 0.86,
            '↑ ↓ Navegar    ENTER Selecionar    ESC Continuar',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85)

        // Define profundidade.
        .setDepth(10);
    }

    // Cria um botão do menu de pausa.
    createPauseButton(x, y, text, boxKey, callback) {

        // Cria o container do botão.
        const container = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(5);

        // Cria a imagem/caixa do botão.
        const box = this.add.image(0, 0, boxKey)

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala.
            .setScale(0.14);

        // Cria o texto do botão.
        const label = this.add.text(0, 5, text, {
            fontFamily: 'MedievalSharp, Arial',
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona a caixa e o texto ao container.
        container.add([box, label]);

        // Torna o container interativo.
        this.makeContainerInteractive(container, 360, 70);

        // Torna a caixa interativa.
        this.makeInteractive(box);

        // Torna o texto interativo.
        this.makeInteractive(label);

        // Quando clica no container, executa a callback.
        container.on('pointerdown', callback);

        // Quando clica na caixa, executa a callback.
        box.on('pointerdown', callback);

        // Quando clica no texto, executa a callback.
        label.on('pointerdown', callback);

        // Devolve as referências do botão.
        return {
            container,
            box,
            label
        };
    }

    // Atualiza visualmente a opção selecionada.
    updateSelection() {

        // Se não houver botões, não faz nada.
        if (!this.pauseButtons || this.pauseButtons.length === 0) return;

        // Percorre todos os botões.
        for (let i = 0; i < this.pauseButtons.length; i++) {

            // Guarda o botão atual.
            const btn = this.pauseButtons[i];

            // Se este botão for o selecionado.
            if (i === this.selectedIndex) {

                // Aumenta ligeiramente a caixa.
                btn.box.setScale(0.145);

                // Deixa a caixa totalmente visível.
                btn.box.setAlpha(1);

                // Muda o texto para dourado.
                btn.label.setColor('#ffd700');

                // Aumenta ligeiramente o texto.
                btn.label.setScale(1.05);
            } else {

                // Volta a caixa ao tamanho normal.
                btn.box.setScale(0.14);

                // Deixa a caixa um pouco transparente.
                btn.box.setAlpha(0.85);

                // Volta o texto a branco.
                btn.label.setColor('#ffffff');

                // Volta o texto ao tamanho normal.
                btn.label.setScale(1);
            }
        }

        // Guarda o botão selecionado.
        const selected = this.pauseButtons[this.selectedIndex];

        // Se existir seletor.
        if (this.pauseSelector) {

            // Move o seletor para o Y do botão selecionado.
            this.pauseSelector.y = selected.container.y;
        }
    }

    // Esconde os botões principais da pausa.
    hidePauseButtons() {

        // Percorre todos os botões.
        this.pauseButtons.forEach(btn => {

            // Esconde o container.
            btn.container.setVisible(false);

            // Desativa a interatividade do container.
            btn.container.disableInteractive();

            // Desativa a interatividade da caixa.
            btn.box.disableInteractive();

            // Desativa a interatividade do texto.
            btn.label.disableInteractive();
        });

        // Se existir seletor.
        if (this.pauseSelector) {

            // Esconde o seletor.
            this.pauseSelector.setVisible(false);
        }

        // Se existir texto de ajuda.
        if (this.helpText) {

            // Esconde o texto de ajuda.
            this.helpText.setVisible(false);
        }
    }

    // Mostra novamente os botões principais da pausa.
    showPauseButtons() {

        // Percorre todos os botões.
        this.pauseButtons.forEach(btn => {

            // Mostra o container.
            btn.container.setVisible(true);

            // Reativa a interatividade do container.
            this.makeContainerInteractive(btn.container, 360, 70);

            // Reativa a interatividade da caixa.
            this.makeInteractive(btn.box);

            // Reativa a interatividade do texto.
            this.makeInteractive(btn.label);
        });

        // Se existir seletor.
        if (this.pauseSelector) {

            // Mostra o seletor.
            this.pauseSelector.setVisible(true);
        }

        // Se existir texto de ajuda.
        if (this.helpText) {

            // Mostra o texto de ajuda.
            this.helpText.setVisible(true);
        }

        // Atualiza a seleção visual.
        this.updateSelection();
    }

    // Limpa o painel aberto.
    clearPanel() {

        // Percorre todos os objetos do painel.
        this.panelObjects.forEach(obj => {

            // Se o objeto existir e tiver destroy.
            if (obj && obj.destroy) {

                // Destroi o objeto.
                obj.destroy();
            }
        });

        // Limpa a lista dos objetos do painel.
        this.panelObjects = [];

        // Remove o painel atual.
        this.currentPanel = null;

        // Limpa a referência do texto do volume.
        this.volumeText = null;

        // Limpa a referência da barra de volume.
        this.volumeBarFill = null;

        // Limpa a referência do botão do volume.
        this.volumeKnob = null;

        // Limpa os dados da barra.
        this.volumeBarData = null;
    }

    // Fecha o painel e volta ao menu de pausa.
    closePanel() {

        // Limpa o painel.
        this.clearPanel();

        // Mostra os botões da pausa.
        this.showPauseButtons();
    }

    // Painel de controles.

    // Abre o painel de controlos.
    openControlsPanel() {

        // Esconde os botões da pausa.
        this.hidePauseButtons();

        // Limpa qualquer painel aberto.
        this.clearPanel();

        // Define o painel atual como CONTROLES.
        this.currentPanel = 'CONTROLES';

        // Guarda a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Calcula o centro X.
        const centerX = width / 2;

        // Calcula o centro Y do painel.
        const centerY = height / 2 + 35;

        // Cria um fundo escuro por trás do painel.
        const fader = this.add.rectangle(0, 0, width, height, 0x000000)

            // Define origem no canto superior esquerdo.
            .setOrigin(0)

            // Define transparência.
            .setAlpha(0.35)

            // Define profundidade.
            .setDepth(20);

        // Cria o título do painel.
        const title = this.add.text(centerX, height * 0.27, 'CONTROLES', {
            fontFamily: 'MedievalSharp, Arial',
            fontSize: '36px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        })

        // Centra o título.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(22);

        // Cria o subtítulo do painel.
        const subtitle = this.add.text(centerX, height * 0.31, 'Comandos dos jogadores e volume da música', {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#d8d8d8',
            stroke: '#000000',
            strokeThickness: 3
        })

        // Centra o subtítulo.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(22);

        // Guarda os objetos do painel.
        this.panelObjects.push(fader, title, subtitle);

        // Cria o fundo do painel.
        const panelBg = this.add.rectangle(
            centerX,
            centerY + 30,
            670,
            355,
            0x000000
        )

        // Centra o fundo.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.32)

        // Define profundidade.
        .setDepth(21);

        // Cria uma barra decorativa.
        const selectorBar = this.add.rectangle(
            centerX,
            centerY - 120,
            590,
            34,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.18)

        // Define profundidade.
        .setDepth(22);

        // Cria o losango decorativo.
        const diamond = this.add.polygon(
            centerX - 310,
            centerY - 120,
            [
                0, 8,
                13, 0,
                26, 8,
                13, 16
            ],
            0xffd36a
        )

        // Centra o losango.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Anima o losango.
        this.tweens.add({
            targets: diamond,
            x: diamond.x - 8,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Guarda os objetos visuais principais do painel.
        this.panelObjects.push(panelBg, selectorBar, diamond);

        // Define as linhas de comandos do Player 1.
        const p1Rows = [
            ['Mover', 'Setas'],
            ['Ataque 1', 'J'],
            ['Ataque 2', 'K'],
            ['Ataque 3', 'L'],
            ['Bloquear', 'B'],
            ['Interagir', 'E']
        ];

        // Define as linhas de comandos do Player 2.
        const p2Rows = [
            ['Mover', 'W A S D'],
            ['Ataque 1', 'R'],
            ['Ataque 2', 'T'],
            ['Ataque 3', 'Q'],
            ['Bloquear', 'CTRL'],
            ['Interagir', 'E']
        ];

        // Cria a coluna de controlos do Player 1.
        this.createControlsColumn(centerX - 180, centerY - 120, 'JOGADOR 1', p1Rows);

        // Cria a coluna de controlos do Player 2.
        this.createControlsColumn(centerX + 180, centerY - 120, 'JOGADOR 2', p2Rows);

        // Cria a barra de volume.
        const soundObjects = this.createPauseVolumeBar(
            centerX,
            height * 0.72
        );

        // Guarda os objetos da barra de volume.
        this.panelObjects.push(...soundObjects);

        // Cria o aviso sobre ataques/heróis.
        const warningText = this.add.text(
            centerX,
            height * 0.81,
            'ATENÇÃO: nem todos os heróis têm bloqueio ou terceiro ataque.',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#ffd36a',
                stroke: '#000000',
                strokeThickness: 4
            }
        )

        // Centra o aviso.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Guarda o aviso nos objetos do painel.
        this.panelObjects.push(warningText);

        // Cria o botão voltar do painel.
        const backBtn = this.createPanelButton(
            centerX,
            height * 0.895,
            'VOLTAR',
            () => this.closePanel()
        );

        // Guarda o botão na lista de objetos do painel.
        this.panelObjects.push(backBtn);
    }

    // Cria uma coluna de controlos.
    createControlsColumn(x, y, title, rows) {

        // Cria o título da coluna.
        const titleText = this.add.text(x, y, title, {
            fontFamily: 'MedievalSharp, Arial',
            fontSize: '24px',
            color: '#f6e4b0',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })

        // Centra o título.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Guarda o título na lista de objetos do painel.
        this.panelObjects.push(titleText);

        // Define a posição Y inicial das linhas.
        const startY = y + 42;

        // Define o espaço vertical entre linhas.
        const gapY = 28;

        // Percorre todas as linhas da coluna.
        rows.forEach((row, i) => {

            // Calcula o Y desta linha.
            const rowY = startY + i * gapY;

            // Cria o texto da ação.
            const actionText = this.add.text(x - 105, rowY, row[0], {
                fontFamily: 'MedievalSharp, Arial',
                fontSize: '18px',
                color: '#f6e4b0',
                stroke: '#000000',
                strokeThickness: 3
            })

            // Alinha o texto à esquerda.
            .setOrigin(0, 0.5)

            // Define profundidade.
            .setDepth(24);

            // Cria o texto da tecla.
            const keyText = this.add.text(x + 95, rowY, row[1], {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            })

            // Centra o texto da tecla.
            .setOrigin(0.5)

            // Define profundidade.
            .setDepth(24);

            // Guarda os textos da linha nos objetos do painel.
            this.panelObjects.push(actionText, keyText);
        });
    }

    // Controlo de som.

    // Cria a barra de volume dentro da pausa.
    createPauseVolumeBar(x, y) {

        // Lista dos objetos criados.
        const objects = [];

        // Define a largura da barra.
        const barWidth = 220;

        // Define a altura da barra.
        const barHeight = 10;

        // Vai buscar o volume atual.
        const volume = this.getMusicVolume();

        // Cria o texto "Volume da música".
        const label = this.add.text(x, y - 28, 'Volume da música', {
            fontFamily: 'MedievalSharp, Arial',
            fontSize: '18px',
            color: '#f6e4b0',
            stroke: '#000000',
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Cria o texto da percentagem do volume.
        this.volumeText = this.add.text(x, y + 28, `${Math.round(volume * 100)}%`, {
            fontFamily: 'Arial',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Cria o botão de diminuir volume.
        const minusBtn = this.add.text(x - 150, y, '−', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        })

        // Centra o botão.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25);

        // Cria o botão de aumentar volume.
        const plusBtn = this.add.text(x + 150, y, '+', {
            fontFamily: 'Arial',
            fontSize: '23px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        })

        // Centra o botão.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25);

        // Cria o fundo da barra de volume.
        const barBg = this.add.rectangle(
            x,
            y,
            barWidth,
            barHeight,
            0x17100a
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define a borda da barra.
        .setStrokeStyle(2, 0x6f4a27)

        // Define profundidade.
        .setDepth(23);

        // Cria a parte preenchida da barra.
        this.volumeBarFill = this.add.rectangle(
            x - barWidth / 2,
            y,
            barWidth * volume,
            barHeight,
            0xd8b568
        )

        // Faz a barra crescer a partir da esquerda.
        .setOrigin(0, 0.5)

        // Define profundidade.
        .setDepth(24);

        // Cria o botão circular da barra.
        this.volumeKnob = this.add.circle(
            x - barWidth / 2 + barWidth * volume,
            y,
            8,
            0xf8f2df
        )

        // Define a borda do botão circular.
        .setStrokeStyle(2, 0xd8b568)

        // Define profundidade.
        .setDepth(26);

        // Torna o botão menos interativo.
        this.makeInteractive(minusBtn);

        // Torna o botão mais interativo.
        this.makeInteractive(plusBtn);

        // Torna o fundo da barra interativo.
        this.makeInteractive(barBg);

        // Torna a parte preenchida interativa.
        this.makeInteractive(this.volumeBarFill);

        // Torna o botão circular interativo.
        this.makeInteractive(this.volumeKnob);

        // Guarda os dados da barra de volume.
        this.volumeBarData = {
            x,
            barWidth
        };

        // Função que atualiza o volume através da posição do rato.
        const updateVolumeByPointer = (pointer) => {

            // Calcula a percentagem com base no X do ponteiro.
            const percent = (pointer.x - (x - barWidth / 2)) / barWidth;

            // Aplica o volume calculado.
            this.applyMusicVolume(percent);
        };

        // Permite clicar no fundo da barra para alterar volume.
        barBg.on('pointerdown', updateVolumeByPointer);

        // Permite clicar na parte preenchida para alterar volume.
        this.volumeBarFill.on('pointerdown', updateVolumeByPointer);

        // Permite arrastar o botão circular.
        this.input.setDraggable(this.volumeKnob);

        // Quando arrasta o botão circular.
        this.volumeKnob.on('drag', pointer => {

            // Atualiza o volume pela posição do ponteiro.
            updateVolumeByPointer(pointer);
        });

        // Quando passa o rato por cima do botão menos.
        minusBtn.on('pointerover', () => minusBtn.setColor('#ffd700'));

        // Quando o rato sai do botão menos.
        minusBtn.on('pointerout', () => minusBtn.setColor('#ffffff'));

        // Quando clica no botão menos.
        minusBtn.on('pointerdown', () => {

            // Diminui o volume.
            this.applyMusicVolume(this.getMusicVolume() - 0.1);
        });

        // Quando passa o rato por cima do botão mais.
        plusBtn.on('pointerover', () => plusBtn.setColor('#ffd700'));

        // Quando o rato sai do botão mais.
        plusBtn.on('pointerout', () => plusBtn.setColor('#ffffff'));

        // Quando clica no botão mais.
        plusBtn.on('pointerdown', () => {

            // Aumenta o volume.
            this.applyMusicVolume(this.getMusicVolume() + 0.1);
        });

        // Guarda todos os objetos criados.
        objects.push(
            label,
            this.volumeText,
            minusBtn,
            plusBtn,
            barBg,
            this.volumeBarFill,
            this.volumeKnob
        );

        // Devolve os objetos criados.
        return objects;
    }

    // Aplica o volume da música.
    applyMusicVolume(newVolume) {

        // Limita o volume entre 0 e 1.
        const volume = Phaser.Math.Clamp(newVolume, 0, 1);

        // Valor global partilhado.

        // Guarda o volume no registry.
        this.registry.set('musicVolume', volume);

        // Guarda o volume no localStorage.
        localStorage.setItem('musicVolume', String(volume));

        // Atualiza o volume global do MusicSystem.
        MusicSystem.masterVolume = volume;

        // Atualiza outro valor de volume do MusicSystem.
        MusicSystem.volume = volume;

        // Se existir função setVolume no MusicSystem.
        if (MusicSystem.setVolume) {

            // Aplica o volume usando essa função.
            MusicSystem.setVolume(volume);
        }

        // Se existir música atual.
        if (MusicSystem.currentMusic) {

            // Aplica o volume diretamente na música atual.
            MusicSystem.currentMusic.setVolume(volume);
        }

        // Atualiza a barra desta cena

        // Atualiza visualmente a barra de volume.
        this.refreshVolumeUI(volume);
    }

    // Atualiza visualmente o texto e a barra do volume.
    refreshVolumeUI(volume = this.getMusicVolume()) {

        // Limita o volume entre 0 e 1.
        volume = Phaser.Math.Clamp(volume, 0, 1);

        // Se existir texto de volume.
        if (this.volumeText) {

            // Atualiza o texto da percentagem.
            this.volumeText.setText(`${Math.round(volume * 100)}%`);
        }

        // Se não houver dados da barra, não faz nada.
        if (!this.volumeBarData) return;

        // Vai buscar dados da barra.
        const { x, barWidth } = this.volumeBarData;

        // Se existir parte preenchida da barra.
        if (this.volumeBarFill) {

            // Atualiza a largura da barra preenchida.
            this.volumeBarFill.width = barWidth * volume;
        }

        // Se existir brilho da barra.
        if (this.volumeBarLight) {

            // Atualiza a largura do brilho.
            this.volumeBarLight.width = barWidth * volume;
        }

        // Se existir botão circular.
        if (this.volumeKnob) {

            // Move o botão circular para a posição do volume.
            this.volumeKnob.x = x - barWidth / 2 + barWidth * volume;
        }
    }

    // Botão do painel.

    // Cria botão usado dentro dos painéis.
    createPanelButton(x, y, text, callback) {

        // Cria o container do botão.
        const container = this.add.container(x, y)

            // Define profundidade.
            .setDepth(30);

        // Cria a imagem do botão.
        const box = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define escala.
            .setScale(0.2);

        // Cria o texto do botão.
        const label = this.add.text(0, 5, text, {
            fontFamily: 'MedievalSharp, Arial',
            fontSize: '18px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona imagem e texto ao container.
        container.add([box, label]);

        // Torna o container interativo.
        this.makeContainerInteractive(container, 210, 55);

        // Torna a imagem interativa.
        this.makeInteractive(box);

        // Torna o texto interativo.
        this.makeInteractive(label);

        // Função para voltar o botão ao normal.
        const reset = () => {

            // Restaura a escala da imagem.
            box.setScale(0.2);

            // Restaura a cor do texto.
            label.setColor('#ffffff');
        };

        // Função para aplicar hover.
        const hover = () => {

            // Aumenta ligeiramente a imagem.
            box.setScale(0.21);

            // Muda o texto para dourado.
            label.setColor('#ffd700');
        };

        // Função para aplicar clique.
        const click = () => {

            // Mantém a escala do botão.
            box.setScale(0.2);

            // Mantém o texto dourado.
            label.setColor('#ffd700');
        };

        // Quando passa o rato por cima do container.
        container.on('pointerover', hover);

        // Quando o rato sai do container.
        container.on('pointerout', reset);

        // Quando clica no container.
        container.on('pointerdown', click);

        // Quando solta o clique no container.
        container.on('pointerup', () => {

            // Aplica hover novamente.
            hover();

            // Executa a função recebida.
            callback();
        });

        // Quando clica na imagem.
        box.on('pointerdown', click);

        // Quando solta o clique na imagem.
        box.on('pointerup', () => {

            // Aplica hover novamente.
            hover();

            // Executa a função recebida.
            callback();
        });

        // Quando clica no texto.
        label.on('pointerdown', click);

        // Quando solta o clique no texto.
        label.on('pointerup', () => {

            // Aplica hover novamente.
            hover();

            // Executa a função recebida.
            callback();
        });

        // Devolve o botão criado.
        return container;
    }

    // Helpers.

    // Devolve a key da cena do nível pausado.
    getLevelSceneKey() {

        // Se levelScene for string, já é a key.
        if (typeof this.levelScene === 'string') {
            return this.levelScene;
        }

        // Se levelScene for referência de cena, devolve a key.
        if (this.levelScene?.scene?.key) {
            return this.levelScene.scene.key;
        }

        // Se não conseguir encontrar, devolve null.
        return null;
    }

    // Ações.

    // Continua o jogo.
    resumeGame() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Vai buscar a key do nível.
        const levelKey = this.getLevelSceneKey();

        // Se a key for inválida.
        if (!levelKey) {

            // Mostra erro na consola.
            console.error('PauseScene: levelScene inválida no continuar:', this.levelScene);

            // Para a PauseScene.
            this.scene.stop();

            // Cancela a função.
            return;
        }

        // Vai buscar a cena do nível.
        const levelScene = this.scene.get(levelKey);

        // Retoma a música pausada.
        this.resumeCurrentMusic();

        // Se o nível estiver pausado.
        if (this.scene.isPaused(levelKey)) {

            // Retoma o nível.
            this.scene.resume(levelKey);
        }

        // Se o HUD estiver pausado.
        if (this.scene.isPaused('LevelHUDScene')) {

            // Retoma o HUD.
            this.scene.resume('LevelHUDScene');
        }

        // Se o HUD não estiver ativo.
        if (!this.scene.isActive('LevelHUDScene')) {

            // Lança o HUD novamente.
            this.scene.launch('LevelHUDScene', {
                levelScene: levelScene,
                levelKey: levelKey
            });
        }

        // Se o HUD estiver ativo.
        if (this.scene.isActive('LevelHUDScene')) {

            // Coloca o HUD no topo.
            this.scene.bringToTop('LevelHUDScene');
        }

        // Fecha a PauseScene.
        this.scene.stop();
    }

    // Reinicia o nível atual.
    restartLevel() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Vai buscar a key do nível.
        const levelKey = this.getLevelSceneKey();

        // Se não houver key válida.
        if (!levelKey) {

            // Mostra erro na consola.
            console.error('PauseScene: levelScene inválida no reiniciar:', this.levelScene);

            // Para a PauseScene.
            this.scene.stop();

            // Cancela a função.
            return;
        }

        // Vai buscar a cena do nível.
        const levelScene = this.scene.get(levelKey);

        // Restaurar ao início do nível.
        // Isto usa o snapshot guardado no Level1 / Level2 / LevelFinal.
        // Assim remove upgrades comprados dentro do nível atual.

        // Se o nível tiver função própria para restaurar o estado.
        if (levelScene && typeof levelScene.restoreLevelStartState === 'function') {

            // Usa essa função.
            levelScene.restoreLevelStartState();
        } else {

            // Caso contrário, usa fallback pelo registry.
            this.restoreRegistryFallback();
        }

        // Limpar estados temporários.

        // Remove o tempo restante guardado.
        this.registry.remove('levelTimeLeft');

        // Remove indicação de dano recebido.
        this.registry.remove('tookDamage');

        // Remove estado de nível terminado.
        this.registry.remove('levelFinished');

        // Remove estado de Game Over iniciado.
        this.registry.remove('gameOverStarted');

        // Remove estado de loja aberta.
        this.registry.remove('shopOpen');

        // Remove estado de boss criado.
        this.registry.remove('bossSpawned');

        // Remove estado de boss morto.
        this.registry.remove('bossDead');

        // Remove estado do baú final aberto.
        this.registry.remove('finalChestOpened');

        // Remove estado de saída final desbloqueada.
        this.registry.remove('finalExitUnlocked');

        // Se existir música atual e ela puder parar.
        if (MusicSystem.currentMusic && MusicSystem.currentMusic.stop) {

            // Para a música atual.
            MusicSystem.currentMusic.stop();
        }

        // Para a cena do HUD.
        this.scene.stop('LevelHUDScene');

        // Para a cena da loja de bónus.
        this.scene.stop('BonusShopScene');

        // Se o nível estiver ativo ou pausado.
        if (this.scene.isActive(levelKey) || this.scene.isPaused(levelKey)) {

            // Para o nível atual.
            this.scene.stop(levelKey);
        }

        // Inicia novamente o nível.
        this.scene.start(levelKey);
    }

    // Restaura dados do registry caso o nível não tenha função própria.
    restoreRegistryFallback() {

        // Restaurar heróis.

        // Vai buscar os dados iniciais do Player 1.
        const p1Start = this.registry.get('player1HeroAtLevelStart');

        // Vai buscar os dados iniciais do Player 2.
        const p2Start = this.registry.get('player2HeroAtLevelStart');

        // Se existirem dados do Player 1.
        if (p1Start) {

            // Restaura o Player 1.
            this.registry.set('player1Hero', this.cloneData(p1Start));
        }

        // Se existirem dados do Player 2.
        if (p2Start) {

            // Restaura o Player 2.
            this.registry.set('player2Hero', this.cloneData(p2Start));
        }

        // Restaurar moedas.

        // Vai buscar as moedas do início do nível.
        const coinsAtLevelStart = this.registry.get('coinsAtLevelStart') || {
            p1: 0,
            p2: 0
        };

        // Restaura as moedas no registry.
        this.registry.set('coins', {
            p1: coinsAtLevelStart.p1 || 0,
            p2: coinsAtLevelStart.p2 || 0
        });

        // Restaurar score.

        // Restaura o score do nível.
        this.registry.set(
            'levelScore',
            this.registry.get('levelScoreAtLevelStart') || 0
        );

        // Restaura o breakdown do score.
        this.registry.set(
            'scoreBreakdown',
            this.cloneData(this.registry.get('scoreBreakdownAtLevelStart')) || {
                items: 0,
                enemies: 0,
                finishLevel: 0,
                timeBonus: 0,
                noDamageBonus: 0
            }
        );

        // Restaura as estatísticas do score.
        this.registry.set(
            'scoreStats',
            this.cloneData(this.registry.get('scoreStatsAtLevelStart')) || {
                apples: 0,
                icecreams: 0,
                coins: 0,
                enemiesKilled: 0,
                enemy0Killed: 0,
                enemy1Killed: 0
            }
        );
    }

    // Volta ao menu principal.
    backToMenu() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Vai buscar a key do nível.
        const levelKey = this.getLevelSceneKey();

        // Faz fade out.
        this.cameras.main.fadeOut(400, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Se existir nível.
                if (levelKey) {

                    // Para o nível.
                    this.scene.stop(levelKey);
                }

                // Se existir música atual e ela puder parar.
                if (MusicSystem.currentMusic && MusicSystem.currentMusic.stop) {

                    // Para a música atual.
                    MusicSystem.currentMusic.stop();
                }

                // Para a cena do HUD.
                this.scene.stop('LevelHUDScene');

                // Vai para o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }

    // Cria uma cópia profunda dos dados recebidos.
    cloneData(data) {

        // Se não houver dados, devolve null.
        if (!data) return null;

        // Converte para JSON e volta a objeto para criar cópia independente.
        return JSON.parse(JSON.stringify(data));
    }
}