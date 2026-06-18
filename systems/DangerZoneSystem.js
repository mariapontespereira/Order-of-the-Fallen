// Cria a classe DangerZoneSystem, responsável por controlar zonas perigosas como água, buracos ou outras layers.
export default class DangerZoneSystem {

    // Construtor do sistema.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;

        // Define a distância a partir da qual aparece o aviso de perigo.
        this.warningDistance = config.warningDistance || 45;

        // Define uma margem interna no tile para evitar morte ao tocar apenas na borda.
        this.dangerMargin = config.dangerMargin || 6;

        // Level1 usa waterLayer
        // Level2 pode usar ground2Layer

        // Define quais layers devem ser consideradas perigosas.
        this.dangerLayers = config.dangerLayers || ['waterLayer'];

        // Define a mensagem mostrada quando o jogador está perto do perigo.
        this.dangerMessage = config.dangerMessage || 'Perigo';

        // Guarda se o texto de perigo está ativo.
        this.dangerTextActive = false;

        // Define durante quanto tempo o aviso fica visível após detectar perigo.
        this.dangerHoldTime = config.dangerHoldTime || 3000;

        // Guarda até que momento o texto de perigo deve continuar visível.
        this.dangerTextUntil = 0;
    }

    // Obter layers de perigo.

    // Vai buscar as layers configuradas como perigosas.
    getDangerLayers() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, devolve lista vazia.
        if (!scene) return [];

        // Converte os nomes das layers em referências reais da cena.
        return this.dangerLayers

            // Vai buscar cada layer pelo nome guardado.
            .map(layerName => scene[layerName])

            // Mantém apenas layers válidas que tenham getTileAtWorldXY.
            .filter(layer => layer && layer.getTileAtWorldXY);
    }

    // Collider para inimigos.

    // Adiciona colisão entre um objeto e as layers de perigo.
    addColliderForObject(object, collideCallback = null) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver objeto ou cena, não faz nada.
        if (!object || !scene) return;

        // Vai buscar as layers de perigo.
        const layers = this.getDangerLayers();

        // Percorre todas as layers perigosas.
        layers.forEach(layer => {

            // Adiciona collider entre o objeto e a layer.
            scene.physics.add.collider(
                object,
                layer,
                collideCallback,
                (obj, tile) => {

                    // Se não houver objeto ou corpo físico, permite colisão.
                    if (!obj || !obj.body) return true;

                    // Usa o centro X do corpo físico para verificar o ponto.
                    const checkX = obj.body.center.x;

                    // Usa um ponto perto dos pés do objeto.
                    const checkY = obj.body.bottom - 16;

                    // Se estiver numa ponte, não considera como colisão perigosa.
                    if (this.isBridgeTileAtWorldXY(checkX, checkY)) {
                        return false;
                    }

                    // Caso contrário, permite a colisão.
                    return true;
                },
                scene
            );
        });
    }

    // Update players.

    // Atualiza a verificação de perigo nos jogadores.
    updatePlayers() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou o nível estiver em estado onde não deve verificar perigo.
        if (
            !scene ||
            scene.levelIntroActive ||
            scene.levelFinished ||
            scene.gameOverStarted
        ) {

            // Esconde o texto de perigo de forma forçada.
            this.hideDangerText(true);

            // Para a função.
            return;
        }

        // Guarda se algum perigo foi detectado perto de jogadores.
        let dangerNear = false;

        // Verifica perigo no Player 1.
        if (this.checkPlayer(scene.player1)) {

            // Marca que existe perigo perto.
            dangerNear = true;
        }

        // Verifica perigo no Player 2, se existir.
        if (scene.player2 && this.checkPlayer(scene.player2)) {

            // Marca que existe perigo perto.
            dangerNear = true;
        }

        // Guarda o tempo atual da cena.
        const now = scene.time.now;

        // Se houver perigo perto.
        if (dangerNear) {

            // Mantém o texto visível durante algum tempo.
            this.dangerTextUntil = now + this.dangerHoldTime;

            // Mostra o texto de perigo.
            this.showDangerText();

            // Para a função.
            return;
        }

        // Se ainda estiver dentro do tempo de manter o aviso.
        if (now < this.dangerTextUntil) {

            // Continua a mostrar o texto de perigo.
            this.showDangerText();

            // Para a função.
            return;
        }

        // Esconde o texto de perigo.
        this.hideDangerText();
    }

    // Verificar player.

    // Verifica se um jogador está em cima ou perto de perigo.
    checkPlayer(player) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar cena, jogador, corpo físico ou se o jogador estiver morto, devolve false.
        if (!scene || !player || player.isDead || !player.body) return false;

        // Define o X usado para verificar perigo, no centro do corpo.
        const dangerX = player.body.center.x;

        // Define o Y usado para verificar perigo, perto dos pés.
        const dangerY = player.body.bottom + 10;

        // Morte se pisar perigo.

        // Se o jogador estiver diretamente num tile perigoso.
        if (this.isDangerTileAtWorldXY(dangerX, dangerY)) {

            // Esconde o aviso de perigo.
            this.hideDangerText(true);

            // Se a cena tiver função de dano.
            if (scene.damagePlayer) {

                // Vai buscar a vida atual do jogador.
                const vidaAtual =
                    player.personagem?.vidaAtual ??
                    player.vidaAtual ??
                    9999;

                // Aplica dano igual à vida atual para matar o jogador.
                scene.damagePlayer(player, vidaAtual);
            }

            // Devolve false porque já tratou o perigo direto.
            return false;
        }

        // Aviso se estiver perto.

        // Verifica se existe perigo perto do jogador.
        return this.isNearDangerTile(
            dangerX,
            dangerY,
            this.warningDistance
        );
    }

    // Mostrar texto.

    // Mostra o texto de perigo no HUD ou no texto antigo da cena.
    showDangerText() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Marca o texto de perigo como ativo.
        this.dangerTextActive = true;

        // Usa a HUD atual

        // Se a cena tiver função setInteractionText.
        if (scene.setInteractionText) {

            // Mostra a mensagem de perigo no HUD.
            scene.setInteractionText(this.dangerMessage, true);

            // Para a função.
            return;
        }

        // Fallback antigo

        // Se existir texto de interação antigo.
        if (scene.textoInteracao && scene.textoInteracao.scene) {

            // Atualiza o texto de interação.
            scene.textoInteracao
                .setText(this.dangerMessage)
                .setVisible(true)
                .setAlpha(1);

            // Se for possível mudar a cor.
            if (scene.textoInteracao.setColor) {

                // Garante que a cor fica branca.
                scene.textoInteracao.setColor('#ffffff');
            }
        }
    }

    // Esconder texto.

    // Esconde o texto de perigo quando já não é necessário.
    hideDangerText(force = false) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se for para forçar.
        if (force) {

            // Cancela imediatamente o tempo de manter o aviso.
            this.dangerTextUntil = 0;
        }

        // Marca o texto de perigo como inativo.
        this.dangerTextActive = false;

        // Vai buscar a cena do HUD.
        const hud = scene.scene?.get('LevelHUDScene');

        // Se o HUD estiver ativo e o texto atual for a mensagem de perigo.
        if (
            scene.scene?.isActive('LevelHUDScene') &&
            hud &&
            hud.interactionText &&
            hud.interactionText.text === this.dangerMessage &&
            hud.setInteractionText
        ) {

            // Limpa o texto no HUD.
            hud.setInteractionText('', true);

            // Para a função.
            return;
        }

        // Se existir texto antigo e ele estiver a mostrar a mensagem de perigo.
        if (
            scene.textoInteracao &&
            scene.textoInteracao.scene &&
            scene.textoInteracao.text === this.dangerMessage
        ) {

            // Limpa e esconde o texto.
            scene.textoInteracao
                .setText('')
                .setVisible(false);

            // Se for possível mudar a cor.
            if (scene.textoInteracao.setColor) {

                // Garante que a cor volta a branco.
                scene.textoInteracao.setColor('#ffffff');
            }
        }
    }

    // Ponto de perigo mais próximo.

    // Procura um ponto perigoso perto de uma posição.
    getNearestDangerPoint(x, y, distance = 28) {

        // Cria pontos à volta da posição para verificar perigo.
        const points = [
            { x: x + distance, y },
            { x: x - distance, y },
            { x, y: y + distance },
            { x, y: y - distance },

            { x: x + distance, y: y + distance },
            { x: x - distance, y: y + distance },
            { x: x + distance, y: y - distance },
            { x: x - distance, y: y - distance }
        ];

        // Guarda o ponto perigoso mais próximo encontrado.
        let nearest = null;

        // Guarda a menor distância encontrada.
        let nearestDist = Infinity;

        // Percorre todos os pontos à volta.
        points.forEach(point => {

            // Se este ponto não for perigoso, ignora.
            if (!this.isDangerTileAtWorldXY(point.x, point.y)) return;

            // Calcula a distância entre a posição original e o ponto.
            const dist = Phaser.Math.Distance.Between(x, y, point.x, point.y);

            // Se esta distância for menor que a anterior.
            if (dist < nearestDist) {

                // Atualiza a menor distância.
                nearestDist = dist;

                // Guarda o novo ponto mais próximo.
                nearest = point;
            }
        });

        // Devolve o ponto perigoso mais próximo ou null.
        return nearest;
    }

    // Verifica se existe algum tile perigoso perto de uma posição.
    isNearDangerTile(x, y, distance = 28) {

        // Converte o ponto encontrado em booleano.
        return !!this.getNearestDangerPoint(x, y, distance);
    }

    // Ponte.

    // Verifica se uma posição está em cima de uma ponte.
    isBridgeTileAtWorldXY(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, ponteLayer ou função de leitura de tile, devolve false.
        if (!scene || !scene.ponteLayer || !scene.ponteLayer.getTileAtWorldXY) {
            return false;
        }

        // Vai buscar o tile da ponte nessa posição.
        const tile = scene.ponteLayer.getTileAtWorldXY(x, y);

        // Devolve true se existir tile válido de ponte.
        return !!(tile && tile.index !== -1);
    }

    // Tile de perigo.

    // Verifica se uma posição do mundo está dentro de um tile perigoso.
    isDangerTileAtWorldXY(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou mapa, devolve false.
        if (!scene || !scene.map) return false;

        // Se a posição estiver em ponte, não é perigosa.
        if (this.isBridgeTileAtWorldXY(x, y)) {
            return false;
        }

        // Vai buscar todas as layers de perigo.
        const layers = this.getDangerLayers();

        // Se não houver layers, devolve false.
        if (!layers.length) return false;

        // Percorre cada layer de perigo.
        for (const layer of layers) {

            // Vai buscar o tile nessa posição.
            const tile = layer.getTileAtWorldXY(x, y);

            // Ignora se não houver tile ou se for tile vazio.
            if (!tile || tile.index === -1) continue;

            // Guarda a margem interna de perigo.
            const margin = this.dangerMargin;

            // Calcula o X local dentro do tile.
            const localX = x - tile.pixelX;

            // Calcula o Y local dentro do tile.
            const localY = y - tile.pixelY;

            // Guarda a largura do tile.
            const tileW = scene.map.tileWidth;

            // Guarda a altura do tile.
            const tileH = scene.map.tileHeight;

            // Verifica se o X está dentro da área perigosa do tile.
            const insideX = localX >= margin && localX <= tileW - margin;

            // Verifica se o Y está dentro da área perigosa do tile.
            const insideY = localY >= margin && localY <= tileH - margin;

            // Se estiver dentro da área perigosa.
            if (insideX && insideY) {

                // É perigo.
                return true;
            }
        }

        // Se nenhuma layer marcou perigo, devolve false.
        return false;
    }

    // Inimigos evitam perigo.

    // Faz os inimigos evitarem tiles perigosos.
    avoidDangerZonesForEnemies() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar cena, grupo de inimigos ou se o Game Over começou, não faz nada.
        if (!scene || !scene.enemies || scene.gameOverStarted) return;

        // Percorre todos os inimigos.
        scene.enemies.getChildren().forEach(enemy => {

            // Ignora inimigos inválidos, inativos, mortos ou sem corpo físico.
            if (!enemy || !enemy.active || enemy.isDead || !enemy.body) return;

            // Garante que o inimigo fica na profundidade certa.
            enemy.setDepth(20);

            // Guarda o corpo físico do inimigo.
            const body = enemy.body;

            // Guarda velocidade X atual.
            const vx = body.velocity.x;

            // Guarda velocidade Y atual.
            const vy = body.velocity.y;

            // Se o inimigo estiver parado, não faz nada.
            if (vx === 0 && vy === 0) return;

            // Calcula o comprimento do vetor de velocidade.
            const len = Math.sqrt(vx * vx + vy * vy);

            // Se o comprimento for zero, não faz nada.
            if (len === 0) return;

            // Calcula direção X normalizada.
            const dirX = vx / len;

            // Calcula direção Y normalizada.
            const dirY = vy / len;

            // Define a distância à frente do inimigo para verificar perigo.
            const checkDistance = 22;

            // Calcula ponto à frente do inimigo no eixo X.
            const frontX = body.center.x + dirX * checkDistance;

            // Calcula ponto à frente do inimigo no eixo Y.
            const frontY = body.center.y + dirY * checkDistance;

            // Calcula o ponto dos pés no eixo X.
            const feetX = body.center.x;

            // Calcula o ponto dos pés no eixo Y.
            const feetY = body.bottom - 2;

            // Verifica se existe perigo à frente.
            const dangerAhead = this.isDangerTileAtWorldXY(frontX, frontY);

            // Verifica se existe perigo por baixo dos pés.
            const dangerUnderFeet = this.isDangerTileAtWorldXY(feetX, feetY);

            // Se não houver perigo à frente nem debaixo dos pés, não faz nada.
            if (!dangerAhead && !dangerUnderFeet) return;

            // Guarda a velocidade do inimigo.
            const speed = enemy.speed || 60;

            // Empurra o inimigo na direção oposta ao perigo.
            enemy.setVelocity(-dirX * speed, -dirY * speed);

            // Move ligeiramente o inimigo para trás no eixo X.
            enemy.x -= dirX * 4;

            // Move ligeiramente o inimigo para trás no eixo Y.
            enemy.y -= dirY * 4;

            // Se o inimigo tiver reação de parede.
            if (enemy.onWallHit) {

                // Chama essa reação.
                enemy.onWallHit();
            }

            // Obriga o inimigo a escolher nova direção.
            enemy.nextDirectionChange = 0;
        });
    }

    // Destruir.

    // Limpa o sistema de perigo.
    destroy() {

        // Esconde o texto de perigo de forma forçada.
        this.hideDangerText(true);

        // Remove a referência da cena.
        this.scene = null;
    }
}