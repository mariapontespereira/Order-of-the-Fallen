// Cria a classe LevelTimerSystem, responsável pelo temporizador do nível.
export default class LevelTimerSystem {

    // Construtor do sistema.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde o temporizador vai funcionar.
        this.scene = scene;

        // Define o tempo máximo do nível ou usa 120 segundos como padrão.
        this.maxTime = config.maxTime || 120;

        // Guarda o tempo restante, começando pelo tempo máximo.
        this.timeLeft = this.maxTime;

        // Controla se o temporizador já foi iniciado.
        this.started = false;

        // Guarda o evento repetido do temporizador.
        this.timerEvent = null;
    }

    // Inicia o temporizador do nível.
    start() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se o temporizador já começou, não inicia outra vez.
        if (this.started) return;

        // Marca o temporizador como iniciado.
        this.started = true;

        // Reinicia o tempo restante para o tempo máximo.
        this.timeLeft = this.maxTime;

        // Guarda o tempo máximo na cena.
        scene.levelTimeMax = this.maxTime;

        // Guarda o tempo restante na cena.
        scene.levelTimeLeft = this.timeLeft;

        // Marca na cena que o temporizador começou.
        scene.levelTimerStarted = true;

        // Cria um evento que corre a cada segundo.
        this.timerEvent = scene.time.addEvent({

            // Define intervalo de 1 segundo.
            delay: 1000,

            // Faz o evento repetir continuamente.
            loop: true,

            // Função chamada a cada segundo.
            callback: () => {

                // Se o Game Over começou ou o nível terminou, não desconta tempo.
                if (scene.gameOverStarted || scene.levelFinished) return;

                // Desconta 1 segundo ao tempo restante.
                this.timeLeft--;

                // Impede que o tempo fique abaixo de zero.
                if (this.timeLeft < 0) {
                    this.timeLeft = 0;
                }

                // Atualiza o tempo restante guardado na cena.
                scene.levelTimeLeft = this.timeLeft;

                // Se o tempo acabou.
                if (this.timeLeft <= 0) {

                    // Para o temporizador.
                    this.stop();

                    // Executa a lógica de fim de tempo.
                    this.timeOver();
                }
            }
        });
    }

    // Executa o Game Over quando o tempo acaba.
    timeOver() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se o Game Over já começou ou o nível terminou, não faz nada.
        if (scene.gameOverStarted || scene.levelFinished) return;

        // Marca que o Game Over começou.
        scene.gameOverStarted = true;

        // Se a HUD do nível estiver ativa.
        if (scene.scene.isActive('LevelHUDScene')) {

            // Para a HUD do nível.
            scene.scene.stop('LevelHUDScene');
        }

        // Guarda a key do nível atual.
        const currentLevelKey = scene.sys.settings.key;

        // Faz fade out antes de ir para o Game Over.
        scene.cameras.main.fadeOut(800, 0, 0, 0);

        // Quando o fade out terminar.
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Inicia a cena de Game Over com o motivo "time_over".
                scene.scene.start('GameOver', {
                    levelKey: currentLevelKey,
                    mode: scene.gameMode,
                    reason: 'time_over'
                });
            }
        );
    }

    // Para o temporizador.
    stop() {

        // Se existir evento do temporizador.
        if (this.timerEvent) {

            // Remove o evento.
            this.timerEvent.remove(false);

            // Limpa a referência do evento.
            this.timerEvent = null;
        }

        // Marca o temporizador como parado.
        this.started = false;

        // Se ainda existir cena.
        if (this.scene) {

            // Marca na cena que o temporizador já não está iniciado.
            this.scene.levelTimerStarted = false;
        }
    }

    // Destroi o sistema do temporizador.
    destroy() {

        // Para o temporizador e limpa o evento.
        this.stop();
    }
}