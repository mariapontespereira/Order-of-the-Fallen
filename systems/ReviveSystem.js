// Cria a classe ReviveSystem, responsável por reviver jogadores no modo multiplayer de forma geral (ex:inimigos)
export default class ReviveSystem {

    // Construtor do sistema.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;

        // Define o tempo necessário para reviver um jogador.
        this.reviveTime = config.reviveTime || 5000;

        // Define de quanto em quanto tempo o sistema verifica se deve reviver alguém.
        this.checkInterval = config.checkInterval || 500;

        // Guarda o momento em que o Player 1 morreu.
        this.p1DeadTime = null;

        // Guarda o momento em que o Player 2 morreu.
        this.p2DeadTime = null;

        // Define posições padrão de respawn dos jogadores.
        this.spawn = {

            // Posição padrão do Player 1.
            p1: { x: 100, y: 100 },

            // Posição padrão do Player 2.
            p2: { x: 140, y: 100 }
        };

        // Guarda o evento temporizado que chama o update.
        this.timer = null;

        // Se existir cena e sistema de tempo.
        if (scene && scene.time) {

            // Cria um evento repetido para verificar revives.
            this.timer = scene.time.addEvent({

                // Define o intervalo entre verificações.
                delay: this.checkInterval,

                // Faz o evento repetir continuamente.
                loop: true,

                // Define a função chamada a cada intervalo.
                callback: this.update,

                // Garante que o "this" dentro do update aponta para este sistema.
                callbackScope: this
            });
        }
    }

    // Define os pontos de respawn dos jogadores.
    setSpawnPoints(p1, p2) {

        // Se foi enviado spawn do Player 1, guarda-o.
        if (p1) this.spawn.p1 = p1;

        // Se foi enviado spawn do Player 2, guarda-o.
        if (p2) this.spawn.p2 = p2;
    }

    // Atualiza a verificação de revive.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Só funciona em modo multiplayer.
        if (scene.gameMode !== 'multi') return;

        // Se o nível terminou, começou Game Over ou a intro está ativa, não faz nada.
        if (scene.levelFinished || scene.gameOverStarted || scene.levelIntroActive) return;

        // Guarda o Player 1.
        const player1 = scene.player1;

        // Guarda o Player 2.
        const player2 = scene.player2;

        // Se faltar algum jogador, não faz nada.
        if (!player1 || !player2) return;

        // Se os dois morreram, deixa o GameOverSystem tratar

        // Se ambos estiverem mortos, não revive ninguém aqui.
        if (player1.isDead && player2.isDead) {
            return;
        }

        // Se o Player 1 estiver morto.
        if (player1.isDead) {

            // Se ainda não foi guardado o tempo da morte.
            if (!this.p1DeadTime) {

                // Guarda o tempo atual como momento da morte.
                this.p1DeadTime = scene.time.now;
            }

            // Tenta reviver o Player 1.
            this.tryRevive(player1, 'p1');
        } else {

            // Se o Player 1 está vivo, limpa o tempo de morte.
            this.p1DeadTime = null;
        }

        // Se o Player 2 estiver morto.
        if (player2.isDead) {

            // Se ainda não foi guardado o tempo da morte.
            if (!this.p2DeadTime) {

                // Guarda o tempo atual como momento da morte.
                this.p2DeadTime = scene.time.now;
            }

            // Tenta reviver o Player 2.
            this.tryRevive(player2, 'p2');
        } else {

            // Se o Player 2 está vivo, limpa o tempo de morte.
            this.p2DeadTime = null;
        }
    }

    // Verifica se um jogador já pode ser revivido.
    tryRevive(player, playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se não houver jogador ou ele não estiver morto, não faz nada.
        if (!player || !player.isDead) return;

        // Vai buscar o tempo de morte correspondente ao jogador.
        const deadTime = playerId === 'p1' ? this.p1DeadTime : this.p2DeadTime;

        // Se ainda não houver tempo de morte guardado, não faz nada.
        if (!deadTime) return;

        // Guarda o tempo atual.
        const now = scene.time.now;

        // Se já passou tempo suficiente desde a morte.
        if (now - deadTime >= this.reviveTime) {

            // Revive o jogador.
            this.revive(player, playerId);
        }
    }

    // Revive um jogador.
    revive(player, playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se não houver jogador ou dados da personagem, não faz nada.
        if (!player || !player.personagem) return;

        // Vai buscar o ponto de respawn do jogador.
        const spawn = this.spawn[playerId];

        // Se não houver ponto de respawn, não faz nada.
        if (!spawn) return;

        // Marca o jogador como vivo.
        player.isDead = false;

        // Remove estado de dano.
        player.isHurting = false;

        // Remove estado de ataque.
        player.isAttacking = false;

        // Remove estado de bloqueio.
        player.isBlocking = false;

        // Desbloqueia animações.
        player.lockAnim = false;

        // Repõe a redução de bloqueio.
        player.blockReduction = 1;

        // Ativa o jogador.
        player.setActive(true);

        // Torna o jogador visível.
        player.setVisible(true);

        // Coloca o jogador na posição de respawn.
        player.setPosition(spawn.x, spawn.y);

        // Se o jogador tiver corpo físico.
        if (player.body) {

            // Ativa o corpo físico.
            player.body.enable = true;

            // Reinicia o corpo físico na posição de respawn.
            player.body.reset(spawn.x, spawn.y);

            // Para qualquer velocidade do corpo.
            player.body.setVelocity(0, 0);
        }

        // Para qualquer movimento do jogador.
        player.setVelocity(0, 0);

        // Restaura a vida total do jogador.
        player.personagem.vidaAtual = player.personagem.vidaMax;

        // Remove qualquer tint visual.
        player.clearTint();

        // Cria a key da animação idle.
        const idleAnim = `${player.personagem.id}_idle`;

        // Se o player tiver animações e a animação idle existir.
        if (player.anims && scene.anims && scene.anims.exists(idleAnim)) {

            // Toca a animação idle.
            player.anims.play(idleAnim, true);
        }

        // Se o jogador revivido for o Player 1.
        if (playerId === 'p1') {

            // Limpa o tempo de morte do Player 1.
            this.p1DeadTime = null;
        }

        // Se o jogador revivido for o Player 2.
        if (playerId === 'p2') {

            // Limpa o tempo de morte do Player 2.
            this.p2DeadTime = null;
        }

        // Se a cena tiver função de texto de interação.
        if (scene.setInteractionText) {

            // Limpa o texto de interação.
            scene.setInteractionText('', true);
        }
    }

    // Destroi o sistema de revive.
    destroy() {

        // Se existir timer ativo.
        if (this.timer) {

            // Remove o evento repetido.
            this.timer.remove(false);

            // Limpa a referência do timer.
            this.timer = null;
        }

        // Remove a referência da cena.
        this.scene = null;
    }
}