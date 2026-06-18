// Entidades

// Importa a classe Player, usada para criar os jogadores no nível.
import Player from '../entities/Player.js';

// Data

// Importa as configurações dos ataques dos heróis.
import ATTACK_CONFIG from '../data/AttackConfig.js';

// Importa as configurações dos níveis.
import LEVEL_CONFIG from '../data/LevelConfig.js';

// Sistemas

// Importa o sistema de revive para o modo multiplayer.
import ReviveSystem from '../systems/ReviveSystem.js';

// Importa o sistema de inventário.
import InventorySystem from '../systems/InventorySystem.js';

// Importa o sistema de ataques.
import AttackSystem from '../systems/AttackSystem.js';

// Importa o sistema de Game Over.
import GameOverSystem from '../systems/GameOverSystem.js';

// Importa o sistema dos inimigos.
import EnemySystem from '../systems/EnemySystem.js';

// Importa o sistema de interações com baús, portas e textos.
import InteractionSystem from '../systems/InteractionSystem.js';

// Importa o sistema dos itens.
import ItemSystem from '../systems/ItemSystem.js';

// Importa o sistema de pontuação.
import ScoreSystem from '../systems/ScoreSystem.js';

// Importa o sistema que controla a distância entre jogadores no multiplayer.
import PlayerDistanceSystem from '../systems/PlayerDistanceSystem.js';

// Importa o sistema da câmara.
import CameraSystem from '../systems/CameraSystem.js';

// Importa o sistema do temporizador do nível.
import LevelTimerSystem from '../systems/LevelTimerSystem.js';

// Importa o sistema das zonas perigosas.
import DangerZoneSystem from '../systems/DangerZoneSystem.js';

// Importa o sistema da introdução do nível.
import LevelIntroSystem from '../systems/LevelIntroSystem.js';

// Importa o sistema de vida/dano dos jogadores.
import PlayerHealthSystem from '../systems/PlayerHealthSystem.js';

