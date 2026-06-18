// Importa o sistema de música para tocar e controlar o volume da música nesta cena.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe ControlsScene, responsável pelo menu de controlos.
export default class ControlsScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "ControlsScene".
        super('ControlsScene');
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e a altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Controla se a cena já está a trocar para outra cena.
        this.isChangingScene = false;

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Guarda qual painel está aberto no momento.
        this.currentPanel = null;

        // Guarda os objetos criados dentro de painéis para depois destruir.
        this.panelObjects = [];

        // Guarda os botões principais do menu.
        this.mainButtons = [];

        // Índice do botão atualmente selecionado no menu principal.
        this.selectedIndex = 0;

        // Texto que mostra a percentagem do volume.
        this.volumeText = null;

        // Parte preenchida da barra de volume.
        this.volumeBarFill = null;

        // Brilho da barra de volume.
        this.volumeBarLight = null;

        // Botão circular da barra de volume.
        this.volumeKnob = null;

        // Dados da barra de volume, como posição e largura.
        this.volumeBarData = null;

        // Secção da música.

        // Toca a música interior nesta cena.
        MusicSystem.play(this, 'music_interior', {

            // Usa o volume guardado pelo jogador.
            volume: this.getMusicVolume(),

            // Faz a música repetir.
            loop: true,

            // Define fade de entrada da música.
            fade: 1000
        });

        // Secção do background.

        // Adiciona a imagem de fundo no centro do ecrã.
        this.bg = this.add.image(width / 2, height / 2, 'bgCharSelect')

            // Ajusta a imagem para ocupar o ecrã inteiro.
            .setDisplaySize(width, height)

            // Coloca o fundo na profundidade mais baixa.
            .setDepth(0);

        // Adiciona um retângulo preto transparente por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência do retângulo.
            .setAlpha(0.45)

            // Coloca o retângulo acima do background.
            .setDepth(1);

        // Secção da caixa do título.

        // Adiciona a caixa visual do título.
        this.add.image(width / 2, height * 0.16, 'caixaTitulo')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da caixa.
            .setScale(0.2)

            // Define a profundidade da caixa.
            .setDepth(2);

        // Adiciona o texto do título.
        this.add.text(width / 2, height * 0.18, 'CONTROLES', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '30px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto a negrito.
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

        // Secção das teclas.

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

        // Cria a tecla ESC.
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Secção dos botões principais.

        // Lista com as opções principais do menu de controlos.
        this.mainMenuOptions = [
            {
                // Texto mostrado no botão.
                text: 'JOGADOR 1',

                // Imagem/caixa usada no botão.
                box: 'btnControlsRed',

                // Ação executada ao escolher esta opção.
                action: () => {

                    // Abre o painel dos controlos do Jogador 1.
                    this.openPlayerControls('JOGADOR 1', [
                        ['Mover', 'Setas'],
                        ['Ataque 1', 'J'],
                        ['Ataque 2', 'K'],
                        ['Ataque 3', 'L'],
                        ['Bloquear', 'B'],
                        ['Interagir', 'E']
                    ]);
                }
            },
            {
                // Texto mostrado no botão.
                text: 'JOGADOR 2',

                // Imagem/caixa usada no botão.
                box: 'btnControlsCav',

                // Ação executada ao escolher esta opção.
                action: () => {

                    // Abre o painel dos controlos do Jogador 2.
                    this.openPlayerControls('JOGADOR 2', [
                        ['Mover', 'W A S D'],
                        ['Ataque 1', 'R'],
                        ['Ataque 2', 'T'],
                        ['Ataque 3', 'Q'],
                        ['Bloquear', 'CTRL'],
                        ['Interagir', 'E']
                    ]);
                }
            },
            {
                // Texto mostrado no botão.
                text: 'SOM',

                // Imagem/caixa usada no botão.
                box: 'btnControlsLos',

                // Ação executada ao escolher esta opção.
                action: () => {

                    // Abre o painel do som.
                    this.openSoundPanel();
                }
            },
            {
                // Texto mostrado no botão.
                text: 'VOLTAR AO MENU',

                // Imagem/caixa usada no botão.
                box: 'btnControlsEsc',

                // Ação executada ao escolher esta opção.
                action: () => {

                    // Volta ao menu principal.
                    this.goBackToMenu();
                }
            }
        ];

        // Cria visualmente o menu principal.
        this.createMainMenu();

        // Atualiza o botão selecionado inicialmente.
        this.updateMainSelection();
    }

    // Função chamada a cada frame.
    update() {

        // Secção dos painéis.

        // Se existir um painel aberto.
        if (this.currentPanel) {

            // Se o painel aberto for o de som.
            if (this.currentPanel === 'SOM') {

                // Atualiza a interface do volume.
                this.refreshVolumeUI();

                // Se carregar na seta esquerda.
                if (Phaser.Input.Keyboard.JustDown(this.keyLeft)) {

                    // Diminui o volume.
                    this.applyMusicVolume(this.getMusicVolume() - 0.1);
                }

                // Se carregar na seta direita.
                if (Phaser.Input.Keyboard.JustDown(this.keyRight)) {

                    // Aumenta o volume.
                    this.applyMusicVolume(this.getMusicVolume() + 0.1);
                }
            }

            // Se carregar ESC com um painel aberto.
            if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

                // Fecha o painel atual.
                this.closePanel();
            }

            // Para aqui para não controlar o menu principal enquanto há painel aberto.
            return;
        }

        // Secção do menu principal.

        // Se carregar na tecla cima.
        if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

            // Move a seleção para cima.
            this.selectedIndex--;

            // Se passar do primeiro botão, vai para o último.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.mainButtons.length - 1;
            }

            // Atualiza o visual da seleção.
            this.updateMainSelection();
        }

        // Se carregar na tecla baixo.
        if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {

            // Move a seleção para baixo.
            this.selectedIndex++;

            // Se passar do último botão, volta ao primeiro.
            if (this.selectedIndex >= this.mainButtons.length) {
                this.selectedIndex = 0;
            }

            // Atualiza o visual da seleção.
            this.updateMainSelection();
        }

        // Se carregar ENTER.
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {

            // Executa a ação da opção selecionada.
            this.mainMenuOptions[this.selectedIndex].action();
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

            // Volta ao menu principal.
            this.goBackToMenu();
        }
    }

    // Secção de interatividade segura.

    // Torna um objeto interativo de forma segura.
    makeInteractive(gameObject) {

        // Se o objeto não existir, não faz nada.
        if (!gameObject) return;

        // Se o objeto já tiver input ativo.
        if (gameObject.input) {

            // Desativa primeiro para evitar conflitos.
            gameObject.disableInteractive();
        }

        // Ativa a interatividade no objeto.
        gameObject.setInteractive();

        // Se o input existir depois de ativar.
        if (gameObject.input) {

            // Muda o cursor para mão.
            gameObject.input.cursor = 'pointer';
        }
    }

    // Torna um container interativo com uma área retangular.
    makeContainerInteractive(container, width, height) {

        // Se o container não existir, não faz nada.
        if (!container) return;

        // Se o container já tiver input ativo.
        if (container.input) {

            // Desativa primeiro para evitar conflitos.
            container.disableInteractive();
        }

        // Define o tamanho do container.
        container.setSize(width, height);

        // Ativa a interatividade usando um retângulo personalizado.
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

    // Vai buscar o volume atual da música.
    getMusicVolume() {

        // Tenta buscar o volume guardado no registry.
        let value = this.registry.get('musicVolume');

        // Se o valor não for número válido.
        if (typeof value !== 'number' || Number.isNaN(value)) {

            // Tenta buscar o volume guardado no localStorage.
            const savedVolume = localStorage.getItem('musicVolume');

            // Se existir volume guardado.
            if (savedVolume !== null) {

                // Converte o volume guardado para número.
                value = Number(savedVolume);
            }
        }

        // Se ainda não existir volume válido.
        if (typeof value !== 'number' || Number.isNaN(value)) {

            // Usa o volume global do MusicSystem ou 0.45 como valor padrão.
            value =
                MusicSystem.masterVolume ??
                MusicSystem.volume ??
                0.45;
        }

        // Limita o volume entre 0 e 1.
        return Phaser.Math.Clamp(value, 0, 1);
    }

    // Secção do menu principal.

    // Cria os botões principais do menu.
    createMainMenu() {

        // Guarda a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Calcula o centro horizontal.
        const centerX = width / 2;

        // Define a posição Y inicial dos botões.
        const startY = height * 0.36;

        // Define o espaço vertical entre botões.
        const gapY = 88;

        // Limpa a lista de botões principais.
        this.mainButtons = [];

        // Percorre todas as opções do menu principal.
        for (let i = 0; i < this.mainMenuOptions.length; i++) {

            // Guarda a opção atual.
            const option = this.mainMenuOptions[i];

            // Calcula a posição Y deste botão.
            const y = startY + i * gapY;

            // Cria o botão principal.
            const button = this.createMainButton(
                centerX,
                y,
                option.text,
                option.box,
                () => {

                    // Atualiza o índice selecionado.
                    this.selectedIndex = i;

                    // Atualiza visualmente a seleção.
                    this.updateMainSelection();

                    // Executa a ação da opção.
                    option.action();
                }
            );

            // Quando o rato passa por cima do container.
            button.container.on('pointerover', () => {

                // Seleciona este botão.
                this.selectedIndex = i;

                // Atualiza visualmente.
                this.updateMainSelection();
            });

            // Quando o rato passa por cima da imagem do botão.
            button.box.on('pointerover', () => {

                // Seleciona este botão.
                this.selectedIndex = i;

                // Atualiza visualmente.
                this.updateMainSelection();
            });

            // Quando o rato passa por cima do texto do botão.
            button.label.on('pointerover', () => {

                // Seleciona este botão.
                this.selectedIndex = i;

                // Atualiza visualmente.
                this.updateMainSelection();
            });

            // Guarda o botão na lista.
            this.mainButtons.push(button);
        }

        // Cria o losango indicador da opção selecionada.
        this.mainSelector = this.add.polygon(
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

        // Coloca o losango por cima.
        .setDepth(10);

        // Cria uma animação no losango.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.mainSelector,

            // Move o losango para a esquerda.
            x: this.mainSelector.x - 8,

            // Define a duração da animação.
            duration: 500,

            // Faz voltar à posição inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização.
            ease: 'Sine.easeInOut'
        });

        // Cria o texto de ajuda do menu principal.
        this.helpText = this.add.text(
            centerX,
            height * 0.82,
            '↑ ↓ Navegar    ENTER Selecionar    ESC Voltar',
            {
                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '13px',

                // Define a cor.
                color: '#ffffff',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 3
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85)

        // Coloca o texto por cima.
        .setDepth(10);
    }

    // Cria um botão principal.
    createMainButton(x, y, text, boxKey, callback) {

        // Cria um container para juntar imagem e texto.
        const container = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(5);

        // Cria a imagem/caixa do botão.
        const box = this.add.image(0, 0, boxKey)

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da caixa.
            .setScale(0.14);

        // Cria o texto do botão.
        const label = this.add.text(0, 5, text, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '20px',

            // Define a cor.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona a imagem e o texto ao container.
        container.add([box, label]);

        // Torna o container interativo com uma área grande.
        this.makeContainerInteractive(container, 360, 70);

        // Torna a imagem do botão interativa.
        this.makeInteractive(box);

        // Torna o texto do botão interativo.
        this.makeInteractive(label);

        // Quando clica no container, executa o callback.
        container.on('pointerdown', callback);

        // Quando clica na imagem, executa o callback.
        box.on('pointerdown', callback);

        // Quando clica no texto, executa o callback.
        label.on('pointerdown', callback);

        // Devolve as partes do botão.
        return {
            container,
            box,
            label
        };
    }

    // Atualiza visualmente o botão selecionado.
    updateMainSelection() {

        // Se não houver botões, não faz nada.
        if (!this.mainButtons || this.mainButtons.length === 0) return;

        // Percorre todos os botões.
        for (let i = 0; i < this.mainButtons.length; i++) {

            // Guarda o botão atual.
            const btn = this.mainButtons[i];

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
        const selected = this.mainButtons[this.selectedIndex];

        // Se existir o seletor.
        if (this.mainSelector) {

            // Move o seletor para o Y do botão selecionado.
            this.mainSelector.y = selected.container.y;
        }
    }

    // Esconde os botões principais.
    hideMainButtons() {

        // Percorre todos os botões principais.
        this.mainButtons.forEach(btn => {

            // Esconde o container.
            btn.container.setVisible(false);

            // Se o container tiver input.
            if (btn.container.input) {

                // Desativa a interatividade.
                btn.container.disableInteractive();
            }

            // Se a caixa tiver input.
            if (btn.box.input) {

                // Desativa a interatividade da caixa.
                btn.box.disableInteractive();
            }

            // Se o texto tiver input.
            if (btn.label.input) {

                // Desativa a interatividade do texto.
                btn.label.disableInteractive();
            }
        });

        // Se existir seletor principal.
        if (this.mainSelector) {

            // Esconde o seletor.
            this.mainSelector.setVisible(false);
        }

        // Se existir texto de ajuda.
        if (this.helpText) {

            // Esconde o texto de ajuda.
            this.helpText.setVisible(false);
        }
    }

    // Mostra novamente os botões principais.
    showMainButtons() {

        // Percorre todos os botões principais.
        this.mainButtons.forEach(btn => {

            // Mostra o container.
            btn.container.setVisible(true);

            // Reativa a interatividade do container.
            this.makeContainerInteractive(btn.container, 360, 70);

            // Reativa a interatividade da caixa.
            this.makeInteractive(btn.box);

            // Reativa a interatividade do texto.
            this.makeInteractive(btn.label);
        });

        // Se existir seletor principal.
        if (this.mainSelector) {

            // Mostra o seletor.
            this.mainSelector.setVisible(true);
        }

        // Se existir texto de ajuda.
        if (this.helpText) {

            // Mostra o texto de ajuda.
            this.helpText.setVisible(true);
        }

        // Atualiza a seleção visual.
        this.updateMainSelection();
    }

    // Secção de limpar painel.

    // Remove todos os objetos do painel atual.
    clearPanel() {

        // Percorre todos os objetos do painel.
        this.panelObjects.forEach(obj => {

            // Se o objeto existir e tiver função destroy.
            if (obj && obj.destroy) {

                // Destroi o objeto.
                obj.destroy();
            }
        });

        // Limpa a lista de objetos do painel.
        this.panelObjects = [];

        // Remove a indicação de painel aberto.
        this.currentPanel = null;

        // Limpa a referência do texto do volume.
        this.volumeText = null;

        // Limpa a referência da barra preenchida.
        this.volumeBarFill = null;

        // Limpa a referência do brilho da barra.
        this.volumeBarLight = null;

        // Limpa a referência do botão circular.
        this.volumeKnob = null;

        // Limpa os dados da barra de volume.
        this.volumeBarData = null;
    }

    // Fecha o painel atual e volta ao menu principal.
    closePanel() {

        // Limpa o painel.
        this.clearPanel();

        // Mostra os botões principais.
        this.showMainButtons();
    }

    // Secção do painel base.

    // Cria a base visual de um painel popup.
    createPopupPanel(title, subtitle = '') {

        // Guarda a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Lista de objetos criados para devolver.
        const objects = [];

        // Define o centro X do painel.
        const panelX = width / 2;

        // Define o centro Y do painel.
        const panelY = height / 2;

        // Cria um fundo escuro por cima do ecrã.
        const fader = this.add.rectangle(0, 0, width, height, 0x000000)

            // Define origem no canto superior esquerdo.
            .setOrigin(0)

            // Define transparência do fundo.
            .setAlpha(0.35)

            // Define profundidade.
            .setDepth(20);

        // Cria o título do painel.
        const titleText = this.add.text(panelX - 5, panelY - 120, title, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '36px',

            // Define a cor.
            color: '#ffffff',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define contorno.
            stroke: '#000000',

            // Define espessura do contorno.
            strokeThickness: 5
        })

        // Centra o título.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(22);

        // Guarda o fader e o título na lista.
        objects.push(fader, titleText);

        // Se existir subtítulo.
        if (subtitle !== '') {

            // Cria o subtítulo.
            const subtitleText = this.add.text(panelX - 5, panelY - 85, subtitle, {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '18px',

                // Define a cor.
                color: '#d8d8d8',

                // Define contorno.
                stroke: '#000000',

                // Define espessura do contorno.
                strokeThickness: 3
            })

            // Centra o subtítulo.
            .setOrigin(0.5)

            // Define profundidade.
            .setDepth(22);

            // Guarda o subtítulo na lista.
            objects.push(subtitleText);
        }

        // Devolve os objetos criados e posições do painel.
        return {
            objects,
            panelX,
            panelY
        };
    }

    // Secção do painel do jogador.

    // Abre o painel de controlos de um jogador.
    openPlayerControls(title, rows) {

        // Esconde os botões principais.
        this.hideMainButtons();

        // Limpa qualquer painel anterior.
        this.clearPanel();

        // Define o painel atual com o título recebido.
        this.currentPanel = title;

        // Guarda a altura da câmara.
        const { height } = this.cameras.main;

        // Cria o painel base.
        const popup = this.createPopupPanel(
            title,
            'Consulta os comandos deste jogador'
        );

        // Guarda os objetos do painel base.
        this.panelObjects.push(...popup.objects);

        // Define o centro X usando o painel criado.
        const centerX = popup.panelX;

        // Define a posição Y inicial das linhas.
        const startY = popup.panelY - 20;

        // Define o espaço vertical entre linhas.
        const gapY = 36;

        // Define a posição X da ação.
        const actionX = centerX - 138;

        // Define a posição X da tecla.
        const keyX = centerX + 100;

        // Percorre as linhas de controlos.
        rows.forEach((row, i) => {

            // Calcula o Y desta linha.
            const y = startY + i * gapY;

            // Cria o texto da ação.
            const actionText = this.add.text(actionX, y, row[0], {

                // Define a fonte.
                fontFamily: 'MedievalSharp, Arial',

                // Define o tamanho.
                fontSize: '21px',

                // Define a cor.
                color: '#f6e4b0',

                // Define contorno.
                stroke: '#000000',

                // Define espessura do contorno.
                strokeThickness: 4
            })

            // Alinha o texto à esquerda e centra verticalmente.
            .setOrigin(0, 0.5)

            // Define profundidade.
            .setDepth(22);

            // Cria o texto da tecla correspondente.
            const keyText = this.add.text(keyX, y, row[1], {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '21px',

                // Coloca em negrito.
                fontStyle: 'bold',

                // Define a cor.
                color: '#ffffff',

                // Define contorno.
                stroke: '#000000',

                // Define espessura do contorno.
                strokeThickness: 4
            })

            // Centra o texto da tecla.
            .setOrigin(0.5)

            // Define profundidade.
            .setDepth(22);

            // Guarda os textos na lista para destruir depois.
            this.panelObjects.push(actionText, keyText);
        });

        // Cria o botão voltar do painel.
        const backBtn = this.createPanelButton(centerX, height * 0.84, 'VOLTAR', () => {

            // Fecha o painel.
            this.closePanel();
        });

        // Guarda o botão na lista do painel.
        this.panelObjects.push(backBtn);
    }

    // Secção do painel de som.

    // Abre o painel de som.
    openSoundPanel() {

        // Esconde os botões principais.
        this.hideMainButtons();

        // Limpa qualquer painel anterior.
        this.clearPanel();

        // Define o painel atual como som.
        this.currentPanel = 'SOM';

        // Guarda a altura da câmara.
        const { height } = this.cameras.main;

        // Cria o painel base do som.
        const popup = this.createPopupPanel(
            'SOM',
            'Ajusta o volume da música'
        );

        // Guarda os objetos do painel base.
        this.panelObjects.push(...popup.objects);

        // Cria a barra de volume.
        const volumeObjects = this.createVolumeBar(
            popup.panelX,
            popup.panelY + 20
        );

        // Guarda os objetos da barra de volume.
        this.panelObjects.push(...volumeObjects);

        // Cria o texto de ajuda do painel de som.
        const hint = this.add.text(
            popup.panelX,
            height * 0.765,
            '← → Diminuir/Aumentar    ESC Voltar',
            {
                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '13px',

                // Define a cor.
                color: '#ffffff',

                // Define contorno.
                stroke: '#000000',

                // Define espessura do contorno.
                strokeThickness: 3
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.8)

        // Define profundidade.
        .setDepth(25);

        // Guarda o texto de ajuda na lista do painel.
        this.panelObjects.push(hint);

        // Cria o botão voltar.
        const backBtn = this.createPanelButton(
            popup.panelX,
            height * 0.84,
            'VOLTAR',
            () => {

                // Fecha o painel.
                this.closePanel();
            }
        );

        // Guarda o botão na lista do painel.
        this.panelObjects.push(backBtn);
    }

    // Cria a barra visual de volume.
    createVolumeBar(x, y) {

        // Lista dos objetos criados.
        const objects = [];

        // Define a largura da barra.
        const barWidth = 280;

        // Define a altura da barra.
        const barHeight = 12;

        // Vai buscar o volume atual.
        const volume = this.getMusicVolume();

        // Cria o fundo do painel de volume.
        const panelBg = this.add.rectangle(
            x,
            y + 10,
            430,
            190,
            0x000000
        )

        // Centra o fundo.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.28)

        // Define profundidade.
        .setDepth(21);

        // Cria uma barra decorativa atrás do volume.
        const selectorBar = this.add.rectangle(
            x,
            y + 12,
            390,
            34,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.18)

        // Define profundidade.
        .setDepth(22);

        // Cria o losango decorativo da barra.
        const diamond = this.add.polygon(
            x - 200,
            y + 12,
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

        // Cria animação no losango.
        this.tweens.add({

            // Define o losango como alvo.
            targets: diamond,

            // Move o losango para a esquerda.
            x: diamond.x - 8,

            // Define duração.
            duration: 500,

            // Faz voltar à posição original.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

        // Cria o texto "Volume da música".
        const label = this.add.text(x, y - 30, 'Volume da música', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '28px',

            // Define a cor.
            color: '#f6e4b0',

            // Define contorno.
            stroke: '#000000',

            // Define espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Cria o texto da percentagem de volume.
        this.volumeText = this.add.text(x, y + 60, `${Math.round(volume * 100)}%`, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '23px',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor.
            color: '#ffffff',

            // Define contorno.
            stroke: '#000000',

            // Define espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(24);

        // Cria o botão de diminuir volume.
        const minusBtn = this.add.text(x - 170, y + 12, '−', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '27px',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor.
            color: '#ffffff',

            // Define contorno.
            stroke: '#000000',

            // Define espessura do contorno.
            strokeThickness: 5
        })

        // Centra o botão.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25);

        // Cria o botão de aumentar volume.
        const plusBtn = this.add.text(x + 170, y + 12, '+', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '26px',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor.
            color: '#ffffff',

            // Define contorno.
            stroke: '#000000',

            // Define espessura do contorno.
            strokeThickness: 5
        })

        // Centra o botão.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25);

        // Cria o fundo da barra de volume.
        const barBg = this.add.rectangle(
            x,
            y + 12,
            barWidth,
            barHeight,
            0x17100a
        )

        // Centra o fundo da barra.
        .setOrigin(0.5)

        // Define a borda da barra.
        .setStrokeStyle(2, 0x6f4a27)

        // Define profundidade.
        .setDepth(23);

        // Cria a parte preenchida da barra.
        this.volumeBarFill = this.add.rectangle(
            x - barWidth / 2,
            y + 12,
            barWidth * volume,
            barHeight,
            0xd8b568
        )

        // Define a origem no lado esquerdo para crescer da esquerda para a direita.
        .setOrigin(0, 0.5)

        // Define profundidade.
        .setDepth(24);

        // Cria o brilho da barra.
        this.volumeBarLight = this.add.rectangle(
            x - barWidth / 2,
            y + 8,
            barWidth * volume,
            3,
            0xffffff
        )

        // Define origem no lado esquerdo.
        .setOrigin(0, 0.5)

        // Define transparência.
        .setAlpha(0.22)

        // Define profundidade.
        .setDepth(25);

        // Cria o círculo que representa o botão de arrastar.
        this.volumeKnob = this.add.circle(
            x - barWidth / 2 + barWidth * volume,
            y + 12,
            10,
            0xf8f2df
        )

        // Define a borda do botão circular.
        .setStrokeStyle(3, 0xd8b568)

        // Define profundidade.
        .setDepth(26);

        // Torna o botão de diminuir interativo.
        this.makeInteractive(minusBtn);

        // Torna o botão de aumentar interativo.
        this.makeInteractive(plusBtn);

        // Torna o fundo da barra interativo.
        this.makeInteractive(barBg);

        // Torna a parte preenchida da barra interativa.
        this.makeInteractive(this.volumeBarFill);

        // Torna o botão circular interativo.
        this.makeInteractive(this.volumeKnob);

        // Guarda dados importantes da barra.
        this.volumeBarData = {
            x,
            y,
            barWidth
        };

        // Função que atualiza o volume com base na posição do rato.
        const updateVolumeByPointer = (pointer) => {

            // Calcula a percentagem clicada dentro da barra.
            const percent = (pointer.x - (x - barWidth / 2)) / barWidth;

            // Aplica o novo volume.
            this.applyMusicVolume(percent);
        };

        // Permite clicar no fundo da barra para mudar volume.
        barBg.on('pointerdown', updateVolumeByPointer);

        // Permite clicar na parte preenchida para mudar volume.
        this.volumeBarFill.on('pointerdown', updateVolumeByPointer);

        // Permite arrastar o botão circular.
        this.input.setDraggable(this.volumeKnob);

        // Quando o botão circular é arrastado.
        this.volumeKnob.on('drag', pointer => {

            // Atualiza o volume pela posição do rato.
            updateVolumeByPointer(pointer);
        });

        // Quando o rato passa por cima do botão menos.
        minusBtn.on('pointerover', () => minusBtn.setColor('#ffd700'));

        // Quando o rato sai do botão menos.
        minusBtn.on('pointerout', () => minusBtn.setColor('#ffffff'));

        // Quando clica no botão menos.
        minusBtn.on('pointerdown', () => {

            // Diminui o volume.
            this.applyMusicVolume(this.getMusicVolume() - 0.1);
        });

        // Quando o rato passa por cima do botão mais.
        plusBtn.on('pointerover', () => plusBtn.setColor('#ffd700'));

        // Quando o rato sai do botão mais.
        plusBtn.on('pointerout', () => plusBtn.setColor('#ffffff'));

        // Quando clica no botão mais.
        plusBtn.on('pointerdown', () => {

            // Aumenta o volume.
            this.applyMusicVolume(this.getMusicVolume() + 0.1);
        });

        // Quando o rato passa por cima do botão circular.
        this.volumeKnob.on('pointerover', () => {

            // Aumenta ligeiramente o botão circular.
            this.volumeKnob.setScale(1.15);
        });

        // Quando o rato sai do botão circular.
        this.volumeKnob.on('pointerout', () => {

            // Volta ao tamanho normal.
            this.volumeKnob.setScale(1);
        });

        // Guarda todos os objetos criados na lista.
        objects.push(
            panelBg,
            selectorBar,
            diamond,
            label,
            minusBtn,
            plusBtn,
            barBg,
            this.volumeBarFill,
            this.volumeBarLight,
            this.volumeKnob,
            this.volumeText
        );

        // Devolve os objetos criados.
        return objects;
    }

    // Aplica um novo volume à música.
    applyMusicVolume(newVolume) {

        // Limita o volume entre 0 e 1.
        const volume = Phaser.Math.Clamp(newVolume, 0, 1);

        // Secção do valor global partilhado.

        // Guarda o volume no registry.
        this.registry.set('musicVolume', volume);

        // Guarda o volume no localStorage.
        localStorage.setItem('musicVolume', String(volume));

        // Atualiza o volume principal do MusicSystem.
        MusicSystem.masterVolume = volume;

        // Atualiza outro valor de volume do MusicSystem, caso seja usado.
        MusicSystem.volume = volume;

        // Se existir função setVolume no MusicSystem.
        if (MusicSystem.setVolume) {

            // Usa a função para aplicar o volume.
            MusicSystem.setVolume(volume);
        }

        // Se existir música atual a tocar.
        if (MusicSystem.currentMusic) {

            // Atualiza diretamente o volume da música atual.
            MusicSystem.currentMusic.setVolume(volume);
        }

        // Atualiza a barra desta cena.

        // Atualiza visualmente o texto, barra e botão do volume.
        this.refreshVolumeUI(volume);
    }

    // Atualiza a interface visual do volume.
    refreshVolumeUI(volume = this.getMusicVolume()) {

        // Limita o volume entre 0 e 1.
        volume = Phaser.Math.Clamp(volume, 0, 1);

        // Se existir texto do volume.
        if (this.volumeText) {

            // Atualiza o texto com a percentagem do volume.
            this.volumeText.setText(`${Math.round(volume * 100)}%`);
        }

        // Se não houver dados da barra, para aqui.
        if (!this.volumeBarData) return;

        // Vai buscar o X e a largura da barra.
        const { x, barWidth } = this.volumeBarData;

        // Se existir barra preenchida.
        if (this.volumeBarFill) {

            // Atualiza a largura preenchida conforme o volume.
            this.volumeBarFill.width = barWidth * volume;
        }

        // Se existir brilho da barra.
        if (this.volumeBarLight) {

            // Atualiza a largura do brilho conforme o volume.
            this.volumeBarLight.width = barWidth * volume;
        }

        // Se existir botão circular.
        if (this.volumeKnob) {

            // Move o botão circular para a posição correspondente ao volume.
            this.volumeKnob.x = x - barWidth / 2 + barWidth * volume;
        }
    }

    // Secção do botão do painel.

    // Cria um botão usado dentro dos painéis.
    createPanelButton(x, y, text, callback) {

        // Cria um container para o botão.
        this.backButton = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(30);

        // Cria a imagem do botão.
        const btnImg = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da imagem.
            .setScale(0.24);

        // Cria o texto do botão.
        const texto = this.add.text(0, 5, text, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '16px',

            // Define a cor.
            color: '#ffffff',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define contorno.
            stroke: '#000000',

            // Define espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona imagem e texto ao container.
        this.backButton.add([btnImg, texto]);

        // Define o tamanho da área clicável.
        this.backButton.setSize(210, 55);

        // Torna o botão interativo.
        this.backButton.setInteractive({ useHandCursor: true });

        // Quando o rato passa por cima.
        this.backButton.on('pointerover', () => {

            // Aumenta ligeiramente a imagem.
            btnImg.setScale(0.255);

            // Muda o texto para dourado.
            texto.setColor('#ffd700');
        });

        // Quando o rato sai.
        this.backButton.on('pointerout', () => {

            // Volta ao tamanho normal.
            btnImg.setScale(0.24);

            // Volta o texto a branco.
            texto.setColor('#ffffff');
        });

        // Quando o rato clica.
        this.backButton.on('pointerdown', () => {

            // Diminui ligeiramente o botão.
            btnImg.setScale(0.225);

            // Mantém o texto dourado.
            texto.setColor('#ffd700');
        });

        // Quando o rato solta o clique.
        this.backButton.on('pointerup', () => {

            // Executa a função recebida.
            callback();
        });

        // Devolve o botão criado.
        return this.backButton;
    }

    // Secção de voltar ao menu.

    // Volta para o menu principal.
    goBackToMenu() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Faz fade out.
        this.cameras.main.fadeOut(500, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Inicia o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }
}