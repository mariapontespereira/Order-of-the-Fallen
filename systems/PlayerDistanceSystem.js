// Cria a classe PlayerDistanceSystem, responsável por controlar a distância entre os jogadores no modo multiplayer.
export default class PlayerDistanceSystem {

    // Construtor do sistema.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;

        // Define a distância a partir da qual aparece o aviso.
        this.warningDistance = Math.max(config.warningDistance ?? 420, 420);

        // Define a distância a partir da qual um jogador morre por se afastar demasiado.
        this.killDistance = Math.max(config.killDistance ?? 560, 560);

        // Define o tempo até o jogador morto reviver.
        this.respawnDelay = config.respawnDelay ?? 1800;

        // Distância onde o jogador morto volta perto do jogador vivo

        // Define a distância do respawn em relação ao jogador vivo.
        this.respawnDistance = config.respawnDistance ?? 72;

        // Vida com que o jogador volta.
        // 1 = 100%
        // 0.75 = 75%
        // 0.5 = 50%

        // Define a percentagem de vida ao reviver.
        this.respawnHealthPercent = config.respawnHealthPercent ?? 1;

        // Tempo sem levar dano depois de reviver

        // Define o tempo de invulnerabilidade após reviver.
        this.invulnerableTime = config.invulnerableTime ?? 1800;

        // Evita reviver colado a inimigos

        // Define a distância mínima entre o respawn e os inimigos.
        this.minDistanceFromEnemies = config.minDistanceFromEnemies ?? 90;

        // Define a mensagem de aviso quando os jogadores se afastam.
        this.warningMessage = 'Aproxime-se da sua equipa';

        // Controla se o aviso está ativo.
        this.warningActive = false;

        // Guarda a última posição conhecida do Player 1.
        this.lastP1Position = null;

        // Guarda a última posição conhecida do Player 2.
        this.lastP2Position = null;

