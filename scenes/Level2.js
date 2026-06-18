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

// Importa o sistema de interação com baús, portas e textos.
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

// Importa o sistema da introdução do nível.
import LevelIntroSystem from '../systems/LevelIntroSystem.js';

// Importa o sistema de vida e dano dos jogadores.
import PlayerHealthSystem from '../systems/PlayerHealthSystem.js';

// Importa o sistema de música.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe Level2, responsável pelo segundo nível do jogo.
export default class Level2 extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "Level2".
        super('Level2');
    }

    // Função chamada quando a cena inicia.
    init() {

        // Vai buscar os dados do Player 1 guardados no registry ou usa valores padrão.
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

        // Guarda o objeto próximo do Player 1.
        this.objetoProximoP1 = null;

        // Guarda o objeto próximo do Player 2.
        this.objetoProximoP2 = null;

        // Controla se o Game Over já começou.
        this.gameOverStarted = false;

        // Indica se a introdução do nível está ativa.
        this.levelIntroActive = true;

        // Controla se os jogadores podem ser controlados.
        this.canControlPlayers = false;

        // Cria os inventários dos jogadores.
        this.inventories = {
            p1: [],
            p2: []
        };

        // Vai buscar as moedas guardadas ou começa com 0.
        this.coins = this.registry.get('coins') || {
            p1: 0,
            p2: 0
        };

        // Guarda se o íman está ativo para cada jogador.
        this.magnet = {
            p1: false,
            p2: false
        };

        // Guarda a configuração dos ataques.
        this.attackConfig = ATTACK_CONFIG;

        // Guarda a configuração do Level2.
        this.levelConfig = LEVEL_CONFIG.Level2;

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

        // Guarda os cooldowns dos ataques.
        this.attackCooldowns = {

            // Cooldowns do Player 1.
            p1: {
                atk1: 0,
                atk2: 0,
                atk3: 0,
                block: 0
            },

            // Cooldowns do Player 2.
            p2: {
                atk1: 0,
                atk2: 0,
                atk3: 0,
                block: 0
            }
        };
    }

    // Preload vazio porque os recursos já são carregados no BootScene.
    preload() {}

    // Função chamada quando a cena é criada.
    create() {

        // Faz fade in ao entrar no nível.
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Toca a música do nível 2.
        MusicSystem.play(this, 'music_level2', {

            // Define o volume.
            volume: 0.35,

            // Faz a música repetir.
            loop: true,

            // Define o fade da música.
            fade: 2200
        });

        // Guarda os dados do Player 1 no início do nível.
        this.registry.set(
            'player1HeroAtLevelStart',
            this.cloneData(this.p1Data)
        );

        // Guarda os dados do Player 2 no início do nível.
        this.registry.set(
            'player2HeroAtLevelStart',
            this.cloneData(this.p2Data)
        );

        // Guarda dados do início do nível.

        // Guarda as moedas no início do nível.
        this.registry.set('coinsAtLevelStart', {
            p1: this.coins.p1 || 0,
            p2: this.coins.p2 || 0
        });

        // Guarda o score do nível no início.
        this.registry.set('levelScoreAtLevelStart', this.registry.get('levelScore') || 0);

        // Guarda o breakdown do score no início do nível.
        this.registry.set('scoreBreakdownAtLevelStart', {
            ...(this.registry.get('scoreBreakdown') || {
                items: 0,
                enemies: 0,
                finishLevel: 0,
                timeBonus: 0,
                noDamageBonus: 0
            })
        });

        // Guarda as estatísticas do score no início do nível.
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


        // Evento chamado quando esta cena é encerrada.
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {

            // Para a cena do HUD.
            this.scene.stop('LevelHUDScene');

            // Se existir sistema de temporizador, destrói-o.
            if (this.levelTimerSystem) {
                this.levelTimerSystem.destroy();
            }

            // Se existir sistema de câmara, destrói-o.
            if (this.cameraSystem) {
                this.cameraSystem.destroy();
            }

            // Se existir sistema de distância entre jogadores, destrói-o.
            if (this.playerDistanceSystem) {
                this.playerDistanceSystem.destroy();
            }

            // Se existir sistema da introdução, destrói-o.
            if (this.levelIntroSystem) {
                this.levelIntroSystem.destroy();
            }

        });

        // Secção do mapa.

        // Cria o tilemap usando a key definida no LevelConfig.
        this.map = this.make.tilemap({
            key: this.levelConfig.mapKey
        });

        // Secção dos tilesets.
        // Os spikes não são colocados como tilesets.
        // Neste nível, os spikes são objetos do Tiled.

        // Adiciona o tileset principal das catacumbas.
        const mainTiles = this.map.addTilesetImage(
            'mainlevbuild',
            'mainLevBuildTiles'
        );

        // Adiciona o tileset decorativo das catacumbas.
        const decorativeTiles = this.map.addTilesetImage(
            'decorativeCat',
            'decorativeCatTiles'
        );

        // Adiciona o tileset freelavatileset-Sheet.
        const lavaTiles = this.map.addTilesetImage(
            'freelavatileset-Sheet',
            'lavaTiles'
        );

        // Guarda os tilesets válidos numa lista.
        const tilesets = [
            mainTiles,
            decorativeTiles,
            lavaTiles
        ].filter(Boolean);

        // Secção das layers.

        // Cria a layer preta do mapa.
        this.pretoLayer = this.map.createLayer('Preto', tilesets, 0, 0);

        // Se a layer existir, coloca-a atrás de tudo.
        if (this.pretoLayer) {
            this.pretoLayer.setDepth(-2);
        }

        // Cria a layer do chão.
        this.groundLayer = this.map.createLayer('Ground', tilesets, 0, 0);

        // Se a layer existir, coloca-a na profundidade 0.
        if (this.groundLayer) {
            this.groundLayer.setDepth(0);
        }

        // Cria a layer Ground3.
        this.ground3Layer = this.map.createLayer('Ground3', tilesets, 0, 0);

        // Se a layer existir, define a sua profundidade.
        if (this.ground3Layer) {
            this.ground3Layer.setDepth(2);
        }

        // Cria a layer das paredes.
        this.paredeLayer = this.map.createLayer('Parede', tilesets, 0, 0);

        // Se a layer existir, define profundidade e colisão.
        if (this.paredeLayer) {
            this.paredeLayer.setDepth(4);
            this.paredeLayer.setCollisionByExclusion([-1]);
        }

        // Cria a layer de decoração.
        this.decLayer = this.map.createLayer('Decoracao', tilesets, 0, 0);

        // Se a decoração existir, coloca-a por cima.
        if (this.decLayer) {
            this.decLayer.setDepth(21);
            this.decLayer.setAlpha(1);
        }

        // Secção de compatibilidade.

        // Mantém a referência waterLayer como null para sistemas que possam verificar esta variável.
        this.waterLayer = null;

        // Mantém a referência ponteLayer como null para sistemas que possam verificar esta variável.
        this.ponteLayer = null;

        // Alguns sistemas usam ground2Layer para validar spawn.
        // Como já não existe Ground2, usamos o chão normal.
        this.ground2Layer = this.groundLayer;

        // Secção dos grupos.

        // Cria o grupo físico dos inimigos.
        this.enemies = this.physics.add.group();

        // Cria o grupo físico dos itens.
        this.itemsGroup = this.physics.add.group();

        // Cria o grupo estático dos objetos interativos.
        this.interativosGroup = this.physics.add.staticGroup();

        // Cria o grupo das saídas.
        this.saidaGroup = this.add.group();

        // Cria o grupo das paredes invisíveis.
        this.paredesInvisiveis = this.physics.add.staticGroup();

        // Grupo dos espinhos.

        // Cria o grupo estático dos spikes.
        this.spikesGroup = this.physics.add.staticGroup();

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

        // Cria o sistema do temporizador do nível.
        this.levelTimerSystem = new LevelTimerSystem(this, {

            // Define o tempo máximo do nível.
            maxTime: this.levelConfig.time
        });

        // Cria o sistema da introdução do nível.
        this.levelIntroSystem = new LevelIntroSystem(this, {

            // Copia os dados da intro definidos no LevelConfig.
            ...this.levelConfig.intro,

            // Passa a key da cena atual.
            levelKey: this.sys.settings.key
        });

        // Secção dos controlos.

        // Cria as setas do teclado para o Player 1.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Cria a tecla ESC.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Cria a tecla E para interação.
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


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

        // Cria as teclas do inventário do Player 1.
        this.invKeysP1 = this.input.keyboard.addKeys({
            s7: Phaser.Input.Keyboard.KeyCodes.SEVEN,
            s8: Phaser.Input.Keyboard.KeyCodes.EIGHT,
            s9: Phaser.Input.Keyboard.KeyCodes.NINE,
            s0: Phaser.Input.Keyboard.KeyCodes.ZERO
        });

        // Cria as teclas do inventário do Player 2.
        this.invKeysP2 = this.input.keyboard.addKeys({
            s1: Phaser.Input.Keyboard.KeyCodes.ONE,
            s2: Phaser.Input.Keyboard.KeyCodes.TWO,
            s3: Phaser.Input.Keyboard.KeyCodes.THREE,
            s4: Phaser.Input.Keyboard.KeyCodes.FOUR
        });

        // Cria o sistema de inventário.
        this.inventorySystem = new InventorySystem(this);

        // Cria a animação dos spikes.
        this.createSpikeAnimation();

        // O texto real é criado pela LevelHUDScene.

        // Guarda a referência do texto de interação.
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

        // Percorre todos os objetos da layer Eventos, se existir.
        objectLayer?.objects.forEach(obj => {

            // Se o objeto for um spike.
            if (obj.name === 'spike' || obj.type === 'spike') {

                // Cria o spike no jogo.
                this.createSpike(obj);
            }

            // Secção da parede invisível.

            // Se o objeto for parede invisível.
            if (obj.name === 'ParedeInvisivel') {

                // Cria um retângulo na posição do objeto.
                const parede = this.add.rectangle(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );

                // Ativa física estática no retângulo.
                this.physics.add.existing(parede, true);

                // Adiciona ao grupo de paredes invisíveis.
                this.paredesInvisiveis.add(parede);

                // Esconde a parede invisível.
                parede.setVisible(false);
            }

            // Secção dos spawns.

            // Se o objeto for spawn do Player 1.
            if (obj.name === 'spawn_player') {

                // Guarda o X do spawn do Player 1.
                spawnX1 = obj.x;

                // Guarda o Y do spawn do Player 1.
                spawnY1 = obj.y;
            }

            // Se o objeto for spawn do Player 2.
            if (obj.name === 'spawn_player2') {

                // Guarda o X do spawn do Player 2.
                spawnX2 = obj.x;

                // Guarda o Y do spawn do Player 2.
                spawnY2 = obj.y;
            }

            // Secção do baú.

            // Se o objeto for um baú.
            if (obj.name === 'bau' || obj.name === 'bau_tesouro') {

                // Cria o baú como objeto interativo.
                const bau = this.interativosGroup.create(
                    obj.x,
                    obj.y,
                    'chest'
                );

                // Centra a origem do baú.
                bau.setOrigin(0.5);

                // Dá o nome "bau" ao baú.
                bau.setName('bau');

                // Marca o baú como fechado.
                bau.aberto = false;

                // Define a profundidade do baú.
                bau.setDepth(20);

                // Define o tamanho da hitbox.
                bau.body.setSize(32, 32);

                // Define o offset da hitbox.
                bau.body.setOffset(0, 0);

                // Atualiza o corpo físico.
                bau.refreshBody();

                // Define a distância de interação do baú.
                bau.interactionRange = 50;
            }

            // Secção da porta de saída.

            // Se o objeto for a porta de saída.
            if (obj.name === 'porta_saida') {

                // Cria uma zona invisível para a porta.
                const porta = this.add.zone(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );

                // Dá o nome "porta_saida" à zona.
                porta.setName('porta_saida');

                // Marca a porta como fechada.
                porta.aberto = false;

                // Define a distância de interação da porta.
                porta.interactionRange = 90;

                // Ativa física estática na porta.
                this.physics.add.existing(porta, true);

                // Adiciona a porta ao grupo de interativos.
                this.interativosGroup.add(porta);
            }
        });

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

        // Se existir layer de parede.
        if (this.paredeLayer) {

            // Adiciona colisão entre Player 1 e parede.
            this.physics.add.collider(this.player1, this.paredeLayer);
        }

        // Adiciona colisão entre Player 1 e paredes invisíveis.
        this.physics.add.collider(this.player1, this.paredesInvisiveis);

        // Se for modo multiplayer e existir Player 2.
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

            // Se existir layer de parede.
            if (this.paredeLayer) {

                // Adiciona colisão entre Player 2 e parede.
                this.physics.add.collider(this.player2, this.paredeLayer);
            }

            // Adiciona colisão entre Player 2 e paredes invisíveis.
            this.physics.add.collider(this.player2, this.paredesInvisiveis);
        }

        // Se for multiplayer e o Player 2 existir.
        if (this.gameMode === 'multi' && this.player2) {

            // Cria o sistema de distância entre jogadores.
            this.playerDistanceSystem = new PlayerDistanceSystem(this, {

                // Distância para aviso.
                warningDistance: 420,

                // Distância máxima antes da penalização.
                killDistance: 560
            });
        }

        // Adiciona overlaps entre jogadores e spikes.
        this.addSpikeOverlaps();

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

            // Define o zoom.
            zoom: 2,

            // Define a suavização do follow.
            followLerp: 0.05,

            // Define a suavização do alvo.
            targetLerp: 0.08
        });

        // Configura a câmara.
        this.cameraSystem.setup();

        // Secção dos inimigos.

        // Percorre os inimigos configurados para o nível.
        this.levelConfig.enemies.forEach(enemyKey => {

            // Cria o inimigo numa posição aleatória.
            this.enemySystem.spawnRandom(enemyKey);
        });

        // Percorre todos os inimigos criados.
        this.enemies.getChildren().forEach(enemy => {

            // Define a profundidade dos inimigos.
            enemy.setDepth(20);
        });

        // Se existir layer de parede.
        if (this.paredeLayer) {

            // Adiciona colisão entre inimigos e parede.
            this.physics.add.collider(this.enemies, this.paredeLayer, enemy => {

                // Chama reação do inimigo ao bater na parede.
                if (enemy.onWallHit) enemy.onWallHit();
            });
        }

        // Adiciona colisão entre inimigos e paredes invisíveis.
        this.physics.add.collider(this.enemies, this.paredesInvisiveis, enemy => {

            // Chama reação do inimigo ao bater na parede invisível.
            if (enemy.onWallHit) enemy.onWallHit();
        });

        // Secção dos itens.

        // Percorre os itens configurados para este nível.
        this.levelConfig.items.forEach(itemKey => {

            // Cria o item numa posição aleatória.
            this.itemSystem.spawnRandom(itemKey);
        });

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

        // Se o jogo estiver em modo multiplayer.
        if (this.gameMode === 'multi') {

            // Cria o sistema de revive.
            this.reviveSystem = new ReviveSystem(this);

            // Define os pontos de spawn dos jogadores.
            this.reviveSystem.setSpawnPoints(
                { x: spawnX1, y: spawnY1 },
                { x: spawnX2, y: spawnY2 }
            );
        }

        // A LevelIntroSystem lança o HUD quando carregas em Começar.

        // Cria a introdução do nível.
        this.levelIntroSystem.create();
    }

    // Cria a animação dos spikes.
    createSpikeAnimation() {

        // Se a animação já existir, não cria novamente.
        if (this.anims.exists('spike_anim')) return;

        // Lista com as texturas usadas na animação dos spikes.
        const frames = [
            'spike_0',
            'spike_1',
            'spike_2',
            'spike_3',
            'spike_4'
        ];

        // Verifica se todas as texturas dos spikes foram carregadas.
        const allLoaded = frames.every(key => this.textures.exists(key));

        // Se alguma textura não estiver carregada.
        if (!allLoaded) {

            // Mostra erro na consola.
            console.error('As texturas dos spikes não foram carregadas.');

            // Cancela a criação da animação.
            return;
        }

        // Cria a animação dos spikes.
        this.anims.create({

            // Define a key da animação.
            key: 'spike_anim',

            // Converte as keys das texturas em frames de animação.
            frames: frames.map(key => ({ key })),

            // Define a velocidade da animação.
            frameRate: 3, // MAIS LENTO

            // Repete infinitamente.
            repeat: -1
        });
    }

    // Cria um spike a partir de um objeto do Tiled.
    createSpike(obj) {

        // Se o grupo dos spikes não existir, não faz nada.
        if (!this.spikesGroup) return;

        // Se a textura base do spike não existir.
        if (!this.textures.exists('spike_0')) {

            // Mostra erro na consola.
            console.error('Textura spike_0 não existe. Verifica o BootScene.');

            // Cancela a criação.
            return;
        }

        // Calcula o X central do spike.
        const x = obj.x + (obj.width || 16) / 2;

        // Calcula o Y central do spike.
        const y = obj.y + (obj.height || 16) / 2;

        // Cria o spike no grupo estático.
        const spike = this.spikesGroup.create(x, y, 'spike_0');

        // Centra a origem do spike.
        spike.setOrigin(0.5);

        // Define a profundidade do spike.
        spike.setDepth(18);

        // Se a animação existir.
        if (this.anims.exists('spike_anim')) {

            // Toca a animação do spike.
            spike.play('spike_anim');
        }

        // Define o dano causado pelo spike.
        spike.damage = 15;

        // Define o cooldown de dano do spike.
        spike.damageCooldown = 900;

        // Guarda o momento do último dano causado.
        spike.lastDamageTime = 0;

        // Define a distância para aviso de perigo.
        spike.warningRange = 45;

        // Se o spike tiver corpo físico.
        if (spike.body) {

            // Define o tamanho da hitbox com base no objeto do Tiled.
            spike.body.setSize(obj.width || 16, obj.height || 16);

            // Define o offset da hitbox.
            spike.body.setOffset(0, 0);

            // Atualiza o corpo físico estático.
            spike.refreshBody();
        }
    }

    // Adiciona deteções de contacto entre jogadores e spikes.
    addSpikeOverlaps() {

        // Se o grupo dos spikes não existir, não faz nada.
        if (!this.spikesGroup) return;

        // Adiciona overlap entre Player 1 e spikes.
        this.physics.add.overlap(
            this.player1,
            this.spikesGroup,
            (player, spike) => this.handleSpikeDamage(player, spike),
            null,
            this
        );

        // Se existir Player 2.
        if (this.player2) {

            // Adiciona overlap entre Player 2 e spikes.
            this.physics.add.overlap(
                this.player2,
                this.spikesGroup,
                (player, spike) => this.handleSpikeDamage(player, spike),
                null,
                this
            );
        }
    }

    // Aplica dano ao jogador quando ele toca num spike perigoso.
    handleSpikeDamage(player, spike) {

        // Se o jogador não existir ou estiver morto, não faz nada.
        if (!player || player.isDead) return;

        // Se o spike não existir, não faz nada.
        if (!spike) return;

        // Só dá dano quando a animação está nos frames perigosos.
        if (!this.isSpikeDangerousFrame(spike)) {
            return;
        }

        // Guarda o tempo atual da cena.
        const now = this.time.now;

        // Se ainda estiver dentro do cooldown de dano, não dá dano.
        if (now - spike.lastDamageTime < spike.damageCooldown) {
            return;
        }

        // Atualiza o último momento de dano.
        spike.lastDamageTime = now;

        // Aplica dano ao jogador.
        this.damagePlayer(player, spike.damage || 15);
    }

    // Verifica se o spike está num frame perigoso.
    isSpikeDangerousFrame(spike) {

        // Se o spike não existir, devolve false.
        if (!spike) return false;

        // Guarda a key da textura atual.
        let currentKey = null;

        // Se o spike tiver animação e frame atual.
        if (spike.anims && spike.anims.currentFrame) {

            // Tenta obter a key da textura atual pelo frame da animação.
            currentKey =
                spike.anims.currentFrame.textureKey ||
                spike.anims.currentFrame.frame?.texture?.key ||
                null;
        }

        // Se ainda não encontrou key e o spike tiver textura.
        if (!currentKey && spike.texture) {

            // Usa a key da textura atual do spike.
            currentKey = spike.texture.key;
        }

        // Devolve true apenas se estiver nos frames perigosos.
        return (
            currentKey === 'spike_3' ||
            currentKey === 'spike_4'
        );
    }

    // Atualiza o aviso de perigo quando o jogador está perto dos spikes.
    updateSpikeWarning() {

        // Se o grupo dos spikes não existir, não mostra aviso.
        if (!this.spikesGroup) return false;

        // Se a intro, Game Over ou fim do nível estiver ativo, não mostra aviso.
        if (this.levelIntroActive || this.gameOverStarted || this.levelFinished) return false;

        // Se algum jogador estiver perto de uma interação, não sobrepõe o aviso.
        if (this.isAnyPlayerNearInteraction()) {
            return false;
        }

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Vai buscar todos os spikes.
        const spikes = this.spikesGroup.getChildren();

        // Percorre os jogadores.
        for (const player of players) {

            // Percorre os spikes.
            for (const spike of spikes) {

                // Ignora spikes inválidos ou inativos.
                if (!spike || !spike.active) continue;

                // Calcula a distância entre jogador e spike.
                const distance = Phaser.Math.Distance.Between(
                    player.x,
                    player.y,
                    spike.x,
                    spike.y
                );

                // Se o jogador estiver perto do spike.
                if (distance <= (spike.warningRange || 45)) {

                    // Mostra aviso de perigo.
                    this.setInteractionText('Perigo: Espinhos');

                    // Indica que mostrou aviso.
                    return true;
                }
            }
        }

        // Indica que não mostrou aviso.
        return false;
    }

    // Verifica se algum jogador está perto de um objeto interativo.
    isAnyPlayerNearInteraction() {

        // Se o grupo de interativos não existir, devolve false.
        if (!this.interativosGroup) return false;

        // Cria lista de jogadores vivos.
        const players = [this.player1, this.player2].filter(p => p && !p.isDead);

        // Vai buscar os objetos interativos.
        const objects = this.interativosGroup.getChildren();

        // Percorre os jogadores.
        for (const player of players) {

            // Percorre os objetos interativos.
            for (const obj of objects) {

                // Ignora objetos inválidos ou inativos.
                if (!obj || !obj.active) continue;

                // Define a distância de interação.
                const range = obj.interactionRange || 80;

                // Calcula a distância entre jogador e objeto.
                const distance = Phaser.Math.Distance.Between(
                    player.x,
                    player.y,
                    obj.x,
                    obj.y
                );

                // Se o jogador estiver dentro da distância de interação.
                if (distance <= range) {

                    // Indica que há interação próxima.
                    return true;
                }
            }
        }

        // Indica que não há interação próxima.
        return false;
    }

    // Define o texto de interação no HUD ou no texto local.
    setInteractionText(text) {

        // Garante que o texto é uma string segura.
        const safeText = text ? String(text) : '';

        // Vai buscar a cena do HUD.
        const hud = this.scene.get('LevelHUDScene');

        // Se a cena do HUD estiver ativa e tiver texto de interação válido.
        if (
            this.scene.isActive('LevelHUDScene') &&
            hud &&
            hud.setInteractionText &&
            hud.interactionText &&
            hud.interactionText.scene
        ) {

            // Define o texto diretamente no HUD.
            hud.setInteractionText(safeText, true);

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

        // Atualiza o texto local de interação.
        this.textoInteracao
            .setText(safeText)
            .setVisible(true)
            .setAlpha(1);
    }

    // Função chamada a cada frame.
    update() {

        // Se carregar ESC, a intro já acabou e não há Game Over.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyESC) &&
            !this.levelIntroActive &&
            !this.gameOverStarted
        ) {

            // Pausa o nível.
            this.scene.pause();

            // Abre a PauseScene.
            this.scene.launch('PauseScene', {
                levelScene: 'Level2'
            });

            // Para o update deste frame.
            return;
        }

        // Secção da intro do nível.

        // Se a intro ainda estiver ativa.
        if (this.levelIntroActive) {

            // Se existir sistema da intro.
            if (this.levelIntroSystem) {

                // Atualiza a intro.
                this.levelIntroSystem.update();
            }

            // Para o update enquanto a intro estiver ativa.
            return;
        }

        // Secção do Game Over.

        // Se existir sistema de Game Over.
        if (this.gameOverSystem) {

            // Atualiza o Game Over.
            this.gameOverSystem.update();
        }

        // Se o Game Over já começou.
        if (
            this.gameOverStarted ||
            this.gameOverSystem?.started
        ) {

            // Para o update.
            return;
        }

        // Secção do revive.

        // Se existir sistema de revive.
        if (this.reviveSystem) {

            // Atualiza o revive.
            this.reviveSystem.update();
        }

        // Secção das interações e aviso dos spikes.

        // Se existir sistema de interação.
        if (this.interactionSystem) {

            // Atualiza as interações.
            this.interactionSystem.update();
        }

        // Se existir função de aviso dos spikes.
        if (this.updateSpikeWarning) {

            // Atualiza o aviso de perigo dos spikes.
            this.updateSpikeWarning();
        }

        // Se o Game Over começou depois das interações.
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

            // Atualiza movimento do Player 1.
            this.player1.updateMovement(this.cursors);
        }

        // Se o Player 2 existir e estiver vivo.
        if (this.player2 && !this.player2.isDead) {

            // Atualiza movimento do Player 2.
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

            // Atualiza os ataques dos jogadores.
            this.attackSystem.handleAttacks();
        }

        // Se existir sistema de inventário.
        if (this.inventorySystem) {

            // Atualiza o input do inventário.
            this.inventorySystem.handleInventoryInput();
        }

        // Secção dos itens / inimigos.

        // Se existir sistema de itens.
        if (this.itemSystem) {

            // Atualiza o efeito do íman.
            this.itemSystem.updateMagnet();
        }

        // Se existir sistema de inimigos.
        if (this.enemySystem) {

            // Atualiza os inimigos.
            this.enemySystem.update();
        }

        // Secção da câmara.

        // Se existir sistema de câmara.
        if (this.cameraSystem) {

            // Atualiza a câmara.
            this.cameraSystem.update();
        }
    }

    // Verifica se há ponte numa posição do mundo.
    isBridgeTileAtWorldXY(x, y) {

        // Neste nível, não existe ponte usada por este sistema.
        return false;
    }

    // Verifica se há perigo numa posição do mundo.
    isDangerTileAtWorldXY(x, y) {

        // Neste nível, o perigo dos spikes é tratado por objetos, não por tiles.
        return false;
    }

    // Aplica dano a um jogador.
    damagePlayer(player, dmg) {

        // Se não existir sistema de vida, não faz nada.
        if (!this.playerHealthSystem) return;

        // Usa o sistema de vida para aplicar dano.
        this.playerHealthSystem.damagePlayer(player, dmg);
    }

    // Restaura os dados do nível para o início.
    restoreLevelStartState() {

        // Secção de restaurar heróis.

        // Vai buscar os dados iniciais do Player 1.
        const p1Start = this.registry.get('player1HeroAtLevelStart');

        // Vai buscar os dados iniciais do Player 2.
        const p2Start = this.registry.get('player2HeroAtLevelStart');

        // Se existirem dados iniciais do Player 1.
        if (p1Start) {

            // Restaura o Player 1 com uma cópia desses dados.
            this.registry.set('player1Hero', this.cloneData(p1Start));
        }

        // Se existirem dados iniciais do Player 2.
        if (p2Start) {

            // Restaura o Player 2 com uma cópia desses dados.
            this.registry.set('player2Hero', this.cloneData(p2Start));
        }

        // Secção de restaurar moedas.

        // Vai buscar as moedas iniciais do nível.
        const coinsStart = this.registry.get('coinsAtLevelStart');

        // Se existirem moedas iniciais guardadas.
        if (coinsStart) {

            // Restaura as moedas no registry.
            this.registry.set('coins', {
                p1: coinsStart.p1 || 0,
                p2: coinsStart.p2 || 0
            });
        }

        // Secção de restaurar score do nível.

        // Restaura o score do nível.
        this.registry.set(
            'levelScore',
            this.registry.get('levelScoreAtLevelStart') || 0
        );

        // Vai buscar o breakdown inicial.
        const breakdownStart = this.registry.get('scoreBreakdownAtLevelStart');

        // Se existir breakdown inicial.
        if (breakdownStart) {

            // Restaura o breakdown.
            this.registry.set('scoreBreakdown', this.cloneData(breakdownStart));
        }

        // Vai buscar as estatísticas iniciais.
        const statsStart = this.registry.get('scoreStatsAtLevelStart');

        // Se existirem estatísticas iniciais.
        if (statsStart) {

            // Restaura as estatísticas.
            this.registry.set('scoreStats', this.cloneData(statsStart));
        }
    }

    // Termina o nível.
    finishLevel() {

        // Se o nível já terminou, não faz nada.
        if (this.levelFinished) return;

        // Marca o nível como terminado.
        this.levelFinished = true;

        // Para a cena do HUD.
        this.scene.stop('LevelHUDScene');

        // Se existir temporizador.
        if (this.levelTimerSystem) {

            // Para o temporizador.
            this.levelTimerSystem.stop();
        }

        // Se existir sistema de score.
        if (this.scoreSystem) {

            // Aplica pontuação de conclusão do nível.
            this.scoreSystem.finishLevel();
        }

        // Guarda as moedas no registry.
        this.registry.set('coins', {
            p1: this.coins.p1 || 0,
            p2: this.coins.p2 || 0
        });

        // Faz fade out.
        this.cameras.main.fadeOut(700, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Inicia a VictoryScene.
                this.scene.start('VictoryScene', {

                    // Passa a key do nível atual.
                    levelKey: this.sys.settings.key,

                    // Passa o próximo nível.
                    nextLevel: this.levelConfig.nextLevel,

                    // Passa o modo de jogo.
                    mode: this.gameMode
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