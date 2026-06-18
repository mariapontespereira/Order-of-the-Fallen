// Cria a classe CameraSystem, responsável por controlar a câmara do nível.
export default class CameraSystem {

    // Construtor do sistema da câmara.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde a câmara vai funcionar.
        this.scene = scene;

        // Define o zoom da câmara ou usa 2 como valor padrão.
        this.zoom = config.zoom || 2;

        // Define a suavização do seguimento da câmara.
        this.followLerp = config.followLerp || 0.05;

        // Define a suavização do movimento do alvo da câmara.
        this.targetLerp = config.targetLerp || 0.08;

        // Guarda o alvo invisível que a câmara segue no modo multiplayer.
        this.cameraTarget = null;
    }

    // Configura a câmara no início do nível.
    setup() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Guarda a referência da câmara principal.
        const cam = scene.cameras.main;

        // Se não existir mapa, não configura a câmara.
        if (!scene.map) return;

        // Define os limites da câmara com base no tamanho do mapa.
        cam.setBounds(
            0,
            0,
            scene.map.widthInPixels,
            scene.map.heightInPixels
        );

        // Aplica o zoom definido.
        cam.setZoom(this.zoom);

        // Desativa o arredondamento de pixels da câmara.
        cam.roundPixels = false;

        // Se estiver em multiplayer e existirem os dois jogadores.
        if (scene.gameMode === 'multi' && scene.player1 && scene.player2) {

            // Calcula o ponto médio entre Player 1 e Player 2 no eixo X.
            const midX = (scene.player1.x + scene.player2.x) / 2;

            // Calcula o ponto médio entre Player 1 e Player 2 no eixo Y.
            const midY = (scene.player1.y + scene.player2.y) / 2;

            // Cria uma zona invisível no meio dos dois jogadores.
            this.cameraTarget = scene.add.zone(midX, midY, 10, 10);

            // Esconde o alvo da câmara.
            this.cameraTarget.setVisible(false);

            // Faz a câmara seguir o alvo invisível.
            cam.startFollow(
                this.cameraTarget,
                true,
                this.followLerp,
                this.followLerp
            );
        } else if (scene.player1) {

            // Em singleplayer, faz a câmara seguir diretamente o Player 1.
            cam.startFollow(
                scene.player1,
                true,
                this.followLerp,
                this.followLerp
            );
        }
    }

    // Atualiza a posição do alvo da câmara.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir alvo da câmara ou ele estiver inativo, não atualiza.
        if (!this.cameraTarget || !this.cameraTarget.active) return;

        // Se faltar algum jogador, não atualiza.
        if (!scene.player1 || !scene.player2) return;

        // Verifica se o Player 1 está morto ou inativo.
        const p1Dead = scene.player1.isDead || !scene.player1.active;

        // Verifica se o Player 2 está morto ou inativo.
        const p2Dead = scene.player2.isDead || !scene.player2.active;

        // Começa com o X atual do alvo da câmara.
        let targetX = this.cameraTarget.x;

        // Começa com o Y atual do alvo da câmara.
        let targetY = this.cameraTarget.y;

        // Os dois vivos: câmara no meio dos dois

        // Se os dois jogadores estiverem vivos.
        if (!p1Dead && !p2Dead) {

            // Define o alvo X como o meio entre os dois jogadores.
            targetX = (scene.player1.x + scene.player2.x) / 2;

            // Define o alvo Y como o meio entre os dois jogadores.
            targetY = (scene.player1.y + scene.player2.y) / 2;
        }

        // Só P1 vivo: câmara segue P1

        // Se só o Player 1 estiver vivo.
        else if (!p1Dead && p2Dead) {

            // Define o alvo X como a posição do Player 1.
            targetX = scene.player1.x;

            // Define o alvo Y como a posição do Player 1.
            targetY = scene.player1.y;
        }

        // Só P2 vivo: câmara segue P2

        // Se só o Player 2 estiver vivo.
        else if (p1Dead && !p2Dead) {

            // Define o alvo X como a posição do Player 2.
            targetX = scene.player2.x;

            // Define o alvo Y como a posição do Player 2.
            targetY = scene.player2.y;
        }

        // Os dois mortos

        // Se os dois jogadores estiverem mortos.
        else {

            // Não move a câmara.
            return;
        }

        // Move suavemente o alvo da câmara no eixo X.
        this.cameraTarget.x = Phaser.Math.Linear(
            this.cameraTarget.x,
            targetX,
            this.targetLerp
        );

        // Move suavemente o alvo da câmara no eixo Y.
        this.cameraTarget.y = Phaser.Math.Linear(
            this.cameraTarget.y,
            targetY,
            this.targetLerp
        );
    }

    // Limpa o sistema da câmara.
    destroy() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se existir câmara principal.
        if (scene?.cameras?.main) {

            // Para o seguimento da câmara.
            scene.cameras.main.stopFollow();
        }

        // Se existir alvo invisível da câmara.
        if (this.cameraTarget) {

            // Destroi o alvo da câmara.
            this.cameraTarget.destroy();

            // Limpa a referência do alvo.
            this.cameraTarget = null;
        }
    }
}