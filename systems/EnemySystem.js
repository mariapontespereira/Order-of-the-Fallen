// Importa a classe Enemy, usada para criar inimigos no mapa.
import Enemy from '../entities/Enemy.js';

// Cria a classe EnemySystem, responsável por criar, atualizar e controlar inimigos.
export default class EnemySystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde os inimigos existem.
        this.scene = scene;

        // Distância mínima entre o spawn do inimigo e os jogadores
        this.minDistanceFromPlayers = 280;
    }

    // Atualiza todos os inimigos existentes.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena ou grupo de inimigos, não faz nada.
        if (!scene || !scene.enemies) return;

        // Cria uma lista com os jogadores existentes.
        const players = [scene.player1, scene.player2].filter(Boolean);

        // Percorre todos os inimigos dentro do grupo.
        scene.enemies.getChildren().forEach(enemy => {

            // Ignora inimigos inválidos, inativos ou mortos.
            if (!enemy || !enemy.active || enemy.isDead) return;

            // Se o inimigo tiver função update.
            if (enemy.update) {

                // Atualiza o inimigo, passando a lista de jogadores.
                enemy.update(players);
            }
        });
    }

    // Cria um inimigo específico numa posição do mapa.
    spawn(type, x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena ou grupo de inimigos, não cria nada.
        if (!scene || !scene.enemies) return null;

        // Configurações específicas de cada tipo de inimigo.
        const configs = {

            // Configuração do enemy0.
            enemy0: {
                vidaMax: 80,
                dano: 15,
                speed: 50,
                attackRange: 30,
                detectRange: 90
            },

            // Configuração do enemy1.
            enemy1: {
                vidaMax: 50,
                dano: 5,
                speed: 60,
                attackRange: 28,
                detectRange: 85
            },

            // Configuração do enemy2.
            enemy2: {
                vidaMax: 50,
                dano: 10,
                speed: 85,
                attackRange: 28,
                detectRange: 100
            },

            // Configuração do enemy3.
            enemy3: {
                vidaMax: 30,
                dano: 7,
                speed: 70,
                attackRange: 20,
                detectRange: 70
            },

            // Configuração do enemy4.
            enemy4: {
                vidaMax: 50,
                dano: 15,
                speed: 55,
                attackRange: 25,
                detectRange: 90
            },

            // Configuração do enemy5.
            enemy5: {
                vidaMax: 50,
                dano: 12,
                speed: 80,
                attackRange: 30,
                detectRange: 100
            },

            // Configuração do enemy6.
            enemy6: {
                vidaMax: 80,
                dano: 16,
                speed: 65,
                attackRange: 30,
                detectRange: 100
            },

            // Configuração do enemy7.
            enemy7: {
                vidaMax: 80,
                dano: 14,
                speed: 60,
                attackRange: 35,
                detectRange: 100
            },

            // Configuração do enemy8.
            enemy8: {
                vidaMax: 60,
                dano: 9,
                speed: 80,
                attackRange: 120,
                detectRange: 180,

                // Configuração do projétil disparado pelo enemy8.
                projectile: {
                    key: 'arrow03',
                    speed: 150,
                    scale: 1,
                    damage: 9,
                    duration: 900,
                    hitboxLength: 24,
                    hitboxThickness: 6
                }
            }
        };

        // Vai buscar a configuração do tipo escolhido ou usa uma configuração padrão.
        const enemyConfig = configs[type] || {
            vidaMax: 80,
            dano: 10,
            speed: 90,
            attackRange: 28,
            detectRange: 100
        };

        // Cria o inimigo com a classe Enemy.
        const enemy = new Enemy(scene, x, y, type, enemyConfig);

        // Adiciona o inimigo ao grupo de inimigos da cena.
        scene.enemies.add(enemy);

        // Se existir layer de paredes.
        if (scene.paredeLayer) {

            // Adiciona colisão entre o inimigo e as paredes.
            scene.physics.add.collider(enemy, scene.paredeLayer);
        }

        // Se existirem paredes invisíveis.
        if (scene.paredesInvisiveis) {

            // Adiciona colisão entre o inimigo e as paredes invisíveis.
            scene.physics.add.collider(enemy, scene.paredesInvisiveis);
        }

        // Se existir sistema de zonas perigosas.
        if (scene.dangerZoneSystem) {

            // Adiciona colisão entre o inimigo e as zonas de perigo.
            scene.dangerZoneSystem.addColliderForObject(enemy);
        }

        // Devolve o inimigo criado.
        return enemy;
    }

    // Cria um inimigo numa posição aleatória segura.
    spawnRandom(type) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena ou mapa, não cria nada.
        if (!scene || !scene.map) return null;

        // Número máximo de tentativas para encontrar uma posição segura.
        const maxTries = 120;

        // Tenta encontrar uma posição segura várias vezes.
        for (let i = 0; i < maxTries; i++) {

            // Escolhe uma posição X aleatória dentro do mapa.
            const x = Phaser.Math.Between(40, scene.map.widthInPixels - 40);

            // Escolhe uma posição Y aleatória dentro do mapa.
            const y = Phaser.Math.Between(40, scene.map.heightInPixels - 40);

            // Não nascer perto dos players.

            // Se a posição estiver demasiado perto dos jogadores, tenta outra.
            if (this.isTooCloseToPlayers(x, y, this.minDistanceFromPlayers)) {
                continue;
            }

            // Tem de nascer em chão.

            // Vai buscar tile da layer de chão principal.
            const groundTile = scene.groundLayer?.getTileAtWorldXY(x, y);

            // Vai buscar tile da segunda layer de chão.
            const ground2Tile = scene.ground2Layer?.getTileAtWorldXY(x, y);

            // Verifica se existe chão válido numa das layers.
            const hasGround =
                (groundTile && groundTile.index !== -1) ||
                (ground2Tile && ground2Tile.index !== -1);

            // Se não houver chão, tenta outra posição.
            if (!hasGround) {
                continue;
            }

            // Não nascer em paredes.

            // Se existir layer de paredes.
            if (scene.paredeLayer) {

                // Vai buscar o tile da parede nesta posição.
                const wallTile = scene.paredeLayer.getTileAtWorldXY(x, y);

                // Se houver parede nesta posição, tenta outra.
                if (wallTile && wallTile.index !== -1) {
                    continue;
                }
            }

            // Não nascer na lava / água.

            // Se a posição for perigosa, tenta outra.
            if (this.isDangerTile(scene, x, y)) {
                continue;
            }

            // Não nascer dentro de paredes invisíveis.

            // Se a posição estiver dentro de uma parede invisível, tenta outra.
            if (this.isInsideInvisibleWall(scene, x, y)) {
                continue;
            }

            // Se passou todos os testes, cria o inimigo nesta posição.
            return this.spawn(type, x, y);
        }

        // Mostra aviso se não conseguiu encontrar posição segura.
        console.warn(`Não foi possível encontrar posição segura para o inimigo: ${type}`);

        // Devolve null porque não conseguiu criar o inimigo.
        return null;
    }

    // Verifica se uma posição está demasiado perto dos jogadores.
    isTooCloseToPlayers(x, y, minDistance = 220) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, devolve false.
        if (!scene) return false;

        // Cria lista de jogadores.
        const players = [];

        // Se existir Player 1.
        if (scene.player1) {

            // Adiciona Player 1 à lista.
            players.push(scene.player1);
        }

        // Se existir Player 2.
        if (scene.player2) {

            // Adiciona Player 2 à lista.
            players.push(scene.player2);
        }

        // Percorre todos os jogadores existentes.
        for (const player of players) {

            // Se o jogador for inválido, ignora.
            if (!player) continue;

            // Calcula a distância entre a posição e o jogador.
            const distance = Phaser.Math.Distance.Between(
                x,
                y,
                player.x,
                player.y
            );

            // Se a distância for menor que o mínimo.
            if (distance < minDistance) {

                // A posição está demasiado perto.
                return true;
            }
        }

        // A posição não está demasiado perto dos jogadores.
        return false;
    }

    // Verifica se uma posição está dentro de uma parede invisível.
    isInsideInvisibleWall(scene, x, y) {

        // Se não houver cena ou grupo de paredes invisíveis, devolve false.
        if (!scene || !scene.paredesInvisiveis) return false;

        // Guarda se a posição está dentro de parede invisível.
        let insideInvisibleWall = false;

        // Percorre todas as paredes invisíveis.
        scene.paredesInvisiveis.children.iterate(parede => {

            // Se a parede for inválida ou não tiver bounds, ignora.
            if (!parede || !parede.getBounds) return;

            // Se o ponto estiver dentro dos limites da parede.
            if (Phaser.Geom.Rectangle.Contains(parede.getBounds(), x, y)) {

                // Marca como dentro de parede invisível.
                insideInvisibleWall = true;
            }
        });

        // Devolve o resultado da verificação.
        return insideInvisibleWall;
    }

    // Verifica se uma posição está numa zona perigosa.
    isDangerTile(scene, x, y) {

        // Se não houver cena, devolve false.
        if (!scene) return false;

        // Usa o DangerZoneSystem se existir
        // Exemplo: Level1 usa waterLayer, LevelFinal usa buracosLayer

        // Se a cena tiver DangerZoneSystem com função de verificação.
        if (
            scene.dangerZoneSystem &&
            typeof scene.dangerZoneSystem.isDangerTileAtWorldXY === 'function'
        ) {

            // Usa o sistema de perigo para verificar a posição.
            return scene.dangerZoneSystem.isDangerTileAtWorldXY(x, y);
        }

        // Fallback para layers de perigo simples
        // water2Layer NÃO entra aqui porque não é dano/perigo

        // Lista de layers perigosas usadas como fallback.
        const dangerLayers = [
            scene.waterLayer,
            scene.buracosLayer
        ].filter(layer => layer && layer.getTileAtWorldXY);

        // Percorre todas as layers de perigo.
        for (const layer of dangerLayers) {

            // Vai buscar o tile nesta posição.
            const tile = layer.getTileAtWorldXY(x, y);

            // Se existir tile válido, é perigo.
            if (tile && tile.index !== -1) {
                return true;
            }
        }

        // Se nenhuma layer tiver perigo, devolve false.
        return false;
    }
}