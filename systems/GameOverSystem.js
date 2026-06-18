// Cria a classe GameOverSystem, responsável por verificar quando o jogo deve terminar.
export default class GameOverSystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;

        // Controla se o Game Over já foi iniciado.
        this.started = false;
    }

    // Atualiza a verificação de Game Over.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena ou se o Game Over já começou, não faz nada.
        if (!scene || this.started) return;

        // Se o nível já foi concluído, não pode dar Game Over.
        if (scene.levelFinished) return;

        // SINGLEPLAYER: P1 morreu

        // Se estiver em singleplayer e o Player 1 morreu.
        if (scene.gameMode === 'single' && scene.player1?.isDead) {

            // Inicia o Game Over em modo singleplayer.
            this.startGameOver('single', 'player1_dead');

            // Para a função.
            return;
        }

        // MULTIPLAYER: P1 e P2 morreram

        // Se estiver em multiplayer e os dois jogadores morreram.
        if (
            scene.gameMode === 'multi' &&
            scene.player1?.isDead &&
            scene.player2?.isDead
        ) {

            // Inicia o Game Over em modo multiplayer.
            this.startGameOver('multi', 'both_dead');
        }
    }

    // Inicia a transição para a cena de Game Over.
    startGameOver(mode, reason) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, não faz nada.
        if (!scene) return;

        // Se o Game Over já começou, não faz nada.
        if (this.started || scene.gameOverStarted) return;

        // Marca o sistema como iniciado.
        this.started = true;

        // Marca a cena como em Game Over.
        scene.gameOverStarted = true;

        // Se a HUD do nível estiver ativa.
        if (scene.scene.isActive('LevelHUDScene')) {

            // Para a HUD do nível.
            scene.scene.stop('LevelHUDScene');
        }

        // Guarda a key do nível atual.
        const currentLevelKey = scene.sys.settings.key;

        // Faz fade out antes de trocar de cena.
        scene.cameras.main.fadeOut(1000, 0, 0, 0);

        // Quando o fade out terminar.
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Inicia a cena de Game Over e envia dados sobre o nível, modo e motivo.
                scene.scene.start('GameOver', {
                    levelKey: currentLevelKey,
                    mode: mode,
                    reason: reason
                });
            }
        );
    }
}