        // Impede mortes repetidas enquanto a lógica de afastamento já foi ativada.
        this.deathLocked = false;
    }

    // Atualiza a verificação da distância entre os jogadores.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Só funciona em multiplayer.
        if (scene.gameMode !== 'multi') return;

        // Se faltar algum jogador, não faz nada.
        if (!scene.player1 || !scene.player2) return;

        // Se a intro estiver ativa, o nível terminou ou começou Game Over, não faz nada.
        if (scene.levelIntroActive || scene.levelFinished || scene.gameOverStarted) return;

        // Guarda o Player 1.
        const p1 = scene.player1;

        // Guarda o Player 2.
        const p2 = scene.player2;

        // Verifica se o Player 1 está morto ou inativo.
        const p1Dead = p1.isDead || !p1.active;

        // Verifica se o Player 2 está morto ou inativo.
        const p2Dead = p2.isDead || !p2.active;

        // Se algum jogador estiver morto.
        if (p1Dead || p2Dead) {

            // Limpa o aviso de distância.
            this.clearWarning();

            // Guarda as últimas posições válidas.
            this.saveLastPositions();

            // Para a função.
            return;
        }

        // Calcula a distância entre os dois jogadores.
        const distance = Phaser.Math.Distance.Between(
            p1.x,
            p1.y,
            p2.x,
            p2.y
        );

        // Se a distância passar do limite de morte e ainda não estiver bloqueado.
        if (distance >= this.killDistance && !this.deathLocked) {

            // Bloqueia temporariamente novas mortes por distância.
            this.deathLocked = true;

            // Limpa o aviso.
            this.clearWarning();

            // Escolhe qual jogador se afastou mais.
            const playerToKill = this.getPlayerWhoMovedAwayMore();

            // Define o outro jogador como jogador vivo.
            const alivePlayer = playerToKill === p1 ? p2 : p1;

            // Mata o jogador que se afastou mais.
            this.killPlayer(playerToKill, alivePlayer);

            // Depois de 900ms, permite detectar novamente.
            scene.time.delayedCall(900, () => {
                this.deathLocked = false;
            });

            // Guarda as últimas posições.
            this.saveLastPositions();

            // Para a função.
            return;
        }

        // Se a distância passou do limite de aviso.
        if (distance >= this.warningDistance) {

            // Mostra o aviso.
            this.showWarning();
        } else {

            // Caso contrário, limpa o aviso.
            this.clearWarning();
        }

        // Guarda as últimas posições dos jogadores.
        this.saveLastPositions();
    }

    // Mostra a mensagem de aviso de distância.
    showWarning() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Marca o aviso como ativo.
        this.warningActive = true;

        // Se a cena tiver função para texto de interação.
        if (scene.setInteractionText) {

            // Mostra a mensagem no HUD.
            scene.setInteractionText(this.warningMessage, true);
        }
    }

    // Limpa a mensagem de aviso de distância.
    clearWarning() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se o aviso não estiver ativo, não faz nada.
        if (!this.warningActive) return;

        // Marca o aviso como inativo.
        this.warningActive = false;

        // Vai buscar a cena do HUD.
        const hud = scene.scene?.get('LevelHUDScene');

        // Só apaga se o texto atual ainda for a mensagem do PlayerDistanceSystem.
        // Assim não apaga "E: Sair", "E: abrir baú" ou "Ambos precisam estar na porta".

        // Se o HUD estiver ativo e estiver a mostrar esta mensagem.
        if (
            scene.scene?.isActive('LevelHUDScene') &&
            hud &&
            hud.interactionText &&
            hud.interactionText.text === this.warningMessage &&
            hud.setInteractionText
        ) {

            // Limpa o texto do HUD.
            hud.setInteractionText('', true);

            // Para a função.
            return;
        }

        // Se existir texto antigo de interação e ele estiver a mostrar esta mensagem.
        if (
            scene.textoInteracao &&
            scene.textoInteracao.scene &&
            scene.textoInteracao.text === this.warningMessage
        ) {

            // Limpa o texto antigo.
            scene.textoInteracao.setText('');

            // Esconde o texto antigo.
            scene.textoInteracao.setVisible(false);
        }
    }

    // Guarda as últimas posições conhecidas dos jogadores.
    saveLastPositions() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se o Player 1 existir e estiver ativo.
        if (scene.player1 && scene.player1.active) {

            // Guarda a posição atual do Player 1.
            this.lastP1Position = {
                x: scene.player1.x,
                y: scene.player1.y
            };
        }

        // Se o Player 2 existir e estiver ativo.
        if (scene.player2 && scene.player2.active) {

            // Guarda a posição atual do Player 2.
            this.lastP2Position = {
                x: scene.player2.x,
                y: scene.player2.y
            };
        }
    }

    // Decide qual jogador se afastou mais desde a última verificação.
    getPlayerWhoMovedAwayMore() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se ainda não houver posições anteriores, usa o Player 1 como padrão.
        if (!this.lastP1Position || !this.lastP2Position) {
            return scene.player1;
        }

        // Calcula quanto o Player 1 se moveu desde a última posição.
        const p1Move = Phaser.Math.Distance.Between(
            scene.player1.x,
            scene.player1.y,
            this.lastP1Position.x,
            this.lastP1Position.y
        );

        // Calcula quanto o Player 2 se moveu desde a última posição.
        const p2Move = Phaser.Math.Distance.Between(
            scene.player2.x,
            scene.player2.y,
            this.lastP2Position.x,
            this.lastP2Position.y
        );

        // Devolve o jogador que se moveu mais.
        return p1Move >= p2Move ? scene.player1 : scene.player2;
    }

    // Mata o jogador que se afastou demasiado e agenda o respawn.
    killPlayer(playerToKill, alivePlayer) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver jogador ou ele já estiver morto, não faz nada.
        if (!playerToKill || playerToKill.isDead) return;

        // Limpa o aviso de distância.
        this.clearWarning();

        // Se a cena tiver função damagePlayer.
        if (scene.damagePlayer) {

            // Aplica dano suficiente para matar o jogador.
            scene.damagePlayer(
                playerToKill,
                playerToKill.personagem?.vidaAtual || playerToKill.personagem?.vidaMax || 9999
            );
        } else {

            // Marca o jogador como morto.
            playerToKill.isDead = true;

            // Desativa o jogador.
            playerToKill.setActive(false);

            // Esconde o jogador.
            playerToKill.setVisible(false);

            // Se tiver corpo físico.
            if (playerToKill.body) {

                // Desativa o corpo físico.
                playerToKill.body.enable = false;
            }
        }

        // Agenda o respawn do jogador morto.
        scene.time.delayedCall(this.respawnDelay, () => {

            // Se o sistema já não tiver cena, não faz nada.
            if (!this.scene) return;

            // Se começou Game Over ou o nível terminou, não revive.
            if (scene.gameOverStarted || scene.levelFinished) return;

            // Revive o jogador perto do jogador vivo.
            this.respawnNearAlivePlayer(playerToKill, alivePlayer);
        });
    }

    // Revive o jogador morto perto do jogador vivo.
    respawnNearAlivePlayer(deadPlayer, alivePlayer) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar jogador morto ou jogador vivo, não faz nada.
        if (!deadPlayer || !alivePlayer) return;

        // Se o jogador vivo não estiver ativo ou estiver morto, não revive.
        if (!alivePlayer.active || alivePlayer.isDead) return;

        // Vai buscar uma posição segura perto do jogador vivo.
        const pos = this.getRespawnPositionNearPlayer(alivePlayer);

        // Reviver com mais vida.

        // Restaura a vida do jogador morto.
        this.restorePlayerHealth(deadPlayer);

        // Estados do player.

        // Marca o jogador como vivo.
        deadPlayer.isDead = false;

        // Limpa estado de ataque.
        deadPlayer.isAttacking = false;

        // Limpa estado de dano.
        deadPlayer.isHurting = false;

        // Limpa estado de defesa.
        deadPlayer.isBlocking = false;

        // Desbloqueia animações.
        deadPlayer.lockAnim = false;

        // Invulnerabilidade temporária para não voltar e tomar dano logo

        // Ativa invulnerabilidade temporária.
        deadPlayer.isInvulnerable = true;

        // Ativa também uma segunda flag de invulnerabilidade.
        deadPlayer.invulnerable = true;

        // Ativa o jogador.
        deadPlayer.setActive(true);

        // Torna o jogador visível.
        deadPlayer.setVisible(true);

        // Remove qualquer tint visual.
        deadPlayer.clearTint();

        // Coloca o jogador na posição segura.
        deadPlayer.setPosition(pos.x, pos.y);

        // Se o jogador tiver corpo físico.
        if (deadPlayer.body) {

            // Ativa o corpo físico.
            deadPlayer.body.enable = true;

            // Reinicia o corpo físico na nova posição.
            deadPlayer.body.reset(pos.x, pos.y);

            // Para qualquer velocidade.
            deadPlayer.body.setVelocity(0, 0);
        }

        // Cria a key da animação idle com base na textura do jogador.
        const idleAnim = `${deadPlayer.texture.key}_idle`;

        // Se a animação idle existir.
        if (scene.anims.exists(idleAnim)) {

            // Toca a animação idle.
            deadPlayer.play(idleAnim, true);
        }

        // Efeito visual de proteção

        // Deixa o jogador semi-transparente no início da proteção.
        deadPlayer.setAlpha(0.55);

        // Cria uma animação de piscar para indicar invulnerabilidade.
        scene.tweens.add({

            // Define o jogador como alvo.
            targets: deadPlayer,

            // Volta a alpha para 1.
            alpha: 1,

            // Define a duração de cada pulso.
            duration: 180,

            // Faz voltar ao valor anterior.
            yoyo: true,

            // Repete várias vezes.
            repeat: 6,

            // Quando a animação terminar.
            onComplete: () => {

                // Se o jogador já não existir ou estiver inativo, não faz nada.
                if (!deadPlayer || !deadPlayer.active) return;

                // Garante opacidade total.
                deadPlayer.setAlpha(1);

                // Remove invulnerabilidade.
                deadPlayer.isInvulnerable = false;

                // Remove a segunda flag de invulnerabilidade.
                deadPlayer.invulnerable = false;
            }
        });

        // Garante que a invulnerabilidade termina depois do tempo configurado.
        scene.time.delayedCall(this.invulnerableTime, () => {

            // Se o jogador já não existir, não faz nada.
            if (!deadPlayer) return;

            // Garante opacidade total.
            deadPlayer.setAlpha(1);

            // Remove invulnerabilidade.
            deadPlayer.isInvulnerable = false;

            // Remove a segunda flag de invulnerabilidade.
            deadPlayer.invulnerable = false;
        });

        // Se a cena tiver texto de interação.
        if (scene.setInteractionText) {

            // Limpa qualquer mensagem.
            scene.setInteractionText('', true);
        }
    }

    // Restaura a vida do jogador revivido.
    restorePlayerHealth(player) {

        // Se não houver jogador ou dados da personagem, não faz nada.
        if (!player || !player.personagem) return;

        // Vai buscar a vida máxima.
        const vidaMax = player.personagem.vidaMax || player.vidaMax || 100;

        // Calcula a vida restaurada com base na percentagem configurada.
        const vidaRestaurada = Math.max(
            1,
            Math.floor(vidaMax * this.respawnHealthPercent)
        );

        // Atualiza a vida atual dentro dos dados da personagem.
        player.personagem.vidaAtual = vidaRestaurada;

        // Caso o teu Player também guarde vida diretamente nele

        // Atualiza a vida diretamente no player.
        player.vidaAtual = vidaRestaurada;

        // Atualiza a vida máxima diretamente no player.
        player.vidaMax = vidaMax;

        // Atualizar também o registry, para o HUD não mostrar valor antigo

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se existir cena.
        if (scene) {

            // Se o jogador for o Player 1.
            if (player === scene.player1) {

                // Vai buscar os dados do Player 1 no registry.
                const p1Data = scene.registry.get('player1Hero');

                // Se existirem dados.
                if (p1Data) {

                    // Atualiza a vida atual nos dados.
                    p1Data.vidaAtual = vidaRestaurada;

                    // Atualiza a vida máxima nos dados.
                    p1Data.vidaMax = vidaMax;

                    // Guarda novamente os dados no registry.
                    scene.registry.set('player1Hero', p1Data);
                }
            }

            // Se o jogador for o Player 2.
            if (player === scene.player2) {

                // Vai buscar os dados do Player 2 no registry.
                const p2Data = scene.registry.get('player2Hero');

                // Se existirem dados.
                if (p2Data) {

                    // Atualiza a vida atual nos dados.
                    p2Data.vidaAtual = vidaRestaurada;

                    // Atualiza a vida máxima nos dados.
                    p2Data.vidaMax = vidaMax;

                    // Guarda novamente os dados no registry.
                    scene.registry.set('player2Hero', p2Data);
                }
            }
        }
    }

    // Procura uma posição segura perto do jogador vivo.
    getRespawnPositionNearPlayer(alivePlayer) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Guarda a distância base de respawn.
        const d = this.respawnDistance;

        // Lista de posições candidatas à volta do jogador vivo.
        const positions = [
            { x: alivePlayer.x + d, y: alivePlayer.y },
            { x: alivePlayer.x - d, y: alivePlayer.y },
            { x: alivePlayer.x, y: alivePlayer.y + d },
            { x: alivePlayer.x, y: alivePlayer.y - d },

            { x: alivePlayer.x + d, y: alivePlayer.y + d },
            { x: alivePlayer.x - d, y: alivePlayer.y + d },
            { x: alivePlayer.x + d, y: alivePlayer.y - d },
            { x: alivePlayer.x - d, y: alivePlayer.y - d },

            { x: alivePlayer.x + d * 1.5, y: alivePlayer.y },
            { x: alivePlayer.x - d * 1.5, y: alivePlayer.y },
            { x: alivePlayer.x, y: alivePlayer.y + d * 1.5 },
            { x: alivePlayer.x, y: alivePlayer.y - d * 1.5 }
        ];

        // Percorre todas as posições candidatas.
        for (const pos of positions) {

            // Se a posição for segura.
            if (this.isSafeRespawnPosition(pos.x, pos.y)) {

                // Usa esta posição.
                return pos;
            }
        }

        // Se nenhuma posição for segura, usa a posição do jogador vivo.
        return {
            x: alivePlayer.x,
            y: alivePlayer.y
        };
    }

    // Verifica se uma posição é segura para respawn.
    isSafeRespawnPosition(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver mapa, considera a posição segura.
        if (!scene.map) return true;

        // Bloqueia posições muito perto da borda esquerda ou superior.
        if (x < 20 || y < 20) return false;

        // Bloqueia posições muito perto da borda direita.
        if (x > scene.map.widthInPixels - 20) return false;

        // Bloqueia posições muito perto da borda inferior.
        if (y > scene.map.heightInPixels - 20) return false;

        // Tem de nascer em chão, se houver layer de chão

        // Se existir pelo menos uma layer de chão.
        if (scene.groundLayer || scene.ground2Layer) {

            // Vai buscar tile da layer de chão principal.
            const groundTile = scene.groundLayer?.getTileAtWorldXY(x, y);

            // Vai buscar tile da segunda layer de chão.
            const ground2Tile = scene.ground2Layer?.getTileAtWorldXY(x, y);

            // Verifica se há chão válido.
            const hasGround =
                (groundTile && groundTile.index !== -1) ||
                (ground2Tile && ground2Tile.index !== -1);

            // Se não houver chão, não é seguro.
            if (!hasGround) {
                return false;
            }
        }

        // Não nascer em parede

        // Se existir layer de parede.
        if (scene.paredeLayer) {

            // Vai buscar tile da parede.
            const tile = scene.paredeLayer.getTileAtWorldXY(x, y);

            // Se existir parede, não é seguro.
            if (tile && tile.index !== -1) {
                return false;
            }
        }

        // Se existir segunda layer de parede.
        if (scene.parede2Layer) {

            // Vai buscar tile da segunda parede.
            const tile = scene.parede2Layer.getTileAtWorldXY(x, y);

            // Se existir parede, não é seguro.
            if (tile && tile.index !== -1) {
                return false;
            }
        }

        // Não nascer em água/buraco/lava

        // Se a cena tiver função própria para verificar perigo.
        if (
            scene.isDangerTileAtWorldXY &&
            scene.isDangerTileAtWorldXY(x, y)
        ) {

            // Não é seguro.
            return false;
        }

        // Se existir DangerZoneSystem.
        if (
            scene.dangerZoneSystem &&
            scene.dangerZoneSystem.isDangerTileAtWorldXY(x, y)
        ) {

            // Não é seguro.
            return false;
        }

        // Não nascer dentro de parede invisível

        // Se estiver dentro de parede invisível.
        if (this.isInsideInvisibleWall(x, y)) {

            // Não é seguro.
            return false;
        }

        // Não nascer colado a inimigos

        // Se estiver demasiado perto de inimigos.
        if (this.isTooCloseToEnemies(x, y)) {

            // Não é seguro.
            return false;
        }

        // Se passou todas as verificações, é seguro.
        return true;
    }

    // Verifica se uma posição está dentro de uma parede invisível.
    isInsideInvisibleWall(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou paredes invisíveis, devolve false.
        if (!scene || !scene.paredesInvisiveis) return false;

        // Guarda se está dentro de parede invisível.
        let insideInvisibleWall = false;

        // Percorre todas as paredes invisíveis.
        scene.paredesInvisiveis.children.iterate(parede => {

            // Ignora paredes inválidas ou sem limites.
            if (!parede || !parede.getBounds) return;

            // Se o ponto estiver dentro dos limites da parede.
            if (Phaser.Geom.Rectangle.Contains(parede.getBounds(), x, y)) {

                // Marca como dentro de parede invisível.
                insideInvisibleWall = true;
            }
        });

        // Devolve se está dentro de parede invisível.
        return insideInvisibleWall;
    }

    // Verifica se uma posição está demasiado perto de inimigos.
    isTooCloseToEnemies(x, y) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou inimigos, devolve false.
        if (!scene || !scene.enemies) return false;

        // Guarda se a posição está demasiado perto.
        let tooClose = false;

        // Percorre todos os inimigos.
        scene.enemies.getChildren().forEach(enemy => {

            // Ignora inimigos inválidos, inativos ou mortos.
            if (!enemy || !enemy.active || enemy.isDead) return;

            // Calcula a distância entre a posição e o inimigo.
            const distance = Phaser.Math.Distance.Between(
                x,
                y,
                enemy.x,
                enemy.y
            );

            // Se a distância for menor que o mínimo permitido.
            if (distance < this.minDistanceFromEnemies) {

                // Marca como demasiado perto.
                tooClose = true;
            }
        });

        // Devolve se está demasiado perto de inimigos.
        return tooClose;
    }

    // Destroi o sistema.
    destroy() {

        // Limpa o aviso de distância.
        this.clearWarning();

        // Remove a referência da cena.
        this.scene = null;
    }
}