// Importa o sistema de música, embora neste ficheiro não esteja a ser usado diretamente.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe NameScene, responsável por pedir o nome dos jogadores.
export default class NameScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "NameScene".
        super('NameScene');
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e a altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Faz fade in ao entrar nesta cena.
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Vai buscar o modo de jogo guardado no registry.
        this.gameMode = this.registry.get('gameMode') || 'single';

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;

        // Indica qual jogador está a escrever o nome.
        this.currentNamePlayer = 1;

        // Guarda o nome que está a ser escrito.
        this.playerName = '';

        // Define o tamanho máximo do nome.
        this.maxNameLength = 12;

        // Guarda temporariamente os nomes dos jogadores.
        this.playerNames = {
            player1Name: '',
            player2Name: ''
        };

        // Background.

        // Adiciona a imagem de fundo do menu.
        this.add.image(width / 2, height / 2, 'bgMenu')

            // Ajusta a imagem para ocupar o ecrã inteiro.
            .setDisplaySize(width, height)

            // Coloca o fundo na profundidade mais baixa.
            .setDepth(0);

        // Adiciona uma camada preta por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da camada escura.
            .setAlpha(0.55)

            // Coloca a camada acima do fundo.
            .setDepth(1);

        // Título.

        // Adiciona a caixa visual do título.
        this.add.image(width / 2, height * 0.16, 'caixaTitulo')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da caixa.
            .setScale(0.24)

            // Coloca a caixa acima do fundo.
            .setDepth(2);

        // Cria o texto do título.
        this.titleText = this.add.text(width / 2, height * 0.18, '', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '28px',

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

        // Coloca o texto acima da caixa.
        .setDepth(3);

        // Texto de instrução.

        // Cria o texto que indica qual jogador deve escrever o nome.
        this.instructionText = this.add.text(width / 2, height * 0.34, '', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor dourada clara.
            color: '#f6e4b0',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto por cima do fundo.
        .setDepth(3);

        // Caixa do nome.

        // Cria a caixa onde o nome aparece.
        this.add.rectangle(width / 2, height * 0.48, 560, 72, 0x000000)

            // Centra o retângulo.
            .setOrigin(0.5)

            // Define a transparência da caixa.
            .setAlpha(0.35)

            // Define a borda dourada da caixa.
            .setStrokeStyle(2, 0xd8b568)

            // Coloca a caixa acima do fundo.
            .setDepth(2);

        // Cria o texto onde o nome digitado aparece.
        this.nameText = this.add.text(width / 2, height * 0.48, '_', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
            fontSize: '32px',

            // Define a cor amarela.
            color: '#ffd700',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima da caixa.
        .setDepth(3);

        // Botões.

        // Cria o botão de confirmar nome.
        this.createButton(width / 2, height * 0.63, 'CONFIRMAR', () => {

            // Confirma o nome escrito.
            this.confirmName();
        });

        // Cria o botão de voltar.
        this.createButton(width / 2, height * 0.76, 'VOLTAR', () => {

            // Volta ao menu principal.
            this.backToMenu();
        });

        // Ajuda.

        // Adiciona o texto de ajuda com as teclas disponíveis.
        this.add.text(
            width / 2,
            height * 0.88,
            'Escreve o nome    ENTER Confirmar    BACKSPACE Apagar    ESC Voltar',
            {
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
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Define uma ligeira transparência.
        .setAlpha(0.85)

        // Coloca o texto acima do fundo.
        .setDepth(3);

        // Teclado.

        // Escuta qualquer tecla pressionada.
        this.input.keyboard.on('keydown', (event) => {

            // Trata o input do teclado.
            this.handleKeyboardInput(event);
        });

        // Atualiza os textos iniciais da cena.
        this.updateTexts();
    }

    // Atualiza os textos principais da cena.
    updateTexts() {

        // Define o título fixo da cena.
        this.titleText.setText('REGISTAR JOGADOR');

        // Se o jogador atual for o Player 1.
        if (this.currentNamePlayer === 1) {

            // Mostra instrução para o Jogador 1.
            this.instructionText.setText('Nome do Jogador 1');
        } else {

            // Mostra instrução para o Jogador 2.
            this.instructionText.setText('Nome do Jogador 2');
        }

        // Atualiza o texto do nome.
        this.updateNameText();
    }

    // Trata as teclas pressionadas pelo jogador.
    handleKeyboardInput(event) {

        // Se a cena já estiver a mudar, ignora inputs.
        if (this.isChangingScene) return;

        // Se carregar Escape.
        if (event.key === 'Escape') {

            // Volta ao menu.
            this.backToMenu();

            // Para a função.
            return;
        }

        // Se carregar Enter.
        if (event.key === 'Enter') {

            // Confirma o nome.
            this.confirmName();

            // Para a função.
            return;
        }

        // Se carregar Backspace.
        if (event.key === 'Backspace') {

            // Remove a última letra do nome.
            this.playerName = this.playerName.slice(0, -1);

            // Atualiza o texto mostrado.
            this.updateNameText();

            // Para a função.
            return;
        }

        // Se o nome já tiver atingido o limite, não adiciona mais letras.
        if (this.playerName.length >= this.maxNameLength) return;

        // Guarda a tecla pressionada.
        const key = event.key;

        // Só aceita letras, números e espaço.
        if (/^[a-zA-Z0-9 ]$/.test(key)) {

            // Adiciona a tecla ao nome em maiúsculas.
            this.playerName += key.toUpperCase();

            // Atualiza o texto mostrado.
            this.updateNameText();
        }
    }

    // Atualiza o texto visual do nome.
    updateNameText() {

        // Se o nome estiver vazio.
        if (this.playerName.trim().length === 0) {

            // Mostra underscore como indicação de campo vazio.
            this.nameText.setText('_');
        } else {

            // Mostra o nome escrito.
            this.nameText.setText(this.playerName);
        }
    }

    // Confirma o nome escrito.
    confirmName() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Guarda o nome sem espaços no início e no fim.
        const name = this.playerName.trim();

        // Se o nome estiver vazio.
        if (name.length === 0) {

            // Mostra mensagem de erro.
            this.showMessage('Escreve um nome primeiro!');

            // Cancela a confirmação.
            return;
        }

        // Se estiver a registar o Player 1.
        if (this.currentNamePlayer === 1) {

            // Guarda o nome do Player 1 na lista local.
            this.playerNames.player1Name = name;

            // Guarda o nome do Player 1 no registry.
            this.registry.set('player1Name', name);

            // Se o modo for multiplayer.
            if (this.gameMode === 'multi') {

                // Passa para o Player 2.
                this.currentNamePlayer = 2;

                // Limpa o nome digitado.
                this.playerName = '';

                // Atualiza os textos para o Player 2.
                this.updateTexts();

                // Para aqui para pedir o segundo nome.
                return;
            }
        }

        // Se estiver a registar o Player 2.
        if (this.currentNamePlayer === 2) {

            // Guarda o nome do Player 2 na lista local.
            this.playerNames.player2Name = name;

            // Guarda o nome do Player 2 no registry.
            this.registry.set('player2Name', name);
        }

        // Se o modo for singleplayer.
        if (this.gameMode === 'single') {

            // Remove qualquer nome antigo do Player 2.
            this.registry.remove('player2Name');
        }

        // Guarda os nomes no localStorage.
        localStorage.setItem('order_of_the_fallen_player_names', JSON.stringify({

            // Guarda o nome do Player 1.
            player1Name: this.registry.get('player1Name') || '',

            // Guarda o nome do Player 2.
            player2Name: this.registry.get('player2Name') || '',

            // Guarda o modo de jogo.
            gameMode: this.gameMode
        }));

        // Define que a próxima seleção começa pelo Player 1.
        this.registry.set('currentPlayer', 1);

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Faz fade out.
        this.cameras.main.fadeOut(400, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Vai para a seleção de personagens.
                this.scene.start('CharSelect');
            }
        );
    }

    // Mostra uma mensagem temporária na cena.
    showMessage(text) {

        // Se já existir uma mensagem, remove-a.
        if (this.messageText) {
            this.messageText.destroy();
        }

        // Cria o texto da mensagem.
        this.messageText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height * 0.27,
            text,
            {
                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho do texto.
                fontSize: '18px',

                // Define a cor vermelha.
                color: '#ff4444',

                // Coloca o texto em negrito.
                fontStyle: 'bold',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            }
        )

        // Centra a mensagem.
        .setOrigin(0.5)

        // Coloca a mensagem por cima de tudo.
        .setDepth(20);

        // Depois de 1600ms.
        this.time.delayedCall(1600, () => {

            // Se a mensagem ainda existir.
            if (this.messageText) {

                // Remove a mensagem.
                this.messageText.destroy();

                // Limpa a referência.
                this.messageText = null;
            }
        });
    }

    // Cria um botão visual reutilizável.
    createButton(x, y, text, callback) {

        // Cria um container para o botão.
        const container = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(5);

        // Cria a imagem do botão.
        const btnImg = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da imagem.
            .setScale(0.24);

        // Cria o texto do botão.
        const label = this.add.text(0, 5, text, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '17px',

            // Define a cor branca.
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
        container.add([btnImg, label]);

        // HITBOX SIMPLES — sem Phaser.Geom.Rectangle

        // Define o tamanho da área clicável do botão.
        container.setSize(210, 55);

        // Torna o container interativo.
        container.setInteractive({ useHandCursor: true });

        // Quando o rato passa por cima.
        container.on('pointerover', () => {

            // Aumenta ligeiramente a imagem.
            btnImg.setScale(0.255);

            // Muda o texto para dourado.
            label.setColor('#ffd700');
        });

        // Quando o rato sai do botão.
        container.on('pointerout', () => {

            // Volta a imagem ao tamanho normal.
            btnImg.setScale(0.24);

            // Volta o texto a branco.
            label.setColor('#ffffff');
        });

        // Quando o rato pressiona o botão.
        container.on('pointerdown', () => {

            // Diminui ligeiramente a imagem.
            btnImg.setScale(0.225);
        });

        // Quando o rato solta o botão.
        container.on('pointerup', () => {

            // Volta a imagem para o estado de hover.
            btnImg.setScale(0.255);

            // Executa a função recebida.
            callback();
        });

        // Devolve o botão criado.
        return container;
    }

    // Volta ao menu principal.
    backToMenu() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Faz fade out.
        this.cameras.main.fadeOut(400, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Volta ao menu principal.
                this.scene.start('MenuScene');
            }
        );
    }
}