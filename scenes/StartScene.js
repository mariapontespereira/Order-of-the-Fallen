// Importa o sistema de música, usado para tocar a música do menu inicial.
import MusicSystem from '../systems/MusicSystem.js';

// Importa o sistema de save, usado para continuar ou limpar progresso.
import SaveSystem from '../systems/SaveSystem.js';

// Cria a classe StartScene, responsável pelo ecrã inicial do jogo.
export default class StartScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "StartScene".
        super('StartScene');
    }

    // Preload vazio porque os recursos já são carregados noutra cena.
    preload() {}

    // Função chamada quando a cena é criada.
    create() {

        // Limpa efeitos anteriores da câmara.
        this.cameras.main.resetFX();

        // Garante que a câmara está totalmente visível.
        this.cameras.main.setAlpha(1);

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Guarda a largura da câmara principal.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara principal.
        const height = this.cameras.main.height;

        // Índice da opção atualmente selecionada.
        this.selectedIndex = 0;

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;

        // Toca a música do menu.
        MusicSystem.play(this, 'music_menu', {

            // Define o volume da música.
            volume: 0.5,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo do fade da música.
            fade: 1200
        });

        // Fundo.

        // Adiciona a imagem de fundo do menu.
        this.add.image(width / 2, height / 2, 'bgMenu')

            // Ajusta a imagem ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Coloca o fundo na profundidade mais baixa.
            .setDepth(0);

        // escurecer o fundo

        // Adiciona uma camada preta transparente para escurecer o fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da camada.
            .setAlpha(0.35)

            // Coloca a camada acima do fundo.
            .setDepth(1);

        // vinheta lateral

        // Adiciona uma segunda camada preta para reforçar o efeito de vinheta.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define uma transparência menor.
            .setAlpha(0.18)

            // Coloca esta camada acima da anterior.
            .setDepth(2);

        // Logo / título.

        // Adiciona o texto principal "ORDER".
        this.add.text(width * 0.17, height * 0.55, 'ORDER', {

            // Define a fonte do título.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '110px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 8
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima do fundo.
        .setDepth(5);

        // Adiciona o texto "OF THE FALLEN".
        this.add.text(width * 0.270, height * 0.64, 'OF THE FALLEN', {

            // Define a fonte do subtítulo.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '42px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 6
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima do fundo.
        .setDepth(5);

        // Adiciona o texto "PIXEL LEGENDS".
        this.add.text(width * 0.255, height * 0.69, 'PIXEL LEGENDS', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '24px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima do fundo.
        .setDepth(5);

        // Menu.

        // Cria as opções do menu inicial.
        this.menuItems = [
            {
                // Texto da primeira opção.
                text: 'Continuar',

                // Ação para continuar o jogo salvo.
                action: () => this.continuarJogo()
            },
            {
                // Texto da segunda opção.
                text: 'Novo Jogo',

                // Ação para iniciar um novo jogo.
                action: () => this.novoJogo()
            }
        ];

        // Lista onde serão guardados os textos das opções.
        this.menuTexts = [];

        // Define a posição X do menu.
        const menuX = width * 0.74;

        // Define a posição Y da primeira opção.
        const startY = height * 0.48;

        // Define o espaço vertical entre as opções.
        const gapY = 55;

        // barra dourada atrás da opção selecionada

        // Cria a barra dourada por trás da opção selecionada.
        this.selectorBar = this.add.rectangle(
            menuX - 20,
            startY,
            260,
            30,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define a transparência da barra.
        .setAlpha(0.32)

        // Coloca a barra atrás dos textos.
        .setDepth(4);

        // losango/ícone seletor

        // Cria o losango que indica a opção selecionada.
        this.selector = this.add.polygon(
            menuX - 145,
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

        // Coloca o losango por cima da barra.
        .setDepth(6);

        // Percorre todas as opções do menu.
        for (let i = 0; i < this.menuItems.length; i++) {

            // Guarda a opção atual.
            const item = this.menuItems[i];

            // Cria o texto da opção.
            const txt = this.add.text(
                menuX,
                startY + i * gapY,
                item.text,
                {
                    // Define a fonte.
                    fontFamily: 'Arial',

                    // Define o tamanho do texto.
                    fontSize: '22px',

                    // Define a cor inicial.
                    color: '#e8e2d0',

                    // Define a cor do contorno.
                    stroke: '#000000',

                    // Define a espessura do contorno.
                    strokeThickness: 3
                }
            )

            // Centra o texto.
            .setOrigin(0.5)

            // Coloca o texto por cima do fundo.
            .setDepth(6)

            // Torna o texto clicável.
            .setInteractive({ useHandCursor: true });

            // Quando o rato passa por cima da opção.
            txt.on('pointerover', () => {

                // Atualiza o índice selecionado.
                this.selectedIndex = i;

                // Atualiza visualmente a seleção.
                this.updateSelection();
            });

            // Quando clica na opção.
            txt.on('pointerdown', () => {

                // Escolhe a opção atual.
                this.chooseOption();
            });

            // Guarda o texto na lista.
            this.menuTexts.push(txt);
        }

        // Atualiza a seleção inicial.
        this.updateSelection();

        // Teclado.

        // Cria a tecla cima.
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Cria a tecla baixo.
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla SPACE.
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Rodapé.

        // Adiciona texto de ajuda para navegação.
        this.add.text(width * 0.75, height * 0.75, '↑ ↓  Navegar      ENTER  Selecionar', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '15px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85)

        // Coloca o texto acima do fundo.
        .setDepth(6);

        // Adiciona o texto de copyright.
        this.add.text(width * 0.77, height * 0.78, '© 2026 ORDER OF THE FALLEN', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '12px',

            // Define a cor cinzenta clara.
            color: '#cfcfcf',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 2
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.7)

        // Coloca o texto acima do fundo.
        .setDepth(6);

        // Animação do selector.

        // Cria a animação do losango seletor.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.selector,

            // Move o losango ligeiramente para a direita.
            x: this.selector.x + 8,

            // Define a duração da animação.
            duration: 500,

            // Faz o losango voltar à posição inicial.
            yoyo: true,

            // Repete a animação infinitamente.
            repeat: -1,

            // Define a suavização.
            ease: 'Sine.easeInOut'
        });
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena já estiver a mudar, não aceita input.
        if (this.isChangingScene) return;

        // Se carregar na tecla cima.
        if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

            // Move a seleção para cima.
            this.selectedIndex--;

            // Se passar da primeira opção, vai para a última.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.menuItems.length - 1;
            }

            // Atualiza visualmente a seleção.
            this.updateSelection();
        }

        // Se carregar na tecla baixo.
        if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {

            // Move a seleção para baixo.
            this.selectedIndex++;

            // Se passar da última opção, volta para a primeira.
            if (this.selectedIndex >= this.menuItems.length) {
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

            // Escolhe a opção selecionada.
            this.chooseOption();
        }
    }

    // Atualiza visualmente a opção selecionada.
    updateSelection() {

        // Guarda o texto selecionado.
        const selectedText = this.menuTexts[this.selectedIndex];

        // Percorre todos os textos do menu.
        for (let i = 0; i < this.menuTexts.length; i++) {

            // Guarda o texto atual.
            const txt = this.menuTexts[i];

            // Se este texto for o selecionado.
            if (i === this.selectedIndex) {

                // Muda a cor para branco.
                txt.setColor('#ffffff');

                // Aumenta ligeiramente o texto.
                txt.setScale(1.08);
            } else {

                // Volta à cor normal.
                txt.setColor('#e8e2d0');

                // Volta ao tamanho normal.
                txt.setScale(1);
            }
        }

        // Move a barra para a opção selecionada.
        this.selectorBar.y = selectedText.y;

        // Move o losango para a opção selecionada.
        this.selector.y = selectedText.y;
    }

    // Escolhe a opção selecionada.
    chooseOption() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Guarda a opção selecionada.
        const selected = this.menuItems[this.selectedIndex];

        // Se a opção não existir ou não tiver ação, não faz nada.
        if (!selected || !selected.action) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Executa a ação da opção.
        selected.action();
    }

    // Novo jogo.

    // Inicia um novo jogo.
    novoJogo() {

        // Limpa o progresso guardado.
        SaveSystem.clearProgress();

        // Remove o herói do Player 1.
        this.registry.remove('player1Hero');

        // Remove o herói do Player 2.
        this.registry.remove('player2Hero');

        // Remove o nome do Player 1.
        this.registry.remove('player1Name');

        // Remove o nome do Player 2.
        this.registry.remove('player2Name');

        // Remove as moedas.
        this.registry.remove('coins');

        // Remove o modo de jogo.
        this.registry.remove('gameMode');

        // Remove o score do nível.
        this.registry.remove('levelScore');

        // Remove o detalhe do score.
        this.registry.remove('scoreBreakdown');

        // Remove as estatísticas do score.
        this.registry.remove('scoreStats');

        // Define as moedas iniciais.
        this.registry.set('coins', { p1: 0, p2: 0 });

        // Define o modo inicial como singleplayer.
        this.registry.set('gameMode', 'single');

        // Limpa efeitos anteriores da câmara.
        this.cameras.main.resetFX();

        // Garante que a câmara está visível.
        this.cameras.main.setAlpha(1);

        // Se o teu jogo começa direto na seleção, troca StoryScene por CharSelect.

        // Começa a história do jogo.
        this.scene.start('StoryScene');
    }

    // Continuar.

    // Continua um jogo guardado.
    continuarJogo() {

        // Carrega o progresso guardado.
        const save = SaveSystem.loadProgress();

        // Mostra o save carregado na consola.
        console.log('SAVE CARREGADO:', save);

        // Se não existir save.
        if (!save) {

            // Liberta a troca de cena.
            this.isChangingScene = false;

            // Mostra mensagem de ausência de save.
            this.showNoSaveMessage();

            // Cancela a função.
            return;
        }

        // Se o save não tiver nível ou herói do Player 1.
        if (!save.levelKey || !save.player1Hero) {

            // Mostra aviso na consola.
            console.warn('Save inválido:', save);

            // Limpa o progresso inválido.
            SaveSystem.clearProgress();

            // Liberta a troca de cena.
            this.isChangingScene = false;

            // Mostra mensagem de ausência de save.
            this.showNoSaveMessage();

            // Cancela a função.
            return;
        }

        // Guarda a key do nível salvo.
        const levelKey = save.levelKey;

        // Se a cena guardada não existir no jogo.
        if (!this.scene.manager.keys[levelKey]) {

            // Mostra erro na consola.
            console.error('Cena guardada não existe:', levelKey);

            // Limpa o progresso inválido.
            SaveSystem.clearProgress();

            // Liberta a troca de cena.
            this.isChangingScene = false;

            // Mostra mensagem de ausência de save.
            this.showNoSaveMessage();

            // Cancela a função.
            return;
        }

        // Limpa registry antigo

        // Remove herói antigo do Player 1.
        this.registry.remove('player1Hero');

        // Remove herói antigo do Player 2.
        this.registry.remove('player2Hero');

        // Remove moedas antigas.
        this.registry.remove('coins');

        // Remove modo de jogo antigo.
        this.registry.remove('gameMode');

        // Player 1

        // Cria uma cópia simples dos dados do Player 1 guardado.
        const p1 = { ...save.player1Hero };

        // Restaura a vida atual ao máximo.
        p1.vidaAtual = p1.vidaMax;

        // Marca o Player 1 como vivo.
        p1.isDead = false;

        // Remove estado de ataque.
        p1.isAttacking = false;

        // Remove estado de dano.
        p1.isHurting = false;

        // Remove estado de defesa.
        p1.isBlocking = false;

        // Guarda o Player 1 no registry.
        this.registry.set('player1Hero', p1);

        // Player 2

        // Se existir Player 2 guardado.
        if (save.player2Hero) {

            // Cria uma cópia simples dos dados do Player 2.
            const p2 = { ...save.player2Hero };

            // Restaura a vida atual ao máximo.
            p2.vidaAtual = p2.vidaMax;

            // Marca o Player 2 como vivo.
            p2.isDead = false;

            // Remove estado de ataque.
            p2.isAttacking = false;

            // Remove estado de dano.
            p2.isHurting = false;

            // Remove estado de defesa.
            p2.isBlocking = false;

            // Guarda o Player 2 no registry.
            this.registry.set('player2Hero', p2);

            // Define o modo de jogo guardado ou multi.
            this.registry.set('gameMode', save.gameMode || 'multi');
        } else {

            // Remove o Player 2 se o save não tiver Player 2.
            this.registry.remove('player2Hero');

            // Define o modo como singleplayer.
            this.registry.set('gameMode', 'single');
        }

        // Guarda as moedas do save ou começa a 0.
        this.registry.set('coins', save.coins || { p1: 0, p2: 0 });

        // Guarda o nome do Player 1.
        this.registry.set('player1Name', save.player1Name || '');

        // Guarda o nome do Player 2.
        this.registry.set('player2Name', save.player2Name || '');

        // Define que o jogador atual é o Player 1.
        this.registry.set('currentPlayer', 1);

        // Limpa efeitos da câmara.
        this.cameras.main.resetFX();

        // Garante visibilidade total da câmara.
        this.cameras.main.setAlpha(1);

        // Mostra na consola qual nível vai abrir.
        console.log('A ENTRAR NO NÍVEL SALVO:', levelKey);

        // Inicia o nível guardado.
        this.scene.start(levelKey);
    }

    // Mensagem sem save.

    // Mostra mensagem quando não existe jogo salvo.
    showNoSaveMessage() {

        // Guarda a largura da câmara.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara.
        const height = this.cameras.main.height;

        // Se já existir mensagem anterior.
        if (this.noSaveText) {

            // Remove a mensagem anterior.
            this.noSaveText.destroy();
        }

        // Cria o texto da mensagem.
        this.noSaveText = this.add.text(
            width * 0.74,
            height * 0.64,
            'Não existe jogo salvo.\nComeça um novo jogo.',
            {
                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '17px',

                // Define a cor branca.
                color: '#ffffff',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4,

                // Centraliza as linhas do texto.
                align: 'center'
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca a mensagem por cima de tudo.
        .setDepth(9999)

        // Começa invisível.
        .setAlpha(0);

        // Cria animação da mensagem.
        this.tweens.add({

            // Define a mensagem como alvo.
            targets: this.noSaveText,

            // Faz a mensagem aparecer.
            alpha: 1,

            // Move ligeiramente a mensagem para cima.
            y: this.noSaveText.y - 8,

            // Define a duração da animação.
            duration: 250,

            // Define a suavização.
            ease: 'Power2',

            // Faz a animação voltar.
            yoyo: true,

            // Mantém a mensagem visível durante algum tempo.
            hold: 1500,

            // Quando a animação terminar.
            onComplete: () => {

                // Se a mensagem ainda existir.
                if (this.noSaveText) {

                    // Remove a mensagem.
                    this.noSaveText.destroy();

                    // Limpa a referência.
                    this.noSaveText = null;
                }
            }
        });
    }
}