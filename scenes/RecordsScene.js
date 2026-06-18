// Importa o sistema de música, usado para tocar música nesta cena.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe RecordsScene, responsável por mostrar e limpar os recordes.
export default class RecordsScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "RecordsScene".
        super('RecordsScene');
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e a altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Faz fade in ao entrar nesta cena.
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;

        // Controla se os recordes estão a ser limpos.
        this.isClearingRecords = false;

        // Guarda todos os textos dos recordes para conseguir apagar visualmente
        this.recordObjects = [];

        // Guarda a mensagem temporária mostrada na cena.
        this.messageText = null;

        // Toca a música interior nesta cena.
        MusicSystem.play(this, 'music_interior', {

            // Define o volume da música.
            volume: 0.45,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo do fade da música.
            fade: 2000
        });

        // Fundo.

        // Adiciona a imagem de fundo do menu.
        this.add.image(width / 2, height / 2, 'bgMenu')

            // Ajusta a imagem ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Coloca a imagem na profundidade mais baixa.
            .setDepth(0);

        // Adiciona uma camada preta transparente por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da camada.
            .setAlpha(0.55)

            // Coloca a camada acima do fundo.
            .setDepth(1);

        // Título.

        // Verifica se existe a textura da caixa de título.
        if (this.textures.exists('caixaTitulo')) {

            // Adiciona a caixa visual do título.
            this.add.image(width / 2, height * 0.16, 'caixaTitulo')

                // Centra a imagem.
                .setOrigin(0.5)

                // Define a escala da caixa.
                .setScale(0.24)

                // Coloca a caixa acima do fundo.
                .setDepth(2);
        }

        // Adiciona o texto do título.
        this.add.text(width / 2, height * 0.18, 'RECORDES', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '32px',

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

        // Painel dos recordes.

        // Cria o painel de fundo onde aparecem os recordes.
        this.add.rectangle(width / 2, height * 0.50, 720, 340, 0x000000)

            // Centra o painel.
            .setOrigin(0.5)

            // Define a transparência do painel.
            .setAlpha(0.35)

            // Define a borda dourada do painel.
            .setStrokeStyle(2, 0xd8b568, 0.8)

            // Coloca o painel acima do fundo.
            .setDepth(2);

        // Cria o cabeçalho da coluna do jogador.
        this.add.text(width * 0.30, height * 0.30, 'JOGADOR', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '18px',

            // Define a cor dourada.
            color: '#ffd36a',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Alinha o texto à esquerda.
        .setOrigin(0, 0.5)

        // Coloca o texto acima do painel.
        .setDepth(3);

        // Cria o cabeçalho da coluna do score.
        this.add.text(width * 0.70, height * 0.30, 'SCORE', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '18px',

            // Define a cor dourada.
            color: '#ffd36a',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Alinha o texto à direita.
        .setOrigin(1, 0.5)

        // Coloca o texto acima do painel.
        .setDepth(3);

        // Desenhar recordes.

        // Desenha a lista de recordes no painel.
        this.drawRecords();

        // Botão limpar.

        // Cria o botão para limpar os recordes.
        this.createButton(width * 0.35, height * 0.84, 'LIMPAR RECORDES', () => {

            // Limpa os recordes guardados.
            this.clearRecords();
        });

        // Botão voltar.

        // Cria o botão para voltar ao menu.
        this.createButton(width * 0.63, height * 0.84, 'VOLTAR', () => {

            // Volta ao menu principal.
            this.backToMenu();
        });

        // Cria o texto de ajuda para limpar recordes com a tecla L.
        this.add.text(width * 0.35, height * 0.91, 'L - Limpar', {

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

        // Define uma transparência ligeira.
        .setAlpha(0.85)

        // Coloca o texto acima do fundo.
        .setDepth(3);

        // Cria o texto de ajuda para voltar com ESC.
        this.add.text(width * 0.63, height * 0.91, 'ESC - Voltar', {

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

        // Define uma transparência ligeira.
        .setAlpha(0.85)

        // Coloca o texto acima do fundo.
        .setDepth(3);

        // Cria a tecla L.
        this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        // Cria a tecla ESC.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena já estiver a mudar, não aceita inputs.
        if (this.isChangingScene) return;

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {

            // Volta ao menu.
            this.backToMenu();
        }

        // Se carregar L.
        if (Phaser.Input.Keyboard.JustDown(this.keyL)) {

            // Limpa os recordes.
            this.clearRecords();
        }
    }

    // Recordes.

    // Vai buscar os recordes guardados.
    getRecords() {

        // Define a key usada no localStorage para os recordes gerais.
        const saveKey = 'order_of_the_fallen_records';

        // Cria a lista inicial de recordes.
        let records = [];

        // Tenta ler os recordes guardados.
        try {

            // Converte os recordes guardados de JSON para array.
            records = JSON.parse(localStorage.getItem(saveKey)) || [];
        } catch (e) {

            // Se houver erro, usa uma lista vazia.
            records = [];
        }

        // Ordena os recordes do maior score para o menor.
        records.sort((a, b) => b.score - a.score);

        // Devolve apenas os 5 melhores recordes.
        return records.slice(0, 5);
    }

    // Desenha os recordes no ecrã.
    drawRecords() {

        // Guarda a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Limpa os textos antigos sem mostrar mensagem vazia.
        this.clearRecordTexts(false);

        // Vai buscar os recordes.
        const records = this.getRecords();

        // Se não houver recordes.
        if (records.length === 0) {

            // Cria o texto de lista vazia.
            const emptyText = this.add.text(width / 2, height * 0.50, 'Ainda não existem recordes.', {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho do texto.
                fontSize: '24px',

                // Define a cor branca.
                color: '#ffffff',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            })

            // Centra o texto.
            .setOrigin(0.5)

            // Coloca o texto acima do painel.
            .setDepth(3);

            // Guarda o texto na lista para poder destruir depois.
            this.recordObjects.push(emptyText);

            // Para a função.
            return;
        }

        // Define a posição Y inicial da lista.
        const startY = height * 0.37;

        // Define o espaço vertical entre recordes.
        const gapY = 45;

        // Percorre todos os recordes.
        for (let i = 0; i < records.length; i++) {

            // Guarda o recorde atual.
            const record = records[i];

            // Cria o texto da posição do recorde.
            const positionText = this.add.text(width * 0.25, startY + i * gapY, `${i + 1}.`, {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho do texto.
                fontSize: '23px',

                // Define a cor dourada.
                color: '#ffd36a',

                // Coloca o texto em negrito.
                fontStyle: 'bold',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            })

            // Centra o número da posição.
            .setOrigin(0.5)

            // Coloca o texto acima do painel.
            .setDepth(3);

            // Cria o texto do nome do jogador.
            const nameText = this.add.text(width * 0.30, startY + i * gapY, record.name, {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho do texto.
                fontSize: '21px',

                // Define a cor branca.
                color: '#ffffff',

                // Coloca o texto em negrito.
                fontStyle: 'bold',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            })

            // Alinha o nome à esquerda.
            .setOrigin(0, 0.5)

            // Coloca o texto acima do painel.
            .setDepth(3);

            // Cria o texto do score.
            const scoreText = this.add.text(width * 0.70, startY + i * gapY, String(record.score), {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho do texto.
                fontSize: '21px',

                // Define a cor branca.
                color: '#ffffff',

                // Coloca o texto em negrito.
                fontStyle: 'bold',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            })

            // Alinha o score à direita.
            .setOrigin(1, 0.5)

            // Coloca o texto acima do painel.
            .setDepth(3);

            // Guarda os textos criados para poder apagar depois.
            this.recordObjects.push(positionText, nameText, scoreText);
        }
    }

    // Limpa os textos de recordes do ecrã.
    clearRecordTexts(showEmptyMessage = true) {

        // Se existirem objetos de recordes.
        if (this.recordObjects && this.recordObjects.length > 0) {

            // Percorre todos os objetos de recordes.
            this.recordObjects.forEach(obj => {

                // Se o objeto existir e puder ser destruído.
                if (obj && obj.destroy) {

                    // Destroi o objeto.
                    obj.destroy();
                }
            });
        }

        // Limpa a lista de objetos de recordes.
        this.recordObjects = [];

        // Se não for para mostrar mensagem vazia, para aqui.
        if (!showEmptyMessage) return;

        // Guarda a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Cria o texto de lista vazia.
        const emptyText = this.add.text(width / 2, height * 0.50, 'Ainda não existem recordes.', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
            fontSize: '24px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima do painel.
        .setDepth(3);

        // Guarda o texto para poder destruir depois.
        this.recordObjects.push(emptyText);
    }

    // Limpa todos os recordes guardados.
    clearRecords() {

        // Se já estiver a limpar recordes, não faz nada.
        if (this.isClearingRecords) return;

        // Key dos recordes gerais.
        const saveKey = 'order_of_the_fallen_records';

        // Key dos recordes por nível.
        const highscoreKey = 'order_of_the_fallen_level_records';

        // Vai buscar os recordes gerais.
        const records = this.getRecords();

        // Cria objeto inicial para recordes por nível.
        let levelRecords = {};

        // Tenta ler os recordes por nível.
        try {

            // Converte os recordes de JSON para objeto.
            levelRecords = JSON.parse(localStorage.getItem(highscoreKey)) || {};
        } catch (e) {

            // Se houver erro, usa objeto vazio.
            levelRecords = {};
        }

        // Verifica se existem recordes gerais.
        const hasRecords = records && records.length > 0;

        // Verifica se existem recordes por nível.
        const hasLevelRecords = Object.keys(levelRecords).length > 0;

        // Se não existirem recordes para limpar.
        if (!hasRecords && !hasLevelRecords) {

            // Mostra mensagem de aviso.
            this.showMessage('Não há recordes para limpar.');

            // Cancela a função.
            return;
        }

        // Bloqueia múltiplas limpezas seguidas.
        this.isClearingRecords = true;

        // Limpar dados guardados.

        // Remove os recordes gerais do localStorage.
        localStorage.removeItem(saveKey);

        // Remove os recordes por nível do localStorage.
        localStorage.removeItem(highscoreKey);

        // Remove o highscore do Level1 do registry.
        this.registry.remove('highscore_Level1');

        // Remove o highscore do Level2 do registry.
        this.registry.remove('highscore_Level2');

        // Remove o highscore do LevelFinal do registry.
        this.registry.remove('highscore_LevelFinal');

        // Primeiro limpa visualmente.

        // Limpa a lista visual de recordes e mostra mensagem vazia.
        this.clearRecordTexts(true);

        // Só depois mostra a mensagem.

        // Mostra mensagem de confirmação.
        this.showMessage('Recordes apagados!');

        // Liberta o botão depois de um pequeno tempo

        // Depois de 900ms, permite limpar novamente se necessário.
        this.time.delayedCall(900, () => {

            // Liberta o estado de limpeza.
            this.isClearingRecords = false;
        });
    }

    // Botões.

    // Cria um botão reutilizável.
    createButton(x, y, text, callback) {

        // Cria o container do botão.
        const container = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(5);

        // Guarda a imagem ou retângulo do botão.
        let btnImg = null;

        // Se existir textura do botão.
        if (this.textures.exists('botaoSelecionar')) {

            // Cria o botão com imagem.
            btnImg = this.add.image(0, 0, 'botaoSelecionar')

                // Centra a imagem.
                .setOrigin(0.5)

                // Define a escala.
                .setScale(0.24);

            // Adiciona a imagem ao container.
            container.add(btnImg);
        } else {

            // Cria um retângulo como fallback visual.
            btnImg = this.add.rectangle(0, 0, 230, 48, 0x000000)

                // Centra o retângulo.
                .setOrigin(0.5)

                // Define a transparência.
                .setAlpha(0.45)

                // Define a borda dourada.
                .setStrokeStyle(2, 0xd8b568);

            // Adiciona o retângulo ao container.
            container.add(btnImg);
        }

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

        // Adiciona o texto ao container.
        container.add(label);

        // Define o tamanho da hitbox do botão.
        container.setSize(230, 55);

        // Torna o botão interativo.
        container.setInteractive({ useHandCursor: true });

        // Quando o rato passa por cima.
        container.on('pointerover', () => {

            // Se o objeto tiver setScale.
            if (btnImg.setScale) {

                // Aumenta ligeiramente o botão.
                btnImg.setScale(0.255);
            }

            // Muda o texto para dourado.
            label.setColor('#ffd700');
        });

        // Quando o rato sai.
        container.on('pointerout', () => {

            // Se o objeto tiver setScale.
            if (btnImg.setScale) {

                // Volta a escala normal.
                btnImg.setScale(0.24);
            }

            // Volta o texto a branco.
            label.setColor('#ffffff');
        });

        // Quando o rato pressiona.
        container.on('pointerdown', () => {

            // Se o objeto tiver setScale.
            if (btnImg.setScale) {

                // Diminui ligeiramente o botão.
                btnImg.setScale(0.225);
            }

            // Mantém o texto dourado.
            label.setColor('#ffd700');
        });

        // Quando o rato solta.
        container.on('pointerup', () => {

            // Se o objeto tiver setScale.
            if (btnImg.setScale) {

                // Volta ao tamanho de hover.
                btnImg.setScale(0.255);
            }

            // Executa a função recebida.
            callback();
        });

        // Devolve o botão criado.
        return container;
    }

    // Mensagem temporária.

    // Mostra uma mensagem temporária na cena.
    showMessage(text) {

        // Se já existir mensagem.
        if (this.messageText) {

            // Remove a mensagem anterior.
            this.messageText.destroy();

            // Limpa a referência.
            this.messageText = null;
        }

        // Guarda largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Cria o texto da mensagem.
        this.messageText = this.add.text(width / 2, height * 0.77, text, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '20px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra a mensagem.
        .setOrigin(0.5)

        // Coloca a mensagem por cima.
        .setDepth(10);

        // Depois de 1800ms.
        this.time.delayedCall(1800, () => {

            // Se a mensagem ainda existir.
            if (this.messageText) {

                // Remove a mensagem.
                this.messageText.destroy();

                // Limpa a referência.
                this.messageText = null;
            }
        });
    }

    // Voltar ao menu.

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

                // Vai para o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }
}