// Cria a classe LevelIntroSystem, responsável pelo ecrã inicial de cada nível.
export default class LevelIntroSystem {

    // Construtor do sistema.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde este sistema vai funcionar.
        this.scene = scene;

        // Define o número do nível ou usa "1" como padrão.
        this.levelNumber = config.levelNumber || '1';

        // Define o nome do nível ou usa "VALE DAS RUÍNAS" como padrão.
        this.levelName = config.levelName || 'VALE DAS RUÍNAS';

        // Define a dificuldade ou usa "FÁCIL" como padrão.
        this.difficulty = config.difficulty || 'FÁCIL';

        // Define a imagem de fundo da intro do nível.
        this.backgroundKey = config.backgroundKey || 'bg_level1';

        // Define a key do nível atual.
        this.levelKey = config.levelKey || scene.sys.settings.key;

        // Guarda o índice da opção selecionada no menu.
        this.selectedIndex = 0;

        // Controla se já está a mudar de cena ou iniciar o nível.
        this.isChangingScene = false;

        // Guarda o container principal da intro.
        this.overlay = null;

        // Guarda as opções do menu.
        this.menuItems = [];

        // Guarda os textos das opções do menu.
        this.menuTexts = [];

        // Guarda as zonas clicáveis das opções.
        this.menuZones = [];

        // Guarda a barra visual da opção selecionada.
        this.selectorBar = null;

