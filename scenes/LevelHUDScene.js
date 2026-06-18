// Cria a classe LevelHUDScene, responsável por mostrar o HUD dos níveis.
export default class LevelHUDScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "LevelHUDScene".
        super('LevelHUDScene');
    }

    // Função chamada quando a cena recebe dados ao iniciar.
    init(data) {

        // Guarda a referência direta da cena do nível, se tiver sido enviada.
        this.levelScene = data?.levelScene || null;

        // Guarda a key da cena do nível, caso não venha a referência direta.
        this.levelKey = data?.levelKey || null;
    }

    // Função chamada quando a cena é criada.
    create() {

        // Se não existir referência direta do nível.
        if (!this.levelScene) {

            // Tenta buscar a cena do nível pela key recebida ou por Level1 como padrão.
            this.levelScene = this.scene.get(this.levelKey || 'Level1');
        }

        // Se mesmo assim não encontrar a cena do nível.
        if (!this.levelScene) {

            // Mostra erro na consola.
            console.error('LevelHUDScene: não encontrou a scene do nível.');

            // Para esta cena.
            this.scene.stop();

            // Cancela o resto da criação.
            return;
        }

        // Garante que a câmara do HUD não tem scroll.
        this.cameras.main.setScroll(0, 0);

        // Garante que o HUD usa zoom normal.
        this.cameras.main.setZoom(1);

        // Ativa arredondamento de pixels para evitar blur.
        this.cameras.main.roundPixels = true;

        // Guarda a última versão do inventário do Player 1.
        this.lastInventoryP1 = '';

        // Guarda a última versão do inventário do Player 2.
        this.lastInventoryP2 = '';

        // Lista dos ícones visuais do inventário do Player 1.
        this.inventoryIconsP1 = [];

        // Lista dos ícones visuais do inventário do Player 2.
        this.inventoryIconsP2 = [];

        // Guarda as cores usadas no HUD.
        this.colors = {

            // Cor principal dos painéis.
            panel: 0x07090d,

            // Cor interior mais escura dos painéis.
            panelDark: 0x020305,

            // Cor dourada principal.
            gold: 0xd8b568,

            // Cor dourada escura.
            goldDark: 0x8b6a32,

            // Cor dourada usada em textos.
            goldText: '#ffd36a',

            // Cor branca.
            white: '#ffffff',

            // Cor verde.
            green: 0x2ecc71,

            // Cor amarela.
            yellow: 0xf1c40f,

            // Cor vermelha.
            red: 0xe74c3c,

            // Cor azul.
            blue: 0x4aa3ff,

            // Cor roxa.
            purple: 0xb56cff
        };

        // Posições do HUD.
        // Singleplayer: P1 esquerda.
        // Multiplayer: P1 direita / P2 esquerda.

        // Verifica se o jogo está em modo multiplayer e se existe Player 2.
        const isMulti = this.levelScene.gameMode === 'multi' && this.levelScene.player2;

        // Define o lado do HUD do Player 1.
        const p1HudSide = isMulti ? 'right' : 'left';

        // Define o lado do HUD do Player 2.
        const p2HudSide = 'left';

        // Define o X do HUD do Player 1.
        const p1HudX = isMulti ? this.cameras.main.width - 28 : 28;

        // Define o X do HUD do Player 2.
        const p2HudX = 28;

        // Player 1 HUD.

        // Cria o painel do Player 1.
        this.p1Hud = this.createPlayerPanel({
            x: p1HudX,
            y: 24,
            side: p1HudSide,
            playerId: 'p1',
            name: this.levelScene.p1Data.nome || 'P1'
        });

        // Player 2 HUD.

        // Se estiver em multiplayer.
        if (isMulti) {

            // Cria o painel do Player 2.
            this.p2Hud = this.createPlayerPanel({
                x: p2HudX,
                y: 24,
                side: p2HudSide,
                playerId: 'p2',
                name: this.levelScene.p2Data?.nome || 'P2'
            });
        }

        // Timer + coins.

        // Cria o painel central com tempo e moedas.
        this.createCenterPanel();

        // Inventário.
        // Singleplayer: P1 esquerda.
        // Multiplayer: P1 direita / P2 esquerda.

        // Define o lado do inventário do Player 1.
        const p1InvSide = isMulti ? 'right' : 'left';

        // Define o lado do inventário do Player 2.
        const p2InvSide = 'left';

        // Define o X do inventário do Player 1.
        const p1InvX = isMulti ? this.cameras.main.width - 28 : 28;

        // Define o X do inventário do Player 2.
        const p2InvX = 28;

        // Cria o inventário do Player 1.
        this.inventoryP1 = this.createInventoryPanel({
            x: p1InvX,
            y: this.cameras.main.height - 92,
            side: p1InvSide,
            playerId: 'p1',
            title: 'INVENTÁRIO P1',
            keys: ['7', '8', '9', '0']
        });

        // Se estiver em multiplayer.
        if (isMulti) {

            // Cria o inventário do Player 2.
            this.inventoryP2 = this.createInventoryPanel({
                x: p2InvX,
                y: this.cameras.main.height - 92,
                side: p2InvSide,
                playerId: 'p2',
                title: 'INVENTÁRIO P2',
                keys: ['1', '2', '3', '4']
            });
        }

        // Texto de interação.

        // Cria o painel e texto de interação.
        this.createInteractionText();
    }

    // Helpers visuais.

    // Cria um container visual de painel com fundo, bordas e linhas decorativas.
    createPanelContainer(x, y, width, height, depth = 9999) {

        // Cria o container do painel.
        const container = this.add.container(x, y).setDepth(depth);

        // Cria o fundo principal do painel.
        const bg = this.add.rectangle(0, 0, width, height, this.colors.panel, 0.45)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0, 0)

            // Adiciona borda dourada.
            .setStrokeStyle(1, this.colors.gold, 0.9);

        // Cria o fundo interior do painel.
        const inner = this.add.rectangle(4, 4, width - 8, height - 8, this.colors.panelDark, 0.08)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0, 0)

            // Adiciona borda interior.
            .setStrokeStyle(1, this.colors.goldDark, 0.45);

        // Cria a linha decorativa superior.
        const topLine = this.add.rectangle(10, 6, width - 20, 1, this.colors.gold, 0.55)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0, 0);

        // Cria a linha decorativa inferior.
        const bottomLine = this.add.rectangle(10, height - 7, width - 20, 1, this.colors.gold, 0.4)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0, 0);

        // Adiciona os elementos visuais ao container.
        container.add([bg, inner, topLine, bottomLine]);

        // Devolve o container criado.
        return container;
    }

    // Cria um losango decorativo.
    createDiamond(x, y, size = 7) {

        // Cria um polígono em forma de losango.
        const diamond = this.add.polygon(
            x,
            y,
            [0, -size, size + 3, 0, 0, size, -(size + 3), 0],
            this.colors.gold,
            1
        );

        // Devolve o losango.
        return diamond;
    }

    // Anima um losango ou outro objeto visual.
    animateDiamond(target, direction = 'x', distance = 4, duration = 700) {

        // Se não existir alvo, não faz nada.
        if (!target) return;

        // Cria uma animação de ida e volta.
        this.tweens.add({

            // Define o alvo da animação.
            targets: target,

            // Move o alvo na direção escolhida.
            [direction]: target[direction] + distance,

            // Define a duração da animação.
            duration,

            // Faz a animação voltar ao início.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização.
            ease: 'Sine.easeInOut'
        });
    }

    // Desenha uma barra com gradiente.
    drawGradientBar(graphics, x, y, width, height, percent, colorLeft, colorRight) {

        // Limpa o desenho anterior.
        graphics.clear();

        // Calcula a largura preenchida da barra.
        const w = Math.max(0, width * Phaser.Math.Clamp(percent, 0, 1));

        // Se a largura for zero ou menor, não desenha.
        if (w <= 0) return;

        // Define o gradiente da barra.
        graphics.fillGradientStyle(
            colorLeft,
            colorRight,
            colorLeft,
            colorRight,
            1
        );

        // Desenha a barra preenchida.
        graphics.fillRoundedRect(x, y, w, height, 2);

        // Define a cor do brilho superior.
        graphics.fillStyle(0xffffff, 0.12);

        // Desenha o brilho da barra.
        graphics.fillRoundedRect(
            x + 1,
            y + 1,
            Math.max(0, w - 2),
            Math.max(1, height / 2 - 1),
            2
        );

        // Define uma linha subtil por cima da barra.
        graphics.lineStyle(1, 0xffffff, 0.08);

        // Desenha o contorno da parte preenchida.
        graphics.strokeRoundedRect(x, y, w, height, 2);
    }

    // Player HUD.

    // Cria o painel de vida e cooldowns de um jogador.
    createPlayerPanel(config) {

        // Verifica se o painel fica do lado direito.
        const isRight = config.side === 'right';

        // Define a largura do painel.
        const width = 310;

        // Define a altura do painel.
        const height = 84;

        // Calcula o X final do painel.
        const x = isRight ? config.x - width : config.x;

        // Define o Y do painel.
        const y = config.y;

        // Cria o container do painel.
        const container = this.createPanelContainer(x, y, width, height);

        // Losango.

        // Cria o losango decorativo do painel.
        const diamond = this.createDiamond(isRight ? width - 2 : 14, 36, 6);

        // Adiciona o losango ao container.
        container.add(diamond);

        // Anima o losango.
        this.animateDiamond(diamond, 'x', isRight ? -3 : 3, 750);

        // Nome.

        // Cria o texto do nome do jogador/herói.
        const nameText = this.add.text(
            30,
            10,
            config.name.toUpperCase(),
            {
                fontFamily: 'MedievalSharp, Arial',
                fontSize: '16px',
                color: this.colors.goldText,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0, 0);

        // Posições.

        // Define o X dos rótulos.
        const labelX = 30;

        // Define o X das barras.
        const barX = 58;

        // Define a largura das barras.
        const barWidth = 195;

        // HP.

        // Cria o rótulo da vida.
        const hpLabel = this.add.text(labelX, 37, 'HP', {
            fontFamily: 'Arial',
            fontSize: '10px',
            color: '#f2e4b6',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Cria o fundo da barra de vida.
        const hpBg = this.add.rectangle(barX, 33, barWidth, 10, 0x101010, 0.95)
            .setOrigin(0, 0)
            .setStrokeStyle(1, this.colors.goldDark, 0.55);

        // Cria o gráfico que vai desenhar a vida preenchida.
        const hpFill = this.add.graphics();

        // Cria o texto numérico da vida.
        const hpText = this.add.text(
            barX + barWidth + 8,
            38,
            '100',
            {
                fontFamily: 'Arial',
                fontSize: '10px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0, 0.5);

        // Ataque 2.

        // Cria o rótulo do ataque 2.
        const cd2Label = this.add.text(labelX, 55, 'A2', {
            fontFamily: 'Arial',
            fontSize: '9px',
            color: '#9ed0ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Cria o fundo da barra de cooldown do ataque 2.
        const cd2Bg = this.add.rectangle(barX, 52, barWidth, 6, 0x111111, 0.95)
            .setOrigin(0, 0)
            .setStrokeStyle(1, 0x1f4f78, 0.45);

        // Cria o gráfico da barra do ataque 2.
        const cd2Fill = this.add.graphics();

        // Ataque 3.

        // Cria o rótulo do ataque 3.
        const cd3Label = this.add.text(labelX, 67, 'A3', {
            fontFamily: 'Arial',
            fontSize: '9px',
            color: '#d6a6ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Cria o fundo da barra de cooldown do ataque 3.
        const cd3Bg = this.add.rectangle(barX, 64, barWidth, 6, 0x111111, 0.95)
            .setOrigin(0, 0)
            .setStrokeStyle(1, 0x5b2c83, 0.45);

        // Cria o gráfico da barra do ataque 3.
        const cd3Fill = this.add.graphics();

        // Adiciona todos os elementos ao container.
        container.add([
            nameText,

            hpLabel,
            hpBg,
            hpFill,
            hpText,

            cd2Label,
            cd2Bg,
            cd2Fill,

            cd3Label,
            cd3Bg,
            cd3Fill
        ]);

        // Devolve todas as referências necessárias para atualizar este HUD depois.
        return {
            container,
            playerId: config.playerId,

            hpFill,
            hpText,
            hpBg,

            cd2Label,
            cd2Bg,
            cd2Fill,

            cd3Label,
            cd3Bg,
            cd3Fill,

            hpBarX: barX,
            hpBarY: 33,
            hpBarWidth: barWidth,
            hpBarHeight: 10,

            cd2BarX: barX,
            cd2BarY: 53,
            cd2BarWidth: barWidth,
            cd2BarHeight: 6,

            cd3BarX: barX,
            cd3BarY: 64,
            cd3BarWidth: barWidth,
            cd3BarHeight: 6
        };
    }

    // Timer + coins.

    // Cria o painel central com tempo e moedas.
    createCenterPanel() {

        // Define a largura do painel central.
        const width = 230;

        // Define a altura do painel central.
        const height = 46;

        // Calcula o X para centrar o painel.
        const x = this.cameras.main.width / 2 - width / 2;

        // Define o Y do painel.
        const y = 24;

        // Cria o painel central.
        this.centerPanel = this.createPanelContainer(x, y, width, height);

        // Cria o losango esquerdo.
        const leftDiamond = this.createDiamond(18, height / 2, 6);

        // Cria o losango direito.
        const rightDiamond = this.createDiamond(width - 5, height / 2, 6);

        // Adiciona os losangos ao painel.
        this.centerPanel.add([leftDiamond, rightDiamond]);

        // Anima o losango esquerdo.
        this.animateDiamond(leftDiamond, 'x', 4, 680);

        // Anima o losango direito.
        this.animateDiamond(rightDiamond, 'x', -4, 680);

        // Se existir textura da ampulheta.
        if (this.textures.exists('hourglass')) {

            // Cria o ícone da ampulheta.
            this.hourglassIcon = this.add.image(42, 23, 'hourglass')
                .setScale(1.2);
        } else {

            // Cria uma ampulheta em texto como fallback.
            this.hourglassIcon = this.add.text(39, 8, '⌛', {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#ffd36a',
                stroke: '#000000',
                strokeThickness: 4
            });
        }

        // Cria o texto do timer.
        this.timerText = this.add.text(
            60,
            8,
            '2:00',
            {
                fontFamily: 'MedievalSharp, Arial',
                fontSize: '20px',
                color: this.colors.goldText,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 5
            }
        );

        // Cria uma linha separadora entre tempo e moedas.
        const separator = this.add.rectangle(120, 12, 1, 22, this.colors.gold, 0.8)
            .setOrigin(0, 0);

        // Cria o ícone da moeda.
        this.coinIcon = this.add.image(146, 23, 'coin')
            .setScale(0.95);

        // Cria o texto das moedas.
        this.coinText = this.add.text(
            162,
            8,
            '0',
            {
                fontFamily: 'MedievalSharp, Arial',
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 5
            }
        );

        // Adiciona os elementos ao painel central.
        this.centerPanel.add([
            this.hourglassIcon,
            this.timerText,
            separator,
            this.coinIcon,
            this.coinText
        ]);
    }

    // Inventário.

    // Cria o painel de inventário.
    createInventoryPanel(config) {

        // Verifica se o painel deve ficar do lado direito.
        const isRight = config.side === 'right';

        // Define o tamanho de cada slot.
        const slotSize = 38;

        // Define o espaço entre slots.
        const gap = 14;

        // Define a quantidade de slots.
        const slotCount = 4;

        // Define o padding horizontal do painel.
        const paddingX = 24;

        // Define o espaço no topo.
        const paddingTop = 34;

        // Define o espaço no fundo.
        const paddingBottom = 16;

        // Calcula a largura ocupada pelos slots.
        const contentWidth = slotCount * slotSize + (slotCount - 1) * gap;

        // Calcula a largura total do painel.
        const width = contentWidth + paddingX * 2;

        // Calcula a altura total do painel.
        const height = paddingTop + slotSize + paddingBottom;

        // Calcula a posição X do painel.
        const x = isRight ? config.x - width : config.x;

        // Define a posição Y do painel.
        const y = config.y;

        // Cria o container do painel.
        const container = this.createPanelContainer(x, y, width, height);

        // Losango do inventário.

        // Cria o losango decorativo do inventário.
        const diamond = this.createDiamond(
            isRight ? width : 12,
            height / 2 - 11,
            6
        );

        // Adiciona o losango ao painel.
        container.add(diamond);

        // Anima o losango do inventário.
        this.animateDiamond(
            diamond,
            'x',
            isRight ? -4 : 4,
            700
        );

        // Título centrado.

        // Cria o título do inventário.
        const title = this.add.text(
            width / 2,
            10,
            config.title,
            {
                fontFamily: 'MedievalSharp, Arial',
                fontSize: '12px',
                color: this.colors.goldText,
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5, 0);

        // Adiciona o título ao painel.
        container.add(title);

        // linha por baixo do título

        // Cria a linha decorativa abaixo do título.
        const titleLine = this.add.rectangle(
            paddingX,
            27,
            contentWidth,
            1,
            this.colors.gold,
            0.55
        ).setOrigin(0, 0);

        // Adiciona a linha ao painel.
        container.add(titleLine);

        // Lista dos slots criados.
        const slots = [];

        // Cria os 4 slots do inventário.
        for (let i = 0; i < slotCount; i++) {

            // Calcula o X do slot.
            const slotX = paddingX + i * (slotSize + gap);

            // Calcula o Y do slot.
            const slotY = paddingTop;

            // Cria o fundo do slot.
            const slotBg = this.add.rectangle(
                slotX,
                slotY,
                slotSize,
                slotSize,
                0x000000,
                0.45
            )
            .setOrigin(0, 0)
            .setStrokeStyle(1, this.colors.gold, 0.9);

            // Cria o interior do slot.
            const slotInner = this.add.rectangle(
                slotX + 4,
                slotY + 4,
                slotSize - 8,
                slotSize - 8,
                0x101010,
                0.25
            )
            .setOrigin(0, 0)
            .setStrokeStyle(1, this.colors.goldDark, 0.25);

            // Cria o texto da tecla do slot.
            const keyText = this.add.text(
                slotX + 5,
                slotY + 3,
                config.keys[i],
                {
                    fontFamily: 'Arial',
                    fontSize: '8px',
                    color: this.colors.goldText,
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2
                }
            );

            // Adiciona os elementos do slot ao painel.
            container.add([slotBg, slotInner, keyText]);

            // Guarda a posição global do centro do slot.
            slots.push({
                x: x + slotX + slotSize / 2,
                y: y + slotY + slotSize / 2,
                bg: slotBg,
                keyText
            });
        }

        // Devolve o painel e os slots.
        return {
            container,
            slots
        };
    }

    // Interação.

    // Cria o painel de texto de interação.
    createInteractionText() {

        // Define a largura do painel de interação.
        const width = 390;

        // Define a altura do painel de interação.
        const height = 38;

        // Calcula o X para centrar o painel.
        const x = this.cameras.main.width / 2 - width / 2;

        // Define o Y no fundo do ecrã.
        const y = this.cameras.main.height - 64;

        // Cria o painel de interação.
        this.interactionPanel = this.createPanelContainer(x, y, width, height, 99998);

        // Começa com o painel invisível.
        this.interactionPanel.setVisible(false);

        // Cria o losango do painel de interação.
        this.interactionDiamond = this.createDiamond(14, height / 2, 7);

        // Adiciona o losango ao painel.
        this.interactionPanel.add(this.interactionDiamond);

        // Anima o losango de interação.
        this.animateDiamond(this.interactionDiamond, 'x', 6, 650);

        // Cria o texto de interação.
        this.interactionText = this.add.text(
            width / 2,
            height / 2,
            '',
            {
                fontFamily: 'MedievalSharp, Arial',
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center',
                wordWrap: {
                    width: width - 42,
                    useAdvancedWrap: true
                }
            }
        )
        .setOrigin(0.5);

        // Adiciona o texto ao painel.
        this.interactionPanel.add(this.interactionText);

        // Dá à cena do nível acesso ao texto de interação.
        this.levelScene.textoInteracao = this.interactionText;

        // Cria na cena do nível uma função para alterar o texto do HUD.
        this.levelScene.setInteractionText = (text, force = false) => {
            this.setInteractionText(text, force);
        };

        // Guarda a função original de setVisible do texto.
        const originalSetVisible = this.interactionText.setVisible.bind(this.interactionText);

        // Substitui setVisible para também mostrar/esconder o painel.
        this.interactionText.setVisible = (value) => {

            // Aplica a visibilidade original no texto.
            originalSetVisible(value);

            // Se existir painel.
            if (this.interactionPanel) {

                // Aplica a mesma visibilidade ao painel.
                this.interactionPanel.setVisible(value);
            }

            // Devolve o próprio texto para permitir encadeamento.
            return this.interactionText;
        };
    }

    // Define o texto mostrado no painel de interação.
    setInteractionText(text, force = false) {

        // Se não existir texto ou painel, não faz nada.
        if (
            !this.interactionText ||
            !this.interactionPanel ||
            !this.interactionText.scene
        ) {
            return;
        }

        // Converte o texto para string segura.
        const safeText = text ? String(text) : '';

        // Se o LevelFinal tem uma mensagem temporária ativa, o HUD não pode limpar nem substituir o texto, a não ser quando force = true.
        if (
            this.levelScene &&
            this.levelScene.interactionTextLocked &&
            !force
        ) {
            return;
        }

        // Garante que o texto fica sempre igual, sem vermelho
        this.interactionText.setColor('#ffffff');

        // Garante a cor de preenchimento branca.
        this.interactionText.setFill('#ffffff');

        // Garante opacidade total.
        this.interactionText.setAlpha(1);

        // Se o texto estiver vazio.
        if (safeText.trim() === '') {

            // Limpa o texto.
            this.interactionText.setText('');

            // Esconde o texto.
            this.interactionText.setVisible(false);

            // Esconde o painel.
            this.interactionPanel.setVisible(false);

            // Termina a função.
            return;
        }

        // Se o texto for comprido.
        if (safeText.length > 38) {

            // Reduz o tamanho da fonte.
            this.interactionText.setFontSize(12);
        } else {

            // Usa o tamanho normal da fonte.
            this.interactionText.setFontSize(14);
        }

        // Atualiza o conteúdo do texto.
        this.interactionText.setText(safeText);

        // Mostra o texto.
        this.interactionText.setVisible(true);

        // Mostra o painel.
        this.interactionPanel.setVisible(true);
    }

    // Update.

    // Função chamada a cada frame.
    update() {

        // Se não existir nível, se a cena não existir, ou se o nível já não estiver ativo.
        if (
            !this.levelScene ||
            !this.levelScene.scene ||
            !this.scene.isActive(this.levelScene.scene.key)
        ) {

            // Para o HUD.
            this.scene.stop();

            // Cancela o resto do update.
            return;
        }

        // Atualiza o HUD do Player 1.
        this.updatePlayerHUD(this.p1Hud, this.levelScene.player1);

        // Se existir HUD e Player 2.
        if (this.p2Hud && this.levelScene.player2) {

            // Atualiza o HUD do Player 2.
            this.updatePlayerHUD(this.p2Hud, this.levelScene.player2);
        }

        // Atualiza o timer.
        this.updateTimer();

        // Atualiza as moedas.
        this.updateCoins();

        // Atualiza o inventário.
        this.updateInventory();
    }

    // Atualiza a vida e cooldowns de um jogador no HUD.
    updatePlayerHUD(hud, player) {

        // Se faltar HUD, jogador ou dados do personagem, não faz nada.
        if (!hud || !player || !player.personagem) return;

        // Guarda a vida atual.
        const hp = player.personagem.vidaAtual ?? 0;

        // Guarda a vida máxima.
        const maxHp = player.personagem.vidaMax ?? 100;

        // Calcula a percentagem de vida.
        const hpPercent = Phaser.Math.Clamp(hp / maxHp, 0, 1);

        // Atualiza o texto numérico da vida.
        hud.hpText.setText(`${hp}`);

        // Define a cor esquerda padrão da barra de vida.
        let hpLeft = 0x46d66f;

        // Define a cor direita padrão da barra de vida.
        let hpRight = 0x1f9d55;

        // Se a vida estiver muito baixa.
        if (hpPercent <= 0.25) {

            // Usa vermelho.
            hpLeft = 0xff6b6b;

            // Usa vermelho escuro.
            hpRight = 0xc0392b;
        } else if (hpPercent <= 0.55) {

            // Se a vida estiver média, usa amarelo.
            hpLeft = 0xffd86b;

            // Usa dourado escuro.
            hpRight = 0xd4a017;
        }

        // Desenha a barra de vida.
        this.drawGradientBar(
            hud.hpFill,
            hud.hpBarX,
            hud.hpBarY,
            hud.hpBarWidth,
            hud.hpBarHeight,
            hpPercent,
            hpLeft,
            hpRight
        );

        // Atualiza as barras de cooldown.
        this.updateCooldownBars(hud, player);
    }

    // Atualiza as barras de cooldown dos ataques.
    updateCooldownBars(hud, player) {

        // Guarda o ID do herói.
        const heroId = player.personagem.id;

        // Guarda o ID do jogador.
        const playerId = hud.playerId;

        // Vai buscar a configuração de ataques do herói.
        const config = this.levelScene.attackConfig?.[heroId];

        // Verifica se existe ataque 2.
        const atk2Exists = !!config?.atk2;

        // Verifica se existe ataque 3.
        const atk3Exists = !!config?.atk3;

        // Mostra ou esconde o rótulo do ataque 2.
        hud.cd2Label.setVisible(atk2Exists);

        // Mostra ou esconde o fundo da barra do ataque 2.
        hud.cd2Bg.setVisible(atk2Exists);

        // Mostra ou esconde o rótulo do ataque 3.
        hud.cd3Label.setVisible(atk3Exists);

        // Mostra ou esconde o fundo da barra do ataque 3.
        hud.cd3Bg.setVisible(atk3Exists);

        // Limpa a barra do ataque 2.
        hud.cd2Fill.clear();

        // Limpa a barra do ataque 3.
        hud.cd3Fill.clear();

        // Se existir ataque 2.
        if (atk2Exists) {

            // Calcula a percentagem de cooldown do ataque 2.
            const p2 = this.getCooldownPercent(playerId, 'atk2', config.atk2);

            // Desenha a barra do ataque 2.
            this.drawGradientBar(
                hud.cd2Fill,
                hud.cd2BarX,
                hud.cd2BarY,
                hud.cd2BarWidth,
                hud.cd2BarHeight,
                p2,
                0x77c8ff,
                0x2d7fd3
            );
        }

        // Se existir ataque 3.
        if (atk3Exists) {

            // Calcula a percentagem de cooldown do ataque 3.
            const p3 = this.getCooldownPercent(playerId, 'atk3', config.atk3);

            // Desenha a barra do ataque 3.
            this.drawGradientBar(
                hud.cd3Fill,
                hud.cd3BarX,
                hud.cd3BarY,
                hud.cd3BarWidth,
                hud.cd3BarHeight,
                p3,
                0xd29bff,
                0x8e44ad
            );
        }
    }

    // Calcula a percentagem de carregamento de um cooldown.
    getCooldownPercent(playerId, attackKey, attackConfig) {

        // Vai buscar os cooldowns do jogador.
        const cooldowns = this.levelScene.attackCooldowns?.[playerId];

        // Se não existirem cooldowns, considera pronto.
        if (!cooldowns) return 1;

        // Guarda o tempo em que o cooldown termina.
        const cooldownEnd = cooldowns[attackKey] || 0;

        // Guarda o tempo atual do nível.
        const now = this.levelScene.time.now;

        // Usa o mesmo cooldown que o AttackSystem usa
        const duration = attackConfig?.cooldown || this.getDefaultCooldown(attackKey);

        // Se o cooldown já terminou, devolve 100%.
        if (cooldownEnd <= now) return 1;

        // Calcula quanto tempo falta.
        const remaining = cooldownEnd - now;

        // Calcula a percentagem já carregada.
        const percent = 1 - remaining / duration;

        // Limita a percentagem entre 0 e 1.
        return Phaser.Math.Clamp(percent, 0, 1);
    }

    // Devolve cooldown padrão caso não exista configuração.
    getDefaultCooldown(attackKey) {

        // Cooldown padrão do ataque 1.
        if (attackKey === 'atk1') return 350;

        // Cooldown padrão do ataque 2.
        if (attackKey === 'atk2') return 15000;

        // Cooldown padrão do ataque 3.
        if (attackKey === 'atk3') return 25000;

        // Cooldown padrão do bloqueio.
        if (attackKey === 'block') return 1000;

        // Cooldown fallback.
        return 500;
    }

    // Atualiza o texto do timer.
    updateTimer() {

        // Vai buscar o tempo restante do nível.
        const time = this.levelScene.levelTimeLeft ?? 0;

        // Calcula os minutos.
        const minutes = Math.floor(time / 60);

        // Calcula os segundos.
        const seconds = time % 60;

        // Atualiza o texto no formato minutos:segundos.
        this.timerText.setText(
            `${minutes}:${seconds.toString().padStart(2, '0')}`
        );

        // Muda a cor para vermelho se o tempo estiver baixo.
        this.timerText.setColor(time <= 20 ? '#ff4444' : this.colors.goldText);
    }

    // Atualiza o total de moedas no HUD.
    updateCoins() {

        // Vai buscar as moedas do nível.
        const coins = this.levelScene.coins || { p1: 0, p2: 0 };

        // Soma moedas do Player 1 e Player 2.
        const total = (coins.p1 || 0) + (coins.p2 || 0);

        // Atualiza o texto das moedas.
        this.coinText.setText(total);
    }

    // Atualiza os inventários dos jogadores.
    updateInventory() {

        // Atualiza inventário do Player 1.
        this.updateInventoryPlayer('p1');

        // Se for multiplayer e existir inventário do Player 2.
        if (this.levelScene.gameMode === 'multi' && this.inventoryP2) {

            // Atualiza inventário do Player 2.
            this.updateInventoryPlayer('p2');
        }
    }

    // Atualiza o inventário de um jogador específico.
    updateInventoryPlayer(playerId) {

        // Vai buscar o inventário do jogador.
        const inventory = this.levelScene.inventories?.[playerId] || [];

        // Cria uma assinatura em texto para detectar alterações.
        const signature = JSON.stringify(inventory);

        // Se for Player 1 e o inventário não mudou, não atualiza.
        if (playerId === 'p1' && signature === this.lastInventoryP1) return;

        // Se for Player 2 e o inventário não mudou, não atualiza.
        if (playerId === 'p2' && signature === this.lastInventoryP2) return;

        // Guarda a nova assinatura do Player 1.
        if (playerId === 'p1') this.lastInventoryP1 = signature;

        // Guarda a nova assinatura do Player 2.
        if (playerId === 'p2') this.lastInventoryP2 = signature;

        // Escolhe o painel correspondente ao jogador.
        const panel = playerId === 'p1' ? this.inventoryP1 : this.inventoryP2;

        // Escolhe a lista de ícones correspondente ao jogador.
        const icons = playerId === 'p1' ? this.inventoryIconsP1 : this.inventoryIconsP2;

        // Se não existir painel, não faz nada.
        if (!panel) return;

        // Destrói os ícones antigos.
        icons.forEach(icon => icon.destroy());

        // Limpa a lista de ícones.
        icons.length = 0;

        // Percorre os 4 slots.
        for (let i = 0; i < 4; i++) {

            // Vai buscar o item do slot.
            const item = inventory[i];

            // Se não houver item neste slot, continua.
            if (!item) continue;

            // Vai buscar o slot visual.
            const slot = panel.slots[i];

            // Vai buscar a key do item.
            const key = item.key || item.itemKey || item;

            // Guarda o ícone criado.
            let icon;

            // Se existir textura com esta key.
            if (this.textures.exists(key)) {

                // Cria imagem do item.
                icon = this.add.image(slot.x, slot.y, key)

                    // Define escala conforme o item.
                    .setScale(this.getItemScale(key))

                    // Coloca por cima do HUD.
                    .setDepth(10050);
            } else {

                // Cria texto como fallback se não existir imagem.
                icon = this.add.text(slot.x, slot.y, key.toUpperCase(), {
                    fontFamily: 'Arial',
                    fontSize: '8px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                })

                // Centra o texto.
                .setOrigin(0.5)

                // Coloca por cima do HUD.
                .setDepth(10050);
            }

            // Guarda o ícone criado.
            icons.push(icon);

            // Se o item tiver quantidade maior que 1.
            if (item.amount && item.amount > 1) {

                // Cria texto da quantidade.
                const amount = this.add.text(slot.x + 6, slot.y + 9, `x${item.amount}`, {
                    fontFamily: 'Arial',
                    fontSize: '9px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                })

                // Centra o texto da quantidade.
                .setOrigin(0.5)

                // Coloca acima do ícone.
                .setDepth(10051);

                // Guarda o texto da quantidade.
                icons.push(amount);
            }
        }
    }

    // Devolve a escala visual de cada item.
    getItemScale(key) {

        // Escolhe a escala conforme a key do item.
        switch (key) {

            // Escala da chave.
            case 'key':
                return 1;

            // Escala da maçã.
            case 'apple':
                return 1;

            // Escala do gelado.
            case 'icecream':
                return 1;

            // Escala do íman.
            case 'magnet':
                return 1;

            // Escala da moeda.
            case 'coin':
                return 1;

            // Escala padrão dos outros itens.
            default:
                return 1;
        }
    }
}