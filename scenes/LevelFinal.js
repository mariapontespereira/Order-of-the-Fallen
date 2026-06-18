// Entidades

// Importa a classe Player, usada para criar os jogadores.
import Player from '../entities/Player.js';

// Data

// Importa as configurações dos ataques.
import ATTACK_CONFIG from '../data/AttackConfig.js';

// Importa as configurações dos níveis.
import LEVEL_CONFIG from '../data/LevelConfig.js';

// Sistemas

// Importa o sistema de revive para multiplayer.
import ReviveSystem from '../systems/ReviveSystem.js';

// Importa o sistema de inventário.
import InventorySystem from '../systems/InventorySystem.js';

// Importa o sistema de ataques.
import AttackSystem from '../systems/AttackSystem.js';

// Importa o sistema de Game Over.
import GameOverSystem from '../systems/GameOverSystem.js';

// Importa o sistema dos inimigos.
import EnemySystem from '../systems/EnemySystem.js';

// Importa o sistema de interação com objetos.
import InteractionSystem from '../systems/InteractionSystem.js';

// Importa o sistema dos itens.
import ItemSystem from '../systems/ItemSystem.js';

// Importa o sistema de pontuação.
import ScoreSystem from '../systems/ScoreSystem.js';

// Importa o sistema que controla a distância entre jogadores.
import PlayerDistanceSystem from '../systems/PlayerDistanceSystem.js';

// Importa o sistema da câmara.
import CameraSystem from '../systems/CameraSystem.js';

// Importa o sistema do temporizador do nível.
import LevelTimerSystem from '../systems/LevelTimerSystem.js';

// Importa o sistema das zonas perigosas.
import DangerZoneSystem from '../systems/DangerZoneSystem.js';

// Importa o sistema da introdução do nível.
import LevelIntroSystem from '../systems/LevelIntroSystem.js';

// Importa o sistema de vida e dano dos jogadores.
import PlayerHealthSystem from '../systems/PlayerHealthSystem.js';

// Importa o sistema de música.
import MusicSystem from '../systems/MusicSystem.js';


