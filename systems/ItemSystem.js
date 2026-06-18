// Cria a classe ItemSystem, responsável por criar, validar, recolher e aplicar efeitos dos itens.
export default class ItemSystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;
    }

    // Spawn aleatório seguro.

    // Cria um item numa posição aleatória válida do mapa.
    spawnRandom(textureKey) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, mapa ou grupo de itens, não cria nada.
        if (!scene || !scene.map || !scene.itemsGroup) return null;

        // Número máximo de tentativas para encontrar uma posição segura.
        const maxTries = 200;

        // Tenta encontrar uma posição válida várias vezes.
        for (let i = 0; i < maxTries; i++) {

            // Escolhe uma posição X aleatória dentro dos limites do mapa.
            const x = Phaser.Math.Between(40, scene.map.widthInPixels - 40);

            // Escolhe uma posição Y aleatória dentro dos limites do mapa.
            const y = Phaser.Math.Between(40, scene.map.heightInPixels - 40);

            // Se a posição não for válida, tenta outra.
            if (!this.isValidSpawnPosition(x, y)) {
                continue;
            }

            // Cria o item no grupo de itens.
            const item = scene.itemsGroup.create(x, y, textureKey);

            // Define a escala visual do item.
            item.setScale(0.8);

            // Define a profundidade do item.
            item.setDepth(8);

            // Guarda a key do item no próprio objeto.
            item.itemKey = textureKey;

            // Devolve o item criado.
            return item;
        }

        // Mostra aviso caso não encontre posição segura.
        console.warn(`Não foi possível encontrar posição segura para o item: ${textureKey}`);

        // Devolve null porque não conseguiu criar o item.
        return null;
    }

    // Validar posição do spawn.

    // Verifica se uma posição é válida para nascer um item.
    isValidSpawnPosition(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena ou mapa, a posição não é válida.
        if (!scene || !scene.map) return false;

        // Fora do mapa.

        // Se a posição estiver demasiado perto das bordas do mapa.
        if (
            x < 40 ||
            y < 40 ||
            x > scene.map.widthInPixels - 40 ||
            y > scene.map.heightInPixels - 40
        ) {

            // A posição é inválida.
            return false;
        }

        // Tem de ter chão.

        // Vai buscar o tile da primeira layer de chão.
        const groundTile = scene.groundLayer?.getTileAtWorldXY(x, y);

        // Vai buscar o tile da segunda layer de chão.
        const ground2Tile = scene.ground2Layer?.getTileAtWorldXY(x, y);

        // Vai buscar o tile da terceira layer de chão.
        const ground3Tile = scene.ground3Layer?.getTileAtWorldXY(x, y);

        // Verifica se existe pelo menos um tile de chão válido.
        const hasGround =
            !!(groundTile && groundTile.index !== -1) ||
            !!(ground2Tile && ground2Tile.index !== -1) ||
            !!(ground3Tile && ground3Tile.index !== -1);

        // Se não houver chão, a posição é inválida.
        if (!hasGround) {
            return false;
        }

        // Não pode nascer em parede.

        // Cria uma lista com as layers de parede existentes.
        const wallLayers = [
            scene.paredeLayer,
            scene.parede2Layer,
            scene.paredesLayer
        ].filter(Boolean);

        // Percorre todas as layers de parede.
        for (const layer of wallLayers) {

            // Vai buscar o tile de parede nesta posição.
            const wallTile = layer.getTileAtWorldXY(x, y);

            // Se existir parede nesta posição, é inválida.
            if (wallTile && wallTile.index !== -1) {
                return false;
            }
        }

        // Não pode nascer em água / lava / buraco.

        // Se existir DangerZoneSystem e ele indicar perigo nesta posição.
        if (
            scene.dangerZoneSystem &&
            scene.dangerZoneSystem.isDangerTileAtWorldXY(x, y)
        ) {

            // A posição é inválida.
            return false;
        }

        // Segurança extra caso o DangerZoneSystem não apanhe alguma layer

        // Vai buscar tile da água.
        const waterTile = scene.waterLayer?.getTileAtWorldXY(x, y);

        // Vai buscar tile da segunda layer de água.
        const water2Tile = scene.water2Layer?.getTileAtWorldXY(x, y);

        // Vai buscar tile de buraco.
        const buracoTile = scene.buracosLayer?.getTileAtWorldXY(x, y);

        // Vai buscar tile da ponte.
        const bridgeTile = scene.ponteLayer?.getTileAtWorldXY(x, y);

        // Verifica se a posição está em cima de ponte.
        const isBridge = !!(bridgeTile && bridgeTile.index !== -1);

        // Se não for ponte, água/lava/buraco bloqueia spawn

        // Se a posição não estiver em ponte.
        if (!isBridge) {

            // Se existir tile de água válido, bloqueia o spawn.
            if (waterTile && waterTile.index !== -5) return false;

            // Se existir tile de buraco válido, bloqueia o spawn.
            if (buracoTile && buracoTile.index !== -3) return false;
        }

        // Mantém compatibilidade com a tua função antiga

        // Se a função antiga detectar área de perigo.
        if (this.isDangerArea && this.isDangerArea(x, y)) {

            // Bloqueia o spawn.
            return false;
        }

        // Não pode nascer dentro de paredes invisíveis.

        // Se existirem paredes invisíveis.
        if (scene.paredesInvisiveis) {

            // Verifica se a posição está dentro de alguma parede invisível.
            const insideInvisibleWall = scene.paredesInvisiveis.getChildren().some(parede => {

                // Ignora objetos inválidos ou sem getBounds.
                if (!parede || !parede.getBounds) return false;

                // Verifica se o ponto está dentro da parede invisível.
                return Phaser.Geom.Rectangle.Contains(
                    parede.getBounds(),
                    x,
                    y
                );
            });

            // Se estiver dentro de parede invisível, é inválido.
            if (insideInvisibleWall) {
                return false;
            }
        }

        // Não pode nascer em cima da porta / baú / objetos interativos.

        // Se existir grupo de objetos interativos.
        if (scene.interativosGroup) {

            // Verifica se a posição está perto demais de algum objeto interativo.
            const tooCloseToInteractive = scene.interativosGroup.getChildren().some(obj => {

                // Ignora objetos inválidos ou inativos.
                if (!obj || !obj.active) return false;

                // Calcula a distância entre a posição e o objeto.
                const dist = Phaser.Math.Distance.Between(
                    x,
                    y,
                    obj.x,
                    obj.y
                );

                // Bloqueia se estiver muito perto.
                return dist < 36;
            });

            // Se estiver perto demais de interativos, é inválido.
            if (tooCloseToInteractive) {
                return false;
            }
        }

        // Não pode nascer demasiado perto de outros itens.

        // Se existir grupo de itens.
        if (scene.itemsGroup) {

            // Verifica se a posição está perto demais de outro item.
            const tooCloseToItem = scene.itemsGroup.getChildren().some(item => {

                // Ignora itens inválidos ou inativos.
                if (!item || !item.active) return false;

                // Calcula a distância entre a posição e o item.
                const dist = Phaser.Math.Distance.Between(
                    x,
                    y,
                    item.x,
                    item.y
                );

                // Bloqueia se estiver demasiado perto.
                return dist < 28;
            });

            // Se estiver perto demais de outro item, é inválido.
            if (tooCloseToItem) {
                return false;
            }
        }

        // Posição válida.

        // Se passou todas as verificações, a posição é válida.
        return true;
    }

    // Verificar área de perigo.

    // Verifica vários pontos à volta de uma posição para detectar perigo.
    isDangerArea(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Define o raio de verificação à volta da posição.
        const checkRadius = 14;

        // Cria uma lista de pontos à volta da posição.
        const points = [
            { x, y },

            { x: x + checkRadius, y },
            { x: x - checkRadius, y },
            { x, y: y + checkRadius },
            { x, y: y - checkRadius },

            { x: x + checkRadius, y: y + checkRadius },
            { x: x - checkRadius, y: y + checkRadius },
            { x: x + checkRadius, y: y - checkRadius },
            { x: x - checkRadius, y: y - checkRadius }
        ];

        // Verifica se algum dos pontos está em perigo.
        return points.some(point => {

            // Se estiver em cima da ponte, não conta como perigo

            // Se a cena tiver função para verificar ponte e o ponto estiver em ponte.
            if (scene.isBridgeTileAtWorldXY && scene.isBridgeTileAtWorldXY(point.x, point.y)) {

                // Não conta como perigo.
                return false;
            }

            // Usa o sistema novo de perigo, se existir

            // Se a cena tiver função nova de perigo e o ponto for perigoso.
            if (scene.isDangerTileAtWorldXY && scene.isDangerTileAtWorldXY(point.x, point.y)) {

                // Conta como perigo.
                return true;
            }

            // Verificação direta na água

            // Se existir layer de água.
            if (scene.waterLayer) {

                // Vai buscar o tile de água no ponto.
                const waterTile = scene.waterLayer.getTileAtWorldXY(point.x, point.y);

                // Se existir tile de água válido, conta como perigo.
                if (waterTile && waterTile.index !== -1) {
                    return true;
                }
            }

            // Se nenhum perigo foi detectado neste ponto.
            return false;
        });
    }

    // Apanhar item.

    // Recolhe um item quando um jogador toca nele.
    coletarItem(player, item) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar cena, jogador, item ou textura, não faz nada.
        if (!scene || !player || !item || !item.texture) return;

        // Se ainda não existir objeto de moedas.
        if (!scene.coins) {

            // Cria o objeto de moedas para os dois jogadores.
            scene.coins = { p1: 0, p2: 0 };
        }

        // Se ainda não existir estado do íman.
        if (!scene.magnet) {

            // Cria o estado do íman para os dois jogadores.
            scene.magnet = { p1: false, p2: false };
        }

        // Se ainda não existirem inventários.
        if (!scene.inventories) {

            // Cria inventários para os dois jogadores.
            scene.inventories = { p1: [], p2: [] };
        }

        // Guarda o nome/key do item.
        const itemName = item.texture.key;

        // Define qual jogador apanhou o item.
        const playerId = player === scene.player2 ? 'p2' : 'p1';

        // Moeda.

        // Se o item for uma moeda.
        if (itemName === 'coin') {

            // Se existir sistema de score.
            if (scene.scoreSystem) {

                // Adiciona score pela moeda.
                scene.scoreSystem.addItem('coin');
            }

            // Aumenta as moedas do jogador.
            scene.coins[playerId]++;

            // Atualiza a interface.
            this.updateNewUI();

            // Remove a moeda do mapa.
            item.destroy();

            // Para a função.
            return;
        }

        // Íman.

        // Se o item for um íman.
        if (itemName === 'magnet') {

            // Ativa o íman para este jogador.
            scene.magnet[playerId] = true;

            // Se já havia um timer do íman, remove para reiniciar a duração

            // Se ainda não existir objeto de timers do íman.
            if (!scene.magnetTimers) {

                // Cria timers para os dois jogadores.
                scene.magnetTimers = {
                    p1: null,
                    p2: null
                };
            }

            // Se já existir timer ativo deste jogador.
            if (scene.magnetTimers[playerId]) {

                // Remove o timer antigo.
                scene.magnetTimers[playerId].remove(false);

                // Limpa a referência.
                scene.magnetTimers[playerId] = null;
            }

            // DURAÇÃO DO ÍMAN
            // 5000 = 5 segundos

            // Cria um novo timer para desligar o íman.
            scene.magnetTimers[playerId] = scene.time.delayedCall(6000, () => {

                // Desativa o íman deste jogador.
                scene.magnet[playerId] = false;

                // Limpa o timer do jogador.
                scene.magnetTimers[playerId] = null;

                // Atualiza a interface.
                this.updateNewUI();
            });

            // Atualiza a interface.
            this.updateNewUI();

            // Remove o item do mapa.
            item.destroy();

            // Para a função.
            return;
        }

        // Inventário.

        // Guarda o inventário do jogador.
        const inv = scene.inventories[playerId];

        // Se não houver inventário, não faz nada.
        if (!inv) return;

        // Procura se o item já existe no inventário.
        const existing = inv.find(i => i.key === itemName);

        // Se o item ainda não existe e o inventário está cheio, não apanha

        // Se o item não existe e já há 4 tipos de item.
        if (!existing && inv.length >= 4) {

            // Não apanha o item.
            return;
        }

        // Pontos do item.

        // Se existir sistema de score.
        if (scene.scoreSystem) {

            // Adiciona score pelo item.
            scene.scoreSystem.addItem(itemName);
        }

        // Adicionar ao inventário.

        // Se o item já existia no inventário.
        if (existing) {

            // Aumenta a quantidade.
            existing.amount++;
        } else {

            // Adiciona novo item ao inventário.
            inv.push({
                key: itemName,
                amount: 1
            });
        }

        // Atualiza a interface.
        this.updateNewUI();

        // Remove o item do mapa.
        item.destroy();
    }

    // Atualizar UI nova.

    // Atualiza a interface do inventário, moedas e HUD.
    updateNewUI() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se existir InventorySystem com função de atualizar UI.
        if (scene.inventorySystem && scene.inventorySystem.updateInventoryUI) {

            // Atualiza a UI do inventário.
            scene.inventorySystem.updateInventoryUI();
        }

        // Se existir HUD antigo do Player 1.
        if (scene.hudP1) {

            // Atualiza o HUD do Player 1.
            scene.hudP1.atualizar();
        }

        // Se existir HUD antigo do Player 2.
        if (scene.hudP2) {

            // Atualiza o HUD do Player 2.
            scene.hudP2.atualizar();
        }

        // Vai buscar a cena do HUD novo.
        const hud = scene.scene.get('LevelHUDScene');

        // Se a cena do HUD não estiver ativa ou não existir, não faz mais nada.
        if (!scene.scene.isActive('LevelHUDScene') || !hud) return;

        // Se o HUD tiver função geral de atualizar.
        if (hud.updateHUD) {

            // Atualiza o HUD completo.
            hud.updateHUD();

            // Para a função.
            return;
        }

        // Se existir função para atualizar moedas, chama essa função.
        if (hud.updateCoinUI) hud.updateCoinUI();

        // Se existir função para atualizar inventário, chama essa função.
        if (hud.updateInventoryUI) hud.updateInventoryUI();

        // Se existir função para atualizar timer, chama essa função.
        if (hud.updateTimerUI) hud.updateTimerUI();
    }

    // Update do íman.

    // Atualiza o efeito do íman nos jogadores.
    updateMagnet() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar cena, grupo de itens ou estado do íman, não faz nada.
        if (!scene || !scene.itemsGroup || !scene.magnet) return;

        // Aplica o íman ao Player 1.
        this.applyMagnet(scene.player1, 'p1');

        // Se existir Player 2.
        if (scene.player2) {

            // Aplica o íman ao Player 2.
            this.applyMagnet(scene.player2, 'p2');
        }
    }

    // Aplica o efeito do íman a um jogador.
    applyMagnet(player, playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar cena, grupo de itens ou estado do íman, não faz nada.
        if (!scene || !scene.itemsGroup || !scene.magnet) return;

        // Se não houver jogador ou ele estiver morto, não faz nada.
        if (!player || player.isDead) return;

        // Se o íman deste jogador não estiver ativo, não faz nada.
        if (!scene.magnet[playerId]) return;

        // Percorre todos os itens do mapa.
        scene.itemsGroup.getChildren().forEach(item => {

            // Ignora itens inválidos ou inativos.
            if (!item || !item.active) return;

            // O íman só puxa moedas.
            if (item.texture.key !== 'coin') return;

            // Calcula a distância entre jogador e moeda.
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                item.x,
                item.y
            );

            // Se a moeda estiver dentro do alcance do íman.
            if (dist < 120) {

                // Move a moeda na direção do jogador.
                scene.physics.moveToObject(item, player, 300);
            }
        });
    }
}