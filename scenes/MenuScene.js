// Importa o sistema de música, usado para tocar a música do menu.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe MenuScene, responsável pelo menu principal do jogo.
export default class MenuScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "MenuScene".
        super('MenuScene');
    }

    // Preload vazio porque os recursos já são carregados noutra cena.
    preload() {}

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura da câmara principal.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara principal.
        const height = this.cameras.main.height;

        // Índice da opção atualmente selecionada no menu.
        this.selectedIndex = 0;

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;

        // Toca a música do menu principal.
        MusicSystem.play(this, 'music_menu', {

            // Define o volume da música.
            volume: 0.45,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo do fade da música.
            fade: 2000
        });

        // Fundo.

        // Adiciona a imagem de fundo do menu no centro do ecrã.
        this.add.image(width / 2, height / 2, 'bgMenu')

        // Ajusta o fundo para ocupar todo o ecrã.
        .setDisplaySize(width, height)

        // Coloca o fundo na profundidade mais baixa.
        .setDepth(0);

        // escurecer o fundo

        // Adiciona um retângulo preto transparente por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência do escurecimento.
            .setAlpha(0.35)

            // Coloca esta camada acima do fundo.
            .setDepth(1);

        // vinheta lateral para parecer mais cinematográfico

        // Adiciona outra camada preta para dar efeito mais cinematográfico.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define uma transparência mais baixa.
            .setAlpha(0.18)

            // Coloca esta camada acima da anterior.
            .setDepth(2);

        // Logo / título.

        // Adiciona o texto principal "ORDER".
        this.add.text(width * 0.17, height * 0.55, 'ORDER', {

            // Define a fonte do título.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho da letra.
            fontSize: '110px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do texto.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 8
        })

        // Centra o texto pela origem.
        .setOrigin(0.5)

        // Coloca o título por cima do fundo.
        .setDepth(5);

        // Adiciona o subtítulo "OF THE FALLEN".
        this.add.text(width * 0.270, height * 0.64, 'OF THE FALLEN', {

            // Define a fonte do subtítulo.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho da letra.
            fontSize: '42px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do texto.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 6
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto por cima do fundo.
        .setDepth(5);

        // Adiciona o texto pequeno "PIXEL LEGENDS".
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

        // Coloca o texto por cima do fundo.
        .setDepth(5);

        // Menu.

        // Cria a lista de opções do menu principal.
        this.menuItems = [
            {
                // Texto mostrado na primeira opção.
                text: '1 Jogador',

                // Ação executada ao escolher 1 jogador.
                action: () => {

                    // Define o modo de jogo como singleplayer.
                    this.registry.set('gameMode', 'single');

                    // Define que o jogador atual é o Player 1.
                    this.registry.set('currentPlayer', 1);

                    // Remove o nome anterior do Player 1.
                    this.registry.remove('player1Name');

                    // Remove o nome anterior do Player 2.
                    this.registry.remove('player2Name');

                    // Vai para a cena de nome.
                    this.scene.start('NameScene');
                }
            },
            {
                // Texto mostrado na segunda opção.
                text: '2 Jogadores',

                // Ação executada ao escolher 2 jogadores.
                action: () => {

                    // Define o modo de jogo como multiplayer.
                    this.registry.set('gameMode', 'multi');

                    // Define que o jogador atual é o Player 1.
                    this.registry.set('currentPlayer', 1);

                    // Remove o nome anterior do Player 1.
                    this.registry.remove('player1Name');

                    // Remove o nome anterior do Player 2.
                    this.registry.remove('player2Name');

                    // Vai para a cena de nome.
                    this.scene.start('NameScene');
                }
            },

            {
                // Texto mostrado na opção de recordes.
                text: 'Recordes',

                // Ação executada ao abrir os recordes.
                action: () => {

                    // Vai para a cena dos recordes.
                    this.scene.start('RecordsScene');
                }
            },

            {
                // Texto mostrado na opção de controlos.
                text: 'Controles',

                // Ação executada ao abrir os controlos.
                action: () => {

                    // Vai para a cena dos controlos.
                    this.scene.start('ControlsScene');
                }
            },
            {
                // Texto mostrado na opção sobre.
                text: 'Sobre',

                // Ação executada ao abrir a cena sobre.
                action: () => {

                    // Vai para a cena AboutScene.
                    this.scene.start('AboutScene');
                }
            },
            {
                // Texto mostrado na opção voltar.
                text: 'Voltar',

                // Ação executada ao voltar.
                action: () => {

                    // Vai para a StartScene.
                    this.scene.start('StartScene');
                }
            }
        ];

        // Lista onde serão guardados os textos das opções do menu.
        this.menuTexts = [];

        // Define a posição X do menu.
        const menuX = width * 0.74;

        // Define a posição Y da primeira opção.
        const startY = height * 0.40;

        // Define o espaço vertical entre opções.
        const gapY = 42;

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

            // Guarda o item atual.
            const item = this.menuItems[i];

            // Cria o texto da opção do menu.
            const txt = this.add.text(
                menuX,
                startY + i * gapY,
                item.text,
                {
                    // Define a fonte da opção.
                    fontFamily: 'Arial',

                    // Define o tamanho do texto.
                    fontSize: '22px',

                    // Define a cor inicial do texto.
                    color: '#e8e2d0',

                    // Define a cor do contorno.
                    stroke: '#000000',

                    // Define a espessura do contorno.
                    strokeThickness: 3
                }
            )

            // Centra o texto.
            .setOrigin(0.5)

            // Coloca o texto por cima da barra.
            .setDepth(6)

            // Torna o texto interativo com cursor de mão.
            .setInteractive({ useHandCursor: true });

            // Quando o rato passa por cima da opção.
            txt.on('pointerover', () => {

                // Atualiza o índice selecionado.
                this.selectedIndex = i;

                // Atualiza visualmente a seleção.
                this.updateSelection();
            });

            // Quando o rato clica na opção.
            txt.on('pointerdown', () => {

                // Escolhe a opção atual.
                this.chooseOption();
            });

            // Guarda o texto na lista de textos do menu.
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

            // Define o tamanho do texto.
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

        // Define uma ligeira transparência.
        .setAlpha(0.85)

        // Coloca o texto por cima do fundo.
        .setDepth(6);

        // Adiciona texto de copyright.
        this.add.text(width * 0.77, height * 0.78, '© 2026 ORDER OF THE FALLEN', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
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

        // Coloca o texto por cima do fundo.
        .setDepth(6);

        // Animação do selector.

        // Cria animação no losango seletor.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.selector,

            // Move o losango ligeiramente para a direita.
            x: this.selector.x + 8,

            // Define a duração da animação.
            duration: 500,

            // Faz voltar à posição inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização da animação.
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

    // Atualiza visualmente qual opção está selecionada.
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

    // Executa a ação da opção selecionada.
    chooseOption() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Guarda a opção selecionada.
        const selected = this.menuItems[this.selectedIndex];

        // Se a opção não existir ou não tiver ação.
        if (!selected || !selected.action) {

            // Liberta a troca de cena.
            this.isChangingScene = false;

            // Para a função.
            return;
        }

        // Faz fade out antes de trocar de cena.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Executa a ação da opção selecionada.
                selected.action();
            }
        );
    }
}