// Importa o sistema de música.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe Level1, responsável pelo primeiro nível do jogo.
export default class Level1 extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "Level1".
        super('Level1');
    }

    // Função chamada quando a cena inicia.
    init() {

        // Vai buscar os dados do herói do Player 1 guardados no registry.
        // Se não existir herói guardado, usa KAEL como padrão.
        this.p1Data = this.registry.get('player1Hero') || {
            id: 'hero0',
            nome: 'KAEL',
            vidaAtual: 100,
            vidaMax: 100,
            poder: 10,
            speed: 4,
            especial: ''
        };

        // Vai buscar os dados do herói do Player 2.
        this.p2Data = this.registry.get('player2Hero');

        // Vai buscar o modo de jogo, single ou multi.
        this.gameMode = this.registry.get('gameMode') || 'single';

        // Indica se o jogador já tem a chave do baú.
        this.temChave = false;

        // Controla se o texto de interação está bloqueado.
        this.interactionTextLocked = false;

        // Guarda o objeto interativo próximo do Player 1.
        this.objetoProximoP1 = null;

        // Guarda o objeto interativo próximo do Player 2.
        this.objetoProximoP2 = null;

        // Controla se o Game Over já começou.
        this.gameOverStarted = false;

        // Indica que a introdução do nível está ativa.
        this.levelIntroActive = true;

        // Impede os jogadores de se moverem antes da intro terminar.
        this.canControlPlayers = false;

        // Cria os inventários dos dois jogadores.
        this.inventories = { p1: [], p2: [] };

        // Vai buscar as moedas guardadas ou começa com 0 para cada jogador.
        this.coins = this.registry.get('coins') || {p1: 0, p2: 0};

        // Guarda se o íman está ativo para cada jogador.
        this.magnet = { p1: false, p2: false };

        // Guarda as configurações de ataque.
        this.attackConfig = ATTACK_CONFIG;

        // Guarda as configurações específicas do Level1.
        this.levelConfig = LEVEL_CONFIG.Level1;

        // Define o tempo máximo do nível.
        this.levelTimeMax = this.levelConfig.time;

        // Define o tempo restante inicial.
        this.levelTimeLeft = this.levelTimeMax;

        // Indica se o temporizador do nível já começou.
        this.levelTimerStarted = false;

        // Indica se o nível já terminou.
        this.levelFinished = false;

        // Indica se algum jogador levou dano neste nível.
        this.playerTookDamage = false;

        // Guarda os cooldowns dos ataques dos dois jogadores.
        this.attackCooldowns = {

            // Cooldowns do Player 1.
            p1: { atk1: 0, atk2: 0, atk3: 0, block: 0 },

            // Cooldowns do Player 2.
            p2: { atk1: 0, atk2: 0, atk3: 0, block: 0 }
        };


    }

    // Preload vazio porque os recursos já são carregados no BootScene.
    preload() {}

    // Função chamada quando a cena é criada.
    create() {

        // Faz fade in ao entrar no nível.
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Toca a música do nível 1.
        MusicSystem.play(this, 'music_level1', {

            // Define o volume da música.
            volume: 0.35,

            // Faz a música repetir.
            loop: true,

            // Define o fade da música.
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

        // Guarda dados do início do nível.

        // Guarda as moedas no estado inicial do nível.
        this.registry.set('coinsAtLevelStart', {

            // Moedas iniciais do Player 1.
            p1: this.coins.p1 || 0,

            // Moedas iniciais do Player 2.
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

        // Evento chamado quando a cena é encerrada.
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

            // Se existir sistema de zonas perigosas, destrói-o.
            if (this.dangerZoneSystem) {
                this.dangerZoneSystem.destroy();
            }

            // Se existir sistema de intro, destrói-o.
            if (this.levelIntroSystem) {
                this.levelIntroSystem.destroy();
            }
        });

        // Secção do mapa.

        // Cria o tilemap usando a key definida no LevelConfig.
        this.map = this.make.tilemap({ key: this.levelConfig.mapKey });

        // Adiciona o tileset principal do mapa.
        const mainTiles = this.map.addTilesetImage('MainLev2.0', 'mainLev2');

        // Adiciona o tileset decorativo.
        const decorativeTiles = this.map.addTilesetImage('decorative', 'decorativeTiles');

        // Adiciona o tileset freelavatileset-Sheet.
        const lavaTiles = this.map.addTilesetImage('freelavatileset-Sheet', 'lavaTiles');

        // Junta os tilesets numa lista.
        const tilesets = [
            mainTiles,
            decorativeTiles,
            lavaTiles

        // Remove tilesets inválidos ou não encontrados.
        ].filter(Boolean);

        // Secção das layers.

        // Cria a layer preta do mapa.
        this.pretoLayer = this.map.createLayer('Preto', tilesets, 0, 0);

        // Se existir, coloca a layer preta atrás de tudo.
        if (this.pretoLayer) this.pretoLayer.setDepth(-2);

        // Cria a layer do chão.
        this.groundLayer = this.map.createLayer('Ground', tilesets, 0, 0);

        // Se existir, coloca o chão na profundidade 0.
        if (this.groundLayer) this.groundLayer.setDepth(0);

        // Cria a layer da água perigosa.
        this.waterLayer = this.map.createLayer('Water', tilesets, 0, 0);

        // Se existir, coloca a água acima do chão.
        if (this.waterLayer) this.waterLayer.setDepth(1);

        // Cria a layer Water2.
        this.water2Layer = this.map.createLayer('Water2', tilesets, 0, 0);

        // Se existir, coloca a Water2 acima da Water.
        if (this.water2Layer) this.water2Layer.setDepth(2);

        // Cria a layer da ponte.
        this.ponteLayer = this.map.createLayer('Ponte', tilesets, 0, 0);

        // Se existir, coloca a ponte acima da água.
        if (this.ponteLayer) this.ponteLayer.setDepth(3);

        // Cria a layer das paredes.
        this.paredeLayer = this.map.createLayer('Parede', tilesets, 0, 0);

        // Se existir, coloca a parede acima das layers principais.
        if (this.paredeLayer) this.paredeLayer.setDepth(4);

        // Cria a layer de decoração.
        this.decLayer = this.map.createLayer('Decoracao', tilesets, 0, 0);

        // Se existir decoração.
        if (this.decLayer) {

            // Coloca a decoração por cima dos jogadores e elementos.
            this.decLayer.setDepth(21);

            // Mantém a decoração visível.
            this.decLayer.setAlpha(1);
        }

        

        // Define ground2Layer como referência à groundLayer.
        this.ground2Layer = this.groundLayer;

        // Se existir layer de parede.
        if (this.paredeLayer) {

            // Ativa colisão em todos os tiles exceto vazios.
            this.paredeLayer.setCollisionByExclusion([-1]);
        }

        // Se existir layer de água.
        if (this.waterLayer) {

            // Ativa colisão em todos os tiles de água.
            this.waterLayer.setCollisionByExclusion([-1]);
        }

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

        // Secção dos sistemas.

        // Cria o sistema dos inimigos.
        this.enemySystem = new EnemySystem(this);

        // Cria o sistema dos itens.
        this.itemSystem = new ItemSystem(this);

        // Cria o sistema de ataques.
        this.attackSystem = new AttackSystem(this);

        // Cria o sistema de interações.
        this.interactionSystem = new InteractionSystem(this);

        // Espera 600ms antes de mostrar a mensagem inicial.
        this.time.delayedCall(600, () => {

            // Se o sistema de interação existir.
            if (this.interactionSystem) {

                // Mostra uma mensagem temporária ao jogador.
                this.interactionSystem.showTemporaryInteractionText('Encontra o baú', 3500);
            }
        });

        // Cria o sistema de Game Over.
        this.gameOverSystem = new GameOverSystem(this);

        // Cria o sistema de score.
        this.scoreSystem = new ScoreSystem(this);

        // Cria o sistema de vida dos jogadores.
        this.playerHealthSystem = new PlayerHealthSystem(this);

        // Cria o sistema de temporizador do nível.
        this.levelTimerSystem = new LevelTimerSystem(this, {

            // Define o tempo máximo com base no LevelConfig.
            maxTime: this.levelConfig.time
        });

        // Cria o sistema de zona perigosa.
        this.dangerZoneSystem = new DangerZoneSystem(this, {

            // Define que a waterLayer é a layer perigosa.
            dangerLayers: ['waterLayer'],

            // Mensagem mostrada quando há perigo.
            dangerMessage: 'Perigo: Água',

            // Distância para mostrar aviso.
            warningDistance: 70,

            // Tempo necessário dentro do perigo antes de aplicar consequência.
            dangerHoldTime: 900,

            // Margem usada na deteção do perigo.
            dangerMargin: 6
        });

        // Cria o sistema da introdução do nível.
        this.levelIntroSystem = new LevelIntroSystem(this, {

            // Copia as configurações da intro do LevelConfig.
            ...this.levelConfig.intro,

            // Passa a key da cena atual.
            levelKey: this.sys.settings.key
        });

        // Secção dos controlos.

        // Cria as teclas de cursor para o Player 1.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Cria a tecla ESC.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Cria a tecla E para interações.
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


        // Cria as teclas WASD para o Player 2.
        this.keysWASD = this.input.keyboard.addKeys({

            // Tecla W para cima.
            up: Phaser.Input.Keyboard.KeyCodes.W,

            // Tecla S para baixo.
            down: Phaser.Input.Keyboard.KeyCodes.S,

            // Tecla A para esquerda.
            left: Phaser.Input.Keyboard.KeyCodes.A,

            // Tecla D para direita.
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Cria as teclas de ataque do Player 1.
        this.keysP1 = this.input.keyboard.addKeys({

            // Ataque 1 do Player 1.
            atk1: Phaser.Input.Keyboard.KeyCodes.J,

            // Ataque 2 do Player 1.
            atk2: Phaser.Input.Keyboard.KeyCodes.K,

            // Ataque 3 do Player 1.
            atk3: Phaser.Input.Keyboard.KeyCodes.L,

            // Defesa do Player 1.
            block: Phaser.Input.Keyboard.KeyCodes.B
        });

        // Cria as teclas de ataque do Player 2.
        this.keysP2 = this.input.keyboard.addKeys({

            // Ataque 1 do Player 2.
            atk1: Phaser.Input.Keyboard.KeyCodes.R,

            // Ataque 2 do Player 2.
            atk2: Phaser.Input.Keyboard.KeyCodes.T,

            // Ataque 3 do Player 2.
            atk3: Phaser.Input.Keyboard.KeyCodes.Q,

            // Defesa do Player 2.
            block: Phaser.Input.Keyboard.KeyCodes.CTRL
        });

        // Cria as teclas de inventário do Player 1.
        this.invKeysP1 = this.input.keyboard.addKeys({

            // Slot 1 do inventário do Player 1.
            s7: Phaser.Input.Keyboard.KeyCodes.SEVEN,

            // Slot 2 do inventário do Player 1.
            s8: Phaser.Input.Keyboard.KeyCodes.EIGHT,

            // Slot 3 do inventário do Player 1.
            s9: Phaser.Input.Keyboard.KeyCodes.NINE,

            // Slot 4 do inventário do Player 1.
            s0: Phaser.Input.Keyboard.KeyCodes.ZERO
        });

        // Cria as teclas de inventário do Player 2.
        this.invKeysP2 = this.input.keyboard.addKeys({

            // Slot 1 do inventário do Player 2.
            s1: Phaser.Input.Keyboard.KeyCodes.ONE,

            // Slot 2 do inventário do Player 2.
            s2: Phaser.Input.Keyboard.KeyCodes.TWO,

            // Slot 3 do inventário do Player 2.
            s3: Phaser.Input.Keyboard.KeyCodes.THREE,

            // Slot 4 do inventário do Player 2.
            s4: Phaser.Input.Keyboard.KeyCodes.FOUR
        });

        // Cria o sistema de inventário.
        this.inventorySystem = new InventorySystem(this);

        // O texto real vai ser criado pela LevelHUDScene.

        // Guarda a referência do texto de interação.
        this.textoInteracao = null;

        // Secção dos objetos do Tiled.

        // Vai buscar a layer de objetos chamada Eventos.
        const objectLayer = this.map.getObjectLayer('Eventos');

        // Define posição padrão do spawn do Player 1.
        let spawnX1 = 100;

        // Define posição padrão Y do Player 1.
        let spawnY1 = 100;

        // Define posição padrão do spawn do Player 2.
        let spawnX2 = 140;

        // Define posição padrão Y do Player 2.
        let spawnY2 = 100;

        // Percorre os objetos da layer Eventos, se ela existir.
        objectLayer?.objects.forEach(obj => {

            // Se o objeto for uma parede invisível.
            if (obj.name === 'ParedeInvisivel') {

                // Cria um retângulo no local do objeto do Tiled.
                const parede = this.add.rectangle(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );

                // Ativa física estática na parede invisível.
                this.physics.add.existing(parede, true);

                // Adiciona a parede ao grupo de paredes invisíveis.
                this.paredesInvisiveis.add(parede);

                // Esconde a parede invisível.
                parede.setVisible(false);
            }

            // Se o objeto for o spawn do Player 1.
            if (obj.name === 'spawn_player') {

                // Guarda a posição X do spawn do Player 1.
                spawnX1 = obj.x;

                // Guarda a posição Y do spawn do Player 1.
                spawnY1 = obj.y;
            }

            // Se o objeto for o spawn do Player 2.
            if (obj.name === 'spawn_player2') {

                // Guarda a posição X do spawn do Player 2.
                spawnX2 = obj.x;

                // Guarda a posição Y do spawn do Player 2.
                spawnY2 = obj.y;
            }

            // Se o objeto for o baú.
            if (obj.name === 'bau' || obj.name === 'bau_tesouro') {

                // Cria o baú dentro do grupo de objetos interativos.
                const bau = this.interativosGroup.create(
                    obj.x,
                    obj.y,
                    'chest'
                );

                // Centra a origem do baú.
                bau.setOrigin(0.5);

                // Dá o nome "bau" ao objeto.
                bau.setName('bau');

                // Marca o baú como fechado.
                bau.aberto = false;

                // Define a profundidade do baú.
                bau.setDepth(20);

                // Define o tamanho do corpo físico do baú.
                bau.body.setSize(32, 32);

                // Define o offset da hitbox do baú.
                bau.body.setOffset(0, 0);

                // Atualiza o corpo físico estático.
                bau.refreshBody();

                // Define a distância necessária para interagir com o baú.
                bau.interactionRange = 100;
            }

            // Se o objeto for a porta de saída.
            if (obj.name === 'porta_saida') {

                // Cria uma zona invisível para a porta.
                const porta = this.add.zone(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );

                // Dá o nome "porta_saida" ao objeto.
                porta.setName('porta_saida');

                // Marca a porta como fechada.
                porta.aberto = false;

                // Define a distância necessária para interagir com a porta.
                porta.interactionRange = 90;

                // Ativa física estática na zona da porta.
                this.physics.add.existing(porta, true);

                // Adiciona a porta aos objetos interativos.
                this.interativosGroup.add(porta);
            }
        });

        // Secção dos players.

        // Cria o Player 1 na posição de spawn.
        this.player1 = new Player(this, spawnX1, spawnY1, this.p1Data.id, this.p1Data);

        // Define a profundidade do Player 1.
        this.player1.setDepth(20);

        // Se existir layer de parede.
        if (this.paredeLayer) {

            // Adiciona colisão entre Player 1 e paredes.
            this.physics.add.collider(this.player1, this.paredeLayer);
        }

        // Adiciona colisão entre Player 1 e paredes invisíveis.
        this.physics.add.collider(this.player1, this.paredesInvisiveis);

        // Se for multiplayer e houver dados do Player 2.
        if (this.gameMode === 'multi' && this.p2Data) {

            // Cria o Player 2 na posição de spawn.
            this.player2 = new Player(this, spawnX2, spawnY2, this.p2Data.id, this.p2Data);

            // Define a profundidade do Player 2.
            this.player2.setDepth(20);

            // Se existir layer de parede.
            if (this.paredeLayer) {

                // Adiciona colisão entre Player 2 e paredes.
                this.physics.add.collider(this.player2, this.paredeLayer);
            }

            // Adiciona colisão entre Player 2 e paredes invisíveis.
            this.physics.add.collider(this.player2, this.paredesInvisiveis);
        }


        // Se for multiplayer e o Player 2 existir.
        if (this.gameMode === 'multi' && this.player2) {

            // Cria o sistema que controla a distância entre jogadores.
            this.playerDistanceSystem = new PlayerDistanceSystem(this, {

                // Distância para começar a avisar.
                warningDistance: 420,

                // Distância que pode causar morte/separação.
                killDistance: 560
            });
        }
        
        // Secção da câmara.

        // Define os limites físicos do mundo conforme o tamanho do mapa.
        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );

        // Cria o sistema de câmara.
        this.cameraSystem = new CameraSystem(this, {

            // Define o zoom da câmara.
            zoom: 2,

            // Define a suavização do follow.
            followLerp: 0.05,

            // Define a suavização do alvo.
            targetLerp: 0.08
        });

        // Configura a câmara.
        this.cameraSystem.setup();

        // Secção dos inimigos.

        // Percorre a lista de inimigos definida no LevelConfig.
        this.levelConfig.enemies.forEach(enemyKey => {

            // Cria cada inimigo numa posição aleatória válida.
            this.enemySystem.spawnRandom(enemyKey);
        });

        // Percorre todos os inimigos criados.
        this.enemies.getChildren().forEach(enemy => {

            // Define a profundidade visual dos inimigos.
            enemy.setDepth(20);
        });

        // Se existir layer de parede.
        if (this.paredeLayer) {

            // Adiciona colisão entre inimigos e paredes.
            this.physics.add.collider(this.enemies, this.paredeLayer, enemy => {

                // Se o inimigo tiver função onWallHit, chama-a.
                if (enemy.onWallHit) enemy.onWallHit();
            });
        }

        // Adiciona colisão entre inimigos e zonas perigosas.
        this.dangerZoneSystem.addColliderForObject(this.enemies, enemy => {

            // Se o inimigo tiver função onWallHit, chama-a.
            if (enemy.onWallHit) enemy.onWallHit();
        });

        // Adiciona colisão entre inimigos e paredes invisíveis.
        this.physics.add.collider(this.enemies, this.paredesInvisiveis, enemy => {

            // Se o inimigo tiver função onWallHit, chama-a.
            if (enemy.onWallHit) enemy.onWallHit();
        });


        // Secção dos itens.

        // Percorre a lista de itens definida no LevelConfig.
        this.levelConfig.items.forEach(itemKey => {

            // Cria cada item numa posição aleatória válida.
            this.itemSystem.spawnRandom(itemKey);
        });

        // Cria overlap entre Player 1 e itens.
        this.physics.add.overlap(
            this.player1,
            this.itemsGroup,

            // Quando o Player 1 toca num item, coleta o item.
            (player, item) => this.itemSystem.coletarItem(player, item),
            null,
            this
        );

        // Se existir Player 2.
        if (this.player2) {

            // Cria overlap entre Player 2 e itens.
            this.physics.add.overlap(
                this.player2,
                this.itemsGroup,

                // Quando o Player 2 toca num item, coleta o item.
                (player, item) => this.itemSystem.coletarItem(player, item),
                null,
                this
            );
        }

        // Secção do revive multiplayer.

        // Se o modo for multiplayer.
        if (this.gameMode === 'multi') {

            // Cria o sistema de revive.
            this.reviveSystem = new ReviveSystem(this);

            // Define os pontos de spawn dos dois jogadores.
            this.reviveSystem.setSpawnPoints(
                { x: spawnX1, y: spawnY1 },
                { x: spawnX2, y: spawnY2 }
            );
        }

        // Cria a intro do nível.
        this.levelIntroSystem.create();
    }

    // Função chamada a cada frame.
    update() {

        // Se carregar ESC e a intro já não estiver ativa.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyESC) &&
            !this.levelIntroActive
        ) {

            // Pausa a cena atual.
            this.scene.pause();

            // Abre a cena de pausa.
            this.scene.launch('PauseScene', {

                // Passa a cena do nível atual para o PauseScene.
                levelScene: 'Level1'
            });

            // Para o update deste frame.
            return;
        }

        // Secção da intro do nível.

        // Se a intro ainda estiver ativa.
        if (this.levelIntroActive) {

            // Se existir sistema de intro.
            if (this.levelIntroSystem) {

                // Atualiza o sistema da intro.
                this.levelIntroSystem.update();
            }

            // Para o resto do update enquanto a intro estiver ativa.
            return;
        }

        // Secção de Game Over / Revive.

        // Se existir sistema de Game Over.
        if (this.gameOverSystem) {

            // Atualiza o Game Over.
            this.gameOverSystem.update();
        }

        // Se existir sistema de revive.
        if (this.reviveSystem) {

            // Atualiza o revive.
            this.reviveSystem.update();
        }

        // Secção de interações / perigos.

        // Se existir sistema de interação.
        if (this.interactionSystem) {

            // Atualiza interações com baús, portas e textos.
            this.interactionSystem.update();
        }

        // Se existir sistema de zonas perigosas.
        if (this.dangerZoneSystem) {

            // Atualiza deteção de perigo nos jogadores.
            this.dangerZoneSystem.updatePlayers();
        }

        // Secção do movimento dos players.

        // Se o Player 1 existir e estiver vivo.
        if (this.player1 && !this.player1.isDead) {

            // Atualiza movimento do Player 1 com as setas.
            this.player1.updateMovement(this.cursors);
        }

        // Se o Player 2 existir e estiver vivo.
        if (this.player2 && !this.player2.isDead) {

            // Atualiza movimento do Player 2 com WASD.
            this.player2.updateMovementKeys(this.keysWASD);
        }

        // Secção da distância entre players.

        // Se existir sistema de distância.
        if (this.playerDistanceSystem) {

            // Atualiza a distância entre os jogadores.
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

            // Atualiza o efeito do íman nos itens.
            this.itemSystem.updateMagnet();
        }

        // Se existir sistema de inimigos.
        if (this.enemySystem) {

            // Atualiza todos os inimigos.
            this.enemySystem.update();
        }

        // Se existir sistema de zonas perigosas.
        if (this.dangerZoneSystem) {

            // Faz os inimigos evitarem zonas perigosas.
            this.dangerZoneSystem.avoidDangerZonesForEnemies();
        }

        // Secção da câmara.

        // Se existir sistema de câmara.
        if (this.cameraSystem) {

            // Atualiza a câmara.
            this.cameraSystem.update();
        }
    }

    // Verifica se existe uma ponte numa posição do mundo.
    isBridgeTileAtWorldXY(x, y) {

        // Usa o DangerZoneSystem para verificar ponte ou devolve false.
        return this.dangerZoneSystem?.isBridgeTileAtWorldXY(x, y) ?? false;
    }

    // Verifica se existe uma zona perigosa numa posição do mundo.
    isDangerTileAtWorldXY(x, y) {

        // Usa o DangerZoneSystem para verificar perigo ou devolve false.
        return this.dangerZoneSystem?.isDangerTileAtWorldXY(x, y) ?? false;
    }

    // Aplica dano a um jogador.
    damagePlayer(player, dmg) {

        // Se o PlayerHealthSystem não existir, não faz nada.
        if (!this.playerHealthSystem) return;

        // Usa o PlayerHealthSystem para dar dano ao jogador.
        this.playerHealthSystem.damagePlayer(player, dmg);
    }

    // Restaura o estado do nível para o início.
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

                // Restaura moedas do Player 1.
                p1: coinsStart.p1 || 0,

                // Restaura moedas do Player 2.
                p2: coinsStart.p2 || 0
            });
        }

        // Secção de restaurar score do nível.

        // Restaura o score do nível para o valor inicial.
        this.registry.set(
            'levelScore',
            this.registry.get('levelScoreAtLevelStart') || 0
        );

        // Vai buscar o breakdown inicial do score.
        const breakdownStart = this.registry.get('scoreBreakdownAtLevelStart');

        // Se existir breakdown inicial.
        if (breakdownStart) {

            // Restaura o breakdown com uma cópia.
            this.registry.set('scoreBreakdown', this.cloneData(breakdownStart));
        }

        // Vai buscar as estatísticas iniciais do score.
        const statsStart = this.registry.get('scoreStatsAtLevelStart');

        // Se existirem estatísticas iniciais.
        if (statsStart) {

            // Restaura as estatísticas com uma cópia.
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

            // Dá os pontos de conclusão do nível.
            this.scoreSystem.finishLevel();
        }

        // Guarda as moedas no registry.
        this.registry.set('coins', this.coins);

        // Faz fade out.
        this.cameras.main.fadeOut(700, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Inicia a VictoryScene com dados do nível.
                this.scene.start('VictoryScene', {

                    // Passa a key da cena atual.
                    levelKey: this.sys.settings.key,

                    // Passa o próximo nível definido no LevelConfig.
                    nextLevel: this.levelConfig.nextLevel,

                    // Passa o modo de jogo.
                    mode: this.gameMode
                });
            }
        );
    }

    // Cria uma cópia profunda de dados.
    cloneData(data) {

        // Se não houver dados, devolve null.
        if (!data) return null;

        // Converte para JSON e volta a objeto para criar uma cópia independente.
        return JSON.parse(JSON.stringify(data));
    }
}