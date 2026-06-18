// Cria a classe PlayerHealthSystem, responsável por controlar dano, cura, morte e revive dos jogadores.
export default class PlayerHealthSystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;
    }

    // Aplica dano a um jogador.
    damagePlayer(player, dmg) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se não houver jogador, se ele já estiver morto ou se não tiver dados da personagem, não faz nada.
        if (!player || player.isDead || !player.personagem) return;

        // Bloqueio.

        // Se o jogador estiver a bloquear.
        if (player.isBlocking) {

            // Vai buscar a redução de dano do bloqueio.
            const reduction = player.blockReduction ?? 0;

            // Calcula o dano final depois da redução.
            const finalDamage = Math.floor(dmg * reduction);

            // Aplica tint azul para indicar bloqueio.
            player.setTint(0x66ccff);

            // Remove o tint depois de pouco tempo.
            scene.time.delayedCall(120, () => {

                // Se o jogador ainda existir e estiver ativo.
                if (player && player.active) player.clearTint();
            });

            // Se o dano final for zero ou menor.
            if (finalDamage <= 0) {

                // Cancela o dano.
                return;
            }

            // Atualiza o dano para o valor reduzido.
            dmg = finalDamage;
        }

        // Dano.

        // Retira vida da personagem.
        player.personagem.vidaAtual -= dmg;

        // Marca que o jogador sofreu dano neste nível.
        scene.playerTookDamage = true;

        // Se a vida ficou abaixo de zero.
        if (player.personagem.vidaAtual < 0) {

            // Corrige a vida para zero.
            player.personagem.vidaAtual = 0;
        }

        // Aplica tint vermelho para indicar dano.
        player.setTint(0xff3300);

        // Marca o jogador como em estado de dano.
        player.isHurting = true;

        // Se existir animação de dano.
        if (player.anims && scene.anims.exists(`${player.personagem.id}_hurt`)) {

            // Toca a animação de dano.
            player.anims.play(`${player.personagem.id}_hurt`, true);
        }

        // Remove o tint depois de pouco tempo.
        scene.time.delayedCall(150, () => {

            // Se o jogador ainda existir e estiver ativo.
            if (player && player.active) player.clearTint();
        });

        // Quando a animação terminar.
        player.once('animationcomplete', () => {

            // Se o jogador ainda existir e estiver ativo.
            if (player && player.active) {

                // Remove o estado de dano.
                player.isHurting = false;
            }
        });

        // Morte.

        // Se a vida chegou a zero.
        if (player.personagem.vidaAtual <= 0) {

            // Mata o jogador.
            this.killPlayer(player);
        }
    }

    // Mata um jogador.
    killPlayer(player) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se não houver jogador, se ele já estiver morto ou se não tiver dados da personagem, não faz nada.
        if (!player || player.isDead || !player.personagem) return;

        // Marca o jogador como morto.
        player.isDead = true;

        // Remove estado de bloqueio.
        player.isBlocking = false;

        // Desbloqueia animações.
        player.lockAnim = false;

        // Remove estado de ataque.
        player.isAttacking = false;

        // Para o movimento do jogador.
        player.setVelocity(0);

        // Se o jogador tiver corpo físico.
        if (player.body) {

            // Desativa o corpo físico.
            player.body.enable = false;
        }

        // Se existir animação de morte.
        if (player.anims && scene.anims.exists(`${player.personagem.id}_death`)) {

            // Toca a animação de morte.
            player.anims.play(`${player.personagem.id}_death`, true);
        }

        // Espera antes de esconder o jogador.
        scene.time.delayedCall(800, () => {

            // Se o jogador já não existir ou não tiver cena, não faz nada.
            if (!player || !player.scene) return;

            // Esconde o jogador.
            player.setVisible(false);

            // Desativa o jogador.
            player.setActive(false);
        });
    }

    // Cura um jogador.
    healPlayer(player, amount) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se não houver jogador, se não tiver dados da personagem ou se estiver morto, não faz nada.
        if (!player || !player.personagem || player.isDead) return;

        // Aumenta a vida sem ultrapassar a vida máxima.
        player.personagem.vidaAtual = Math.min(
            player.personagem.vidaAtual + amount,
            player.personagem.vidaMax
        );

        // Aplica tint verde para indicar cura.
        player.setTint(0x66ff99);

        // Remove o tint depois de pouco tempo.
        scene.time.delayedCall(150, () => {

            // Se o jogador ainda existir e estiver ativo.
            if (player && player.active) player.clearTint();
        });
    }

    // Revive um jogador numa posição específica.
    revivePlayer(player, x, y, healthPercent = 0.5) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se não houver jogador ou se não tiver dados da personagem, não faz nada.
        if (!player || !player.personagem) return;

        // Coloca o jogador na posição de revive.
        player.setPosition(x, y);

        // Ativa o jogador.
        player.setActive(true);

        // Torna o jogador visível.
        player.setVisible(true);

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

        // Se o jogador tiver corpo físico.
        if (player.body) {

            // Ativa o corpo físico.
            player.body.enable = true;

            // Reinicia o corpo físico na nova posição.
            player.body.reset(x, y);

            // Para qualquer movimento.
            player.setVelocity(0);
        }

        // Restaura a vida com base na percentagem recebida.
        player.personagem.vidaAtual = Math.ceil(
            player.personagem.vidaMax * healthPercent
        );

        // Remove qualquer tint visual.
        player.clearTint();

        // Cria a key da animação idle.
        const idleAnim = `${player.personagem.id}_idle`;

        // Se a animação idle existir.
        if (scene.anims && scene.anims.exists(idleAnim)) {

            // Toca a animação idle.
            player.play(idleAnim, true);
        }
    }
}