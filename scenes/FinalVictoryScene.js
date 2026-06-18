// Importa o sistema de música para tocar a música da vitória final.
import MusicSystem from '../systems/MusicSystem.js';

// Importa o sistema de save para limpar ou guardar progresso.
import SaveSystem from '../systems/SaveSystem.js';

// Cria a classe FinalVictoryScene, responsável pela cena de vitória final.
export default class FinalVictoryScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "FinalVictoryScene".
        super('FinalVictoryScene');
    }

    // Função chamada quando a cena recebe dados ao iniciar.
    init(data) {

        // Guarda o modo de jogo recebido, ou usa single por padrão.
        this.mode = data?.mode || 'single';

        // Guarda o score total recebido pelos dados da cena.
        this.receivedTotalScore = data?.totalScore || 0;

        // Índice da opção atualmente selecionada no menu.
        this.selectedIndex = 0;

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Toca a música da vitória final.
        MusicSystem.play(this, 'music_finalVictory', {

            // Define o volume da música.
            volume: 0.45,

            // Faz a música repetir.
            loop: true,

            // Define o fade de entrada da música.
            fade: 1000
        });

        // Secção dos dados.

        // Vai buscar e clona os dados do herói do jogador 1.
        this.player1Hero = this.cloneData(this.registry.get('player1Hero'));

        // Vai buscar e clona os dados do herói do jogador 2.
        this.player2Hero = this.cloneData(this.registry.get('player2Hero'));

        // Define o nome do jogador 1 usando várias chaves possíveis do registry.
        this.player1Name =
            this.registry.get('player1Name') ||
            this.registry.get('p1Name') ||
            this.registry.get('nomeP1') ||
            this.player1Hero?.playerName ||
            this.player1Hero?.nomeJogador ||
            'JOGADOR 1';

        // Define o nome do jogador 2 usando várias chaves possíveis do registry.
        this.player2Name =
            this.registry.get('player2Name') ||
            this.registry.get('p2Name') ||
            this.registry.get('nomeP2') ||
            this.player2Hero?.playerName ||
            this.player2Hero?.nomeJogador ||
            'JOGADOR 2';

        // Calcula o score total da campanha.
        this.totalScore = this.getCampaignTotalScore();

        // Define o nome usado para guardar o recorde.
        this.recordName = this.getRecordName();

        // Guarda o score se for recorde e devolve o highscore atual.
        this.highscore = this.saveAndGetHighscore(
            this.recordName,
            this.totalScore
        );

        // Limpa progresso guardado da campanha depois da vitória final.
        SaveSystem.clearProgress();

        // Secção do fundo.

        // Adiciona a imagem de fundo da vitória final.
        this.add.image(width / 2, height / 2, 'bgFinalVictory')

            // Ajusta a imagem ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Coloca o fundo na profundidade mais baixa.
            .setDepth(0);

        // Adiciona um retângulo preto transparente por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência do retângulo.
            .setAlpha(0.6)

            // Coloca o retângulo acima do fundo.
            .setDepth(1);

        // Secção do título.

        // Adiciona o texto "VITÓRIA".
        this.add.text(width * 0.5, height * 0.29, 'VITÓRIA', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '82px',

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

        // Coloca o texto por cima do fundo.
        .setDepth(5);

        // Adiciona o texto "FINAL".
        this.add.text(width * 0.5, height * 0.37, 'FINAL', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '57px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada.
            color: '#ffd36a',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 6
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto por cima do fundo.
        .setDepth(5);

        // Adiciona o subtítulo da vitória final.
        this.add.text(width * 0.5, height * 0.43, 'O REINO FOI SALVO', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '24px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#f5e6b3',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o subtítulo.
        .setOrigin(0.5)

        // Coloca o subtítulo acima do fundo.
        .setDepth(5);

        // Secção do score e highscore.

        // Cria o bloco visual do score total.
        this.createTopScoreBlock(
            width * 0.4,
            height * 0.09,
            'SCORE TOTAL',
            this.totalScore
        );

        // Cria o bloco visual do highscore.
        this.createTopScoreBlock(
            width * 0.58,
            height * 0.09,
            'HIGHSCORE',
            this.highscore
        );

        // Secção dos heróis.

        // Cria a apresentação dos heróis usados na campanha.
        this.createHeroesShowcase(width, height);

        // Secção do menu.

        // Cria o menu de opções da vitória final.
        this.createMenu(width, height);

        // Secção das teclas.

        // Cria a tecla cima.
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Cria a tecla baixo.
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla SPACE.
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cria a tecla ESC.
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Secção do tween do selector.

        // Cria uma animação de movimento no losango seletor.
        this.tweens.add({

            // Define o seletor como alvo da animação.
            targets: this.selector,

            // Move o seletor 8 pixels para a direita.
            x: this.selector.x + 8,

            // Define a duração do movimento.
            duration: 500,

            // Faz o seletor voltar à posição inicial.
            yoyo: true,

            // Repete a animação infinitamente.
            repeat: -1,

            // Define o tipo de suavização.
            ease: 'Sine.easeInOut'
        });
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena estiver a mudar, não aceita inputs.
        if (this.isChangingScene) return;

        // Se carregar na tecla cima.
        if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

            // Move a seleção para cima.
            this.selectedIndex--;

            // Se passar da primeira opção, vai para a última.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.menuItems.length - 1;
            }

            // Atualiza a seleção visual.
            this.updateSelection();
        }

        // Se carregar na tecla baixo.
        if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {

            // Move a seleção para baixo.
            this.selectedIndex++;

            // Se passar da última opção, volta à primeira.
            if (this.selectedIndex >= this.menuItems.length) {
                this.selectedIndex = 0;
            }

            // Atualiza a seleção visual.
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

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

            // Volta ao menu principal.
            this.backToMenu();
        }
    }

    // Secção do menu.

    // Cria o menu da cena de vitória final.
    createMenu(width, height) {

        // Lista de opções do menu.
        this.menuItems = [
            {
                // Texto da primeira opção.
                text: 'Repetir Nível',

                // Ação para repetir o nível final.
                action: () => {
                    this.repeatFinalLevel();
                }
            },
            {
                // Texto da segunda opção.
                text: 'Voltar ao Menu',

                // Ação para voltar ao menu principal.
                action: () => {
                    this.backToMenu();
                }
            }
        ];

        // Lista onde serão guardados os textos do menu.
        this.menuTexts = [];

        // Define a posição X do menu.
        const menuX = width * 0.85;

        // Define a posição Y da primeira opção.
        const startY = height * 0.58;

        // Define o espaço entre opções.
        const gapY = 44;

        // Cria a barra de seleção por trás da opção escolhida.
        this.selectorBar = this.add.rectangle(
            menuX - 10,
            startY,
            210,
            34,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define a transparência da barra.
        .setAlpha(0.28)

        // Define a profundidade da barra.
        .setDepth(4);

        // Cria o losango seletor.
        this.selector = this.add.polygon(
            menuX - 110,
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
        .setDepth(6);

        // Percorre todas as opções do menu.
        for (let i = 0; i < this.menuItems.length; i++) {

            // Guarda o item atual.
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
                    fontSize: '20px',

                    // Define a cor inicial.
                    color: '#e8e2d0',

                    // Define a cor do contorno.
                    stroke: '#000000',

                    // Define a espessura do contorno.
                    strokeThickness: 4
                }
            )

            // Centra o texto.
            .setOrigin(0.5)

            // Define a profundidade.
            .setDepth(6)

            // Torna o texto interativo.
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

                // Escolhe a opção selecionada.
                this.chooseOption();
            });

            // Guarda o texto na lista.
            this.menuTexts.push(txt);
        }

        // Atualiza a seleção inicial.
        this.updateSelection();

        // Adiciona o texto de ajuda do menu.
        this.add.text(
            width * 0.84,
            height * 0.72,
            '↑ ↓ Navegar    ENTER Selecionar    ESC Menu',
            {
                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '12px',

                // Define a cor.
                color: '#ffffff',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 3
            }
        )

        // Centra o texto de ajuda.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.9)

        // Define profundidade.
        .setDepth(6);
    }

    // Atualiza visualmente a opção selecionada.
    updateSelection() {

        // Se não existirem textos no menu, não faz nada.
        if (!this.menuTexts || this.menuTexts.length === 0) return;

        // Guarda o texto atualmente selecionado.
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

        // Se existir barra de seleção.
        if (this.selectorBar) {

            // Move a barra para a opção selecionada.
            this.selectorBar.y = selectedText.y;
        }

        // Se existir losango seletor.
        if (this.selector) {

            // Move o losango para a opção selecionada.
            this.selector.y = selectedText.y;
        }
    }

    // Escolhe a opção atualmente selecionada.
    chooseOption() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Guarda a opção selecionada.
        const selected = this.menuItems[this.selectedIndex];

        // Se a opção existir e tiver ação.
        if (selected && selected.action) {

            // Executa a ação da opção.
            selected.action();
        }
    }

    // Secção do score.

    // Cria um bloco visual de score no topo da cena.
    createTopScoreBlock(x, y, label, value) {

        // Cria o texto do rótulo, como SCORE TOTAL ou HIGHSCORE.
        this.add.text(x, y, label, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '22px',

            // Define a cor dourada clara.
            color: '#f5e6b3',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o rótulo.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6);

        // Cria o texto com o valor do score.
        this.add.text(x, y + 34, String(value), {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '28px',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o valor.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6);
    }

    // Calcula o score total da campanha.
    getCampaignTotalScore() {

        // Vai buscar o total acumulado da campanha.
        const campaignTotal = this.registry.get('campaignTotalScore') || 0;

        // Vai buscar outro possível valor total guardado.
        const totalScore = this.registry.get('totalScore') || 0;

        // Vai buscar outro possível score total do player 1.
        const totalP1 = this.registry.get('totalScoreP1') || 0;

        // Devolve o maior valor encontrado entre os totais possíveis.
        return Math.max(
            campaignTotal,
            totalScore,
            totalP1,
            this.receivedTotalScore || 0
        );
    }

    // Decide qual nome deve ser usado para guardar o recorde.
    getRecordName() {

        // Se for modo multiplayer.
        if (this.mode === 'multi') {

            // Usa o nome dos dois jogadores juntos.
            return `${this.player1Name} + ${this.player2Name}`;
        }

        // Se for singleplayer, usa só o nome do jogador 1.
        return this.player1Name;
    }

    // Guarda o recorde e devolve o highscore do jogador/equipa.
    saveAndGetHighscore(name, score) {

        // Chave usada no localStorage para guardar os recordes.
        const key = 'order_of_the_fallen_records';

        // Lista inicial de recordes.
        let records = [];

        // Tenta ler os recordes guardados.
        try {

            // Lê e converte os recordes do localStorage.
            records = JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {

            // Se der erro, usa lista vazia.
            records = [];
        }

        // Procura se já existe recorde com este nome.
        const existingIndex = records.findIndex(record => {

            // Verifica se o nome do recorde é igual ao nome atual.
            return record.name === name;
        });

        // Se já existir recorde para este nome.
        if (existingIndex !== -1) {

            // Se o score atual for maior que o score guardado.
            if (score > records[existingIndex].score) {

                // Atualiza o score guardado.
                records[existingIndex].score = score;
            }
        } else {

            // Se não existir recorde, adiciona um novo.
            records.push({
                name,
                score
            });
        }

        // Ordena os recordes do maior score para o menor.
        records.sort((a, b) => b.score - a.score);

        // Mantém apenas os 5 melhores recordes.
        records = records.slice(0, 5);

        // Guarda a lista atualizada no localStorage.
        localStorage.setItem(key, JSON.stringify(records));

        // Procura novamente o recorde deste nome.
        const found = records.find(record => {

            // Verifica se o nome é o mesmo.
            return record.name === name;
        });

        // Devolve o score encontrado ou o score atual como fallback.
        return found ? found.score : score;
    }

    // Secção dos heróis.

    // Cria a apresentação dos heróis na vitória final.
    createHeroesShowcase(width, height) {

        // Define a posição Y dos heróis.
        const centerY = height * 0.68;

        // Se for multiplayer e existir herói do jogador 2.
        if (this.mode === 'multi' && this.player2Hero) {

            // Cria o card do herói do jogador 1.
            this.createHeroCard(width * 0.43, centerY, this.player1Hero, this.player1Name);

            // Cria o card do herói do jogador 2.
            this.createHeroCard(width * 0.57, centerY, this.player2Hero, this.player2Name);
        } else {

            // Cria apenas o card do jogador 1.
            this.createHeroCard(width * 0.5, centerY, this.player1Hero, this.player1Name);
        }
    }

    // Cria o card visual de um herói.
    createHeroCard(x, y, heroData, playerName) {

        // Se não houver dados do herói, não cria nada.
        if (!heroData) return;

        // Cria o texto com o nome do jogador.
        this.add.text(x, y - 70, playerName, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '24px',

            // Define a cor dourada.
            color: '#ffd36a',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6);

        // Cria o sprite do herói.
        const heroSprite = this.add.sprite(x, y, heroData.id)

            // Aumenta o tamanho do sprite.
            .setScale(3)

            // Define profundidade.
            .setDepth(6);

        // Monta o nome da animação idle do herói.
        const idleAnim = `${heroData.id}_idle`;

        // Se a animação idle existir.
        if (this.anims.exists(idleAnim)) {

            // Toca a animação idle.
            heroSprite.play(idleAnim, true);
        }

        // Cria o texto com o nome do herói.
        this.add.text(x, y + 78, heroData.nome || '', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '18px',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6);
    }

    // Secção de repetir level final.

    // Reinicia o nível final depois da vitória.
    repeatFinalLevel() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que está a mudar de cena.
        this.isChangingScene = true;

        // Secção de guardar modo e heróis.

        // Guarda o modo de jogo no registry.
        this.registry.set('gameMode', this.mode || 'single');

        // Se existir herói do jogador 1.
        if (this.player1Hero) {

            // Guarda uma cópia do herói do jogador 1.
            this.registry.set('player1Hero', this.cloneData(this.player1Hero));
        }

        // Se existir herói do jogador 2.
        if (this.player2Hero) {

            // Guarda uma cópia do herói do jogador 2.
            this.registry.set('player2Hero', this.cloneData(this.player2Hero));
        }

        // Secção de limpar estados temporários.

        // Limpa estados temporários do nível.
        this.clearTemporaryLevelState();

        // Secção de limpar teclas presas.

        // Se existir teclado.
        if (this.input.keyboard) {

            // Limpa teclas presas.
            this.input.keyboard.resetKeys();
        }

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Para cenas que possam estar abertas.
                this.stopPossibleOpenScenes();

                // Se o LevelFinal estiver ativo ou pausado.
                if (this.scene.isActive('LevelFinal') || this.scene.isPaused('LevelFinal')) {

                    // Para o LevelFinal anterior.
                    this.scene.stop('LevelFinal');
                }

                // Inicia novamente o LevelFinal.
                this.scene.start('LevelFinal', {

                    // Passa o modo de jogo.
                    mode: this.mode || 'single'
                });
            }
        );
    }

    // Secção de voltar menu.

    // Volta ao menu principal.
    backToMenu() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que está a mudar de cena.
        this.isChangingScene = true;

        // Se existir teclado.
        if (this.input.keyboard) {

            // Limpa teclas presas.
            this.input.keyboard.resetKeys();
        }

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Para cenas que possam estar abertas.
                this.stopPossibleOpenScenes();

                // Se o LevelFinal estiver ativo ou pausado.
                if (this.scene.isActive('LevelFinal') || this.scene.isPaused('LevelFinal')) {

                    // Para o LevelFinal.
                    this.scene.stop('LevelFinal');
                }

                // Inicia o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }

    // Secção de limpeza.

    // Limpa dados temporários do registry relacionados com o nível.
    clearTemporaryLevelState() {

        // Remove o tempo restante do nível.
        this.registry.remove('levelTimeLeft');

        // Remove informação se o jogador levou dano.
        this.registry.remove('tookDamage');

        // Remove informação de nível terminado.
        this.registry.remove('levelFinished');

        // Remove informação de game over iniciado.
        this.registry.remove('gameOverStarted');

        // Remove informação de loja aberta.
        this.registry.remove('shopOpen');

        // Remove informação de boss criado.
        this.registry.remove('bossSpawned');

        // Remove informação de boss morto.
        this.registry.remove('bossDead');

        // Remove informação de baú final aberto.
        this.registry.remove('finalChestOpened');

        // Remove informação de saída final desbloqueada.
        this.registry.remove('finalExitUnlocked');
    }

    // Para cenas que podem ter ficado abertas por cima ou ao lado do nível.
    stopPossibleOpenScenes() {

        // Para a cena do HUD.
        this.scene.stop('LevelHUDScene');

        // Para a cena de pausa.
        this.scene.stop('PauseScene');

        // Para a cena da loja de bónus.
        this.scene.stop('BonusShopScene');

        // Para a cena de Game Over.
        this.scene.stop('GameOver');
    }

    // Cria uma cópia profunda dos dados recebidos.
    cloneData(data) {

        // Se não houver dados, devolve null.
        if (!data) return null;

        // Converte os dados para texto JSON e volta a objeto para criar uma cópia independente.
        return JSON.parse(JSON.stringify(data));
    }
}