// Importa o sistema de música para tocar música nesta cena.
import MusicSystem from '../systems/MusicSystem.js';

// Exporta a classe AboutScene para poder ser usada no game.js.
export default class AboutScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "AboutScene".
        super('AboutScene');
    }

    // Função chamada automaticamente quando a cena é criada.
    create() {

        // Vai buscar a largura e a altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Controla se a cena já está a trocar para outra cena.
        this.isChangingScene = false;

        // Faz um fade in da câmara durante 500ms.
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Toca a música interior nesta cena.
        MusicSystem.play(this, 'music_interior', {

            // Define o volume da música.
            volume: 0.45,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo de fade da música.
            fade: 1000
        });

        // BACKGROUND

        // Adiciona a imagem de fundo no centro do ecrã.
        this.add.image(width / 2, height / 2, 'bgCharSelect')

            // Ajusta a imagem para ocupar toda a largura e altura do ecrã.
            .setDisplaySize(width, height)

            // Define a profundidade da imagem no fundo.
            .setDepth(0);

        // Fundo preto transparente

        // Adiciona um retângulo preto por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência do retângulo.
            .setAlpha(0.55)

            // Define a profundidade acima da imagem de fundo.
            .setDepth(1);

        // CAIXA DO TÍTULO

        // Adiciona a imagem da caixa do título.
        this.add.image(width / 2, height * 0.16, 'caixaTitulo')

            // Centra a imagem pela origem.
            .setOrigin(0.5)

            // Reduz o tamanho da caixa.
            .setScale(0.24)

            // Coloca a caixa acima do fundo escuro.
            .setDepth(2);

        // Adiciona o texto principal do título.
        this.add.text(width / 2, height * 0.18, 'SOBRE O JOGO', {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho da letra.
            fontSize: '30px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno do texto.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima da caixa.
        .setDepth(3);

        // PAINEL ESTILO POPUP

        // Define a posição X central do painel.
        const panelX = width / 2;

        // Define a posição Y central do painel.
        const panelY = height / 2;

        // Cria uma barra decorativa atrás do subtítulo.
        const selectorBar = this.add.rectangle(
            panelX,
            panelY - 140,
            620,
            38,
            0xd8b568
        )

        // Centra a barra pela origem.
        .setOrigin(0.5)

        // Define a transparência da barra.
        .setAlpha(0.22)

        // Coloca a barra numa profundidade acima do fundo.
        .setDepth(2);

        // Cria um losango decorativo ao lado do subtítulo.
        const diamond = this.add.polygon(
            panelX - 310,
            panelY - 140,
            [
                0, 8,
                13, 0,
                26, 8,
                13, 16
            ],
            0xffd36a
        )

        // Centra o polígono pela origem.
        .setOrigin(0.5)

        // Coloca o losango acima da barra.
        .setDepth(4);

        // Cria uma animação para o losango.
        this.tweens.add({

            // Define que o alvo da animação é o losango.
            targets: diamond,

            // Move o losango 8 pixels para a esquerda.
            x: diamond.x - 8,

            // Define a duração da animação.
            duration: 500,

            // Faz a animação voltar ao ponto inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define o tipo de suavização da animação.
            ease: 'Sine.easeInOut'
        });

        // Adiciona o subtítulo do painel.
        this.add.text(panelX, panelY - 140, 'Uma nova aventura começou...', {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto por cima dos elementos anteriores.
        .setDepth(4);

        // TEXTO SOBRE O JOGO

        // Guarda o texto completo sobre a história e objetivo do jogo.
        const textoSobre =
            // Primeira parte do texto sobre Valdoria e Odysseus.
            'O jogo passa-se em Valdoria, um reino que viveu em paz durante séculos graças aos cristais mágicos. No entanto, essa paz foi destruída quando Odysseus, um cavaleiro poderoso, se virou contra o reino, dando início a uma ameaça que colocou todos em perigo.\n\n' +

            // Segunda parte do texto sobre a exploração e progressão.
            'Para enfrentar este desafio, o jogador escolhe um herói e percorre vários níveis cheios de inimigos, obstáculos e caminhos bloqueados. Durante a aventura, é necessário explorar o mapa, recolher cristais, usar itens e encontrar chaves para conseguir avançar.\n\n' +

            // Terceira parte do texto sobre o objetivo final e modo cooperativo.
            'O objetivo principal é chegar até Odysseus e derrotá-lo, restaurando a segurança de Valdoria. O jogo pode ser jogado sozinho ou em modo cooperativo, permitindo que dois jogadores trabalhem em conjunto para completar a missão.';

        // Adiciona o texto sobre o jogo ao ecrã.
        this.add.text(panelX, panelY - 95, textoSobre, {

            // Define a fonte do texto.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
            fontSize: '16px',

            // Define a cor do texto.
            color: '#e8e2d0',

            // Alinha o texto ao centro.
            align: 'center',

            // Define o espaçamento entre linhas.
            lineSpacing: 8,

            // Ativa quebra automática de linha.
            wordWrap: {

                // Define a largura máxima do texto antes de quebrar linha.
                width: 760
            },

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Define a origem no centro horizontal e no topo vertical.
        .setOrigin(0.5, 0)

        // Coloca o texto acima do fundo.
        .setDepth(4);

        // BOTÃO VOLTAR

        // Cria o botão para voltar ao menu.
        this.createBackButton(width / 2, height * 0.88);

        // TECLAS

        // Cria a tecla ESC para voltar ao menu.
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Cria a tecla ENTER para voltar ao menu.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    // Função chamada automaticamente a cada frame.
    update() {

        // Verifica se o jogador carregou ESC ou ENTER.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyEsc) ||
            Phaser.Input.Keyboard.JustDown(this.keyEnter)
        ) {

            // Volta para o menu.
            this.voltarMenu();
        }
    }

    // Cria o botão visual de voltar ao menu.
    createBackButton(x, y) {

        // Cria um container para juntar imagem e texto do botão.
        this.backButton = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(10);

        // Adiciona a imagem do botão.
        const btnImg = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala do botão.
            .setScale(0.24);

        // Adiciona o texto do botão.
        const texto = this.add.text(0, 5, 'VOLTAR AO MENU', {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '16px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona a imagem e o texto ao container do botão.
        this.backButton.add([btnImg, texto]);

        // Define o tamanho da área clicável do botão.
        this.backButton.setSize(210, 55);

        // Torna o botão interativo e muda o cursor para mão.
        this.backButton.setInteractive({ useHandCursor: true });

        // Evento quando o rato passa por cima do botão.
        this.backButton.on('pointerover', () => {

            // Aumenta ligeiramente a imagem do botão.
            btnImg.setScale(0.255);

            // Muda a cor do texto para amarelo.
            texto.setColor('#ffd700');
        });

        // Evento quando o rato sai de cima do botão.
        this.backButton.on('pointerout', () => {

            // Volta a escala normal da imagem.
            btnImg.setScale(0.24);

            // Volta a cor do texto para branco.
            texto.setColor('#ffffff');
        });

        // Evento quando o rato pressiona o botão.
        this.backButton.on('pointerdown', () => {

            // Reduz ligeiramente a imagem para dar efeito de clique.
            btnImg.setScale(0.225);

            // Mantém o texto amarelo durante o clique.
            texto.setColor('#ffd700');
        });

        // Evento quando o rato solta o botão.
        this.backButton.on('pointerup', () => {

            // Chama a função para voltar ao menu.
            this.voltarMenu();
        });
    }

    // Função que faz a transição de volta para o menu.
    voltarMenu() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está em transição.
        this.isChangingScene = true;

        // Faz fade out da câmara.
        this.cameras.main.fadeOut(400, 0, 0, 0);

        // Quando o fade out terminar, troca para o MenuScene.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Inicia a cena do menu principal.
                this.scene.start('MenuScene');
            }
        );
    }
}