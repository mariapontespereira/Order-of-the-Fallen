// Importa o sistema de música, usado para tocar a música de vitória.
import MusicSystem from '../systems/MusicSystem.js';

// Importa o sistema de save, usado para guardar progresso entre níveis.
import SaveSystem from '../systems/SaveSystem.js';

// Cria a classe VictoryScene, responsável pelo ecrã de vitória após concluir um nível.
export default class VictoryScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "VictoryScene".
        super('VictoryScene');
    }

    // Função chamada quando a cena recebe dados ao iniciar.
    init(data) {

        // Guarda a key do nível concluído.
        this.levelKey = data?.levelKey || 'Level1';

        // Guarda a key do próximo nível.
        this.nextLevel = data?.nextLevel || 'Level2';

        // Guarda o modo de jogo.
        this.mode = data?.mode || 'single';

        // Índice da linha de feedback atualmente mostrada.
        this.feedbackIndex = 0;

        // Lista das mensagens de feedback do score.
        this.feedbackLines = [];

        // Controla se o feedback já terminou.
        this.feedbackFinished = false;

        // Lista das opções do menu.
        this.menuItems = [];

        // Lista dos textos do menu.
        this.menuTexts = [];

        // Índice da opção selecionada.
        this.selectedIndex = 0;

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;

        // Controla se a loja está aberta.
        this.shopOpen = false;

        // Guarda os objetos visuais da loja.
        this.shopObjects = [];

        // Índice do item selecionado na loja.
        this.shopSelectedIndex = 0;

        // Guarda os cards da loja.
        this.shopCards = [];

        // Guarda os objetos visuais do resumo.
        this.summaryObjects = [];

        // Guarda os objetos visuais do menu.
        this.menuObjects = [];
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura da câmara.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara.
        const height = this.cameras.main.height;

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Toca a música de vitória.
        MusicSystem.play(this, 'music_victory', {

            // Define o volume da música.
            volume: 0.45,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo do fade.
            fade: 1000
        });

        // Fundo.

        // Adiciona a imagem de fundo da vitória.
        this.bg = this.add.image(width / 2, height / 2, 'bgVictory')

            // Ajusta o fundo ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Coloca o fundo atrás de tudo.
            .setDepth(0);

        // Adiciona uma camada escura por cima do fundo.
        this.overlay1 = this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência.
            .setAlpha(0.35)

            // Coloca a camada acima do fundo.
            .setDepth(1);

        // Adiciona uma segunda camada escura mais subtil.
        this.overlay2 = this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência.
            .setAlpha(0.16)

            // Coloca a camada acima da primeira.
            .setDepth(2);

        // Título esquerda.

        // Cria o texto grande "NÍVEL".
        this.titleNivel = this.add.text(width * 0.21, height * 0.56, 'NÍVEL', {

            // Define a fonte.
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

        // Cria o texto "CONCLUÍDO".
        this.titleConcluido = this.add.text(width * 0.275, height * 0.65, 'CONCLUÍDO', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '28px',

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

        // Dados de score.

        // Vai buscar o score obtido no nível.
        this.levelScore = this.registry.get('levelScore') || 0;

        // Vai buscar o detalhe da pontuação.
        this.breakdown = this.registry.get('scoreBreakdown') || {
            items: 0,
            enemies: 0,
            finishLevel: 0,
            timeBonus: 0,
            noDamageBonus: 0
        };

        // Vai buscar as estatísticas do nível.
        this.stats = this.registry.get('scoreStats') || {
            apples: 0,
            icecreams: 0,
            coins: 0,
            enemiesKilled: 0,
            enemy0Killed: 0,
            enemy1Killed: 0
        };

        // Guarda e obtém o highscore deste nível.
        this.highscore = this.saveAndGetLevelHighscore(this.levelKey, this.levelScore);

        // Painel do score.

        // Define a posição X do painel.
        this.panelX = width * 0.74;

        // Define a posição Y do painel.
        this.panelY = height * 0.28;

        // Cria o painel principal do resumo.
        this.scorePanel = this.add.rectangle(
            this.panelX - 20,
            this.panelY,
            360,
            185,
            0x000000
        )

        // Centra o painel.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.26)

        // Define profundidade.
        .setDepth(3);

        // Cria a barra decorativa do título do painel.
        this.scoreBar = this.add.rectangle(
            this.panelX - 20,
            this.panelY - 65,
            315,
            32,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.24)

        // Define profundidade.
        .setDepth(4);

        // Cria o losango decorativo do painel de score.
        this.scoreDiamond = this.add.polygon(
            this.panelX - 185,
            this.panelY - 65,
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
        .setDepth(6);

        // Anima o losango do painel.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.scoreDiamond,

            // Move o losango ligeiramente para a direita.
            x: this.scoreDiamond.x + 8,

            // Define a duração.
            duration: 500,

            // Faz a animação voltar.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

        // Cria o título do painel do resumo.
        this.scoreTitle = this.add.text(this.panelX - 20, this.panelY - 66, 'RESUMO DO NÍVEL', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '21px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o título.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6);

        // Cria o texto onde aparecem as linhas do feedback.
        this.feedbackText = this.add.text(this.panelX - 20, this.panelY + 10, '', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '17px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4,

            // Centraliza o texto.
            align: 'center',

            // Define a largura máxima do texto.
            wordWrap: {
                width: 315
            }
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Começa invisível.
        .setAlpha(0)

        // Define profundidade.
        .setDepth(6);

        // Cria o texto de ajuda para saltar o resumo.
        this.skipText = this.add.text(this.panelX - 20, this.panelY + 72, 'ENTER / SPACE para saltar resumo', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '12px',

            // Define a cor cinzenta.
            color: '#cfcfcf',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 2
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.75)

        // Define profundidade.
        .setDepth(6);

        // Cria o texto da pontuação final.
        this.finalScoreText = this.add.text(this.panelX - 20, this.panelY - 10, '', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '24px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor amarela.
            color: '#ffd700',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5,

            // Centraliza o texto.
            align: 'center'
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Começa invisível.
        .setAlpha(0)

        // Define profundidade.
        .setDepth(6);

        // Cria o texto do highscore.
        this.highscoreText = this.add.text(this.panelX - 20, this.panelY + 62, '', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '18px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4,

            // Centraliza o texto.
            align: 'center'
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Começa invisível.
        .setAlpha(0)

        // Define profundidade.
        .setDepth(6);

        // Guarda os objetos do resumo para poder esconder quando abrir a loja.
        this.summaryObjects.push(
            this.scorePanel,
            this.scoreBar,
            this.scoreDiamond,
            this.scoreTitle,
            this.feedbackText,
            this.skipText,
            this.finalScoreText,
            this.highscoreText
        );

        // Teclado.

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

        // Cria a tecla R.
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Cria a tecla ESC.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Cria as linhas de feedback do score.
        this.feedbackLines = this.criarFeedbackLines();

        // Começa a mostrar o feedback sequencial.
        this.mostrarFeedbackSequencial();
    }

    // Guarda e devolve o melhor score do nível.
    saveAndGetLevelHighscore(levelKey, score) {

        // Define a key do localStorage onde ficam os recordes por nível.
        const key = 'order_of_the_fallen_level_records';

        // Cria o objeto inicial dos recordes.
        let records = {};

        // Tenta carregar recordes existentes.
        try {

            // Lê os recordes do localStorage.
            records = JSON.parse(localStorage.getItem(key)) || {};
        } catch (e) {

            // Se der erro, usa objeto vazio.
            records = {};
        }

        // Guarda o antigo highscore deste nível.
        const oldHighscore = records[levelKey] || 0;

        // Calcula o novo highscore.
        const newHighscore = Math.max(oldHighscore, score);

        // Atualiza o recorde deste nível.
        records[levelKey] = newHighscore;

        // Guarda os recordes atualizados no localStorage.
        localStorage.setItem(key, JSON.stringify(records));

        // Guarda também no registry.
        this.registry.set(`highscore_${levelKey}`, newHighscore);

        // Devolve o highscore.
        return newHighscore;
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena já estiver a mudar, não aceita input.
        if (this.isChangingScene) return;

        // Se a loja estiver aberta.
        if (this.shopOpen) {

            // Atualiza a loja.
            this.updateShop();

            // Para o resto do update.
            return;
        }

        // ENTER / SPACE para saltar o resumo do nível

        // Se o menu ainda não apareceu e carregar ENTER ou SPACE.
        if (
            (!this.menuItems || this.menuItems.length === 0) &&
            (
                Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
                Phaser.Input.Keyboard.JustDown(this.keySpace)
            )
        ) {

            // Salta o resumo do nível.
            this.pularResumoNivel();

            // Para o update.
            return;
        }

        // Se o menu ainda não existe, não faz mais nada.
        if (!this.menuItems || this.menuItems.length === 0) return;

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

            // Se passar da última opção, volta para a primeira.
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

        // Se carregar R.
        if (Phaser.Input.Keyboard.JustDown(this.keyR)) {

            // Repete o nível.
            this.repetirNivel();
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {

            // Volta ao menu.
            this.voltarMenu();
        }
    }

    // Cria as mensagens de feedback do score.
    criarFeedbackLines() {

        // Cria lista de mensagens.
        const lines = [];


        // Se foram recolhidas moedas.
        if (this.stats.coins > 0) {

            // Adiciona feedback das moedas.
            lines.push(`Moedas recolhidas: ${this.stats.coins} x 15 = +${this.stats.coins * 15} pontos`);
        }

        // Se foram recolhidas maçãs.
        if (this.stats.apples > 0) {

            // Adiciona feedback das maçãs.
            lines.push(`Maçãs recolhidas: ${this.stats.apples} x 10 = +${this.stats.apples * 10} pontos`);
        }

        // Se foram recolhidos gelados.
        if (this.stats.icecreams > 0) {

            // Adiciona feedback dos gelados.
            lines.push(`Gelados recolhidos: ${this.stats.icecreams} x 20 = +${this.stats.icecreams * 20} pontos`);
        }

        // Se houve pontos por inimigos.
        if (this.breakdown.enemies > 0) {

            // Adiciona feedback dos inimigos derrotados.
            lines.push(`Inimigos derrotados: ${this.stats.enemiesKilled} = +${this.breakdown.enemies} pontos`);
        }

        // Se houve pontos por concluir o nível.
        if (this.breakdown.finishLevel > 0) {

            // Adiciona feedback de conclusão do nível.
            lines.push(`Nível concluído: +${this.breakdown.finishLevel} pontos`);
        }

        // Se houve bónus de tempo.
        if (this.breakdown.timeBonus > 0) {

            // Adiciona feedback do bónus de tempo.
            lines.push(`Terminaste em menos de 1 minuto: +${this.breakdown.timeBonus} pontos`);
        }

        // Se houve bónus sem sofrer dano.
        if (this.breakdown.noDamageBonus > 0) {

            // Adiciona feedback do bónus sem dano.
            lines.push(`Sem sofrer dano: +${this.breakdown.noDamageBonus} pontos`);
        }

        // Adiciona a linha do score total.
        lines.push(`Total de score: ${this.levelScore}`);

        // Devolve as linhas criadas.
        return lines;
    }

    // Mostra as linhas de feedback uma a uma.
    mostrarFeedbackSequencial() {

        // Se o feedback já terminou, não faz nada.
        if (this.feedbackFinished) return;

        // Se já mostrou todas as linhas.
        if (this.feedbackIndex >= this.feedbackLines.length) {

            // Mostra a pontuação final.
            this.mostrarPontuacaoFinal();

            // Para a função.
            return;
        }

        // Guarda a linha atual.
        const line = this.feedbackLines[this.feedbackIndex];

        // Atualiza o texto do feedback.
        this.feedbackText.setText(line);

        // Começa invisível.
        this.feedbackText.setAlpha(0);

        // Garante que está visível.
        this.feedbackText.setVisible(true);

        // Define a posição inicial da animação.
        this.feedbackText.setY(this.panelY + 30);

        // Cria a animação de entrada do feedback.
        this.feedbackTween = this.tweens.add({

            // Define o texto como alvo.
            targets: this.feedbackText,

            // Faz aparecer.
            alpha: 1,

            // Move para a posição final.
            y: this.panelY + 10,

            // Define a duração.
            duration: 350,

            // Define suavização.
            ease: 'Power2',

            // Quando a entrada terminar.
            onComplete: () => {

                // Se o feedback já terminou, não continua.
                if (this.feedbackFinished) return;

                // Espera 900ms antes de desaparecer.
                this.feedbackDelay = this.time.delayedCall(900, () => {

                    // Se o feedback já terminou, não continua.
                    if (this.feedbackFinished) return;

                    // Cria animação de saída do feedback.
                    this.feedbackTween = this.tweens.add({

                        // Define o texto como alvo.
                        targets: this.feedbackText,

                        // Faz desaparecer.
                        alpha: 0,

                        // Move ligeiramente para cima.
                        y: this.panelY - 10,

                        // Define a duração.
                        duration: 300,

                        // Define suavização.
                        ease: 'Power2',

                        // Quando a saída terminar.
                        onComplete: () => {

                            // Se o feedback já terminou, não continua.
                            if (this.feedbackFinished) return;

                            // Avança para a próxima linha.
                            this.feedbackIndex++;

                            // Mostra a próxima linha.
                            this.mostrarFeedbackSequencial();
                        }
                    });
                });
            }
        });
    }

    // Salta o resumo do nível.
    pularResumoNivel() {

        // Se o feedback já terminou, não faz nada.
        if (this.feedbackFinished) return;

        // Marca o feedback como terminado.
        this.feedbackFinished = true;

        // Se existir tween do feedback.
        if (this.feedbackTween) {

            // Para a animação.
            this.feedbackTween.stop();

            // Limpa a referência.
            this.feedbackTween = null;
        }

        // Se existir delay do feedback.
        if (this.feedbackDelay) {

            // Remove o delay.
            this.feedbackDelay.remove(false);

            // Limpa a referência.
            this.feedbackDelay = null;
        }

        // Mata qualquer tween do texto de feedback.
        this.tweens.killTweensOf(this.feedbackText);

        // Se existir texto de feedback.
        if (this.feedbackText) {

            // Esconde o texto.
            this.feedbackText.setVisible(false);

            // Garante transparência zero.
            this.feedbackText.setAlpha(0);
        }

        // Se existir texto de skip.
        if (this.skipText) {

            // Remove o texto de skip.
            this.skipText.destroy();

            // Limpa a referência.
            this.skipText = null;
        }

        // Mostra a pontuação final instantaneamente.
        this.mostrarPontuacaoFinal(true);
    }

    // Mostra a pontuação final e o highscore.
    mostrarPontuacaoFinal(instant = false) {

        // Se já terminou e não é chamada instantânea, não faz nada.
        if (this.feedbackFinished && !instant) return;

        // Marca o feedback como terminado.
        this.feedbackFinished = true;

        // Se existir texto de feedback.
        if (this.feedbackText) {

            // Esconde o texto.
            this.feedbackText.setVisible(false);

            // Garante transparência zero.
            this.feedbackText.setAlpha(0);
        }

        // ESCONDE/REMOVE O TEXTO DE SKIP

        // Se existir texto de skip.
        if (this.skipText) {

            // Remove o texto de skip.
            this.skipText.destroy();

            // Limpa a referência.
            this.skipText = null;
        }

        // Atualiza o texto da pontuação final.
        this.finalScoreText.setText(`PONTUAÇÃO FINAL\n${this.levelScore}`);

        // Atualiza o texto do highscore.
        this.highscoreText.setText(`HIGHSCORE\n${this.highscore}`);

        // Se for para mostrar instantaneamente.
        if (instant) {

            // Mostra a pontuação final.
            this.finalScoreText
                .setAlpha(1)
                .setY(this.panelY - 10);

            // Mostra o highscore.
            this.highscoreText
                .setAlpha(1)
                .setY(this.panelY + 62);

            // Se o menu ainda não existe.
            if (!this.menuItems || this.menuItems.length === 0) {

                // Mostra o menu.
                this.mostrarMenu();
            }

            // Para a função.
            return;
        }

        // Anima a entrada da pontuação final.
        this.tweens.add({

            // Define a pontuação final como alvo.
            targets: this.finalScoreText,

            // Faz aparecer.
            alpha: 1,

            // Define posição final.
            y: this.panelY - 10,

            // Define duração.
            duration: 500,

            // Define suavização.
            ease: 'Power2',

            // Quando terminar.
            onComplete: () => {

                // Anima a entrada do highscore.
                this.tweens.add({

                    // Define o highscore como alvo.
                    targets: this.highscoreText,

                    // Faz aparecer.
                    alpha: 1,

                    // Define posição final.
                    y: this.panelY + 62,

                    // Define duração.
                    duration: 450,

                    // Define suavização.
                    ease: 'Power2',

                    // Quando terminar.
                    onComplete: () => {

                        // Se o menu ainda não existe.
                        if (!this.menuItems || this.menuItems.length === 0) {

                            // Mostra o menu.
                            this.mostrarMenu();
                        }
                    }
                });
            }
        });
    }

    // Mostra o menu após o resumo.
    mostrarMenu() {

        // Guarda a largura da câmara.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara.
        const height = this.cameras.main.height;

        // Cria as opções do menu da vitória.
        this.menuItems = [
            {
                // Texto da opção de repetir.
                text: 'Repetir Nível',

                // Ação para repetir o nível.
                action: () => {
                    this.repetirNivel();
                }
            },
            {
                // Texto da opção da loja.
                text: 'Loja',

                // Ação para abrir a loja de bónus.
                action: () => {
                    this.abrirLojaBonus();
                }
            },
            {
                // Texto da opção de próximo nível.
                text: 'Próximo Nível',

                // Ação para ir para o próximo nível.
                action: () => {
                    this.irProximoNivel();
                }
            },
            {
                // Texto da opção de voltar ao menu.
                text: 'Voltar ao Menu',

                // Ação para voltar ao menu principal.
                action: () => {
                    this.voltarMenu();
                }
            }
        ];

        // Limpa a lista de textos do menu.
        this.menuTexts = [];

        // Define o X do menu.
        const menuX = width * 0.74;

        // Define o Y inicial do menu.
        const startY = height * 0.50;

        // Define o espaço vertical entre opções.
        const gapY = 43;

        // Cria a barra da opção selecionada.
        this.selectorBar = this.add.rectangle(
            menuX - 20,
            startY,
            285,
            32,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.32)

        // Define profundidade.
        .setDepth(4);

        // Cria o losango seletor.
        this.selector = this.add.polygon(
            menuX - 165,
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

        // Define profundidade.
        .setDepth(6);

        // Anima o losango seletor.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.selector,

            // Move o losango ligeiramente para a direita.
            x: this.selector.x + 8,

            // Define duração.
            duration: 500,

            // Faz voltar ao início.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

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

                    // Define o tamanho.
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

            // Define profundidade.
            .setDepth(6)

            // Começa invisível para animar entrada.
            .setAlpha(0)

            // Torna a opção interativa.
            .setInteractive({ useHandCursor: true });

            // Quando o rato passa por cima.
            txt.on('pointerover', () => {

                // Atualiza índice selecionado.
                this.selectedIndex = i;

                // Atualiza seleção visual.
                this.updateSelection();
            });

            // Quando clica.
            txt.on('pointerdown', () => {

                // Escolhe a opção.
                this.chooseOption();
            });

            // Guarda o texto na lista.
            this.menuTexts.push(txt);

            // Anima a entrada do texto.
            this.tweens.add({

                // Define o texto como alvo.
                targets: txt,

                // Faz aparecer.
                alpha: 1,

                // Define duração.
                duration: 300,

                // Define atraso de entrada.
                delay: i * 90,

                // Define suavização.
                ease: 'Power2'
            });
        }

        // Cria texto de ajuda de navegação.
        this.helpText1 = this.add.text(width * 0.75, height * 0.76, '↑ ↓  Navegar      ENTER  Selecionar', {

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

        // Define profundidade.
        .setDepth(6);

        // Cria texto de ajuda dos atalhos.
        this.helpText2 = this.add.text(width * 0.77, height * 0.79, 'R  Repetir      ESC  Menu', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '12px',

            // Define a cor cinzenta.
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

        // Define profundidade.
        .setDepth(6);

        // Guarda os objetos do menu para esconder quando abrir a loja.
        this.menuObjects.push(
            this.selectorBar,
            this.selector,
            this.helpText1,
            this.helpText2,
            ...this.menuTexts
        );

        // Seleciona a primeira opção.
        this.selectedIndex = 0;

        // Atualiza visualmente a seleção.
        this.updateSelection();
    }

    // Atualiza a opção selecionada.
    updateSelection() {

        // Se não existirem textos do menu, não faz nada.
        if (!this.menuTexts || this.menuTexts.length === 0) return;

        // Guarda o texto selecionado.
        const selectedText = this.menuTexts[this.selectedIndex];

        // Percorre todos os textos do menu.
        for (let i = 0; i < this.menuTexts.length; i++) {

            // Guarda o texto atual.
            const txt = this.menuTexts[i];

            // Se for o texto selecionado.
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

        // Se a opção existir.
        if (selected) {

            // Executa a ação dela.
            selected.action();
        }
    }

    // Loja.

    // Abre a loja de bónus.
    abrirLojaBonus() {

        // Se a loja já estiver aberta, não faz nada.
        if (this.shopOpen) return;

        // Guarda largura da câmara.
        const width = this.cameras.main.width;

        // Guarda altura da câmara.
        const height = this.cameras.main.height;

        // Marca a loja como aberta.
        this.shopOpen = true;

        // Limpa objetos anteriores da loja.
        this.shopObjects = [];

        // Limpa cards anteriores.
        this.shopCards = [];

        // Seleciona o primeiro item da loja.
        this.shopSelectedIndex = 0;

        // esconder resumo e menu

        // Esconde os objetos do resumo.
        this.summaryObjects.forEach(obj => {

            // Se o objeto existir, esconde.
            if (obj) obj.setVisible(false);
        });

        // Esconde os objetos do menu.
        this.menuObjects.forEach(obj => {

            // Se o objeto existir.
            if (obj) {

                // Esconde o objeto.
                obj.setVisible(false);

                // Se tiver interatividade, desativa.
                if (obj.disableInteractive) {
                    obj.disableInteractive();
                }
            }
        });

        // Vai buscar as moedas guardadas.
        const coinsData = this.registry.get('coins') || { p1: 0, p2: 0 };

        // Se estiver em multiplayer.
        if (this.mode === 'multi') {

            // Soma moedas dos dois jogadores.
            this.shopCoins = (coinsData.p1 || 0) + (coinsData.p2 || 0);
        } else {

            // Usa apenas moedas do Player 1.
            this.shopCoins = coinsData.p1 || 0;
        }

        // Cria os itens disponíveis na loja.
        this.shopItems = [
            {
                // Tipo de upgrade.
                tipo: 'vida',

                // Título do card.
                title: '+ VIDA',

                // Descrição do card.
                desc: '+20 HP',

                // Ícone usado no card.
                icon: 'ExtraVida',

                // Preço do upgrade.
                price: 5
            },
            {
                // Tipo de upgrade.
                tipo: 'speed',

                // Título do card.
                title: '+ VELOCIDADE',

                // Descrição do card.
                desc: '+1 velocidade',

                // Ícone usado no card.
                icon: 'ExtraSpeed',

                // Preço do upgrade.
                price: 10
            },
            {
                // Tipo de upgrade.
                tipo: 'poder',

                // Título do card.
                title: '+ PODER',

                // Descrição do card.
                desc: '+5 poder',

                // Ícone usado no card.
                icon: 'ExtraPoder',

                // Preço do upgrade.
                price: 15
            }
        ];

        // Cria o overlay escuro da loja.
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000)

            // Define origem no canto superior esquerdo.
            .setOrigin(0)

            // Define transparência.
            .setAlpha(0.62)

            // Define profundidade.
            .setDepth(20);

        // Define posição X do painel da loja.
        const panelX = width * 0.74;

        // Define posição Y do painel da loja.
        const panelY = height * 0.46;

        // Cria o painel da loja.
        const panel = this.add.rectangle(
            panelX,
            panelY,
            520,
            390,
            0x000000
        )

        // Centra o painel.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.35)

        // Define profundidade.
        .setDepth(21);

        // Cria a barra do título da loja.
        const bar = this.add.rectangle(
            panelX,
            panelY - 155,
            440,
            34,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.24)

        // Define profundidade.
        .setDepth(22);

        // Cria o losango da loja.
        const diamond = this.add.polygon(
            panelX - 235,
            panelY - 155,
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

        // Anima o losango da loja.
        this.tweens.add({
            targets: diamond,
            x: diamond.x + 8,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Cria o título da loja.
        const title = this.add.text(panelX, panelY - 156, 'LOJA DE BÓNUS', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '25px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o título.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25);

        // Cria o texto das moedas disponíveis.
        const coinsLabel = this.add.text(panelX - 18, panelY - 105, `${this.shopCoins}`, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '24px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25);

        // Cria o ícone da moeda.
        const coinIcon = this.add.image(panelX + 22, panelY - 104, 'coin')

            // Define escala.
            .setScale(1)

            // Define profundidade.
            .setDepth(25);

        // Guarda referência do texto das moedas.
        this.coinsText = coinsLabel;

        // Define X inicial dos cards.
        const startX = panelX - 160;

        // Define Y dos cards.
        const cardsY = panelY + 5;

        // Define espaço entre cards.
        const gapX = 160;

        // Percorre os itens da loja.
        for (let i = 0; i < this.shopItems.length; i++) {

            // Guarda o item atual.
            const item = this.shopItems[i];

            // Cria o card do item.
            const card = this.createShopCard(
                startX + i * gapX,
                cardsY,
                item,
                i
            );

            // Guarda o card criado.
            this.shopCards.push(card);
        }

        // Cria o seletor visual dos cards.
        this.shopSelector = this.add.rectangle(0, 0, 132, 142)

            // Centra o seletor.
            .setOrigin(0.5)

            // Define a borda dourada.
            .setStrokeStyle(3, 0xffd36a)

            // Define preenchimento transparente.
            .setFillStyle(0xffffff, 0)

            // Define profundidade.
            .setDepth(30);

        // Cria o botão de voltar da loja.
        const backBtn = this.add.text(panelX, panelY + 150, 'Voltar', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '24px',

            // Define a cor inicial.
            color: '#e8e2d0',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o botão.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(25)

        // Torna o botão interativo.
        .setInteractive({ useHandCursor: true });

        // Quando passa o rato por cima do botão voltar.
        backBtn.on('pointerover', () => {

            // Muda a cor para branco.
            backBtn.setColor('#ffffff');

            // Aumenta ligeiramente.
            backBtn.setScale(1.08);
        });

        // Quando o rato sai do botão voltar.
        backBtn.on('pointerout', () => {

            // Volta a cor normal.
            backBtn.setColor('#e8e2d0');

            // Volta ao tamanho normal.
            backBtn.setScale(1);
        });

        // Quando clica no botão voltar.
        backBtn.on('pointerdown', () => {

            // Fecha a loja.
            this.fecharLoja();
        });

        // Cria o texto de ajuda da loja.
        const help = this.add.text(panelX, panelY + 190, '← → Navegar      ENTER Comprar      ESC Voltar', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '13px',

            // Define a cor cinzenta.
            color: '#cfcfcf',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 2
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85)

        // Define profundidade.
        .setDepth(25);

        // Guarda todos os objetos da loja.
        this.shopObjects.push(
            overlay,
            panel,
            bar,
            diamond,
            title,
            coinsLabel,
            coinIcon,
            this.shopSelector,
            backBtn,
            help
        );

        // Atualiza a seleção inicial da loja.
        this.updateShopSelection();
    }

    // Cria um card de item da loja.
    createShopCard(x, y, item, index) {

        // Cria o container do card.
        const container = this.add.container(x, y)

            // Define profundidade.
            .setDepth(25);

        // Cria o fundo do card.
        const bg = this.add.rectangle(0, 0, 120, 130, 0x000000)

            // Define transparência.
            .setAlpha(0.38)

            // Define borda dourada.
            .setStrokeStyle(2, 0xd8b568);

        // Cria o ícone do upgrade.
        const icon = this.add.image(0, -38, item.icon)

            // Define escala do ícone.
            .setScale(1.1);

        // Cria o título do card.
        const title = this.add.text(0, 5, item.title, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '13px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada.
            color: '#ffd36a',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o título.
        .setOrigin(0.5);

        // Cria a descrição do card.
        const desc = this.add.text(0, 28, item.desc, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '11px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 2,

            // Centraliza o texto.
            align: 'center'
        })

        // Centra a descrição.
        .setOrigin(0.5);

        // Cria o texto do preço.
        const priceText = this.add.text(-12, 52, `${item.price}`, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '13px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o preço.
        .setOrigin(0.5);

        // Cria o ícone de moeda no preço.
        const coin = this.add.image(12, 53, 'coin')

            // Define escala.
            .setScale(0.7);

        // Adiciona todos os elementos ao card.
        container.add([
            bg,
            icon,
            title,
            desc,
            priceText,
            coin
        ]);

        // Define o tamanho clicável do card.
        container.setSize(120, 130);

        // Torna o card interativo.
        container.setInteractive({ useHandCursor: true });

        // Quando o rato passa por cima do card.
        container.on('pointerover', () => {

            // Atualiza o item selecionado.
            this.shopSelectedIndex = index;

            // Atualiza visualmente a seleção.
            this.updateShopSelection();
        });

        // Quando clica no card.
        container.on('pointerdown', () => {

            // Diminui ligeiramente o card.
            container.setScale(0.96);
        });

        // Quando solta o clique no card.
        container.on('pointerup', () => {

            // Restaura o tamanho do card.
            container.setScale(1);

            // Compra o upgrade deste card.
            this.comprarUpgrade(item.tipo, item.price);
        });

        // Guarda referências do card.
        const card = {
            container,
            bg,
            icon,
            title,
            desc,
            priceText,
            coin,
            item
        };

        // Guarda o container nos objetos da loja.
        this.shopObjects.push(container);

        // Devolve o card criado.
        return card;
    }

    // Atualiza os controlos da loja.
    updateShop() {

        // Se carregar esquerda.
        if (Phaser.Input.Keyboard.JustDown(this.keyLeft)) {

            // Move a seleção da loja para a esquerda.
            this.shopSelectedIndex--;

            // Se passar do primeiro, vai para o último.
            if (this.shopSelectedIndex < 0) {
                this.shopSelectedIndex = this.shopCards.length - 1;
            }

            // Atualiza visualmente a seleção.
            this.updateShopSelection();
        }

        // Se carregar direita.
        if (Phaser.Input.Keyboard.JustDown(this.keyRight)) {

            // Move a seleção da loja para a direita.
            this.shopSelectedIndex++;

            // Se passar do último, volta para o primeiro.
            if (this.shopSelectedIndex >= this.shopCards.length) {
                this.shopSelectedIndex = 0;
            }

            // Atualiza visualmente a seleção.
            this.updateShopSelection();
        }

        // Se carregar ENTER ou SPACE.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            Phaser.Input.Keyboard.JustDown(this.keySpace)
        ) {

            // Guarda o card selecionado.
            const card = this.shopCards[this.shopSelectedIndex];

            // Se o card existir.
            if (card) {

                // Compra o upgrade do card.
                this.comprarUpgrade(card.item.tipo, card.item.price);
            }
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {

            // Fecha a loja.
            this.fecharLoja();
        }
    }

    // Atualiza a seleção visual da loja.
    updateShopSelection() {

        // Se não houver cards, não faz nada.
        if (!this.shopCards || this.shopCards.length === 0) return;

        // Percorre todos os cards.
        for (let i = 0; i < this.shopCards.length; i++) {

            // Guarda o card atual.
            const card = this.shopCards[i];

            // Se o card for o selecionado.
            if (i === this.shopSelectedIndex) {

                // Aumenta ligeiramente o card.
                card.container.setScale(1.06);

                // Aumenta a transparência do fundo.
                card.bg.setAlpha(0.58);

                // Muda o título para branco.
                card.title.setColor('#ffffff');
            } else {

                // Volta ao tamanho normal.
                card.container.setScale(1);

                // Volta a transparência normal do fundo.
                card.bg.setAlpha(0.38);

                // Volta o título para dourado.
                card.title.setColor('#ffd36a');
            }
        }

        // Guarda o card selecionado.
        const selected = this.shopCards[this.shopSelectedIndex];

        // Se existir seletor e card selecionado.
        if (this.shopSelector && selected) {

            // Move o seletor para o X do card.
            this.shopSelector.x = selected.container.x;

            // Move o seletor para o Y do card.
            this.shopSelector.y = selected.container.y;
        }
    }

    // Compra um upgrade da loja.
    comprarUpgrade(tipo, preco) {

        // Se não houver moedas suficientes.
        if (this.shopCoins < preco) {

            // Mostra mensagem de moedas insuficientes.
            this.mostrarMensagemLoja('Moedas insuficientes!');

            // Cancela a compra.
            return;
        }

        // Vai buscar dados do Player 1.
        const p1 = this.registry.get('player1Hero');

        // Vai buscar dados do Player 2.
        const p2 = this.registry.get('player2Hero');

        // desconta moedas

        // Desconta o preço do total da loja.
        this.shopCoins -= preco;

        // Vai buscar as moedas atuais.
        const coinsData = this.registry.get('coins') || { p1: 0, p2: 0 };

        // Se estiver em multiplayer.
        if (this.mode === 'multi') {

            // Guarda o valor ainda por descontar.
            let restante = preco;

            // Usa primeiro moedas do Player 1.
            const usarP1 = Math.min(coinsData.p1 || 0, restante);

            // Desconta moedas do Player 1.
            coinsData.p1 = Math.max(0, (coinsData.p1 || 0) - usarP1);

            // Atualiza o valor restante.
            restante -= usarP1;

            // Se ainda faltar descontar.
            if (restante > 0) {

                // Desconta o restante do Player 2.
                coinsData.p2 = Math.max(0, (coinsData.p2 || 0) - restante);
            }
        } else {

            // Em singleplayer, desconta apenas do Player 1.
            coinsData.p1 = Math.max(0, (coinsData.p1 || 0) - preco);
        }

        // Guarda as moedas atualizadas.
        this.registry.set('coins', coinsData);

        // aplica upgrade SEM LIMITE

        // Função interna para aplicar o upgrade a um jogador.
        const aplicarUpgrade = (playerData) => {

            // Se não houver dados do jogador, não faz nada.
            if (!playerData) return;

            // Se o upgrade for vida.
            if (tipo === 'vida') {

                // Aumenta a vida máxima.
                playerData.vidaMax += 20;

                // Cura o jogador até à vida máxima.
                playerData.vidaAtual = playerData.vidaMax;
            }

            // Se o upgrade for velocidade.
            if (tipo === 'speed') {

                // Aumenta a velocidade base.
                playerData.speed += 1;
            }

            // Se o upgrade for poder.
            if (tipo === 'poder') {

                // Aumenta o poder.
                playerData.poder += 5;
            }
        };

        // Aplica o upgrade ao Player 1.
        aplicarUpgrade(p1);

        // Se estiver em multiplayer.
        if (this.mode === 'multi') {

            // Aplica o upgrade também ao Player 2.
            aplicarUpgrade(p2);
        }

        // Guarda o Player 1 atualizado.
        this.registry.set('player1Hero', p1);

        // Se existir Player 2.
        if (p2) {

            // Guarda o Player 2 atualizado.
            this.registry.set('player2Hero', p2);
        }

        // Se existir texto das moedas.
        if (this.coinsText) {

            // Atualiza o texto das moedas.
            this.coinsText.setText(`${this.shopCoins}`);
        }

        // Se comprou vida.
        if (tipo === 'vida') this.mostrarMensagemLoja('+ Vida comprada!');

        // Se comprou velocidade.
        if (tipo === 'speed') this.mostrarMensagemLoja('+ Velocidade comprada!');

        // Se comprou poder.
        if (tipo === 'poder') this.mostrarMensagemLoja('+ Poder comprado!');
    }

    // Mostra uma mensagem temporária na loja.
    mostrarMensagemLoja(texto) {

        // Se já existir mensagem da loja.
        if (this.shopMessage) {

            // Remove a mensagem anterior.
            this.shopMessage.destroy();
        }

        // Guarda largura da câmara.
        const width = this.cameras.main.width;

        // Guarda altura da câmara.
        const height = this.cameras.main.height;

        // Cria a mensagem da loja.
        this.shopMessage = this.add.text(width * 0.74, height * 0.60, texto, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho.
            fontSize: '17px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra a mensagem.
        .setOrigin(0.5)

        // Coloca a mensagem por cima da loja.
        .setDepth(40)

        // Começa invisível.
        .setAlpha(0);

        // Guarda a mensagem nos objetos da loja.
        this.shopObjects.push(this.shopMessage);

        // Anima a mensagem.
        this.tweens.add({

            // Define a mensagem como alvo.
            targets: this.shopMessage,

            // Faz aparecer.
            alpha: 1,

            // Define duração.
            duration: 200,

            // Faz desaparecer depois.
            yoyo: true,

            // Mantém visível por um tempo.
            hold: 800,

            // Quando a animação termina.
            onComplete: () => {

                // Se a mensagem ainda existir.
                if (this.shopMessage) {

                    // Remove a mensagem.
                    this.shopMessage.destroy();

                    // Limpa a referência.
                    this.shopMessage = null;
                }
            }
        });
    }

    // Fecha a loja.
    fecharLoja() {

        // Percorre todos os objetos da loja.
        this.shopObjects.forEach(obj => {

            // Se o objeto existir e puder ser destruído.
            if (obj && obj.destroy) {

                // Destroi o objeto.
                obj.destroy();
            }
        });

        // Limpa objetos da loja.
        this.shopObjects = [];

        // Limpa cards da loja.
        this.shopCards = [];

        // Se existir mensagem da loja.
        if (this.shopMessage) {

            // Remove a mensagem.
            this.shopMessage.destroy();

            // Limpa a referência.
            this.shopMessage = null;
        }

        // Marca a loja como fechada.
        this.shopOpen = false;

        // Mostra novamente os objetos do resumo.
        this.summaryObjects.forEach(obj => {

            // Se o objeto existir, mostra.
            if (obj) obj.setVisible(true);
        });

        // Mostra novamente os objetos do menu.
        this.menuObjects.forEach(obj => {

            // Se o objeto existir.
            if (obj) {

                // Mostra o objeto.
                obj.setVisible(true);

                // Se for texto do menu, reativa interatividade.
                if (obj.setInteractive && this.menuTexts.includes(obj)) {
                    obj.setInteractive({ useHandCursor: true });
                }
            }
        });

        // Atualiza a seleção do menu.
        this.updateSelection();
    }

    // Ações.

    // Repete o nível atual.
    repetirNivel() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        this.restaurarMoedasDoInicioDoNivel();
        // Restaura vida e estados dos jogadores.
        this.restaurarStatusJogadores();

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Guarda progresso no nível atual.
                SaveSystem.saveProgress({
                    levelKey: this.levelKey,
                    gameMode: this.mode,
                    player1Hero: this.registry.get('player1Hero'),
                    player2Hero: this.registry.get('player2Hero'),
                    coins: this.registry.get('coins') || { p1: 0, p2: 0 }
                });

                // Reinicia o mesmo nível.
                this.scene.start(this.levelKey);
            }
        );
    }

    
    // Vai para o próximo nível.
    irProximoNivel() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Restaura vida e estados dos jogadores antes do próximo nível.
        this.restaurarStatusJogadores();

        // Somar score do nível ao total.

        // Vai buscar o score do nível.
        const levelScore = this.registry.get('levelScore') || 0;

        // Vai buscar o total atual do Player 1.
        const totalP1 = this.registry.get('totalScoreP1') || 0;

        // Vai buscar o total atual do Player 2.
        const totalP2 = this.registry.get('totalScoreP2') || 0;

        // Soma o score deste nível ao total do Player 1.
        this.registry.set('totalScoreP1', totalP1 + levelScore);

        // Se estiver em multiplayer.
        if (this.mode === 'multi') {

            // Soma também ao total do Player 2.
            this.registry.set('totalScoreP2', totalP2 + levelScore);
        }

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Se existir próximo nível.
                if (this.nextLevel) {

                    // Guarda o progresso para o próximo nível.
                    SaveSystem.saveProgress({
                        levelKey: this.nextLevel,
                        gameMode: this.mode,
                        player1Hero: this.registry.get('player1Hero'),
                        player2Hero: this.registry.get('player2Hero'),
                        player1Name: this.registry.get('player1Name'),
                        player2Name: this.registry.get('player2Name'),
                        coins: this.registry.get('coins') || { p1: 0, p2: 0 },
                        totalScoreP1: this.registry.get('totalScoreP1') || 0,
                        totalScoreP2: this.registry.get('totalScoreP2') || 0
                    });

                    // Inicia o próximo nível.
                    this.scene.start(this.nextLevel);
                } else {

                    // Se não houver próximo nível, limpa o progresso.
                    SaveSystem.clearProgress();

                    // Volta ao menu.
                    this.scene.start('MenuScene');
                }
            }
        );
    }

    // Volta ao menu principal.
    voltarMenu() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Vai para o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }

    // Restaura vida e estados temporários dos jogadores.
    restaurarStatusJogadores() {

        // Vai buscar dados do Player 1.
        const p1 = this.registry.get('player1Hero');

        // Vai buscar dados do Player 2.
        const p2 = this.registry.get('player2Hero');

        // Se existir Player 1.
        if (p1) {

            // Restaura a vida atual ao máximo.
            p1.vidaAtual = p1.vidaMax;

            // Marca como vivo.
            p1.isDead = false;

            // Limpa estado de ataque.
            p1.isAttacking = false;

            // Limpa estado de dano.
            p1.isHurting = false;

            // Limpa estado de defesa.
            p1.isBlocking = false;
        }

        // Se existir Player 2.
        if (p2) {

            // Restaura a vida atual ao máximo.
            p2.vidaAtual = p2.vidaMax;

            // Marca como vivo.
            p2.isDead = false;

            // Limpa estado de ataque.
            p2.isAttacking = false;

            // Limpa estado de dano.
            p2.isHurting = false;

            // Limpa estado de defesa.
            p2.isBlocking = false;
        }
    }

    restaurarMoedasDoInicioDoNivel() {
        const coinsAtLevelStart = this.registry.get('coinsAtLevelStart') || {
            p1: 0,
            p2: 0
        };

        this.registry.set('coins', {
            p1: coinsAtLevelStart.p1 || 0,
            p2: coinsAtLevelStart.p2 || 0
        });
    }
}