        // Guarda o losango seletor.
        this.selector = null;
    }

    // Cria a interface da introdução do nível.
    create() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Guarda a câmara principal.
        const cam = scene.cameras.main;

        // Para o seguimento da câmara.
        cam.stopFollow();

        // Coloca o zoom em 1 para mostrar a intro em ecrã inteiro.
        cam.setZoom(1);

        // Desativa arredondamento de pixels.
        cam.roundPixels = false;

        // Coloca a câmara no canto inicial.
        cam.setScroll(0, 0);

        // Guarda largura e altura da câmara.
        const { width, height } = cam;

        // Marca que a introdução do nível está ativa.
        scene.levelIntroActive = true;

        // Bloqueia os controlos dos jogadores.
        scene.canControlPlayers = false;

        // Para o movimento do Player 1, se existir.
        if (scene.player1) scene.player1.setVelocity(0);

        // Para o movimento do Player 2, se existir.
        if (scene.player2) scene.player2.setVelocity(0);

        // Cria o container principal da intro.
        this.overlay = scene.add.container(0, 0)

            // Faz o container ficar fixo no ecrã.
            .setScrollFactor(0)

            // Coloca a intro acima dos objetos do nível.
            .setDepth(1002);

        // Cria a imagem de fundo da intro.
        const bgImage = scene.add.image(width / 2, height / 2, this.backgroundKey)

            // Ajusta a imagem ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Centra a imagem.
            .setOrigin(0.5);

        // Cria uma camada escura sobre o fundo.
        const darkOverlay = scene.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência.
            .setAlpha(0.45);

        // Cria uma segunda camada escura para dar efeito de vinheta.
        const vignette = scene.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define uma transparência mais leve.
            .setAlpha(0.18);

        // Cria o texto "NÍVEL".
        const title = scene.add.text(width * 0.22, height * 0.58, 'NÍVEL', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '88px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 8
        }).setOrigin(0.5);

        // Cria o texto do número do nível.
        const number = scene.add.text(width * 0.35, height * 0.58, this.levelNumber, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Usa tamanho menor se o número for "FINAL".
            fontSize: this.levelNumber === 'FINAL' ? '82px' : '100px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada.
            color: '#ffd36a',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 8
        }).setOrigin(0.5);

        // Cria o texto com o nome do mapa.
        const mapName = scene.add.text(width * 0.30, height * 0.70, this.levelName, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho do texto.
            fontSize: '28px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        }).setOrigin(0.5);

        // Cria o texto da dificuldade.
        const difficultyText = scene.add.text(width * 0.30, height * 0.76, `DIFICULDADE: ${this.difficulty}`, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
            fontSize: '15px',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85);

        // Seleciona a primeira opção do menu.
        this.selectedIndex = 0;

        // Botões da intro.
        // Level1 tem:
        // Começar
        // Escolher Personagem
        // Voltar ao Menu
        //
        // Outros níveis têm:
        // Começar
        // Voltar ao Menu

        // Se o nível atual for o Level1.
        if (this.levelKey === 'Level1') {

            // Cria as opções completas da intro do Level1.
            this.menuItems = [
                {
                    // Texto da opção.
                    text: 'Começar',

                    // Ação para começar o nível.
                    action: () => this.startLevel()
                },
                {
                    // Texto da opção.
                    text: 'Escolher Personagem',

                    // Ação para ir à seleção de personagem.
                    action: () => this.handleSecondaryAction()
                },
                {
                    // Texto da opção.
                    text: 'Voltar ao Menu',

                    // Ação para voltar ao menu principal.
                    action: () => this.backToMenu()
                }
            ];
        } else {

            // Cria as opções para os outros níveis.
            this.menuItems = [
                {
                    // Texto da opção.
                    text: 'Começar',

                    // Ação para começar o nível.
                    action: () => this.startLevel()
                },
                {
                    // Texto da opção.
                    text: 'Voltar ao Menu',

                    // Ação para voltar ao menu principal.
                    action: () => this.backToMenu()
                }
            ];
        }

        // Limpa a lista de textos do menu.
        this.menuTexts = [];

        // Limpa a lista de zonas clicáveis.
        this.menuZones = [];

        // Define a posição X do menu.
        const menuX = width * 0.74;

        // POSIÇÃO ANTIGA DO MENU
        // Não volta a subir para 0.50.

        // Define a posição Y inicial do menu.
        const startY = height * 0.55;

        // Define o espaço vertical entre opções.
        const gapY = 48;

        // Cria a barra da opção selecionada.
        this.selectorBar = scene.add.rectangle(
            menuX - 20,
            startY,
            300,
            32,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define a transparência.
        .setAlpha(0.32);

        // Cria o losango seletor.
        this.selector = scene.add.polygon(
            menuX - 190,
            startY,
            [
                0, 8,
                13, 0,
                26, 8,
                13, 16
            ],
            0xffd36a
        ).setOrigin(0.5);

        // Percorre todas as opções do menu.
        for (let i = 0; i < this.menuItems.length; i++) {

            // Guarda a opção atual.
            const item = this.menuItems[i];

            // Calcula a posição Y desta opção.
            const optionY = startY + i * gapY;

            // Cria uma zona clicável maior do que o texto.
            const zone = scene.add.zone(
                menuX - 20,
                optionY,
                370,
                42
            )

            // Centra a zona.
            .setOrigin(0.5)

            // Torna a zona interativa.
            .setInteractive({ useHandCursor: true });

            // Cria o texto da opção.
            const txt = scene.add.text(
                menuX,
                optionY,
                item.text,
                {
                    // Define a fonte.
                    fontFamily: 'Arial',

                    // Usa tamanho menor se for a segunda opção e o texto for longo.
                    fontSize: i === 1 && item.text.length > 20 ? '18px' : '22px',

                    // Define a cor inicial.
                    color: '#e8e2d0',

                    // Define a cor do contorno.
                    stroke: '#000000',

                    // Define a espessura do contorno.
                    strokeThickness: 3
                }
            ).setOrigin(0.5);

            // Quando o rato passa por cima da zona.
            zone.on('pointerover', () => {

                // Atualiza a opção selecionada.
                this.selectedIndex = i;

                // Atualiza o visual da seleção.
                this.updateSelection();
            });

            // Quando clica na zona.
            zone.on('pointerdown', () => {

                // Diminui ligeiramente o texto.
                txt.setScale(0.98);
            });

            // Quando solta o clique.
            zone.on('pointerup', () => {

                // Atualiza a opção selecionada.
                this.selectedIndex = i;

                // Atualiza o visual da seleção.
                this.updateSelection();

                // Escolhe a opção.
                this.chooseOption();
            });

            // Quando o rato sai da zona.
            zone.on('pointerout', () => {

                // Atualiza o visual da seleção.
                this.updateSelection();
            });

            // Guarda a zona clicável.
            this.menuZones.push(zone);

            // Guarda o texto do menu.
            this.menuTexts.push(txt);
        }

        // Cria o texto de ajuda dos controlos.
        const helpText = scene.add.text(
            width * 0.73,
            height * 0.77,
            '↑ ↓  Navegar      ENTER / ESPAÇO  Selecionar',
            {
                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '14px',

                // Define a cor branca.
                color: '#ffffff',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 3
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85);

        // Adiciona todos os elementos visuais ao container da intro.
        this.overlay.add([
            bgImage,
            darkOverlay,
            vignette,
            title,
            number,
            mapName,
            difficultyText,
            this.selectorBar,
            this.selector,
            ...this.menuZones,
            ...this.menuTexts,
            helpText
        ]);

        // Atualiza a seleção inicial.
        this.updateSelection();

        // Cria a animação do losango seletor.
        scene.tweens.add({

            // Define o losango como alvo.
            targets: this.selector,

            // Move ligeiramente para a direita.
            x: this.selector.x + 8,

            // Define a duração.
            duration: 500,

            // Faz a animação voltar.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

        // Cria a tecla cima.
        this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Cria a tecla baixo.
        this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Cria a tecla ENTER.
        this.keyEnter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla ESPAÇO.
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Atualiza os controlos da intro do nível.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, não faz nada.
        if (!scene) return;

        // Se a intro do nível não estiver ativa, não faz nada.
        if (!scene.levelIntroActive) return;

        // Se alguma tecla ainda não foi criada, não faz nada.
        if (!this.keyUp || !this.keyDown || !this.keyEnter || !this.keySpace) return;

        // Mantém o Player 1 parado durante a intro.
        if (scene.player1) scene.player1.setVelocity(0);

        // Mantém o Player 2 parado durante a intro.
        if (scene.player2) scene.player2.setVelocity(0);

        // Se carregar na tecla cima.
        if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

            // Move a seleção para cima.
            this.selectedIndex--;

            // Se passar da primeira opção, vai para a última.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.menuItems.length - 1;
            }

            // Atualiza o visual da seleção.
            this.updateSelection();
        }

        // Se carregar na tecla baixo.
        if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {

            // Move a seleção para baixo.
            this.selectedIndex++;

            // Se passar da última opção, volta para a primeira.
            if (this.selectedIndex >= this.menuItems.length) {
                this.selectedIndex = 0;
            }

            // Atualiza o visual da seleção.
            this.updateSelection();
        }

        // Se carregar ENTER ou ESPAÇO.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            Phaser.Input.Keyboard.JustDown(this.keySpace)
        ) {

            // Escolhe a opção selecionada.
            this.chooseOption();
        }
    }

    // Atualiza o visual da opção selecionada.
    updateSelection() {

        // Se não existirem textos do menu, não faz nada.
        if (!this.menuTexts || this.menuTexts.length === 0) return;

        // Guarda o texto selecionado.
        const selectedText = this.menuTexts[this.selectedIndex];

        // Percorre todos os textos do menu.
        for (let i = 0; i < this.menuTexts.length; i++) {

            // Guarda o texto atual.
            const txt = this.menuTexts[i];

            // Se for a opção selecionada.
            if (i === this.selectedIndex) {

                // Muda a cor para branco.
                txt.setColor('#ffffff');

                // Aumenta ligeiramente o texto.
                txt.setScale(1.08);
            } else {

                // Volta à cor normal.
                txt.setColor('#e8e2d0');

                // Volta ao tamanho normal.
                txt.setScale(1);
            }
        }

        // Se existir barra seletora.
        if (this.selectorBar) {

            // Move a barra para a opção selecionada.
            this.selectorBar.y = selectedText.y;
        }

        // Se existir losango seletor.
        if (this.selector) {

            // Move o losango para a opção selecionada.
            this.selector.y = selectedText.y;
        }
    }

    // Escolhe a opção atual.
    chooseOption() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se a intro não estiver ativa, não faz nada.
        if (!scene.levelIntroActive) return;

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Guarda a opção selecionada.
        const selected = this.menuItems[this.selectedIndex];

        // Se existir opção e ação.
        if (selected && selected.action) {

            // Executa a ação da opção.
            selected.action();
        }
    }

    // Começa o nível.
    startLevel() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se a intro não estiver ativa, não faz nada.
        if (!scene.levelIntroActive) return;

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que está em transição.
        this.isChangingScene = true;

        // Faz fade out da intro.
        scene.cameras.main.fadeOut(250, 0, 0, 0);

        // Quando o fade out terminar.
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Remove a interface da intro.
                this.destroyOverlay();

                // Marca a intro como terminada.
                scene.levelIntroActive = false;

                // Liberta os controlos dos jogadores.
                scene.canControlPlayers = true;

                // Permite novas mudanças depois de iniciar.
                this.isChangingScene = false;

                // Volta a colocar o zoom do nível.
                scene.cameras.main.setZoom(2);

                // Mantém pixels sem arredondamento.
                scene.cameras.main.roundPixels = false;

                // Se existir sistema de câmara.
                if (scene.cameraSystem) {

                    // Configura novamente a câmara do nível.
                    scene.cameraSystem.setup();
                }

                // Se a HUD já estiver ativa.
                if (scene.scene.isActive('LevelHUDScene')) {

                    // Para a HUD antiga.
                    scene.scene.stop('LevelHUDScene');
                }

                // Lança a HUD do nível.
                scene.scene.launch('LevelHUDScene', {
                    levelScene: scene,
                    levelKey: scene.sys.settings.key
                });

                // Coloca a HUD por cima.
                scene.scene.bringToTop('LevelHUDScene');

                // Faz fade in para o jogo.
                scene.cameras.main.fadeIn(250, 0, 0, 0);

                // Se existir sistema de timer do nível.
                if (scene.levelTimerSystem) {

                    // Começa o timer.
                    scene.levelTimerSystem.start();
                }
            }
        );
    }

    // Ação secundária da intro.
    handleSecondaryAction() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se a intro não estiver ativa, não faz nada.
        if (!scene.levelIntroActive) return;

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que está a mudar de cena.
        this.isChangingScene = true;

        // Se a HUD estiver ativa.
        if (scene.scene.isActive('LevelHUDScene')) {

            // Para a HUD.
            scene.scene.stop('LevelHUDScene');
        }

        // Faz fade out.
        scene.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Vai buscar o modo de jogo.
                const gameMode = scene.registry.get('gameMode') || 'single';

                // Se estiver em multiplayer.
                if (gameMode === 'multi') {

                    // Define que a seleção começa pelo Player 1.
                    scene.registry.set('selectingPlayer', 'p1');
                }

                // Vai para a seleção de personagens.
                scene.scene.start('CharSelect');
            }
        );
    }

    // Volta ao menu principal.
    backToMenu() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se a intro não estiver ativa, não faz nada.
        if (!scene.levelIntroActive) return;

        // Se já estiver a mudar de cena, não faz nada.
        if (this.isChangingScene) return;

        // Marca que está a mudar de cena.
        this.isChangingScene = true;

        // Se a HUD estiver ativa.
        if (scene.scene.isActive('LevelHUDScene')) {

            // Para a HUD.
            scene.scene.stop('LevelHUDScene');
        }

        // Faz fade out.
        scene.cameras.main.fadeOut(350, 0, 0, 0);

        // Quando o fade out terminar.
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Vai para o menu principal.
                scene.scene.start('MenuScene');
            }
        );
    }

    // Destroi o overlay da intro.
    destroyOverlay() {

        // Se existir overlay.
        if (this.overlay) {

            // Destroi o container e todos os seus objetos.
            this.overlay.destroy();

            // Limpa a referência.
            this.overlay = null;
        }
    }

    // Destroi o sistema da intro.
    destroy() {

        // Remove o overlay da intro.
        this.destroyOverlay();

        // Limpa as opções do menu.
        this.menuItems = [];

        // Limpa os textos do menu.
        this.menuTexts = [];

        // Limpa as zonas clicáveis.
        this.menuZones = [];

        // Limpa a referência da barra seletora.
        this.selectorBar = null;

        // Limpa a referência do losango seletor.
        this.selector = null;
    }
}