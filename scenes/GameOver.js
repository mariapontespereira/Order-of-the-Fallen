// Importa o sistema de música para tocar a música de Game Over.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe GameOver, responsável pela cena de fim de jogo.
export default class GameOver extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "GameOver".
        super('GameOver');
    }

    // Função chamada quando a cena recebe dados ao iniciar.
    init(data) {

        // Guarda o modo de jogo recebido, ou usa single por padrão.
        this.mode = data?.mode || 'single';

        // Guarda a razão do Game Over, ou usa "gameover" por padrão.
        this.reason = data?.reason || 'gameover';

        // Guarda a chave do nível onde aconteceu o Game Over.
        this.levelKey = data?.levelKey || 'Level1';

        // Índice da opção atualmente selecionada no menu.
        this.selectedIndex = 0;

        // Controla se a cena já está a mudar para outra cena.
        this.isChangingScene = false;
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura da câmara principal.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara principal.
        const height = this.cameras.main.height;

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Toca a música de Game Over.
        MusicSystem.play(this, 'music_gameOver', {

            // Define o volume da música.
            volume: 0.4,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo de fade da música.
            fade: 1000
        });

        // Secção do fundo.

        // Adiciona a imagem de fundo do Game Over.
        this.add.image(width / 2, height / 2, 'bgGameOver')

            // Ajusta a imagem ao tamanho total do ecrã.
            .setDisplaySize(width, height)

            // Coloca o fundo na profundidade mais baixa.
            .setDepth(0);

        // Adiciona uma camada preta transparente por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da camada.
            .setAlpha(0.35)

            // Coloca esta camada acima do fundo.
            .setDepth(1);

        // Adiciona uma segunda camada preta para escurecer mais o fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da segunda camada.
            .setAlpha(0.18)

            // Coloca esta camada acima da anterior.
            .setDepth(2);

        // Secção do título Game Over.

        // Adiciona o texto "GAME".
        this.add.text(width * 0.22, height * 0.55, 'GAME', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '105px',

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

        // Coloca o texto acima das camadas do fundo.
        .setDepth(5);

        // Adiciona o texto "OVER".
        this.add.text(width * 0.28, height * 0.66, 'OVER', {

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

        // Coloca o texto acima das camadas do fundo.
        .setDepth(5);

        // Adiciona a mensagem específica do Game Over.
        this.add.text(width * 0.265, height * 0.74, this.getGameOverMessage(), {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '22px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra a mensagem.
        .setOrigin(0.5)

        // Coloca a mensagem acima do fundo.
        .setDepth(5);

        // Secção do menu.

        // Lista de opções do menu de Game Over.
        this.menuItems = [
            {
                // Texto da primeira opção.
                text: 'Reiniciar Nível',

                // Ação da primeira opção.
                action: () => this.reiniciarNivelAtual()
            },
            {
                // Texto da segunda opção.
                text: 'Voltar ao Menu',

                // Ação da segunda opção.
                action: () => this.voltarAoMenu()
            }
        ];

        // Lista onde serão guardados os textos das opções do menu.
        this.menuTexts = [];

        // Define a posição X do menu.
        const menuX = width * 0.74;

        // Define a posição Y da primeira opção.
        const startY = height * 0.48;

        // Define o espaço vertical entre opções.
        const gapY = 48;

        // Cria a barra visual atrás da opção selecionada.
        this.selectorBar = this.add.rectangle(
            menuX - 20,
            startY,
            285,
            32,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define a transparência da barra.
        .setAlpha(0.32)

        // Define a profundidade da barra.
        .setDepth(4);

        // Cria o losango que indica a opção selecionada.
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

        // Coloca o losango acima da barra.
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

            // Define a profundidade do texto.
            .setDepth(6)

            // Torna o texto interativo.
            .setInteractive({ useHandCursor: true });

            // Quando o rato passa por cima desta opção.
            txt.on('pointerover', () => {

                // Atualiza o índice selecionado.
                this.selectedIndex = i;

                // Atualiza a seleção visual.
                this.updateSelection();
            });

            // Quando clica nesta opção.
            txt.on('pointerdown', () => {

                // Escolhe a opção atual.
                this.chooseOption();
            });

            // Guarda o texto na lista do menu.
            this.menuTexts.push(txt);
        }

        // Atualiza a seleção inicial do menu.
        this.updateSelection();

        // Secção do teclado.

        // Cria a tecla cima.
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Cria a tecla baixo.
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla SPACE.
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cria a tecla R.
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Cria a tecla ESC.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Secção do rodapé.

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

        // Coloca o texto acima do fundo.
        .setDepth(6);

        // Adiciona texto de ajuda com atalhos.
        this.add.text(width * 0.77, height * 0.78, 'R  Reiniciar      ESC  Menu', {

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

        // Define a transparência do texto.
        .setAlpha(0.7)

        // Coloca o texto acima do fundo.
        .setDepth(6);

        // Secção da animação do selector.

        // Cria animação no losango selector.
        this.tweens.add({

            // Define o selector como alvo.
            targets: this.selector,

            // Move o selector 8 pixels para a direita.
            x: this.selector.x + 8,

            // Define a duração da animação.
            duration: 500,

            // Faz voltar à posição inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização.
            ease: 'Sine.easeInOut'
        });
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena já estiver a trocar, não aceita input.
        if (this.isChangingScene) return;

        // Se carregar na tecla cima.
        if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

            // Move a seleção para cima.
            this.selectedIndex--;

            // Se passar da primeira opção, vai para a última.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.menuItems.length - 1;
            }

            // Atualiza o visual da seleção.
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

            // Atualiza o visual da seleção.
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

            // Reinicia o nível atual.
            this.reiniciarNivelAtual();
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {

            // Volta ao menu principal.
            this.voltarAoMenu();
        }
    }

    // Atualiza visualmente a opção selecionada.
    updateSelection() {

        // Se não existirem textos do menu, não faz nada.
        if (!this.menuTexts || this.menuTexts.length === 0) return;

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

        // Se existir barra de seleção.
        if (this.selectorBar) {

            // Move a barra para a opção selecionada.
            this.selectorBar.y = selectedText.y;
        }

        // Se existir losango selector.
        if (this.selector) {

            // Move o selector para a opção selecionada.
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

    // Devolve a mensagem correta de Game Over.
    getGameOverMessage() {

        // Se a razão do Game Over for tempo esgotado.
        if (this.reason === 'time_over') {

            // Devolve mensagem de tempo esgotado.
            return 'O TEMPO ESGOTOU-SE';
        }

        // Se estiver em modo multiplayer.
        if (this.mode === 'multi') {

            // Devolve mensagem para vários heróis derrotados.
            return 'OS HERÓIS FORAM DERROTADOS';
        }

        // Devolve mensagem padrão para singleplayer.
        return 'O HERÓI CAIU EM BATALHA';
    }

    // Secção de reiniciar nível.

    // Reinicia o nível atual.
    reiniciarNivelAtual() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Restaura tudo para o estado do início deste nível.
        // Isto mantém o progresso vindo dos níveis anteriores,
        // mas remove o que foi feito/comprado dentro do nível atual.
        this.restaurarNivelAtualAoInicio();

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Para a cena do HUD.
                this.scene.stop('LevelHUDScene');

                // Para a cena da loja de bónus.
                this.scene.stop('BonusShopScene');

                // Para a cena de pausa.
                this.scene.stop('PauseScene');

                // Verifica se existe levelKey e se o nível está ativo ou pausado.
                if (
                    this.levelKey &&
                    (
                        this.scene.isActive(this.levelKey) ||
                        this.scene.isPaused(this.levelKey)
                    )
                ) {

                    // Para a cena do nível atual.
                    this.scene.stop(this.levelKey);
                }

                // Inicia novamente o nível atual.
                this.scene.start(this.levelKey);
            }
        );
    }

    // Secção de voltar ao menu.

    // Volta ao menu principal.
    voltarAoMenu() {

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Faz fade out.
        this.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Para a cena do HUD.
                this.scene.stop('LevelHUDScene');

                // Para a cena da loja de bónus.
                this.scene.stop('BonusShopScene');

                // Para a cena de pausa.
                this.scene.stop('PauseScene');

                // Verifica se existe levelKey e se o nível está ativo ou pausado.
                if (
                    this.levelKey &&
                    (
                        this.scene.isActive(this.levelKey) ||
                        this.scene.isPaused(this.levelKey)
                    )
                ) {

                    // Para a cena do nível atual.
                    this.scene.stop(this.levelKey);
                }

                // Inicia o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }

    // Secção de restaurar nível atual ao início.

    // Restaura o estado do nível para o início.
    restaurarNivelAtualAoInicio() {

        // Vai buscar a cena do nível atual.
        const levelScene = this.scene.get(this.levelKey);

        // Se a cena do nível existir e tiver restoreLevelStartState.
        if (levelScene && typeof levelScene.restoreLevelStartState === 'function') {

            // Usa a função própria do nível para restaurar o estado inicial.
            levelScene.restoreLevelStartState();
        } else {

            // Caso contrário, usa o fallback desta cena.
            this.restaurarDadosDoInicioDoNivel();
        }

        // Limpa estados temporários do jogo.
        this.limparEstadosTemporarios();
    }

    // Secção de restaurar dados do início do nível.
    // fallback caso o nível não tenha restoreLevelStartState()

    // Restaura os dados guardados no início do nível.
    restaurarDadosDoInicioDoNivel() {

        // Secção de restaurar heróis ao estado do início do nível.

        // Vai buscar os dados do player 1 guardados no início do nível.
        const p1AtStart = this.registry.get('player1HeroAtLevelStart');

        // Vai buscar os dados do player 2 guardados no início do nível.
        const p2AtStart = this.registry.get('player2HeroAtLevelStart');

        // Se existirem dados iniciais do player 1.
        if (p1AtStart) {

            // Restaura o player 1 com uma cópia desses dados.
            this.registry.set(
                'player1Hero',
                this.cloneData(p1AtStart)
            );
        }

        // Se existirem dados iniciais do player 2.
        if (p2AtStart) {

            // Restaura o player 2 com uma cópia desses dados.
            this.registry.set(
                'player2Hero',
                this.cloneData(p2AtStart)
            );
        }

        // Secção de restaurar moedas.

        // Vai buscar as moedas guardadas no início do nível.
        const coinsAtLevelStart = this.registry.get('coinsAtLevelStart') || {
            p1: 0,
            p2: 0
        };

        // Restaura as moedas no registry.
        this.registry.set('coins', {

            // Restaura moedas do player 1.
            p1: coinsAtLevelStart.p1 || 0,

            // Restaura moedas do player 2.
            p2: coinsAtLevelStart.p2 || 0
        });

        // Secção de restaurar score do nível.

        // Vai buscar o score do nível guardado no início.
        const levelScoreAtStart = this.registry.get('levelScoreAtLevelStart') || 0;

        // Restaura o score do nível.
        this.registry.set('levelScore', levelScoreAtStart);

        // Secção de restaurar breakdown do score.

        // Vai buscar o breakdown do score guardado no início do nível.
        const scoreBreakdownAtStart = this.registry.get('scoreBreakdownAtLevelStart') || {
            items: 0,
            enemies: 0,
            finishLevel: 0,
            timeBonus: 0,
            noDamageBonus: 0
        };

        // Restaura o breakdown do score.
        this.registry.set('scoreBreakdown', {

            // Restaura pontos de itens.
            items: scoreBreakdownAtStart.items || 0,

            // Restaura pontos de inimigos.
            enemies: scoreBreakdownAtStart.enemies || 0,

            // Restaura pontos de conclusão de nível.
            finishLevel: scoreBreakdownAtStart.finishLevel || 0,

            // Restaura bónus de tempo.
            timeBonus: scoreBreakdownAtStart.timeBonus || 0,

            // Restaura bónus de sem dano.
            noDamageBonus: scoreBreakdownAtStart.noDamageBonus || 0
        });

        // Secção de restaurar estatísticas do score.

        // Vai buscar as estatísticas guardadas no início do nível.
        const scoreStatsAtStart = this.registry.get('scoreStatsAtLevelStart') || {
            apples: 0,
            icecreams: 0,
            coins: 0,
            enemiesKilled: 0,
            enemy0Killed: 0,
            enemy1Killed: 0
        };

        // Restaura as estatísticas do score.
        this.registry.set('scoreStats', {

            // Restaura número de maçãs.
            apples: scoreStatsAtStart.apples || 0,

            // Restaura número de gelados.
            icecreams: scoreStatsAtStart.icecreams || 0,

            // Restaura número de moedas.
            coins: scoreStatsAtStart.coins || 0,

            // Restaura número total de inimigos mortos.
            enemiesKilled: scoreStatsAtStart.enemiesKilled || 0,

            // Restaura número de enemy0 mortos.
            enemy0Killed: scoreStatsAtStart.enemy0Killed || 0,

            // Restaura número de enemy1 mortos.
            enemy1Killed: scoreStatsAtStart.enemy1Killed || 0
        });
    }

    // Secção de limpar estados temporários.

    // Limpa estados temporários guardados no registry.
    limparEstadosTemporarios() {

        // Remove o tempo restante do nível.
        this.registry.remove('levelTimeLeft');

        // Remove informação se o jogador levou dano.
        this.registry.remove('tookDamage');

        // Remove informação de nível terminado.
        this.registry.remove('levelFinished');

        // Remove informação de Game Over iniciado.
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

    // Secção de restaurar vida / estados.
    // Mantida por compatibilidade, mas NÃO é usada no reiniciar.
    // Se fosse usada, mantinha upgrades comprados na loja.

    // Restaura vida e estados básicos dos jogadores.
    restaurarStatusJogadores() {

        // Vai buscar os dados do player 1.
        const p1 = this.registry.get('player1Hero');

        // Vai buscar os dados do player 2.
        const p2 = this.registry.get('player2Hero');

        // Se existir player 1.
        if (p1) {

            // Restaura a vida atual ao máximo.
            p1.vidaAtual = p1.vidaMax;

            // Marca como vivo.
            p1.isDead = false;

            // Remove estado de ataque.
            p1.isAttacking = false;

            // Remove estado de dano.
            p1.isHurting = false;

            // Remove estado de defesa.
            p1.isBlocking = false;

            // Liberta animações.
            p1.lockAnim = false;
        }

        // Se existir player 2.
        if (p2) {

            // Restaura a vida atual ao máximo.
            p2.vidaAtual = p2.vidaMax;

            // Marca como vivo.
            p2.isDead = false;

            // Remove estado de ataque.
            p2.isAttacking = false;

            // Remove estado de dano.
            p2.isHurting = false;

            // Remove estado de defesa.
            p2.isBlocking = false;

            // Liberta animações.
            p2.lockAnim = false;
        }
    }

    // Secção de clonar dados.

    // Cria uma cópia profunda dos dados recebidos.
    cloneData(data) {

        // Se não houver dados, devolve null.
        if (!data) return null;

        // Converte os dados para JSON e volta a objeto para criar uma cópia independente.
        return JSON.parse(JSON.stringify(data));
    }
}