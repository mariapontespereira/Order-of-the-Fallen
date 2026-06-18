// Cria a classe AttackSystem, responsável por controlar ataques, bloqueio, cura, FX e projéteis.
export default class AttackSystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;
    }

    // Controla os ataques dos jogadores.
    handleAttacks() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se a introdução do nível estiver ativa ou os jogadores não puderem controlar, não faz nada.
        if (scene.levelIntroActive || scene.canControlPlayers === false) return;

        // Cancela o bloqueio do Player 1 se ele começar a mover-se.
        this.cancelBlockIfMoving(scene.player1, 'p1');

        // Trata os ataques do Player 1.
        this.handlePlayerAttacks(scene.player1, 'p1', scene.p1Data, scene.keysP1);

        // Se estiver em multiplayer e existir Player 2.
        if (scene.gameMode === 'multi' && scene.player2 && scene.p2Data) {

            // Cancela o bloqueio do Player 2 se ele começar a mover-se.
            this.cancelBlockIfMoving(scene.player2, 'p2');

            // Trata os ataques do Player 2.
            this.handlePlayerAttacks(scene.player2, 'p2', scene.p2Data, scene.keysP2);
        }
    }

    // Trata o input de ataque de um jogador específico.
    handlePlayerAttacks(player, playerId, playerData, keys) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar jogador, dados, teclas ou se o jogador estiver morto, não faz nada.
        if (!player || player.isDead || !playerData || !keys) return;

        // Vai buscar a configuração de ataques do herói.
        const cfg = scene.attackConfig?.[playerData.id];

        // Se não houver configuração, não faz nada.
        if (!cfg) return;

        // BLOCK TEM PRIORIDADE

        // Se a tecla de bloqueio for pressionada.
        if (Phaser.Input.Keyboard.JustDown(keys.block)) {

            // Tenta usar a ação de bloqueio.
            this.tryUseAction(player, playerId, 'block', cfg.block);

            // Para aqui porque o bloqueio tem prioridade sobre ataques.
            return;
        }

        // Se a tecla do ataque 1 for pressionada.
        if (Phaser.Input.Keyboard.JustDown(keys.atk1)) {

            // Tenta usar o ataque 1.
            this.tryUseAction(player, playerId, 'atk1', cfg.atk1);
        }

        // Se a tecla do ataque 2 for pressionada.
        if (Phaser.Input.Keyboard.JustDown(keys.atk2)) {

            // Tenta usar o ataque 2.
            this.tryUseAction(player, playerId, 'atk2', cfg.atk2);
        }

        // Se a tecla do ataque 3 for pressionada.
        if (Phaser.Input.Keyboard.JustDown(keys.atk3)) {

            // Tenta usar o ataque 3.
            this.tryUseAction(player, playerId, 'atk3', cfg.atk3);
        }
    }

    // Tenta executar uma ação, respeitando estados e cooldowns.
    tryUseAction(player, playerId, actionName, config) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver configuração ou o jogador estiver morto, não faz nada.
        if (!config || player.isDead) return;

        // Impede usar ação enquanto está a atacar, com animação bloqueada ou a bloquear.
        if (player.isAttacking || player.lockAnim || player.isBlocking) return;

        // Guarda o tempo atual da cena.
        const now = scene.time.now;

        // Vai buscar os cooldowns do jogador.
        const cooldowns = scene.attackCooldowns?.[playerId];

        // Se não houver cooldowns, não faz nada.
        if (!cooldowns) return;

        // Se a ação ainda estiver em cooldown, não faz nada.
        if (cooldowns[actionName] > now) return;

        // Define o cooldown da ação.
        const cooldown = config.cooldown || this.getDefaultCooldown(actionName);

        // Guarda o momento em que o cooldown termina.
        cooldowns[actionName] = now + cooldown;

        // Se a ação for bloqueio.
        if (actionName === 'block') {

            // Executa o bloqueio.
            this.block(player, config);

            // Para a função.
            return;
        }

        // Executa o ataque.
        this.attack(player, config, actionName);
    }

    // Devolve cooldown padrão caso a configuração não tenha cooldown.
    getDefaultCooldown(actionName) {

        // Cooldown padrão do ataque 1.
        if (actionName === 'atk1') return 350;

        // Cooldown padrão do ataque 2.
        if (actionName === 'atk2') return 15000;

        // Cooldown padrão do ataque 3.
        if (actionName === 'atk3') return 25000;

        // Cooldown padrão do bloqueio.
        if (actionName === 'block') return 1000;

        // Cooldown padrão geral.
        return 500;
    }

    // Executa um ataque, cura, FX ou dano normal.
    attack(player, config, actionName) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar jogador, configuração ou o jogador estiver morto, não faz nada.
        if (!player || !config || player.isDead) return;

        // Marca o jogador como a atacar.
        player.isAttacking = true;

        // Bloqueia a animação do jogador.
        player.lockAnim = true;

        // Para o movimento do jogador.
        player.setVelocity(0, 0);

        // Guarda se o ataque tem animação.
        let hasAnimation = false;

        // Se existir animação configurada e ela estiver carregada.
        if (config.anim && scene.anims.exists(config.anim)) {

            // Toca a animação do ataque.
            player.anims.play(config.anim, true);

            // Marca que existe animação.
            hasAnimation = true;
        }

        // Guarda a configuração de FX ou projétil.
        const fxConfig = config.fx || config.projectile;

        // Define o atraso até aplicar o efeito do ataque.
        const hitDelay = config.hitDelay ?? 250;

        // Espera o tempo do impacto antes de aplicar cura, FX ou dano.
        scene.time.delayedCall(hitDelay, () => {

        // Se o jogador já não existir ou morreu, não faz nada.
        if (!player || player.isDead) return;

        // Cura.

        // Se este ataque for do tipo cura.
        if (config.type === 'heal') {

            // Cura os aliados dentro do alcance.
            this.healAllies(player, config);

            // Mostra o FX da cura, se existir
            if (fxConfig) {

                // Cria o FX da cura.
                this.spawnFX(player, fxConfig, config);
            }

            // Para a função atrasada.
            return;
        }

        // FX / projétil.

        // Se existir FX ou projétil configurado.
        if (fxConfig) {

            // Cria o FX ou projétil.
            this.spawnFX(player, fxConfig, config);

            // Para aqui porque o dano será tratado pelo FX.
            return;
        }

        // Dano normal.

        // Se houver dano configurado.
        if (config.damage) {

            // Aplica dano aos inimigos sem FX.
            this.damageEnemies(player, config, actionName);
        }
    });

        // Função que desbloqueia o jogador depois do ataque.
        const unlock = () => {

            // Se o jogador já não existir ou morreu, não faz nada.
            if (!player || player.isDead) return;

            // Desbloqueia a animação.
            player.lockAnim = false;

            // Marca que já não está a atacar.
            player.isAttacking = false;
        };

        // Se o ataque tinha animação.
        if (hasAnimation) {

            // Desbloqueia quando a animação terminar.
            player.once('animationcomplete', unlock);
        } else {

            // Caso não tenha animação, desbloqueia após a duração configurada.
            scene.time.delayedCall(config.duration || 500, unlock);
        }

        // Segurança para desbloquear mesmo que a animação não termine.
        scene.time.delayedCall(config.maxDuration || 1200, () => {

            // Se o jogador ainda estiver bloqueado e a atacar.
            if (player && player.active && player.lockAnim && player.isAttacking) {

                // Desbloqueia o jogador.
                unlock();
            }
        });
    }

    // Cancela o bloqueio se o jogador começar a mover-se.
    cancelBlockIfMoving(player, playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver jogador ou ele estiver morto, não faz nada.
        if (!player || player.isDead) return;

        // Se o jogador não estiver a bloquear, não faz nada.
        if (!player.isBlocking) return;

        // Não cancela o block nos primeiros milissegundos.
        // Isto permite o block começar imediatamente mesmo se tinhas acabado de andar.

        // Calcula há quanto tempo o bloqueio começou.
        const blockAge = scene.time.now - (player.blockStartedAt || 0);

        // Se o bloqueio acabou de começar, ainda não cancela.
        if (blockAge < 120) return;

        // Guarda se o jogador está a mover-se.
        let isMoving = false;

        // Se for o Player 1 e existirem setas.
        if (playerId === 'p1' && scene.cursors) {

            // Verifica se alguma seta está pressionada.
            isMoving =
                scene.cursors.left?.isDown ||
                scene.cursors.right?.isDown ||
                scene.cursors.up?.isDown ||
                scene.cursors.down?.isDown;
        }

        // Se for o Player 2 e existirem teclas WASD.
        if (playerId === 'p2' && scene.keysWASD) {

            // Verifica se alguma tecla WASD está pressionada.
            isMoving =
                scene.keysWASD.left?.isDown ||
                scene.keysWASD.right?.isDown ||
                scene.keysWASD.up?.isDown ||
                scene.keysWASD.down?.isDown;
        }

        // Se não estiver a mover-se, mantém o bloqueio.
        if (!isMoving) return;

        // Cancela o bloqueio.
        this.cancelBlock(player);
    }

    // Cancela o estado de bloqueio do jogador.
    cancelBlock(player) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver jogador, não faz nada.
        if (!player) return;

        // Se existir timer do bloqueio.
        if (player.blockTimer) {

            // Remove o timer do bloqueio.
            player.blockTimer.remove(false);

            // Limpa a referência do timer.
            player.blockTimer = null;
        }

        // Remove o estado de bloqueio.
        player.isBlocking = false;

        // Desbloqueia a animação.
        player.lockAnim = false;

        // Remove estado de ataque.
        player.isAttacking = false;

        // Restaura o valor normal de redução de dano.
        player.blockReduction = 1;

        // Cria a key da animação idle do herói.
        const idleKey = `${player.personagem.id}_idle`;

        // Se a animação idle existir.
        if (scene.anims.exists(idleKey)) {

            // Toca a animação idle.
            player.anims.play(idleKey, true);
        }
    }

    // Executa o bloqueio do jogador.
    block(player, config) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar jogador, configuração ou o jogador estiver morto, não faz nada.
        if (!player || player.isDead || !config) return;

        // Para tudo imediatamente

        // Para o movimento do jogador.
        player.setVelocity(0, 0);

        // Se o jogador tiver corpo físico.
        if (player.body) {

            // Para também a velocidade do corpo físico.
            player.body.setVelocity(0, 0);
        }

        // Cancela qualquer animação anterior

        // Se o jogador tiver sistema de animação.
        if (player.anims) {

            // Para a animação atual.
            player.anims.stop();
        }

        // Marca o jogador como a bloquear.
        player.isBlocking = true;

        // Bloqueia a animação.
        player.lockAnim = true;

        // Garante que não está marcado como atacante.
        player.isAttacking = false;

        // Momento em que começou o block
        // Serve para não cancelar no mesmo instante se ainda tinhas a tecla de andar pressionada

        // Guarda o momento em que o bloqueio começou.
        player.blockStartedAt = scene.time.now;

        // Define a redução de dano do bloqueio.
        player.blockReduction = config.reduction ?? 0;

        // Se houver animação de bloqueio configurada.
        if (config.anim && scene.anims.exists(config.anim)) {

            // Toca a animação de bloqueio.
            player.anims.play(config.anim, true);
        }

        // Se já existir timer de bloqueio.
        if (player.blockTimer) {

            // Remove o timer antigo.
            player.blockTimer.remove(false);

            // Limpa a referência.
            player.blockTimer = null;
        }

        // Cria o timer que termina o bloqueio.
        player.blockTimer = scene.time.delayedCall(config.duration || 900, () => {

            // Se o jogador já não existir ou morreu, não faz nada.
            if (!player || player.isDead) return;

            // Se já não estiver a bloquear, não faz nada.
            if (!player.isBlocking) return;

            // Cancela o bloqueio.
            this.cancelBlock(player);
        });
    }

    // Dano sem FX.

    // Aplica dano aos inimigos sem criar FX.
    damageEnemies(player, config, actionName) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se faltar jogador, configuração ou dano, não faz nada.
        if (!player || !config || !config.damage) return;

        // Se não houver grupo de inimigos, não faz nada.
        if (!scene.enemies) return;

        // Verifica se o ataque deve usar linha de flecha.
        const isArrowAttack = config.arrowLine === true;

        // Se for ataque em linha.
        if (isArrowAttack) {

            // Aplica dano numa linha à frente do jogador.
            this.damageEnemiesInArrowLine(player, config);

            // Para a função.
            return;
        }

        // Aplica dano em círculo.
        this.damageEnemiesInCircle(player, config);
    }

    // Aplica dano em inimigos dentro de um círculo.
    damageEnemiesInCircle(player, config) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver grupo de inimigos, não faz nada.
        if (!scene.enemies) return;

        // Define o alcance do ataque.
        const range = config.range || 70;

        // Percorre todos os inimigos.
        scene.enemies.getChildren().forEach(enemy => {

            // Ignora inimigos inválidos, inativos ou mortos.
            if (!enemy || !enemy.active || enemy.isDead) return;

            // Calcula a distância entre jogador e inimigo.
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                enemy.x,
                enemy.y
            );

            // Se o inimigo estiver dentro do alcance.
            if (dist <= range) {

                // Aplica dano ao inimigo.
                this.applyDamageToEnemy(enemy, config.damage);
            }
        });
    }

    // Aplica dano numa área retangular à frente do jogador.
    damageEnemiesInArrowLine(player, config) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver inimigos, não faz nada.
        if (!scene.enemies) return;

        // Guarda a direção atual do jogador.
        const direction = this.getPlayerDirection(player);

        // Define o alcance da linha.
        const range = config.range || 100;

        // Define a largura da linha.
        const width = config.width || 14;

        // Define o X inicial da hitbox.
        let hitboxX = player.x;

        // Define o Y inicial da hitbox.
        let hitboxY = player.y;

        // Define a largura inicial da hitbox.
        let hitboxW = width;

        // Define a altura inicial da hitbox.
        let hitboxH = width;

        // Se o jogador estiver virado para a esquerda.
        if (direction === 'left') {

            // Move a hitbox para a esquerda.
            hitboxX = player.x - range / 2;

            // Define a largura da hitbox.
            hitboxW = range;

            // Define a altura da hitbox.
            hitboxH = width;
        } else if (direction === 'right') {

            // Move a hitbox para a direita.
            hitboxX = player.x + range / 2;

            // Define a largura da hitbox.
            hitboxW = range;

            // Define a altura da hitbox.
            hitboxH = width;
        } else if (direction === 'up') {

            // Mantém o X do jogador.
            hitboxX = player.x;

            // Move a hitbox para cima.
            hitboxY = player.y - range / 2;

            // Define a largura da hitbox.
            hitboxW = width;

            // Define a altura da hitbox.
            hitboxH = range;
        } else if (direction === 'down') {

            // Mantém o X do jogador.
            hitboxX = player.x;

            // Move a hitbox para baixo.
            hitboxY = player.y + range / 2;

            // Define a largura da hitbox.
            hitboxW = width;

            // Define a altura da hitbox.
            hitboxH = range;
        }

        // Cria a hitbox retangular do ataque.
        const arrowHitbox = new Phaser.Geom.Rectangle(
            hitboxX - hitboxW / 2,
            hitboxY - hitboxH / 2,
            hitboxW,
            hitboxH
        );

        // Controla se a hitbox de debug deve aparecer.
        const debug = false;

        // Se o debug estiver ativo.
        if (debug) {

            // Cria graphics para desenhar a hitbox.
            const g = scene.add.graphics();

            // Define a linha magenta.
            g.lineStyle(2, 0xff00ff, 1);

            // Desenha a hitbox.
            g.strokeRectShape(arrowHitbox);

            // Remove o desenho depois de pouco tempo.
            scene.time.delayedCall(150, () => {

                // Destroi o graphics, se existir.
                if (g) g.destroy();
            });
        }

        // Percorre todos os inimigos.
        scene.enemies.getChildren().forEach(enemy => {

            // Ignora inimigos inválidos, inativos ou mortos.
            if (!enemy || !enemy.active || enemy.isDead) return;

            // Vai buscar os limites físicos/visuais do inimigo.
            const enemyBounds = enemy.getBounds();

            // Se a hitbox do ataque tocar nos limites do inimigo.
            if (Phaser.Geom.Intersects.RectangleToRectangle(arrowHitbox, enemyBounds)) {

                // Aplica dano ao inimigo.
                this.applyDamageToEnemy(enemy, config.damage);
            }
        });
    }

    // Direção do player.

    // Devolve a direção atual do jogador.
    getPlayerDirection(player) {

        // Se não houver jogador, usa direita por padrão.
        if (!player) return 'right';

        // Tenta buscar a direção guardada no jogador.
        let direction =
            player.lastDirection ||
            player.direction ||
            player.facing ||
            player.facingDirection;

        // Converte direções em português para inglês.
        if (direction === 'esquerda') direction = 'left';

        // Converte direção direita.
        if (direction === 'direita') direction = 'right';

        // Converte direção cima.
        if (direction === 'cima') direction = 'up';

        // Converte direção baixo.
        if (direction === 'baixo') direction = 'down';

        // Lista de direções aceites.
        const validDirections = [
            'left',
            'right',
            'up',
            'down',
            'up-left',
            'up-right',
            'down-left',
            'down-right'
        ];

        // Se a direção não for válida.
        if (!validDirections.includes(direction)) {

            // Usa flipX para escolher esquerda ou direita.
            direction = player.flipX ? 'left' : 'right';
        }

        // Devolve a direção final.
        return direction;
    }

    // Devolve o vetor da direção do jogador.
    getDirectionVector(player) {

        // Vai buscar o último vetor X guardado no jogador.
        let x = player?.lastDirX;

        // Vai buscar o último vetor Y guardado no jogador.
        let y = player?.lastDirY;

        // Se X ou Y não forem números válidos.
        if (typeof x !== 'number' || typeof y !== 'number') {

            // Vai buscar a direção em texto.
            const direction = this.getPlayerDirection(player);

            // Se a direção for esquerda.
            if (direction === 'left') {
                x = -1;
                y = 0;
            }

            // Se a direção for direita.
            else if (direction === 'right') {
                x = 1;
                y = 0;
            }

            // Se a direção for cima.
            else if (direction === 'up') {
                x = 0;
                y = -1;
            }

            // Se a direção for baixo.
            else if (direction === 'down') {
                x = 0;
                y = 1;
            }

            // Se a direção for cima-esquerda.
            else if (direction === 'up-left') {
                x = -1;
                y = -1;
            }

            // Se a direção for cima-direita.
            else if (direction === 'up-right') {
                x = 1;
                y = -1;
            }

            // Se a direção for baixo-esquerda.
            else if (direction === 'down-left') {
                x = -1;
                y = 1;
            }

            // Se a direção for baixo-direita.
            else if (direction === 'down-right') {
                x = 1;
                y = 1;
            }

            // Direção fallback.
            else {
                x = 1;
                y = 0;
            }
        }

        // Se o vetor estiver parado.
        if (x === 0 && y === 0) {

            // Usa direita como direção padrão.
            x = 1;
            y = 0;
        }

        // Cria e normaliza o vetor.
        const vec = new Phaser.Math.Vector2(x, y).normalize();

        // Devolve os valores da direção e o ângulo.
        return {
            x: vec.x,
            y: vec.y,
            angle: Phaser.Math.RadToDeg(Math.atan2(vec.y, vec.x))
        };
    }

    // Aplicar dano.

    // Aplica dano a um inimigo.
    applyDamageToEnemy(enemy, damage) {

        // Se o inimigo for inválido, inativo ou morto, não faz nada.
        if (!enemy || !enemy.active || enemy.isDead) return;

        // Se o inimigo tiver função própria de receber dano.
        if (typeof enemy.takeDamage === 'function') {

            // Usa a função própria do inimigo.
            enemy.takeDamage(damage);

            // Se o inimigo morreu e ainda não contou score.
            if (enemy.isDead && this.scene.scoreSystem && !enemy.scoreCounted) {

                // Marca que o score já foi contado.
                enemy.scoreCounted = true;

                // Adiciona score pelo inimigo.
                this.scene.scoreSystem.addEnemy(enemy.type);
            }

            // Para a função.
            return;
        }

        // Reduz a vida atual do inimigo.
        enemy.vidaAtual = (enemy.vidaAtual ?? 100) - damage;

        // Aplica tint vermelho para indicar dano.
        enemy.setTint(0xff5555);

        // Remove o tint depois de pouco tempo.
        this.scene.time.delayedCall(100, () => {

            // Se o inimigo ainda existir e estiver ativo.
            if (enemy && enemy.active) enemy.clearTint();
        });

        // Se a vida chegou a zero ou menos.
        if (enemy.vidaAtual <= 0) {

            // Marca o inimigo como morto.
            enemy.isDead = true;

            // Se existir sistema de score e ainda não contou.
            if (this.scene.scoreSystem && !enemy.scoreCounted) {

                // Marca que o score já foi contado.
                enemy.scoreCounted = true;

                // Adiciona score pelo inimigo.
                this.scene.scoreSystem.addEnemy(enemy.type);
            }

            // Destroi o inimigo.
            enemy.destroy();
        }
    }

    // Calcula a distância entre dois objetos.
    getDistanceBetweenObjects(a, b) {

        // Usa o centro do corpo físico do primeiro objeto, se existir.
        const ax = a.body ? a.body.center.x : a.x;

        // Usa o centro do corpo físico do primeiro objeto, se existir.
        const ay = a.body ? a.body.center.y : a.y;

        // Usa o centro do corpo físico do segundo objeto, se existir.
        const bx = b.body ? b.body.center.x : b.x;

        // Usa o centro do corpo físico do segundo objeto, se existir.
        const by = b.body ? b.body.center.y : b.y;

        // Devolve a distância entre os dois pontos.
        return Phaser.Math.Distance.Between(ax, ay, bx, by);
    }

    // Cura.

    // Cura aliados dentro do alcance.
    healAllies(player, config) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Cria uma lista com os jogadores existentes.
        const allies = [scene.player1, scene.player2].filter(Boolean);

        // Percorre os aliados.
        allies.forEach(ally => {

            // Ignora aliados inválidos, mortos ou sem dados de personagem.
            if (!ally || ally.isDead || !ally.personagem) return;

            // Calcula a distância entre quem curou e o aliado.
            const dist = this.getDistanceBetweenObjects(player, ally);

            // Se estiver fora do alcance, não cura.
            if (dist > (config.range || 70)) return;

            // Cura sem ultrapassar a vida máxima.
            ally.personagem.vidaAtual = Math.min(
                ally.personagem.vidaAtual + (config.heal || 0),
                ally.personagem.vidaMax
            );

            // Aplica tint verde para indicar cura.
            ally.setTint(0x66ff99);

            // Remove o tint depois de pouco tempo.
            scene.time.delayedCall(150, () => {

                // Se o aliado ainda existir e estiver ativo.
                if (ally && ally.active) ally.clearTint();
            });
        });
    }

    // Devolve a direção que o FX deve usar.
    getFXDirection(player, fxConfig) {

        // Vai buscar a direção atual do jogador.
        let direction = this.getPlayerDirection(player);

        // Se o FX só puder ser horizontal.
        if (fxConfig.onlyHorizontal) {

            // Se a direção atual for vertical ou diagonal.
            if (
                direction === 'up' ||
                direction === 'down' ||
                direction === 'up-left' ||
                direction === 'up-right' ||
                direction === 'down-left' ||
                direction === 'down-right'
            ) {

                // Usa esquerda ou direita conforme o flip do jogador.
                direction = player.flipX ? 'left' : 'right';
            }
        }

        // Devolve a direção final do FX.
        return direction;
    }

    // FX / projéteis.

    // Cria um FX ou projétil do ataque.
    spawnFX(player, fxConfig, attackConfig = {}) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se o jogador não existir ou estiver morto, não faz nada.
        if (!player || player.isDead) return;

        // Se não houver configuração de FX ou key, não faz nada.
        if (!fxConfig || !fxConfig.key) return;

        // Se a textura do FX não existir.
        if (!scene.textures.exists(fxConfig.key)) {

            // Mostra aviso na consola.
            console.warn('Texture do FX não existe:', fxConfig.key);

            // Cancela a criação do FX.
            return;
        }

        // Vai buscar a direção do FX.
        const direction = this.getFXDirection(player, fxConfig);

        // Vai buscar o vetor da direção do jogador.
        const dirVector = this.getDirectionVector(player);

        // Define o X inicial do FX.
        let x = player.x;

        // Define o Y inicial do FX.
        let y = player.y;

        // Define offset X do FX.
        const offsetX = fxConfig.offsetX ?? 25;

        // Define offset Y do FX.
        const offsetY = fxConfig.offsetY ?? 18;

        // Se a direção for esquerda.
        if (direction === 'left') {

            // Move o FX para a esquerda.
            x -= offsetX;
        }

        // Se a direção for direita.
        else if (direction === 'right') {

            // Move o FX para a direita.
            x += offsetX;
        }

        // Se a direção for cima.
        else if (direction === 'up') {

            // Move o FX para cima.
            y -= offsetY;
        }

        // Se a direção for baixo.
        else if (direction === 'down') {

            // Move o FX para baixo.
            y += fxConfig.offsetYDown ?? offsetY;
        }

        // Se for diagonal.
        else {
            // diagonais

            // Move o FX usando o vetor diagonal.
            x += dirVector.x * offsetX;

            // Move o FX usando o vetor diagonal.
            y += dirVector.y * offsetY;
        }

        // Cria o sprite físico do FX.
        const fx = scene.physics.add.sprite(x, y, fxConfig.key);

        // Define a escala do FX.
        fx.setScale(fxConfig.scale ?? 0.25);

        // Define a profundidade do FX.
        fx.setDepth(fxConfig.depth ?? 10);

        // Se o FX tiver corpo físico.
        if (fx.body) {

            // Desativa gravidade do FX.
            fx.body.allowGravity = false;
        }

        // Se existir animação de FX configurada.
        if (fxConfig.anim && scene.anims.exists(fxConfig.anim)) {

            // Toca a animação do FX.
            fx.anims.play(fxConfig.anim, true);
        }

        // Define a velocidade do FX.
        const speed = fxConfig.speed || 250;

        // Se o FX deve seguir o jogador.
        if (fxConfig.follow) {

            // Mantém o FX parado.
            fx.setVelocity(0, 0);

            // Cria evento para atualizar posição do FX.
            scene.time.addEvent({

                // Atualiza aproximadamente a cada frame.
                delay: 16,

                // Repete durante a duração do FX.
                repeat: Math.floor((fxConfig.duration || 500) / 16),

                // Função chamada repetidamente.
                callback: () => {

                    // Se o FX ou jogador não forem válidos, não faz nada.
                    if (!fx || !fx.active || !player || !player.active) return;

                    // Coloca o FX na posição do jogador.
                    fx.setPosition(player.x, player.y);
                }
            });
        } else {

            // Move o FX na direção do jogador.
            fx.setVelocity(dirVector.x * speed, dirVector.y * speed);

            // flip só para esquerda/direita

            // Vira o FX se estiver a ir para a esquerda.
            fx.flipX = dirVector.x < 0;

            // Se o FX deve rodar conforme a direção.
            if (fxConfig.rotateWithDirection) {

                // Aplica o ângulo do vetor.
                fx.setAngle(dirVector.angle);
            } else {

                // Mantém o FX sem rotação.
                fx.setAngle(0);
            }
        }

        // Hitbox do FX / projétil.

        // Só usa hitbox retangular se o AttackConfig tiver hitboxLength.
        // Exemplo: flechas arrow01, arrow02, arrow03.

        // Verifica se existe hitbox retangular personalizada.
        const hasCustomRectangleHitbox =
            fxConfig.hitboxLength !== undefined ||
            attackConfig.hitboxLength !== undefined;

        // Se o FX tiver corpo físico.
        if (fx.body) {

            // Se usar hitbox retangular.
            if (hasCustomRectangleHitbox) {
                // Hitbox retangular para flechas

                // Verifica se a direção é horizontal.
                const isHorizontal = direction === 'left' || direction === 'right';

                // Verifica se a direção é vertical.
                const isVertical = direction === 'up' || direction === 'down';

                // Verifica se a direção é diagonal.
                const isDiagonal = !isHorizontal && !isVertical;

                // Define o comprimento da hitbox.
                const hitboxLength =
                    fxConfig.hitboxLength ??
                    attackConfig.hitboxLength ??
                    24;

                // Define a grossura da hitbox.
                const hitboxThickness =
                    fxConfig.hitboxThickness ??
                    attackConfig.width ??
                    6;

                // Guarda a largura da hitbox.
                let hitboxW;

                // Guarda a altura da hitbox.
                let hitboxH;

                // Se a direção for horizontal.
                if (isHorizontal) {

                    // Usa hitbox comprida na horizontal.
                    hitboxW = hitboxLength;

                    // Usa hitbox fina na vertical.
                    hitboxH = hitboxThickness;
                }

                // Se a direção for vertical.
                else if (isVertical) {

                    // Usa hitbox fina na horizontal.
                    hitboxW = hitboxThickness;

                    // Usa hitbox comprida na vertical.
                    hitboxH = hitboxLength;
                }

                // Se a direção for diagonal.
                else if (isDiagonal) {
                    // para diagonal, uma hitbox quadrada funciona melhor

                    // Usa hitbox quadrada.
                    hitboxW = hitboxLength;

                    // Usa hitbox quadrada.
                    hitboxH = hitboxLength;
                }

                // Define o tamanho da hitbox do FX.
                fx.body.setSize(hitboxW, hitboxH);

                // Centraliza a hitbox dentro do sprite.
                fx.body.setOffset(
                    Math.max(0, (fx.width - hitboxW) / 2),
                    Math.max(0, (fx.height - hitboxH) / 2)
                );
            } else {
                // Hitbox quadrada normal para mago, priest, etc.

                // Define o tamanho da hitbox quadrada.
                const hitboxSize = fxConfig.hitbox || 18;

                // Define o tamanho da hitbox.
                fx.body.setSize(hitboxSize, hitboxSize);

                // Centraliza a hitbox dentro do sprite.
                fx.body.setOffset(
                    Math.max(0, (fx.width - hitboxSize) / 2),
                    Math.max(0, (fx.height - hitboxSize) / 2)
                );
            }
        }

        // Controla se o debug da hitbox do FX aparece.
        const debugFX = false;

        // Se o debug do FX estiver ativo.
        if (debugFX && fx.body) {

            // Cria evento para desenhar a hitbox repetidamente.
            const debugEvent = scene.time.addEvent({

                // Intervalo do debug.
                delay: 30,

                // Repete enquanto o FX existir.
                loop: true,

                // Função chamada no debug.
                callback: () => {

                    // Se o FX já não existir ou não tiver corpo.
                    if (!fx || !fx.active || !fx.body) {

                        // Remove o evento de debug.
                        debugEvent.remove(false);

                        // Para a função.
                        return;
                    }

                    // Cria graphics para desenhar a hitbox.
                    const g = scene.add.graphics();

                    // Define linha magenta.
                    g.lineStyle(2, 0xff00ff, 1);

                    // Desenha a hitbox física do FX.
                    g.strokeRect(
                        fx.body.x,
                        fx.body.y,
                        fx.body.width,
                        fx.body.height
                    );

                    // Remove o desenho rapidamente.
                    scene.time.delayedCall(40, () => {

                        // Destroi o graphics.
                        if (g) g.destroy();
                    });
                }
            });
        }

        // Se existir layer de paredes.
        if (scene.paredeLayer) {

            // Adiciona colisão entre o FX e a parede.
            scene.physics.add.collider(fx, scene.paredeLayer, fxObj => {

                // Destroi o FX ao bater na parede.
                if (fxObj && fxObj.active) fxObj.destroy();
            });
        }

        // Se existirem paredes invisíveis.
        if (scene.paredesInvisiveis) {

            // Adiciona colisão entre FX e paredes invisíveis.
            scene.physics.add.collider(fx, scene.paredesInvisiveis, fxObj => {

                // Destroi o FX ao bater na parede invisível.
                if (fxObj && fxObj.active) fxObj.destroy();
            });
        }

        // Calcula o dano final do FX.
        const finalDamage = fxConfig.damage ?? attackConfig.damage ?? 0;

        // Guarda o raio extra de impacto do FX.
        const fxHitRadius = fxConfig.hitRadius ?? attackConfig.hitRadius ?? 0;

        // Guarda inimigos que já sofreram dano deste FX.
        const damagedEnemies = new Set();

        // Função chamada quando o FX acerta num inimigo.
        const hitEnemy = (fxObj, enemy) => {

            // Se o FX não existir ou estiver inativo, não faz nada.
            if (!fxObj || !fxObj.active) return;

            // Se o inimigo não existir, estiver inativo ou morto, não faz nada.
            if (!enemy || !enemy.active || enemy.isDead) return;

            // Se este inimigo já sofreu dano deste FX, não repete.
            if (damagedEnemies.has(enemy)) return;

            // Marca o inimigo como atingido.
            damagedEnemies.add(enemy);

            // Aplica dano ao inimigo.
            this.applyDamageToEnemy(enemy, finalDamage);

            // Se o FX não atravessa inimigos.
            if (!fxConfig.pierce) {

                // Destroi o FX.
                fxObj.destroy();
            }
        };

        // Se existirem inimigos e o FX tiver dano.
        if (scene.enemies && finalDamage > 0) {

            // Adiciona overlap entre FX e inimigos.
            scene.physics.add.overlap(
                fx,
                scene.enemies,
                hitEnemy,
                null,
                scene
            );

            // Se houver raio extra de acerto.
            if (fxHitRadius > 0) {

                // Cria verificação manual por distância.
                const manualCheck = scene.time.addEvent({

                    // Intervalo da verificação.
                    delay: 30,

                    // Repete enquanto o FX existir.
                    loop: true,

                    // Função chamada na verificação.
                    callback: () => {

                        // Se o FX já não existir.
                        if (!fx || !fx.active) {

                            // Remove o evento.
                            manualCheck.remove(false);

                            // Para a função.
                            return;
                        }

                        // Percorre os inimigos.
                        scene.enemies.getChildren().forEach(enemy => {

                            // Ignora inimigos inválidos, inativos ou mortos.
                            if (!enemy || !enemy.active || enemy.isDead) return;

                            // Calcula a distância entre FX e inimigo.
                            const dist = this.getDistanceBetweenObjects(fx, enemy);

                            // Se estiver dentro do raio extra.
                            if (dist <= fxHitRadius) {

                                // Aplica impacto.
                                hitEnemy(fx, enemy);
                            }
                        });
                    }
                });
            }
        }

        // Destroi o FX depois da duração configurada.
        scene.time.delayedCall(fxConfig.duration || 800, () => {

            // Se o FX ainda existir e estiver ativo.
            if (fx && fx.active) fx.destroy();
        });

        // Devolve o FX criado.
        return fx;
    }
}