// Cria a classe LevelFinal, responsável pelo nível final do jogo.
export default class LevelFinal extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "LevelFinal".
        super('LevelFinal');
    }

    // Função chamada quando a cena inicia.
    init() {

        // Controla se a cena já está a trocar para outra.
        this.isChangingScene = false;

        // Vai buscar os dados do Player 1 ou usa valores padrão.
        this.p1Data = this.registry.get('player1Hero') || {
            id: 'hero0',
            nome: 'KAEL',
            vidaAtual: 100,
            vidaMax: 100,
            poder: 10,
            speed: 4,
            especial: ''
        };

        // Vai buscar os dados do Player 2.
        this.p2Data = this.registry.get('player2Hero');

        // Vai buscar o modo de jogo.
        this.gameMode = this.registry.get('gameMode') || 'single';

        // Indica se o jogador tem chave.
        this.temChave = false;

        // Controla se o texto de interação está bloqueado.
        this.interactionTextLocked = false;

        // Guarda o temporizador das mensagens.
        this.messageTimer = null;

        // Guarda o objeto próximo do Player 1.
        this.objetoProximoP1 = null;

        // Guarda o objeto próximo do Player 2.
        this.objetoProximoP2 = null;

        // Controla se o Game Over já começou.
        this.gameOverStarted = false;

        // Indica que a intro do nível está ativa.
        this.levelIntroActive = true;

        // Controla se os jogadores podem ser controlados.
        this.canControlPlayers = false;

        // Cria os inventários dos jogadores.
        this.inventories = { p1: [], p2: [] };

        // Vai buscar as moedas guardadas ou começa com 0.
        this.coins = this.registry.get('coins') || { p1: 0, p2: 0 };

        // Guarda se o íman está ativo para cada jogador.
        this.magnet = { p1: false, p2: false };

        // Guarda a configuração dos ataques.
        this.attackConfig = ATTACK_CONFIG;

        // Guarda a configuração do nível final.
        this.levelConfig = LEVEL_CONFIG.LevelFinal;

        // Define o tempo máximo do nível.
        this.levelTimeMax = this.levelConfig.time;

        // Define o tempo restante inicial.
        this.levelTimeLeft = this.levelTimeMax;

        // Indica se o temporizador já começou.
        this.levelTimerStarted = false;

        // Indica se o nível já terminou.
        this.levelFinished = false;

        // Indica se algum jogador levou dano.
        this.playerTookDamage = false;

        // Guarda os cooldowns dos ataques dos jogadores.
        this.attackCooldowns = {
            p1: { atk1: 0, atk2: 0, atk3: 0, block: 0 },
            p2: { atk1: 0, atk2: 0, atk3: 0, block: 0 }
        };

        // Estado do boss.

        // Guarda a posição onde o boss vai nascer.
        this.bossSpawnPoint = null;

        // Guarda a referência do boss.
        this.boss = null;

        // Indica se o boss já nasceu.
        this.bossSpawned = false;

        // Indica se o boss já morreu.
        this.bossDead = false;

        // Guarda a zona da entrada do boss.
        this.bossEntranceZone = null;

        // Guarda o bloqueador invisível da entrada do boss.
        this.bossEntranceBlocker = null;

        // Indica se a entrada do boss já abriu.
        this.bossEntranceOpened = false;

        // Indica se a porta do boss já fechou.
        this.bossDoorClosed = false;

        // Guarda as paredes invisíveis da entrada do boss.
        this.bossEntranceWalls = [];

        // Controla quando a porta do boss pode fechar.
        this.canCloseBossDoor = false;

        // Baú final.

        // Guarda o objeto do Tiled referente ao baú final.
        this.finalChestObject = null;

        // Guarda a referência do baú final criado no jogo.
        this.finalChest = null;

        // Indica se o baú final já apareceu.
        this.finalChestSpawned = false;

        // Indica se o baú final já foi aberto.
        this.finalChestOpened = false;

        // Guarda a porta de saída final.
        this.exitDoor = null;

        // Indica se a saída final foi desbloqueada.
        this.finalExitUnlocked = false;

        // Cristais de Valdoria.

        // Indica se os cristais foram recuperados.
        this.cristaisValdoriaRecuperados = false;

        // Indica se a mensagem dos cristais está ativa.
        this.mensagemCristaisAtiva = false;

        // Guarda objetos visuais dos cristais finais.
        this.finalCrystalObjects = [];

        // Boss.

        // Indica se a mensagem do boss já foi mostrada.
        this.bossMessageShown = false;

        // Loja.

        // Indica se a loja está aberta.
        this.shopOpen = false;

        // Guarda objetos visuais da loja.
        this.shopObjects = [];

        // Guarda cards da loja.
        this.shopCards = [];

        // Índice selecionado na loja.
        this.shopSelectedIndex = 0;

        // Guarda moedas usadas pela loja.
        this.shopCoins = 0;

        // Guarda mensagem da loja.
        this.shopMessage = null;
    }

    // Preload vazio porque os recursos já são carregados no BootScene.
    preload() {}

    // Função chamada quando a cena é criada.
    create() {

        // Garante que a cena não começa marcada como em transição.
        this.isChangingScene = false;

        // Limpa efeitos anteriores da câmara.
        this.cameras.main.resetFX();

        // Garante opacidade total da câmara.
        this.cameras.main.setAlpha(1);

        // Define o fundo da câmara como preto.
        this.cameras.main.setBackgroundColor('#000000');

        // Faz fade in ao entrar no nível.
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Toca a música do nível final.
        MusicSystem.play(this, 'music_levelFinal', {
            volume: 0.38,
            loop: true,
            fade: 2200
        });


        // Guarda uma cópia dos dados do Player 1 no início do nível.
        this.registry.set(
            'player1HeroAtLevelStart',
            this.cloneData(this.p1Data)
        );

        // Guarda uma cópia dos dados do Player 2 no início do nível.
        this.registry.set(
            'player2HeroAtLevelStart',
            this.cloneData(this.p2Data)
        );

        // Guarda dados do início do nível final.

        // Guarda as moedas iniciais.
        this.registry.set('coinsAtLevelStart', {
            p1: this.coins.p1 || 0,
            p2: this.coins.p2 || 0
        });

        // Guarda o score do nível no início.
        this.registry.set('levelScoreAtLevelStart', this.registry.get('levelScore') || 0);

        // Guarda o breakdown do score no início.
        this.registry.set('scoreBreakdownAtLevelStart', {
            ...(this.registry.get('scoreBreakdown') || {
                items: 0,
                enemies: 0,
                finishLevel: 0,
                timeBonus: 0,
                noDamageBonus: 0
            })
        });

        // Guarda as estatísticas do score no início.
        this.registry.set('scoreStatsAtLevelStart', {
            ...(this.registry.get('scoreStats') || {
                apples: 0,
                icecreams: 0,
                coins: 0,
                enemiesKilled: 0,
                enemy0Killed: 0,
                enemy1Killed: 0
            })
        });


        // Evento chamado quando a cena é encerrada.
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {

            // Para a cena do HUD.
            this.scene.stop('LevelHUDScene');

            // Destroi o sistema do timer, se existir.
            if (this.levelTimerSystem) this.levelTimerSystem.destroy();

            // Destroi o sistema da câmara, se existir.
            if (this.cameraSystem) this.cameraSystem.destroy();

            // Destroi o sistema de distância entre jogadores, se existir.
            if (this.playerDistanceSystem) this.playerDistanceSystem.destroy();

            // Destroi o sistema de perigo, se existir.
            if (this.dangerZoneSystem) this.dangerZoneSystem.destroy();

            // Destroi o sistema de intro, se existir.
            if (this.levelIntroSystem) this.levelIntroSystem.destroy();
        });

        // Secção do mapa.

        // Cria o tilemap do nível final.
        this.map = this.make.tilemap({
            key: this.levelConfig.mapKey
        });

        // Cria os tilesets usados pelo mapa.
        const tilesets = this.createTilesets();

        // Secção das layers.

        // Cria a layer preta.
        this.pretoLayer = this.createLayerSafe('Preto', tilesets, -2);

        // Cria a layer do chão.
        this.groundLayer = this.createLayerSafe('Ground', tilesets, 0);

        // Cria a layer dos buracos.
        this.buracosLayer = this.createLayerSafe('Buracos', tilesets, 1);

        // Cria a primeira layer de paredes.
        this.paredeLayer = this.createLayerSafe('Paredes', tilesets, 4);

        // Cria a segunda layer de paredes.
        this.parede2Layer = this.createLayerSafe('Paredes2', tilesets, 4);

        // Cria a primeira layer de decoração.
        this.decLayer = this.createLayerSafe('Decoracao', tilesets, 21);

        // Cria a segunda layer de decoração.
        this.dec2Layer = this.createLayerSafe('Decoracao2', tilesets, 22);

        // Se existir a primeira layer de paredes.
        if (this.paredeLayer) {

            // Ativa colisão em todos os tiles exceto vazios.
            this.paredeLayer.setCollisionByExclusion([-1]);
        }

        // Se existir a segunda layer de paredes.
        if (this.parede2Layer) {

            // Ativa colisão em todos os tiles exceto vazios.
            this.parede2Layer.setCollisionByExclusion([-1]);
        }

        // Usa buracosLayer como waterLayer por compatibilidade com sistemas antigos.
        this.waterLayer = this.buracosLayer;

        // Define ponteLayer como null porque este nível não usa ponte.
        this.ponteLayer = null;

        // Usa groundLayer como ground2Layer por compatibilidade.
        this.ground2Layer = this.groundLayer;

        // Secção dos grupos.

        // Cria o grupo físico dos inimigos.
        this.enemies = this.physics.add.group();

        // Cria o grupo físico dos itens.
        this.itemsGroup = this.physics.add.group();

        // Cria o grupo estático dos objetos interativos.
        this.interativosGroup = this.physics.add.staticGroup();

        // Cria o grupo da saída.
        this.saidaGroup = this.add.group();

        // Cria o grupo das paredes invisíveis.
        this.paredesInvisiveis = this.physics.add.staticGroup();

        // Cria o grupo da porta do boss.
        this.bossDoorGroup = this.physics.add.staticGroup();

        // Secção dos sistemas.

        // Cria o sistema dos inimigos.
        this.enemySystem = new EnemySystem(this);

        // Cria o sistema dos itens.
        this.itemSystem = new ItemSystem(this);

        // Cria o sistema de ataques.
        this.attackSystem = new AttackSystem(this);

        // Cria o sistema de interação.
        this.interactionSystem = new InteractionSystem(this);

        // Cria o sistema de Game Over.
        this.gameOverSystem = new GameOverSystem(this);

        // Cria o sistema de score.
        this.scoreSystem = new ScoreSystem(this);

        // Cria o sistema de vida dos jogadores.
        this.playerHealthSystem = new PlayerHealthSystem(this);

        // Cria o sistema de temporizador.
        this.levelTimerSystem = new LevelTimerSystem(this, {
            maxTime: this.levelConfig.time
        });

        // Cria o sistema de zonas perigosas.
        this.dangerZoneSystem = new DangerZoneSystem(this, {
            warningDistance: 20,
            dangerLayers: ['buracosLayer'],
            dangerMessage: 'Perigo'
        });

        // Cria o sistema de introdução do nível.
        this.levelIntroSystem = new LevelIntroSystem(this, {
            ...this.levelConfig.intro,
            levelKey: this.sys.settings.key
        });

        // Secção dos controlos.

        // Cria as setas do teclado.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Cria a tecla ESC.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Cria a tecla E para interação.
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Cria a tecla SHIFT para abrir a loja antes do boss.
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Cria as teclas WASD para o Player 2.
        this.keysWASD = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Cria as teclas de ataque do Player 1.
        this.keysP1 = this.input.keyboard.addKeys({
            atk1: Phaser.Input.Keyboard.KeyCodes.J,
            atk2: Phaser.Input.Keyboard.KeyCodes.K,
            atk3: Phaser.Input.Keyboard.KeyCodes.L,
            block: Phaser.Input.Keyboard.KeyCodes.B
        });

        // Cria as teclas de ataque do Player 2.
        this.keysP2 = this.input.keyboard.addKeys({
            atk1: Phaser.Input.Keyboard.KeyCodes.R,
            atk2: Phaser.Input.Keyboard.KeyCodes.T,
            atk3: Phaser.Input.Keyboard.KeyCodes.Q,
            block: Phaser.Input.Keyboard.KeyCodes.CTRL
        });

        // Cria as teclas de inventário do Player 1.
        this.invKeysP1 = this.input.keyboard.addKeys({
            s7: Phaser.Input.Keyboard.KeyCodes.SEVEN,
            s8: Phaser.Input.Keyboard.KeyCodes.EIGHT,
            s9: Phaser.Input.Keyboard.KeyCodes.NINE,
            s0: Phaser.Input.Keyboard.KeyCodes.ZERO
        });

        // Cria as teclas de inventário do Player 2.
        this.invKeysP2 = this.input.keyboard.addKeys({
            s1: Phaser.Input.Keyboard.KeyCodes.ONE,
            s2: Phaser.Input.Keyboard.KeyCodes.TWO,
            s3: Phaser.Input.Keyboard.KeyCodes.THREE,
            s4: Phaser.Input.Keyboard.KeyCodes.FOUR
        });

        // Cria a tecla esquerda.
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        // Cria a tecla direita.
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla SPACE.
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cria o sistema de inventário.
        this.inventorySystem = new InventorySystem(this);

        // Guarda referência do texto de interação.
        this.textoInteracao = null;

        // Secção dos objetos do Tiled.

        // Vai buscar a layer de objetos chamada Eventos.
        const objectLayer = this.map.getObjectLayer('Eventos');

        // Define spawn padrão do Player 1.
        let spawnX1 = 100;

        // Define spawn Y padrão do Player 1.
        let spawnY1 = 100;

        // Define spawn padrão do Player 2.
        let spawnX2 = 140;

        // Define spawn Y padrão do Player 2.
        let spawnY2 = 100;

        // Percorre os objetos do Tiled, se existirem.
        objectLayer?.objects.forEach(obj => {

            // Se o objeto for uma parede invisível.
            if (obj.name === 'ParedeInvisivel') {

                // Cria a parede invisível.
                this.createInvisibleWall(obj);
            }

            // Se o objeto for spawn do Player 1.
            if (obj.name === 'spawn_player') {

                // Guarda a posição X do Player 1.
                spawnX1 = obj.x;

                // Guarda a posição Y do Player 1.
                spawnY1 = obj.y;
            }

            // Se o objeto for spawn do Player 2.
            if (obj.name === 'spawn_player2') {

                // Guarda a posição X do Player 2.
                spawnX2 = obj.x;

                // Guarda a posição Y do Player 2.
                spawnY2 = obj.y;
            }

            // Se o objeto for o ponto de spawn do boss.
            if (obj.name === 'boss') {

                // Guarda o centro do objeto como posição do boss.
                this.bossSpawnPoint = {
                    x: obj.x + (obj.width || 0) / 2,
                    y: obj.y + (obj.height || 0) / 2
                };
            }

            // Se o objeto for o baú final.
            if (obj.name === 'bau' || obj.name === 'bau_tesouro') {

                // Guarda o objeto para criar o baú final mais tarde.
                this.finalChestObject = obj;
            }

            // Se o objeto for a entrada do boss.
            if (obj.name === 'entrada_boss') {

                // Cria a zona da entrada do boss.
                this.createBossEntrance(obj);
            }

            // Se o objeto for a porta de saída.
            if (obj.name === 'porta_saida') {

                // Cria uma zona invisível para a porta de saída.
                const porta = this.add.zone(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );

                // Dá nome à porta.
                porta.setName('porta_saida');

                // Marca a porta como fechada.
                porta.aberto = false;

                // Define a distância de interação da porta.
                porta.interactionRange = 90;

                // Ativa física estática na porta.
                this.physics.add.existing(porta, true);

                // NÃO adicionar ao interativosGroup.
                // A porta é tratada manualmente em updateExitDoorInteraction().
                this.exitDoor = porta;
            }
        });

        // Procura paredes invisíveis que pertencem à entrada do boss.
        this.collectBossEntranceWalls();

        // Secção dos players.

        // Cria o Player 1.
        this.player1 = new Player(
            this,
            spawnX1,
            spawnY1,
            this.p1Data.id,
            this.p1Data
        );

        // Define a profundidade do Player 1.
        this.player1.setDepth(20);

        // Adiciona colisores ao Player 1.
        this.addPlayerColliders(this.player1);

        // Se for multiplayer e existir Player 2.
        if (this.gameMode === 'multi' && this.p2Data) {

            // Cria o Player 2.
            this.player2 = new Player(
                this,
                spawnX2,
                spawnY2,
                this.p2Data.id,
                this.p2Data
            );

            // Define a profundidade do Player 2.
            this.player2.setDepth(20);

            // Adiciona colisores ao Player 2.
            this.addPlayerColliders(this.player2);
        }

        // Se estiver em multiplayer e o Player 2 existir.
        if (this.gameMode === 'multi' && this.player2) {

            // Cria o sistema de distância entre jogadores.
            this.playerDistanceSystem = new PlayerDistanceSystem(this, {
                warningDistance: 420,
                killDistance: 560
            });
        }

        // Secção da câmara.

        // Define os limites físicos do mundo.
        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        // Cria o sistema de câmara.
        this.cameraSystem = new CameraSystem(this, {
            zoom: 2,
            followLerp: 0.05,
            targetLerp: 0.08
        });

        // Configura a câmara.
        this.cameraSystem.setup();

        // Secção dos inimigos normais.

        // Define os inimigos que devem nascer antes da porta do boss.
        const enemiesToSpawn = this.levelConfig.enemies || ['enemy2', 'enemy8'];

        // Percorre os inimigos a criar.
        enemiesToSpawn.forEach(enemyKey => {

            // Cria o inimigo antes da porta do boss.
            this.spawnEnemyBeforeBossDoor(enemyKey);
        });

        // Percorre todos os inimigos criados.
        this.enemies.getChildren().forEach(enemy => {

            // Define profundidade dos inimigos.
            enemy.setDepth(20);
        });

        // Adiciona colisores aos inimigos.
        this.addEnemyColliders();

        // Secção dos itens.

        // Se existirem itens definidos no nível.
        if (this.levelConfig.items) {

            // Percorre os itens definidos.
            this.levelConfig.items.forEach(itemKey => {

                // Cria cada item antes da porta do boss.
                this.spawnItemBeforeBossDoor(itemKey);
            });
        }

        // Adiciona overlap entre Player 1 e itens.
        this.physics.add.overlap(
            this.player1,
            this.itemsGroup,
            (player, item) => this.itemSystem.coletarItem(player, item),
            null,
            this
        );

        // Se existir Player 2.
        if (this.player2) {

            // Adiciona overlap entre Player 2 e itens.
            this.physics.add.overlap(
                this.player2,
                this.itemsGroup,
                (player, item) => this.itemSystem.coletarItem(player, item),
                null,
                this
            );
        }

        // Secção do revive multiplayer.

        // Se estiver em multiplayer.
        if (this.gameMode === 'multi') {

            // Cria o sistema de revive.
            this.reviveSystem = new ReviveSystem(this);

            // Define os pontos de spawn dos jogadores.
            this.reviveSystem.setSpawnPoints(
                { x: spawnX1, y: spawnY1 },
                { x: spawnX2, y: spawnY2 }
            );
        }

        // Cria a introdução do nível.
        this.levelIntroSystem.create();
    }

    // Cria um item antes da porta do boss.
    spawnItemBeforeBossDoor(itemKey) {

        // Vai buscar uma posição válida para o item.
        const pos = this.getRandomItemPositionBeforeBossDoor();

        // Se não houver posição válida, não cria item.
        if (!pos) return null;

        // Cria o item no grupo de itens.
        const item = this.itemsGroup.create(pos.x, pos.y, itemKey);

        // Se o item não for criado, devolve null.
        if (!item) return null;

        // Define a profundidade do item.
        item.setDepth(15);

        // Define a escala do item.
        item.setScale(0.8);

        // Guarda a key do item.
        item.key = itemKey;

        // Guarda outra referência da key do item.
        item.itemKey = itemKey;

        // Se o item tiver corpo físico.
        if (item.body) {

            // Desativa gravidade no item.
            item.body.setAllowGravity(false);

            // Torna o item imóvel.
            item.body.setImmovable(true);
        }

        // Devolve o item criado.
        return item;
    }

    // Procura uma posição aleatória para item antes da porta do boss.
    getRandomItemPositionBeforeBossDoor() {

        // Define o número máximo de tentativas.
        const maxTries = 120;

        // Define limite X mínimo.
        const minX = 60;

        // Define limite X máximo.
        const maxX = this.map.widthInPixels - 60;

        // Define limite Y mínimo.
        let minY = 60;

        // Define limite Y máximo.
        let maxY = this.map.heightInPixels - 60;

        // A sala do boss fica acima da entrada_boss.
        // Então os itens devem nascer ABAIXO da entrada_boss.
        if (this.bossEntranceZone) {
            minY = this.bossEntranceZone.y + 45;
        }

        // Tenta várias posições aleatórias.
        for (let i = 0; i < maxTries; i++) {

            // Sorteia uma posição X.
            const x = Phaser.Math.Between(minX, maxX);

            // Sorteia uma posição Y.
            const y = Phaser.Math.Between(minY, maxY);

            // Se a posição não for válida, tenta outra.
            if (!this.isValidItemSpawnBeforeBoss(x, y)) continue;

            // Devolve a posição válida.
            return { x, y };
        }

        // Se não encontrar posição, devolve null.
        return null;
    }

    // Verifica se uma posição é válida para nascer item antes do boss.
    isValidItemSpawnBeforeBoss(x, y) {

        // Se não existir chão, não é válido.
        if (!this.groundLayer) return false;

        // Tem de estar em cima do chão.
        const groundTile = this.groundLayer.getTileAtWorldXY(x, y);

        // Se não houver tile de chão, não é válido.
        if (!groundTile || groundTile.index === -1) return false;

        // Não pode estar em buraco.
        if (this.buracosLayer) {

            // Vai buscar tile de buraco.
            const holeTile = this.buracosLayer.getTileAtWorldXY(x, y);

            // Se houver buraco, não é válido.
            if (holeTile && holeTile.index !== -1) return false;
        }

        // Não pode estar em parede.
        if (this.paredeLayer) {

            // Vai buscar tile de parede.
            const wallTile = this.paredeLayer.getTileAtWorldXY(x, y);

            // Se houver parede, não é válido.
            if (wallTile && wallTile.index !== -1) return false;
        }

        // Não pode estar em parede da segunda layer.
        if (this.parede2Layer) {

            // Vai buscar tile da segunda parede.
            const wall2Tile = this.parede2Layer.getTileAtWorldXY(x, y);

            // Se houver parede, não é válido.
            if (wall2Tile && wall2Tile.index !== -1) return false;
        }

        // Não deixa spawnar na sala do boss.
        if (this.bossEntranceZone && y < this.bossEntranceZone.y + 35) {
            return false;
        }

        // Se passou todos os testes, a posição é válida.
        return true;
    }

    // Secção dos tilesets.

    // Cria a lista de tilesets usados pelo mapa.
    createTilesets() {

        // Lista onde ficam os tilesets válidos.
        const tilesets = [];

        // Função interna para adicionar um tileset com segurança.
        const addTileset = (tiledName, possibleKeys) => {

            // Se o mapa não tiver este tileset, não faz nada.
            if (!this.map.tilesets.some(t => t.name === tiledName)) {
                return;
            }

            // Procura uma key de textura que exista.
            const key = possibleKeys.find(k => this.textures.exists(k));

            // Se nenhuma textura existir.
            if (!key) {

                // Mostra aviso na consola.
                console.warn(`Tileset ${tiledName} não tem textura carregada no BootScene.`);

                // Sai da função.
                return;
            }

            // Adiciona o tileset ao mapa.
            const tileset = this.map.addTilesetImage(tiledName, key);

            // Se o tileset foi criado.
            if (tileset) {

                // Guarda o tileset.
                tilesets.push(tileset);
            } else {

                // Mostra erro se o tileset falhar.
                console.error('ERRO: tileset null ->', tiledName, key);
            }
        };

        // Adiciona o tileset decorativo do castelo.
        addTileset('decorativecastle', [
            'decorativeCastleTiles',
            'decorativecastle'
        ]);

        // Adiciona o tileset decorativo das catacumbas.
        addTileset('decorativeCat', [
            'decorativeCatTiles',
            'decorativeCat'
        ]);

        // Adiciona o tileset freelavatileset-Sheet.
        addTileset('freelavatileset-Sheet', [
            'lavaTiles',
            'freelavatileset-Sheet'
        ]);

        // Adiciona o tileset principal das catacumbas.
        addTileset('mainlevbuild', [
            'mainLevBuildTiles',
            'mainlevbuild'
        ]);

        // Adiciona o tileset principal do castelo.
        addTileset('mainlevbuildcastle', [
            'mainLevBuildCastleTiles',
            'mainlevbuildcastle'
        ]);

        // Devolve a lista de tilesets.
        return tilesets;
    }

    // Cria uma layer com segurança.
    createLayerSafe(layerName, tilesets, depth = 0) {

        // Se o mapa não tiver esta layer.
        if (!this.map.layers.some(l => l.name === layerName)) {

            // Mostra aviso na consola.
            console.warn(`Layer ${layerName} não existe no mapa.`);

            // Devolve null.
            return null;
        }

        // Cria a layer.
        const layer = this.map.createLayer(layerName, tilesets, 0, 0);

        // Se a layer foi criada.
        if (layer) {

            // Define a profundidade da layer.
            layer.setDepth(depth);
        }

        // Devolve a layer criada.
        return layer;
    }

    // Secção dos objetos.

    // Cria uma parede invisível a partir de um objeto do Tiled.
    createInvisibleWall(obj) {

        // Cria um retângulo na posição do objeto.
        const parede = this.add.rectangle(
            obj.x + obj.width / 2,
            obj.y + obj.height / 2,
            obj.width,
            obj.height
        );

        // Ativa física estática na parede.
        this.physics.add.existing(parede, true);

        // Adiciona ao grupo de paredes invisíveis.
        this.paredesInvisiveis.add(parede);

        // Esconde a parede.
        parede.setVisible(false);

        // Guarda a posição X original do Tiled.
        parede.tiledX = obj.x;

        // Guarda a posição Y original do Tiled.
        parede.tiledY = obj.y;

        // Guarda a largura original do Tiled.
        parede.tiledWidth = obj.width;

        // Guarda a altura original do Tiled.
        parede.tiledHeight = obj.height;

        // Devolve a parede criada.
        return parede;
    }

    // Cria a entrada do boss.
    createBossEntrance(obj) {

        // Cria a zona invisível da entrada do boss.
        this.bossEntranceZone = this.add.zone(
            obj.x + obj.width / 2,
            obj.y + obj.height / 2,
            obj.width,
            obj.height
        );

        // Dá nome à zona.
        this.bossEntranceZone.setName('entrada_boss');

        // Define a distância de interação.
        this.bossEntranceZone.interactionRange = 120;

        // Ativa física estática na zona.
        this.physics.add.existing(this.bossEntranceZone, true);

        // Cria o bloqueador invisível da entrada do boss.
        this.bossEntranceBlocker = this.add.rectangle(
            obj.x + obj.width / 2,
            obj.y + obj.height / 2,
            obj.width,
            obj.height
        );

        // Ativa física estática no bloqueador.
        this.physics.add.existing(this.bossEntranceBlocker, true);

        // Adiciona o bloqueador ao grupo da porta do boss.
        this.bossDoorGroup.add(this.bossEntranceBlocker);

        // Esconde o bloqueador.
        this.bossEntranceBlocker.setVisible(false);
    }

    // Faz aparecer o baú final.
    spawnFinalChest() {

        // Se o baú já apareceu ou não existe objeto no Tiled, não faz nada.
        if (this.finalChestSpawned || !this.finalChestObject) return;

        // Guarda o objeto do Tiled.
        const obj = this.finalChestObject;

        // Calcula o X central do baú.
        const x = obj.x + (obj.width || 0) / 2;

        // Calcula o Y central do baú.
        const y = obj.y + (obj.height || 0) / 2;

        // Cria o baú como imagem física estática.
        const bau = this.physics.add.staticImage(x, y, 'chest');

        // Centra a origem do baú.
        bau.setOrigin(0.5);

        // Dá nome ao baú final.
        bau.setName('bau_final');

        // Marca o baú como fechado.
        bau.aberto = false;

        // Define a profundidade do baú.
        bau.setDepth(20);

        // Se o baú tiver corpo físico.
        if (bau.body) {

            // Define tamanho da hitbox.
            bau.body.setSize(32, 32);

            // Define offset da hitbox.
            bau.body.setOffset(0, 0);

            // Atualiza o corpo físico.
            bau.refreshBody();
        }

        // Define distância de interação do baú.
        bau.interactionRange = 50;

        // Guarda referência do baú final.
        this.finalChest = bau;

        // Marca que o baú final já apareceu.
        this.finalChestSpawned = true;

        // Mostra mensagem temporária.
        this.showTemporaryMessage('O baú final apareceu!');
    }

    // Secção dos colliders.

    // Adiciona colisores a um jogador.
    addPlayerColliders(player) {

        // Se o jogador não existir, não faz nada.
        if (!player) return;

        // Se existir primeira layer de parede.
        if (this.paredeLayer) {

            // Adiciona colisão entre jogador e parede.
            this.physics.add.collider(player, this.paredeLayer);
        }

        // Se existir segunda layer de parede.
        if (this.parede2Layer) {

            // Adiciona colisão entre jogador e parede 2.
            this.physics.add.collider(player, this.parede2Layer);
        }

        // Adiciona colisão com paredes invisíveis.
        this.physics.add.collider(player, this.paredesInvisiveis);

        // Adiciona colisão com a porta do boss.
        this.physics.add.collider(player, this.bossDoorGroup);
    }

    // Adiciona colisores aos inimigos.
    addEnemyColliders() {

        // Se existir primeira layer de parede.
        if (this.paredeLayer) {

            // Adiciona colisão entre inimigos e parede.
            this.physics.add.collider(this.enemies, this.paredeLayer, enemy => {

                // Chama reação do inimigo ao bater na parede.
                if (enemy.onWallHit) enemy.onWallHit();
            });
        }

        // Se existir segunda layer de parede.
        if (this.parede2Layer) {

            // Adiciona colisão entre inimigos e parede 2.
            this.physics.add.collider(this.enemies, this.parede2Layer, enemy => {

                // Chama reação do inimigo ao bater na parede.
                if (enemy.onWallHit) enemy.onWallHit();
            });
        }

        // Adiciona colisão entre inimigos e paredes invisíveis.
        this.physics.add.collider(this.enemies, this.paredesInvisiveis, enemy => {

            // Chama reação do inimigo ao bater na parede.
            if (enemy.onWallHit) enemy.onWallHit();
        });

        // Adiciona colisão entre inimigos e porta do boss.
        this.physics.add.collider(this.enemies, this.bossDoorGroup, enemy => {

            // Chama reação do inimigo ao bater na porta.
            if (enemy.onWallHit) enemy.onWallHit();
        });

        // Adiciona colisão entre inimigos e zonas perigosas.
        this.dangerZoneSystem.addColliderForObject(this.enemies, enemy => {

            // Chama reação do inimigo ao bater no perigo.
            if (enemy.onWallHit) enemy.onWallHit();
        });
    }

    // Secção da entrada do boss.

    // Atualiza automaticamente a lógica da entrada do boss.
    updateBossEntranceAuto() {

        // Se não existir zona da entrada, não faz nada.
        if (!this.bossEntranceZone) return false;

        // Se a porta já fechou, não faz nada.
        if (this.bossDoorClosed) return false;

        // Se a intro, Game Over ou fim do nível estiver ativo, não faz nada.
        if (this.levelIntroActive || this.gameOverStarted || this.levelFinished) return false;

        // Se a loja estiver aberta, mantém esta interação como tratada.
        if (this.shopOpen) return true;

        // Verifica se algum jogador está perto da entrada.
        const playerNear = this.getPlayerNearBossEntrance();

        // Conta inimigos normais vivos.
        const enemiesLeft = this.getNormalEnemiesAliveCount();

        // Ainda há inimigos.

        // Se ainda houver inimigos.
        if (enemiesLeft > 0) {

            // Se o jogador estiver perto.
            if (playerNear) {

                // Mostra mensagem para derrotar inimigos.
                this.setInteractionText(`Derrota todos os inimigos primeiro (${enemiesLeft})`);

                // Indica que tratou interação.
                return true;
            }

            // Não tratou interação.
            return false;
        }

        // Todos os inimigos morreram.

        // Se a entrada ainda não abriu.
        if (!this.bossEntranceOpened) {

            // Abre a entrada do boss.
            this.openBossEntrance();
        }

        // Enquanto uma mensagem temporária estiver ativa,
        // não deixa o texto da loja apagar a mensagem do boss.
        if (this.interactionTextLocked) {
            return true;
        }

        // Loja antes do boss.

        // Se o jogador estiver perto e a porta ainda não fechou.
        if (playerNear && !this.bossDoorClosed) {

            // Mostra texto da loja.
            this.forceInteractionText('SHIFT: Loja Bónus');

            // Se carregar SHIFT.
            if (Phaser.Input.Keyboard.JustDown(this.keyShift)) {

                // Abre a loja de bónus.
                this.openBonusShop();
            }

            // Indica que tratou a interação.
            return true;
        }

        // Não tratou interação.
        return false;
    }

    // Verifica se algum jogador está perto da entrada do boss.
    getPlayerNearBossEntrance() {

        // Se não existir entrada do boss, devolve null.
        if (!this.bossEntranceZone) return null;

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Percorre jogadores.
        for (const player of players) {

            // Calcula distância entre jogador e entrada.
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                this.bossEntranceZone.x,
                this.bossEntranceZone.y
            );

            // Se estiver dentro da distância de interação.
            if (dist <= this.bossEntranceZone.interactionRange) {

                // Devolve o jogador próximo.
                return player;
            }
        }

        // Se nenhum jogador estiver perto, devolve null.
        return null;
    }

    // Conta quantos inimigos normais ainda estão vivos.
    getNormalEnemiesAliveCount() {

        // Se não existir grupo de inimigos, devolve 0.
        if (!this.enemies) return 0;

        // Filtra inimigos ativos que não são boss.
        return this.enemies.getChildren().filter(enemy => {
            return enemy &&
                enemy.active &&
                !enemy.isDead &&
                !enemy.isBoss;
        }).length;
    }

    // Abre a entrada do boss.
    openBossEntrance() {

        // Se já abriu, não faz nada.
        if (this.bossEntranceOpened) return;

        // Mostra mensagem na consola.
        console.log('Todos os inimigos foram derrotados. A entrada do boss abriu.');

        // Marca a entrada como aberta.
        this.bossEntranceOpened = true;

        // Se existir bloqueador.
        if (this.bossEntranceBlocker) {

            // Remove e destrói o bloqueador.
            this.bossDoorGroup.remove(this.bossEntranceBlocker, true, true);

            // Limpa a referência.
            this.bossEntranceBlocker = null;
        }

        // Se existir grupo da porta.
        if (this.bossDoorGroup) {

            // Limpa todos os bloqueadores.
            this.bossDoorGroup.clear(true, true);
        }

        // Se existirem paredes invisíveis da entrada.
        if (this.bossEntranceWalls && this.bossEntranceWalls.length > 0) {

            // Percorre essas paredes.
            this.bossEntranceWalls.forEach(wall => {

                // Ignora paredes inválidas.
                if (!wall) return;

                // Remove e destrói a parede invisível.
                this.paredesInvisiveis.remove(wall, true, true);
            });

            // Limpa a lista.
            this.bossEntranceWalls = [];
        }

        // Agora NÃO destrói o mapa.
        // Só desliga a colisão dos tiles nessa zona.
        this.disableBossEntranceTileCollision();

        // Impede a porta de fechar imediatamente.
        this.canCloseBossDoor = false;

        // Depois de 1200ms, permite fechar a porta.
        this.time.delayedCall(1200, () => {
            this.canCloseBossDoor = true;
        });

        // Limpa o texto de interação.
        this.setInteractionText('');

        // Depois de 900ms, cria o boss.
        this.time.delayedCall(900, () => {
            this.spawnBoss();
        });

        
        // Troca suavemente para a música do boss.
        MusicSystem.fadeTo(this, 'music_boss', {
            volume: 0.45,
            loop: true,
            fade: 3000
        });
    }
    

    // Desativa a colisão dos tiles da entrada do boss.
    disableBossEntranceTileCollision() {

        // Se não houver zona ou mapa, não faz nada.
        if (!this.bossEntranceZone || !this.map) return;

        // Lista das layers de parede que vão perder colisão na entrada.
        const layers = [
            this.paredeLayer,
            this.parede2Layer

        // Remove layers inválidas.
        ].filter(layer => layer);

        // Guarda a largura de cada tile.
        const tileW = this.map.tileWidth;

        // Guarda a altura de cada tile.
        const tileH = this.map.tileHeight;

        // Calcula o tile mais à esquerda da zona.
        const left = Math.floor((this.bossEntranceZone.x - this.bossEntranceZone.width / 2) / tileW) - 1;

        // Calcula o tile mais à direita da zona.
        const right = Math.ceil((this.bossEntranceZone.x + this.bossEntranceZone.width / 2) / tileW) + 1;

        // Calcula o tile de cima da zona.
        const top = Math.floor((this.bossEntranceZone.y - this.bossEntranceZone.height / 2) / tileH) - 1;

        // Calcula o tile de baixo da zona.
        const bottom = Math.ceil((this.bossEntranceZone.y + this.bossEntranceZone.height / 2) / tileH) + 1;

        // Percorre as layers de parede.
        layers.forEach(layer => {

            // Percorre os tiles em Y.
            for (let ty = top; ty <= bottom; ty++) {

                // Percorre os tiles em X.
                for (let tx = left; tx <= right; tx++) {

                    // Vai buscar o tile.
                    const tile = layer.getTileAt(tx, ty);

                    // Ignora tile vazio.
                    if (!tile || tile.index === -1) continue;

                    // Mantém o tile visível, mas remove a colisão
                    // Mantém o tile visível, mas remove a colisão

                    // Remove a colisão do tile.
                    tile.setCollision(false, false, false, false);

                    // Reinicia a colisão do tile.
                    tile.resetCollision();
                }
            }

            // Atualiza as colisões da área modificada
            layer.calculateFacesWithin(
                left,
                top,
                right - left + 1,
                bottom - top + 1
            );
        });

        // Mostra mensagem na consola.
        console.log('Colisão dos tiles da entrada do boss desativada.');
    }

    // Atualiza a lógica de fechar a porta do boss.
    updateCloseBossDoor() {

        // Se a entrada ainda não abriu, não faz nada.
        if (!this.bossEntranceOpened) return;

        // Se a porta já fechou, não faz nada.
        if (this.bossDoorClosed) return;

        // Se ainda não pode fechar, não faz nada.
        if (!this.canCloseBossDoor) return;

        // Se não existir zona da entrada, não faz nada.
        if (!this.bossEntranceZone) return;

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Se não houver jogadores vivos, não faz nada.
        if (!players.length) return;

        // Verifica se todos os jogadores entraram na sala do boss.
        const allPlayersEntered = players.every(player => {
            return player.y < this.bossEntranceZone.y - 20;
        });

        // Se nem todos entraram, não fecha.
        if (!allPlayersEntered) return;

        // Fecha a porta atrás dos jogadores.
        this.closeBossDoorBehindPlayers();
    }

    // Fecha a porta do boss atrás dos jogadores.
    closeBossDoorBehindPlayers() {

        // Se já fechou ou não há entrada, não faz nada.
        if (this.bossDoorClosed || !this.bossEntranceZone) return;

        // Marca a porta como fechada.
        this.bossDoorClosed = true;

        // Cria um bloqueador invisível na entrada.
        const blocker = this.add.rectangle(
            this.bossEntranceZone.x,
            this.bossEntranceZone.y,
            this.bossEntranceZone.width,
            this.bossEntranceZone.height
        );

        // Ativa física estática no bloqueador.
        this.physics.add.existing(blocker, true);

        // Adiciona o bloqueador ao grupo da porta do boss.
        this.bossDoorGroup.add(blocker);

        // Esconde o bloqueador.
        blocker.setVisible(false);

        // Mostra mensagem temporária.
        this.showTemporaryMessage('A porta fechou atrás de ti!', 2200);

        // Depois mostra a mensagem para derrotar o boss.
        this.time.delayedCall(2400, () => {

            // Se o nível já acabou ou houve Game Over, não mostra.
            if (this.levelFinished || this.gameOverStarted) return;

            // Mostra mensagem do objetivo.
            this.showTemporaryMessage('Derrote Odysseus!', 2600);
        });
    }

    // Secção do boss.

    // Cria o boss.
    spawnBoss() {

        // Se o boss já nasceu, não faz nada.
        if (this.bossSpawned) return;

        // Se não existir ponto de spawn.
        if (!this.bossSpawnPoint) {

            // Mostra aviso na consola.
            console.warn('Objeto boss não encontrado no Tiled.');

            // Cancela o spawn.
            return;
        }

        // Marca que o boss já nasceu.
        this.bossSpawned = true;

        // Escolhe boss0 se existir, senão usa enemy0.
        const bossType = this.textures.exists('boss0') ? 'boss0' : 'enemy0';

        // Cria o boss usando o EnemySystem.
        this.boss = this.enemySystem.spawn(
            bossType,
            this.bossSpawnPoint.x,
            this.bossSpawnPoint.y
        );

        // Se o boss não foi criado, não faz nada.
        if (!this.boss) return;

        // Marca este inimigo como boss.
        this.boss.isBoss = true;

        // Define profundidade do boss.
        this.boss.setDepth(20);

        // Define a vida máxima do boss.
        this.boss.vidaMax = 500;

        // Define a vida atual do boss.
        this.boss.vidaAtual = 500;

        // Define o dano do boss.
        this.boss.dano = 25;

        // Define a velocidade do boss.
        this.boss.speed = 65;

        // Define a distância de deteção do boss.
        this.boss.detectRange = 200;

        // Define a distância de ataque do boss.
        this.boss.attackRange = 40;

        // Adiciona colisores aos inimigos novamente.
        this.addEnemyColliders();

        // Se a mensagem do boss ainda não foi mostrada.
        if (!this.bossMessageShown) {

            // Marca a mensagem como mostrada.
            this.bossMessageShown = true;

            // Mostra mensagem temporária.
            this.showTemporaryMessage('O Boss apareceu!', 2400);
        }

    }

    // Verifica se o boss morreu.
    checkBossDeath() {

        // Se o boss ainda não nasceu, não faz nada.
        if (!this.bossSpawned) return;

        // Se o boss já foi marcado como morto, não faz nada.
        if (this.bossDead) return;

        // Se não existir boss, não faz nada.
        if (!this.boss) return;

        // Se o boss morreu ou ficou inativo.
        if (this.boss.isDead || !this.boss.active) {

            // Marca o boss como morto.
            this.bossDead = true;

            // Dá a chave ao jogador.
            this.temChave = true;

            // Faz aparecer o baú final.
            this.spawnFinalChest();
        }
    }

    // Atualiza a interação com o baú final.
    updateFinalChestInteraction() {

        // Se não existe baú final, não faz nada.
        if (!this.finalChest) return false;

        // Se o baú já foi aberto, não faz nada.
        if (this.finalChestOpened) return false;

        // Se intro, Game Over ou fim do nível estiver ativo, não faz nada.
        if (this.levelIntroActive || this.gameOverStarted || this.levelFinished) return false;

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Guarda se algum jogador está perto.
        let playerNear = false;

        // Percorre os jogadores.
        for (const player of players) {

            // Calcula distância entre jogador e baú.
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                this.finalChest.x,
                this.finalChest.y
            );

            // Se estiver dentro da distância de interação.
            if (dist <= this.finalChest.interactionRange) {

                // Marca que há jogador perto.
                playerNear = true;

                // Para o loop.
                break;
            }
        }

        // Se não houver jogador perto, não faz nada.
        if (!playerNear) return false;

        // Mostra texto para abrir baú final.
        this.setInteractionText('E: abrir baú final');

        // Se carregar na tecla E.
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {

            // Marca baú como aberto.
            this.finalChestOpened = true;

            // Marca cristais como recuperados.
            this.cristaisValdoriaRecuperados = true;

            // A porta ainda não fica disponível.
            // Primeiro aparece a mensagem dos cristais.
            this.finalExitUnlocked = false;

            // Remove a chave temporariamente.
            this.temChave = false;

            // Limpa texto de interação.
            this.setInteractionText('');

            // Música da vitória final começa quando o baú final é aberto
            MusicSystem.fadeTo(this, 'music_finalVictory', {
                volume: 0.45,
                loop: true,
                fade: 2500
            });

            // Se existir textura do baú aberto.
            if (this.finalChest.setTexture && this.textures.exists('chestAberto')) {

                // Troca a textura do baú.
                this.finalChest.setTexture('chestAberto');
            }

            // Mostra cristal acima do baú.
            this.mostrarCristalSobreBauFinal();

            // Mostra mensagem dos cristais.
            this.mostrarMensagemCristaisValdoria();

            // Indica que a interação foi tratada.
            return true;
        }

        // Indica que a interação está ativa.
        return true;
    }

    // Atualiza a interação com a porta de saída.
    updateExitDoorInteraction() {

        // Se não existir porta, não faz nada.
        if (!this.exitDoor) return false;

        // Se intro, Game Over ou fim de nível estiver ativo, não faz nada.
        if (this.levelIntroActive || this.gameOverStarted || this.levelFinished) return false;

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Guarda se algum jogador está perto.
        let playerNear = false;

        // Percorre os jogadores.
        for (const player of players) {

            // Calcula distância entre jogador e porta.
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                this.exitDoor.x,
                this.exitDoor.y
            );

            // Se jogador estiver perto da porta.
            if (dist <= this.exitDoor.interactionRange) {

                // Marca que há jogador perto.
                playerNear = true;

                // Para o loop.
                break;
            }
        }

        // Se ninguém estiver perto, não faz nada.
        if (!playerNear) return false;

        // Se os cristais ainda não foram recuperados.
        if (!this.cristaisValdoriaRecuperados) {

            // Mostra aviso para abrir o baú final.
            this.setInteractionText('Abre o baú final primeiro');

            // Indica que tratou a interação.
            return true;
        }

        // Se a mensagem dos cristais ainda está ativa.
        if (this.mensagemCristaisAtiva) {

            // Limpa o texto.
            this.setInteractionText('');

            // Indica que tratou.
            return true;
        }

        // Se a saída ainda não foi desbloqueada.
        if (!this.finalExitUnlocked) {

            // Limpa o texto.
            this.setInteractionText('');

            // Indica que tratou.
            return true;
        }

        // Mostra texto para sair.
        this.setInteractionText('E: Sair');

        // Se carregar E.
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {

            // Limpa texto de interação.
            this.setInteractionText('');

            // Termina o nível.
            this.finishLevel();

            // Indica que tratou.
            return true;
        }

        // Indica que a interação está ativa.
        return true;
    }

    // Mostra o cristal visual acima do baú final.
    mostrarCristalSobreBauFinal() {

        // Se não existir baú final, não faz nada.
        if (!this.finalChest) return;

        // Se já existirem objetos de cristal, não cria novamente.
        if (this.finalCrystalObjects.length > 0) return;

        // Define X do cristal.
        const x = this.finalChest.x;

        // Define Y do cristal acima do baú.
        const y = this.finalChest.y - 48;

        // Cria círculo luminoso atrás do cristal.
        const circle = this.add.circle(x, y, 30, 0x7fdcff)

            // Define transparência inicial.
            .setAlpha(0.18)

            // Define profundidade.
            .setDepth(999);

        // Cria imagem do cristal.
        const crystal = this.add.image(x, y + 2, 'crystal')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define escala.
            .setScale(1)

            // Define profundidade.
            .setDepth(1000);

        // Anima o círculo luminoso.
        this.tweens.add({
            targets: circle,
            alpha: 0.45,
            scale: 1.25,
            duration: 650,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Anima o cristal a flutuar.
        this.tweens.add({
            targets: crystal,
            y: y,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Guarda os objetos visuais do cristal.
        this.finalCrystalObjects.push(circle, crystal);
    }

    // Mostra a mensagem dos cristais de Valdoria.
    mostrarMensagemCristaisValdoria() {

        // Se a mensagem já estiver ativa, não faz nada.
        if (this.mensagemCristaisAtiva) return;

        // Marca mensagem como ativa.
        this.mensagemCristaisAtiva = true;

        // Mantém a saída bloqueada temporariamente.
        this.finalExitUnlocked = false;

        // Remove a chave temporariamente.
        this.temChave = false;

        // Limpa texto de interação.
        this.setInteractionText('');

        // Mostra mensagem principal.
        this.showTemporaryMessage(
            'Parabéns, recuperaste os cristais de Valdoria!',
            3200
        );

        // Depois da primeira mensagem.
        this.time.delayedCall(3300, () => {

            // Marca mensagem como terminada.
            this.mensagemCristaisAtiva = false;

            // Agora sim desbloqueia a saída
            this.finalExitUnlocked = true;

            // Dá a chave final.
            this.temChave = true;

            // Mostra mensagem de saída desbloqueada.
            this.showTemporaryMessage(
                'A porta de saída foi desbloqueada! Vai até à porta.',
                2600
            );
        });
    }

    // Secção do update.

    // Função chamada a cada frame.
    update() {

        // Se o nível terminou, houve Game Over ou a cena está a mudar, não faz nada.
        if (this.levelFinished || this.gameOverStarted || this.isChangingScene) {
            return;
        }

        // Secção da pausa.

        // Se carregar ESC e puder pausar.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyESC) &&
            !this.levelIntroActive &&
            !this.gameOverStarted &&
            !this.shopOpen
        ) {

            // Pausa o nível final.
            this.scene.pause();

            // Abre a PauseScene.
            this.scene.launch('PauseScene', {
                levelScene: 'LevelFinal'
            });

            // Para o update.
            return;
        }

        // Secção da intro do nível.

        // Se a intro ainda estiver ativa.
        if (this.levelIntroActive) {

            // Se existir sistema de intro.
            if (this.levelIntroSystem) {

                // Atualiza a intro.
                this.levelIntroSystem.update();
            }

            // Para o update enquanto a intro está ativa.
            return;
        }

        // Secção do Game Over.

        // Se existir sistema de Game Over.
        if (this.gameOverSystem) {

            // Atualiza o Game Over.
            this.gameOverSystem.update();
        }

        // Se o Game Over começou.
        if (
            this.gameOverStarted ||
            this.gameOverSystem?.started
        ) {

            // Para o update.
            return;
        }

        // Secção da loja aberta.

        // Se a loja estiver aberta.
        if (this.shopOpen) {

            // Não deixa o resto do nível atualizar.
            return;
        }

        // Secção do revive.

        // Se existir sistema de revive.
        if (this.reviveSystem) {

            // Atualiza o revive.
            this.reviveSystem.update();
        }

        // Secção da entrada do boss, baú e porta final.

        // Atualiza a entrada do boss.
        const bossEntranceHandled = this.updateBossEntranceAuto
            ? this.updateBossEntranceAuto()
            : false;

        // Atualiza a interação do baú final.
        const finalChestHandled = this.updateFinalChestInteraction
            ? this.updateFinalChestInteraction()
            : false;

        // Atualiza a interação da porta de saída.
        const exitDoorHandled = this.updateExitDoorInteraction
            ? this.updateExitDoorInteraction()
            : false;

        // A porta de saída, baú final e entrada do boss têm prioridade sobre perigo/interação normal
        if (!bossEntranceHandled && !finalChestHandled && !exitDoorHandled) {

            // Atualiza aviso dos buracos.
            const dangerHandled = this.updateBuracoWarning
                ? this.updateBuracoWarning()
                : false;

            // Se nenhum perigo foi tratado e existir sistema de interação.
            if (!dangerHandled && this.interactionSystem) {

                // Atualiza interações normais.
                this.interactionSystem.update();
            }
        }

        // Secção da porta do boss e buracos.

        // Atualiza o fecho da porta do boss.
        if (this.updateCloseBossDoor) {
            this.updateCloseBossDoor();
        }

        // Atualiza dano dos buracos.
        if (this.updateBuracosDamage) {
            this.updateBuracosDamage();
        }

        // Atualiza novamente o Game Over.
        if (this.gameOverSystem) {
            this.gameOverSystem.update();
        }

        // Se o Game Over começou depois dos danos.
        if (
            this.gameOverStarted ||
            this.gameOverSystem?.started
        ) {

            // Para o update.
            return;
        }

        // Secção do movimento dos players.

        // Se o Player 1 existir e estiver vivo.
        if (this.player1 && !this.player1.isDead) {

            // Atualiza o movimento do Player 1.
            this.player1.updateMovement(this.cursors);
        }

        // Se o Player 2 existir e estiver vivo.
        if (this.player2 && !this.player2.isDead) {

            // Atualiza o movimento do Player 2.
            this.player2.updateMovementKeys(this.keysWASD);
        }

        // Secção da distância entre players.

        // Se existir sistema de distância.
        if (this.playerDistanceSystem) {

            // Atualiza a distância entre jogadores.
            this.playerDistanceSystem.update();
        }

        // Secção dos ataques / inventário.

        // Se existir sistema de ataques.
        if (this.attackSystem) {

            // Atualiza ataques.
            this.attackSystem.handleAttacks();
        }

        // Se existir sistema de inventário.
        if (this.inventorySystem) {

            // Atualiza input do inventário.
            this.inventorySystem.handleInventoryInput();
        }

        // Secção dos itens / inimigos / perigo.

        // Se existir sistema de itens.
        if (this.itemSystem) {

            // Atualiza efeito do íman.
            this.itemSystem.updateMagnet();
        }

        // Se existir sistema de inimigos.
        if (this.enemySystem) {

            // Atualiza inimigos.
            this.enemySystem.update();
        }

        // Se existir sistema de perigo.
        if (this.dangerZoneSystem) {

            // Faz os inimigos evitarem zonas perigosas.
            this.dangerZoneSystem.avoidDangerZonesForEnemies();
        }

        // Secção do boss.

        // Se existir função de verificar morte do boss.
        if (this.checkBossDeath) {

            // Verifica se o boss morreu.
            this.checkBossDeath();
        }

        // Secção da câmara.

        // Se existir sistema de câmara.
        if (this.cameraSystem) {

            // Atualiza a câmara.
            this.cameraSystem.update();
        }
    }

    // Secção do texto.

    // Define o texto de interação normal.
    setInteractionText(text) {

        // Garante texto seguro.
        const safeText = text ? String(text) : '';

        // Se o nível terminou, está a trocar de cena ou houve Game Over.
        if (this.levelFinished || this.isChangingScene || this.gameOverStarted) {
            return;
        }

        // Enquanto houver mensagem temporária, NÃO deixamos ninguém apagar
        // nem substituir o texto normal.
        // Só a forceInteractionText() pode passar por cima disto.
        if (this.interactionTextLocked) {
            return;
        }

        // Vai buscar a cena do HUD.
        const hud = this.scene.get('LevelHUDScene');

        // Se o HUD estiver ativo e tiver texto de interação.
        if (
            this.scene.isActive('LevelHUDScene') &&
            hud &&
            hud.setInteractionText &&
            hud.interactionText &&
            hud.interactionText.scene
        ) {

            // Define o texto no HUD.
            hud.setInteractionText(safeText, true);

            // Termina a função.
            return;
        }

        // Se não existir texto local, não faz nada.
        if (!this.textoInteracao || !this.textoInteracao.scene) return;

        // Se o texto estiver vazio.
        if (safeText.trim() === '') {

            // Limpa o texto.
            this.textoInteracao.setText('');

            // Esconde o texto.
            this.textoInteracao.setVisible(false);

            // Termina a função.
            return;
        }

        // Atualiza texto local.
        this.textoInteracao
            .setText(safeText)
            .setVisible(true)
            .setAlpha(1);

        // Se puder mudar cor.
        if (this.textoInteracao.setColor) {

            // Define cor branca.
            this.textoInteracao.setColor('#ffffff');
        }
    }

    // Força o texto de interação mesmo com bloqueio temporário.
    forceInteractionText(text) {

        // Garante texto seguro.
        const safeText = text ? String(text) : '';

        // Vai buscar a cena do HUD.
        const hud = this.scene.get('LevelHUDScene');

        // Se o HUD estiver ativo e válido.
        if (
            this.scene.isActive('LevelHUDScene') &&
            hud &&
            hud.setInteractionText &&
            hud.interactionText &&
            hud.interactionText.scene
        ) {

            // Define o texto no HUD.
            hud.setInteractionText(safeText);

            // Termina a função.
            return;
        }

        // Se não houver texto local válido, não faz nada.
        if (!this.textoInteracao || !this.textoInteracao.scene) return;

        // Se o texto estiver vazio.
        if (safeText.trim() === '') {

            // Limpa o texto.
            this.textoInteracao.setText('');

            // Esconde o texto.
            this.textoInteracao.setVisible(false);

            // Termina a função.
            return;
        }

        // Atualiza texto local.
        this.textoInteracao
            .setText(safeText)
            .setVisible(true)
            .setAlpha(1);
    }

    // Mostra uma mensagem temporária no HUD.
    showTemporaryMessage(text, duration = 2800) {

        // Se não houver texto, não faz nada.
        if (!text) return;

        // Garante que a mensagem é string.
        const message = String(text);

        // Bloqueia substituição de texto normal.
        this.interactionTextLocked = true;

        // Se já existir timer de mensagem.
        if (this.messageTimer) {

            // Remove o timer anterior.
            this.messageTimer.remove(false);

            // Limpa a referência.
            this.messageTimer = null;
        }

        // Vai buscar a cena do HUD.
        const hud = this.scene.get('LevelHUDScene');

        // Se o HUD estiver ativo e válido.
        if (
            this.scene.isActive('LevelHUDScene') &&
            hud &&
            hud.setInteractionText &&
            hud.interactionText &&
            hud.interactionText.scene
        ) {

            // Mostra a mensagem no HUD.
            hud.setInteractionText(message, true);

            // Cria timer para remover a mensagem.
            this.messageTimer = this.time.delayedCall(duration, () => {

                // Liberta o bloqueio do texto.
                this.interactionTextLocked = false;

                // Se a mensagem atual ainda for a mesma.
                if (
                    this.scene.isActive('LevelHUDScene') &&
                    hud &&
                    hud.setInteractionText &&
                    hud.interactionText &&
                    hud.interactionText.scene &&
                    hud.interactionText.text === message
                ) {

                    // Limpa o texto no HUD.
                    hud.setInteractionText('', true);
                }

                // Limpa o timer.
                this.messageTimer = null;
            });

            // Termina a função.
            return;
        }

        // Se não existir texto local.
        if (!this.textoInteracao || !this.textoInteracao.scene) {

            // Liberta o bloqueio.
            this.interactionTextLocked = false;

            // Termina a função.
            return;
        }

        // Mostra mensagem no texto local.
        this.textoInteracao
            .setText(message)
            .setVisible(true)
            .setAlpha(1);

        // Cria timer para limpar mensagem local.
        this.messageTimer = this.time.delayedCall(duration, () => {

            // Liberta o bloqueio.
            this.interactionTextLocked = false;

            // Se o texto local ainda for a mesma mensagem.
            if (
                this.textoInteracao &&
                this.textoInteracao.scene &&
                this.textoInteracao.text === message
            ) {

                // Limpa o texto.
                this.textoInteracao.setText('');

                // Esconde o texto.
                this.textoInteracao.setVisible(false);
            }

            // Limpa referência do timer.
            this.messageTimer = null;
        });
    }

    // Atualiza o aviso visual de buraco próximo.
    updateBuracoWarning() {

        // Se não existir layer dos buracos, não faz nada.
        if (!this.buracosLayer) return false;

        // Se intro, Game Over ou fim do nível estiver ativo, não faz nada.
        if (this.levelIntroActive || this.gameOverStarted || this.levelFinished) return false;

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Percorre os jogadores.
        for (const player of players) {

            // Se o jogador estiver perto de um buraco.
            if (this.isPlayerNearBuraco(player, 45)) {

                // Mostra aviso de perigo.
                this.setInteractionText('Perigo: Buraco');

                // Indica que tratou o aviso.
                return true;
            }
        }

        // Indica que não há aviso.
        return false;
    }

    // Verifica se um jogador está perto de buraco.
    isPlayerNearBuraco(player, warningDistance = 45) {

        // Se faltar jogador, layer ou mapa, devolve false.
        if (!player || !this.buracosLayer || !this.map) return false;

        // Guarda largura do tile.
        const tileW = this.map.tileWidth;

        // Guarda altura do tile.
        const tileH = this.map.tileHeight;

        // Converte X do jogador para coordenada de tile.
        const playerTileX = this.buracosLayer.worldToTileX(player.x);

        // Converte Y do jogador para coordenada de tile.
        const playerTileY = this.buracosLayer.worldToTileY(player.y);

        // Calcula raio horizontal de procura.
        const radiusX = Math.ceil(warningDistance / tileW);

        // Calcula raio vertical de procura.
        const radiusY = Math.ceil(warningDistance / tileH);

        // Percorre tiles à volta do jogador em Y.
        for (let ty = playerTileY - radiusY; ty <= playerTileY + radiusY; ty++) {

            // Percorre tiles à volta do jogador em X.
            for (let tx = playerTileX - radiusX; tx <= playerTileX + radiusX; tx++) {

                // Vai buscar o tile de buraco.
                const tile = this.buracosLayer.getTileAt(tx, ty);

                // Ignora tiles vazios.
                if (!tile || tile.index === -1) continue;

                // Calcula o centro X do tile.
                const tileCenterX = tile.getCenterX();

                // Calcula o centro Y do tile.
                const tileCenterY = tile.getCenterY();

                // Calcula distância entre jogador e centro do tile.
                const distance = Phaser.Math.Distance.Between(
                    player.x,
                    player.y,
                    tileCenterX,
                    tileCenterY
                );

                // Se estiver dentro da distância de aviso.
                if (distance <= warningDistance) {

                    // Indica que o jogador está perto.
                    return true;
                }
            }
        }

        // Indica que não está perto.
        return false;
    }

    // Atualiza dano dos buracos nos jogadores.
    updateBuracosDamage() {

        // Verifica dano no Player 1.
        this.checkPlayerHoleDamage(this.player1);

        // Se existir Player 2.
        if (this.player2) {

            // Verifica dano no Player 2.
            this.checkPlayerHoleDamage(this.player2);
        }
    }

    // Verifica se um jogador caiu num buraco.
    checkPlayerHoleDamage(player) {

        // Se o jogador não existir ou estiver morto, não faz nada.
        if (!player || player.isDead) return;

        // Se não existir layer dos buracos, não faz nada.
        if (!this.buracosLayer) return;

        // Vai buscar o tile na posição do jogador.
        const tile = this.buracosLayer.getTileAtWorldXY(player.x, player.y);

        // Se não houver tile de buraco, não faz nada.
        if (!tile || tile.index === -1) return;

        // Dá dano fatal ao jogador.
        this.damagePlayer(player, 9999);
    }

    // Secção de compatibilidade.

    // Verifica se existe ponte numa posição do mundo.
    isBridgeTileAtWorldXY(x, y) {

        // Usa o DangerZoneSystem ou devolve false.
        return this.dangerZoneSystem?.isBridgeTileAtWorldXY(x, y) ?? false;
    }

    // Verifica se existe zona perigosa numa posição do mundo.
    isDangerTileAtWorldXY(x, y) {

        // Usa o DangerZoneSystem ou devolve false.
        return this.dangerZoneSystem?.isDangerTileAtWorldXY(x, y) ?? false;
    }

    // Aplica dano a um jogador.
    damagePlayer(player, dmg) {

        // Se não existir sistema de vida, não faz nada.
        if (!this.playerHealthSystem) return;

        // Usa o sistema de vida para aplicar dano.
        this.playerHealthSystem.damagePlayer(player, dmg);
    }

    // Cria um inimigo antes da porta do boss.
    spawnEnemyBeforeBossDoor(enemyKey) {

        // Cria inimigo numa posição aleatória.
        const enemy = this.enemySystem.spawnRandom(enemyKey);

        // Se não criar inimigo, não faz nada.
        if (!enemy) return;

        // Marca que este inimigo não é boss.
        enemy.isBoss = false;

        // Vai buscar uma posição válida antes da porta do boss.
        const pos = this.getRandomPositionBeforeBossDoor();

        // Se encontrou posição.
        if (pos) {

            // Move o inimigo para essa posição.
            enemy.setPosition(pos.x, pos.y);

            // Se o inimigo tiver corpo físico.
            if (enemy.body) {

                // Atualiza o corpo físico para a nova posição.
                enemy.body.reset(pos.x, pos.y);
            }
        }

        // Define a profundidade do inimigo.
        enemy.setDepth(20);

        // Devolve o inimigo.
        return enemy;
    }

    // Procura uma posição válida para inimigo antes da porta do boss.
    getRandomPositionBeforeBossDoor() {

        // Define máximo de tentativas.
        const maxTries = 120;

        // Define limite X mínimo.
        const minX = 60;

        // Define limite X máximo.
        const maxX = this.map.widthInPixels - 60;

        // Define limite Y mínimo.
        let minY = 60;

        // Define limite Y máximo.
        let maxY = this.map.heightInPixels - 60;

        // Se existir entrada do boss.
        if (this.bossEntranceZone) {

            // Obriga inimigos a nascerem abaixo da entrada.
            minY = this.bossEntranceZone.y + 45;
        }

        // Tenta várias posições.
        for (let i = 0; i < maxTries; i++) {

            // Sorteia X.
            const x = Phaser.Math.Between(minX, maxX);

            // Sorteia Y.
            const y = Phaser.Math.Between(minY, maxY);

            // Se a posição não for válida, tenta outra.
            if (!this.isValidEnemySpawnBeforeBoss(x, y)) continue;

            // Devolve posição válida.
            return { x, y };
        }

        // Devolve posição fallback.
        return {
            x: 180,
            y: this.map.heightInPixels - 180
        };
    }

    // Verifica se a posição é válida para inimigo.
    isValidEnemySpawnBeforeBoss(x, y) {

        // Se não houver chão, não é válido.
        if (!this.groundLayer) return false;

        // Vai buscar tile de chão.
        const groundTile = this.groundLayer.getTileAtWorldXY(x, y);

        // Se não houver chão, não é válido.
        if (!groundTile || groundTile.index === -1) return false;

        // Se existir layer de buracos.
        if (this.buracosLayer) {

            // Vai buscar tile de buraco.
            const holeTile = this.buracosLayer.getTileAtWorldXY(x, y);

            // Se houver buraco, não é válido.
            if (holeTile && holeTile.index !== -1) return false;
        }

        // Se existir primeira layer de parede.
        if (this.paredeLayer) {

            // Vai buscar tile de parede.
            const wallTile = this.paredeLayer.getTileAtWorldXY(x, y);

            // Se houver parede, não é válido.
            if (wallTile && wallTile.index !== -1) return false;
        }

        // Se existir segunda layer de parede.
        if (this.parede2Layer) {

            // Vai buscar tile de parede 2.
            const wall2Tile = this.parede2Layer.getTileAtWorldXY(x, y);

            // Se houver parede, não é válido.
            if (wall2Tile && wall2Tile.index !== -1) return false;
        }

        // Não deixa nascer na sala do boss.
        if (this.bossEntranceZone && y < this.bossEntranceZone.y + 35) {
            return false;
        }

        // Se passou todos os testes, é válido.
        return true;
    }

    // Guarda paredes invisíveis que estão na entrada do boss.
    collectBossEntranceWalls() {

        // Se não existir zona da entrada, não faz nada.
        if (!this.bossEntranceZone) return;

        // Limpa a lista de paredes da entrada.
        this.bossEntranceWalls = [];

        // Percorre todas as paredes invisíveis.
        this.paredesInvisiveis.getChildren().forEach(wall => {

            // Verifica se a parede cruza a zona da entrada.
            const overlap = Phaser.Geom.Intersects.RectangleToRectangle(
                wall.getBounds(),
                this.bossEntranceZone.getBounds()
            );

            // Se houver sobreposição.
            if (overlap) {

                // Guarda a parede.
                this.bossEntranceWalls.push(wall);
            }
        });

        // Mostra quantidade encontrada na consola.
        console.log('Paredes da entrada do boss encontradas:', this.bossEntranceWalls.length);
    }

    // Abre a loja de bónus.
    openBonusShop() {

        // Se a loja já estiver aberta, não faz nada.
        if (this.shopOpen) return;

        // Marca a loja como aberta.
        this.shopOpen = true;

        // Limpa texto de interação.
        this.setInteractionText('');

        // Pausa a cena atual.
        this.scene.pause(this.sys.settings.key);

        // Lança a cena da loja.
        this.scene.launch('BonusShopScene', {
            levelSceneKey: this.sys.settings.key,
            mode: this.gameMode
        });

        // Coloca a loja por cima.
        this.scene.bringToTop('BonusShopScene');
    }

    // Restaura os dados do nível para o início.
    restoreLevelStartState() {

        // Secção de restaurar heróis.

        // Vai buscar dados iniciais do Player 1.
        const p1Start = this.registry.get('player1HeroAtLevelStart');

        // Vai buscar dados iniciais do Player 2.
        const p2Start = this.registry.get('player2HeroAtLevelStart');

        // Se existirem dados iniciais do Player 1.
        if (p1Start) {

            // Clona os dados do Player 1.
            const p1Clone = this.cloneData(p1Start);

            // Registry

            // Guarda o Player 1 no registry.
            this.registry.set('player1Hero', p1Clone);

            // Dados do nível

            // Atualiza os dados do nível.
            this.p1Data = this.cloneData(p1Clone);

            // Player atual, caso ainda exista antes do restart

            // Se o Player 1 ainda existir.
            if (this.player1 && this.player1.personagem) {

                // Restaura dados do personagem.
                this.player1.personagem = this.cloneData(p1Clone);

                // Restaura vida máxima.
                this.player1.vidaMax = p1Clone.vidaMax;

                // Restaura vida atual.
                this.player1.vidaAtual = p1Clone.vidaAtual;

                // Se a velocidade for número.
                if (typeof p1Clone.speed === 'number') {

                    // Restaura velocidade real do Player.
                    this.player1.speed = p1Clone.speed * 15;
                }

                // Marca o Player 1 como vivo.
                this.player1.isDead = false;

                // Limpa estado de ataque.
                this.player1.isAttacking = false;

                // Limpa estado de dano.
                this.player1.isHurting = false;

                // Limpa estado de defesa.
                this.player1.isBlocking = false;

                // Liberta animação bloqueada.
                this.player1.lockAnim = false;
            }
        }

        // Se existirem dados iniciais do Player 2.
        if (p2Start) {

            // Clona os dados do Player 2.
            const p2Clone = this.cloneData(p2Start);

            // Registry

            // Guarda o Player 2 no registry.
            this.registry.set('player2Hero', p2Clone);

            // Dados do nível

            // Atualiza os dados do Player 2 no nível.
            this.p2Data = this.cloneData(p2Clone);

            // Player atual, caso ainda exista antes do restart

            // Se o Player 2 ainda existir.
            if (this.player2 && this.player2.personagem) {

                // Restaura dados do personagem.
                this.player2.personagem = this.cloneData(p2Clone);

                // Restaura vida máxima.
                this.player2.vidaMax = p2Clone.vidaMax;

                // Restaura vida atual.
                this.player2.vidaAtual = p2Clone.vidaAtual;

                // Se a velocidade for número.
                if (typeof p2Clone.speed === 'number') {

                    // Restaura velocidade real do Player.
                    this.player2.speed = p2Clone.speed * 15;
                }

                // Marca o Player 2 como vivo.
                this.player2.isDead = false;

                // Limpa estado de ataque.
                this.player2.isAttacking = false;

                // Limpa estado de dano.
                this.player2.isHurting = false;

                // Limpa estado de defesa.
                this.player2.isBlocking = false;

                // Liberta animação bloqueada.
                this.player2.lockAnim = false;
            }
        }

        // Secção de restaurar moedas.

        // Vai buscar moedas iniciais.
        const coinsStart = this.registry.get('coinsAtLevelStart');

        // Se existirem moedas iniciais.
        if (coinsStart) {

            // Restaura moedas no nível.
            this.coins = {
                p1: coinsStart.p1 || 0,
                p2: coinsStart.p2 || 0
            };

            // Guarda moedas restauradas no registry.
            this.registry.set('coins', {
                p1: this.coins.p1,
                p2: this.coins.p2
            });
        }

        // Secção de restaurar score do nível.

        // Restaura score do nível.
        this.registry.set(
            'levelScore',
            this.registry.get('levelScoreAtLevelStart') || 0
        );

        // Vai buscar breakdown inicial.
        const breakdownStart = this.registry.get('scoreBreakdownAtLevelStart');

        // Se existir breakdown inicial.
        if (breakdownStart) {

            // Restaura breakdown.
            this.registry.set('scoreBreakdown', this.cloneData(breakdownStart));
        }

        // Vai buscar estatísticas iniciais.
        const statsStart = this.registry.get('scoreStatsAtLevelStart');

        // Se existirem estatísticas iniciais.
        if (statsStart) {

            // Restaura estatísticas.
            this.registry.set('scoreStats', this.cloneData(statsStart));
        }
    }

    // Termina o nível final.
    finishLevel() {

        // Se o nível já terminou, não faz nada.
        if (this.levelFinished) return;

        // Marca o nível como terminado.
        this.levelFinished = true;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Bloqueia controlo dos jogadores.
        this.canControlPlayers = false;

        // Limpa texto de interação.
        this.setInteractionText('');

        // Secção de parar timer.

        // Se existir temporizador.
        if (this.levelTimerSystem) {

            // Para o temporizador.
            this.levelTimerSystem.stop();
        }

        // Secção de dar score de fim do nível.

        // Se existir sistema de score.
        if (this.scoreSystem) {

            // Dá score de conclusão do nível.
            this.scoreSystem.finishLevel();
        }

        // Secção de guardar moedas.

        // Se existirem moedas.
        if (this.coins) {

            // Guarda moedas no registry.
            this.registry.set('coins', this.coins);
        }

        // Secção de somar score final ao total.

        // Vai buscar score do nível final.
        const finalLevelScore = this.registry.get('levelScore') || 0;

        // Total que veio dos níveis anteriores
        const previousTotal =
            this.registry.get('totalScoreP1') ||
            this.registry.get('totalScore') ||
            0;

        // Soma dos 3 níveis
        const campaignTotalScore = previousTotal + finalLevelScore;

        // Guarda score total da campanha.
        this.registry.set('campaignTotalScore', campaignTotalScore);

        // Guarda score total genérico.
        this.registry.set('totalScore', campaignTotalScore);

        // Guarda score total do Player 1.
        this.registry.set('totalScoreP1', campaignTotalScore);

        // Se estiver em multiplayer.
        if (this.gameMode === 'multi') {

            // Guarda score total do Player 2.
            this.registry.set('totalScoreP2', campaignTotalScore);
        }

        // Secção de guardar nomes e modo.

        // Guarda o modo de jogo.
        this.registry.set('gameMode', this.gameMode || 'single');

        // Secção de fechar HUD.

        // Se o HUD estiver ativo.
        if (this.scene.isActive('LevelHUDScene')) {

            // Para o HUD.
            this.scene.stop('LevelHUDScene');
        }

        

        // Secção de ir para a cena final.

        // Faz fade out.
        this.cameras.main.fadeOut(600, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Se a FinalVictoryScene não estiver registada.
                if (!this.scene.manager.keys['FinalVictoryScene']) {

                    // Mostra erro na consola.
                    console.error('FinalVictoryScene não está registada no game.js');

                    // Vai para a VictoryScene normal como fallback.
                    this.scene.start('VictoryScene', {
                        levelKey: this.sys.settings.key,
                        nextLevel: null,
                        mode: this.gameMode || 'single'
                    });

                    // Para a função.
                    return;
                }

                // Inicia a cena de vitória final.
                this.scene.start('FinalVictoryScene', {
                    levelKey: this.sys.settings.key,
                    mode: this.gameMode || 'single',
                    totalScore: this.registry.get('campaignTotalScore') || 0
                });
            }
        );
    }

    // Cria uma cópia profunda dos dados recebidos.
    cloneData(data) {

        // Se não houver dados, devolve null.
        if (!data) return null;

        // Converte para JSON e volta a objeto para criar uma cópia independente.
        return JSON.parse(JSON.stringify(data));
    }
}