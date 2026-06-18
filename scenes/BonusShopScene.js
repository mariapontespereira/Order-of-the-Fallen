// Cria a classe BonusShopScene, responsável pela loja de bónus do jogo.
export default class BonusShopScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "BonusShopScene".
        super('BonusShopScene');
    }

    // Função chamada quando a cena recebe dados ao ser iniciada.
    init(data) {

        // Guarda a chave da cena do nível que abriu a loja.
        this.levelSceneKey = data?.levelSceneKey || 'LevelFinal';

        // Guarda o modo de jogo, single ou multi.
        this.mode = data?.mode || 'single';

        // Índice do item atualmente selecionado na loja.
        this.selectedIndex = 0;

        // Controla se a loja já está a fechar.
        this.isClosing = false;

        // Lista onde ficam guardados os cards dos upgrades.
        this.shopCards = [];

        // Texto temporário usado para mostrar mensagens da loja.
        this.shopMessage = null;

        // Timer usado para controlar a duração das mensagens da loja.
        this.shopMessageTimer = null;

        // Lista de upgrades disponíveis na loja.
        this.upgrades = [
            {
                // Tipo do upgrade, usado para aplicar o efeito de vida
                tipo: 'vida',

                // Título mostrado no card da loja.
                title: '+ VIDA',

                // Descrição curta do efeito do upgrade.
                desc: '+20 HP',

                // Ícone usado no card.
                icon: 'ExtraVida',

                // Preço em moedas.
                price: 5
            },
            {
                // Tipo do upgrade, usado para aumentar a velocidade.
                tipo: 'speed',

                // Título mostrado no card da loja.
                title: '+ VELOCIDADE',

                // Descrição curta do efeito do upgrade.
                desc: '+1 velocidade',

                // Ícone usado no card.
                icon: 'ExtraSpeed',

                // Preço em moedas.
                price: 10
            },
            {
                // Tipo do upgrade, usado para aumentar o poder.
                tipo: 'poder',

                // Título mostrado no card da loja.
                title: '+ PODER',

                // Descrição curta do efeito do upgrade.
                desc: '+5 poder',

                // Ícone usado no card.
                icon: 'ExtraPoder',

                // Preço em moedas.
                price: 15
            }
        ];
    }

    // Função chamada quando a cena é criada.
    create() {

        // Vai buscar a largura e altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Garante que a câmara começa sem scroll.
        this.cameras.main.setScroll(0, 0);

        // Define o zoom da loja como 1 para ocupar o ecrã normal.
        this.cameras.main.setZoom(1);

        // Ativa arredondamento de pixels.
        this.cameras.main.roundPixels = true;

        // Faz fade in ao entrar na loja.
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Adiciona a imagem de fundo no centro do ecrã.
        this.add.image(width / 2, height / 2, 'bgMenu')

            // Ajusta a imagem ao tamanho total do ecrã.
            .setDisplaySize(width, height)

            // Coloca a imagem no fundo.
            .setDepth(0);

        // Adiciona um retângulo preto transparente por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência do retângulo.
            .setAlpha(0.55)

            // Coloca o retângulo acima do fundo.
            .setDepth(1);


        // Adiciona a caixa visual do título.
        this.add.image(width / 2, height * 0.16, 'caixaTitulo')

            // Centra a imagem pela origem.
            .setOrigin(0.5)

            // Reduz a escala da caixa.
            .setScale(0.24)

            // Coloca a caixa acima do fundo.
            .setDepth(2);

        // Adiciona o texto do título da loja.
        this.add.text(width / 2, height * 0.18, 'LOJA DE BÓNUS', {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '28px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno do texto.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima da caixa.
        .setDepth(3);

        // MOEDAS

        // Adiciona o rótulo "MOEDAS".
        this.add.text(width / 2, height * 0.285, 'MOEDAS', {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '18px',

            // Define a cor do texto.
            color: '#f6e4b0',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima do fundo.
        .setDepth(3);

        // Cria o texto que mostra o total de moedas disponíveis.
        this.coinsText = this.add.text(width / 2 - 1, height * 0.34, `${this.getTotalCoins()}`, {

            // Define a fonte do número de moedas.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do número.
            fontSize: '26px',

            // Define a cor do número.
            color: '#ffffff',

            // Coloca o número a negrito.
            fontStyle: 'bold',

            // Define o contorno preto.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 6
        })

        // Define a origem no lado direito para alinhar com o ícone da moeda.
        .setOrigin(1, 0.5)

        // Coloca o texto acima do fundo.
        .setDepth(3);

        // Adiciona o ícone da moeda ao lado do número.
        this.add.image(width / 2 + 15, height * 0.34, 'coin')

            // Centra o ícone.
            .setOrigin(0.5)

            // Aumenta o tamanho do ícone.
            .setScale(1.2)

            // Coloca o ícone acima do fundo.
            .setDepth(3);


        // Cria o painel central com os cards dos upgrades.
        this.createMiddleShopPanel(width, height);


        // Cria o botão para voltar ao jogo.
        this.backButton = this.createButton(width / 2, height * 0.78, 'VOLTAR AO JOGO', () => {

            // Fecha a loja quando o botão é clicado.
            this.closeShop();
        });


        // Adiciona texto de ajuda com as teclas disponíveis.
        this.add.text(width / 2, height * 0.90, '← → Navegar    ENTER Comprar    ESC Voltar ao Jogo', {

            // Define a fonte do texto de ajuda.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
            fontSize: '15px',

            // Define a cor do texto.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define uma ligeira transparência.
        .setAlpha(0.85)

        // Coloca o texto acima do fundo.
        .setDepth(3);

        // TECLAS

        // Cria a tecla da seta esquerda para navegar nos upgrades.
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        // Cria a tecla da seta direita para navegar nos upgrades.
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Cria a tecla ENTER para comprar.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla ESPAÇO também para comprar.
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cria a tecla ESC para voltar ao jogo.
        this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Atualiza o card selecionado visualmente.
        this.updateShopSelection();

        // Atualiza a interface da loja, incluindo moedas e disponibilidade.
        this.refreshShopUI();
    }

    // Cria o painel central da loja onde ficam os cards.
    createMiddleShopPanel(width, height) {

        // Define a posição X central do painel.
        const panelX = width / 2;

        // Define a posição Y do painel.
        const panelY = height * 0.51;

        // Define a largura do painel.
        const panelWidth = 620;

        // Define a altura do painel.
        const panelHeight = 190;

        // Cria o retângulo exterior do painel.
        this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0x000000)

            // Centra o retângulo.
            .setOrigin(0.5)

            // Define a transparência.
            .setAlpha(0.25)

            // Define a borda dourada.
            .setStrokeStyle(2, 0xd8b568, 0.75)

            // Define a profundidade.
            .setDepth(4);

        // Cria um retângulo interior para dar efeito de painel.
        this.add.rectangle(panelX, panelY, panelWidth - 22, panelHeight - 22, 0x020305)

            // Centra o retângulo.
            .setOrigin(0.5)

            // Define a transparência.
            .setAlpha(0.20)

            // Define uma borda interior.
            .setStrokeStyle(1, 0x8b6a32, 0.45)

            // Define a profundidade.
            .setDepth(4);

        // Define a posição X inicial do primeiro card.
        const startX = panelX - 185;

        // Define a posição Y dos cards.
        const cardsY = panelY;

        // Define o espaço horizontal entre cards.
        const gapX = 185;

        // Reinicia a lista de cards da loja.
        this.shopCards = [];

        // Percorre todos os upgrades disponíveis.
        for (let i = 0; i < this.upgrades.length; i++) {

            // Guarda o upgrade atual.
            const item = this.upgrades[i];

            // Cria o card do upgrade.
            const card = this.createShopCard(
                startX + i * gapX,
                cardsY,
                item,
                i
            );

            // Guarda o card na lista.
            this.shopCards.push(card);
        }

        // Cria o retângulo de seleção em volta do card selecionado.
        this.shopSelector = this.add.rectangle(0, 0, 135, 145)

            // Centra o seletor.
            .setOrigin(0.5)

            // Define a borda amarela do seletor.
            .setStrokeStyle(3, 0xffd36a)

            // Define preenchimento transparente.
            .setFillStyle(0xffffff, 0)

            // Coloca o seletor por cima dos cards.
            .setDepth(30);
    }

    // Cria um card individual da loja.
    createShopCard(x, y, item, index) {

        // Cria um container para juntar fundo, ícone, textos e preço.
        const container = this.add.container(x, y)

            // Define a profundidade do card.
            .setDepth(10);

        // Cria o fundo do card.
        const bg = this.add.rectangle(0, 0, 120, 130, 0x000000)

            // Define a transparência do fundo.
            .setAlpha(0.38)

            // Define a borda dourada.
            .setStrokeStyle(2, 0xd8b568);

        // Cria o ícone do upgrade.
        const icon = this.add.image(0, -38, item.icon)

            // Define a escala do ícone.
            .setScale(1.2);

        // Cria o título do upgrade.
        const title = this.add.text(0, 2, item.title, {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '13px',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor dourada.
            color: '#ffd36a',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o título.
        .setOrigin(0.5);

        // Cria a descrição do upgrade.
        const desc = this.add.text(0, 27, item.desc, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '11px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 2,

            // Alinha o texto ao centro.
            align: 'center'
        })

        // Centra a descrição.
        .setOrigin(0.5);

        // Cria o texto do preço.
        const priceText = this.add.text(-8, 50, `${item.price}`, {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '14px',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do preço.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto do preço.
        .setOrigin(0.5);

        // Adiciona o ícone da moeda junto ao preço.
        const coin = this.add.image(13, 49.5, 'coin')

            // Reduz o tamanho da moeda.
            .setScale(0.7);

        // Adiciona todos os elementos visuais ao container.
        container.add([
            bg,
            icon,
            title,
            desc,
            priceText,
            coin
        ]);

        // Define o tamanho do container.
        container.setSize(120, 130);

        // Torna o container interativo com uma hitbox retangular.
        container.setInteractive(
            new Phaser.Geom.Rectangle(-60, -65, 120, 130),
            Phaser.Geom.Rectangle.Contains
        );

        // Se o input do container existir.
        if (container.input) {

            // Muda o cursor para pointer/mão.
            container.input.cursor = 'pointer';
        }

        // Quando o rato passa por cima do card.
        container.on('pointerover', () => {

            // Seleciona este card.
            this.selectedIndex = index;

            // Atualiza a seleção visual.
            this.updateShopSelection();
        });

        // Quando o rato clica no card.
        container.on('pointerdown', () => {

            // Diminui ligeiramente o card para efeito de clique.
            container.setScale(0.96);
        });

        // Quando o rato solta o clique no card.
        container.on('pointerup', () => {

            // Volta a escala normal do card.
            container.setScale(1);

            // Seleciona este card.
            this.selectedIndex = index;

            // Atualiza a seleção visual.
            this.updateShopSelection();

            // Compra o upgrade deste card.
            this.buyUpgrade(item);
        });

        // Devolve um objeto com referências aos elementos do card.
        return {
            container,
            bg,
            icon,
            title,
            desc,
            priceText,
            coin,
            item
        };
    }

    // Função chamada a cada frame.
    update() {

        // Se a loja estiver a fechar, não permite interação.
        if (this.isClosing) return;

        // Se carregar na seta esquerda.
        if (Phaser.Input.Keyboard.JustDown(this.keyLeft)) {

            // Anda uma posição para trás.
            this.selectedIndex--;

            // Se passar do primeiro, vai para o último.
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.shopCards.length - 1;
            }

            // Atualiza seleção visual.
            this.updateShopSelection();
        }

        // Se carregar na seta direita.
        if (Phaser.Input.Keyboard.JustDown(this.keyRight)) {

            // Anda uma posição para a frente.
            this.selectedIndex++;

            // Se passar do último, volta ao primeiro.
            if (this.selectedIndex >= this.shopCards.length) {
                this.selectedIndex = 0;
            }

            // Atualiza seleção visual.
            this.updateShopSelection();
        }

        // Se carregar ENTER ou ESPAÇO.
        if (
            Phaser.Input.Keyboard.JustDown(this.keyEnter) ||
            Phaser.Input.Keyboard.JustDown(this.keySpace)
        ) {

            // Vai buscar o card atualmente selecionado.
            const card = this.shopCards[this.selectedIndex];

            // Se o card existir.
            if (card) {

                // Compra o item do card.
                this.buyUpgrade(card.item);
            }
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {

            // Fecha a loja.
            this.closeShop();
        }
    }

    // Atualiza o aspeto visual do card selecionado.
    updateShopSelection() {

        // Se não existirem cards, não faz nada.
        if (!this.shopCards || this.shopCards.length === 0) return;

        // Percorre todos os cards.
        for (let i = 0; i < this.shopCards.length; i++) {

            // Guarda o card atual.
            const card = this.shopCards[i];

            // Se este card for o selecionado.
            if (i === this.selectedIndex) {

                // Aumenta ligeiramente o card.
                card.container.setScale(1.06);

                // Aumenta a opacidade do fundo.
                card.bg.setAlpha(0.58);

                // Muda o título para branco.
                card.title.setColor('#ffffff');
            } else {

                // Volta o card ao tamanho normal.
                card.container.setScale(1);

                // Volta a transparência normal do fundo.
                card.bg.setAlpha(0.38);

                // Volta o título à cor dourada.
                card.title.setColor('#ffd36a');
            }
        }

        // Guarda o card selecionado.
        const selected = this.shopCards[this.selectedIndex];

        // Se existir seletor visual e card selecionado.
        if (this.shopSelector && selected) {

            // Move o seletor para a posição X do card selecionado.
            this.shopSelector.x = selected.container.x;

            // Move o seletor para a posição Y do card selecionado.
            this.shopSelector.y = selected.container.y;
        }

        // Se existir botão de voltar.
        if (this.backButton) {

            // Vai buscar a imagem do botão guardada nos dados do container.
            const btnImg = this.backButton.getData('btnImg');

            // Vai buscar o texto do botão guardado nos dados do container.
            const label = this.backButton.getData('label');

            // Garante que a imagem do botão volta à escala normal.
            btnImg.setScale(0.24);

            // Garante que o texto do botão volta a branco.
            label.setColor('#ffffff');
        }
    }

    // Compra um upgrade.
    buyUpgrade(item) {

        // Calcula o total de moedas disponíveis.
        const totalCoins = this.getTotalCoins();

        // Se o jogador não tiver moedas suficientes.
        if (totalCoins < item.price) {

            // Mostra mensagem de moedas insuficientes.
            this.showShopMessage('Moedas insuficientes!');

            // Atualiza a interface da loja.
            this.refreshShopUI();

            // Para a função.
            return;
        }

        // Gasta as moedas necessárias.
        this.spendCoins(item.price);

        // Aplica o upgrade comprado.
        this.applyUpgrade(item.tipo);

        // Atualiza a interface da loja.
        this.refreshShopUI();

        // Se o upgrade for de vida, mostra mensagem.
        if (item.tipo === 'vida') this.showShopMessage('Vida aumentada!');

        // Se o upgrade for de velocidade, mostra mensagem.
        if (item.tipo === 'speed') this.showShopMessage('Velocidade aumentada!');

        // Se o upgrade for de poder, mostra mensagem.
        if (item.tipo === 'poder') this.showShopMessage('Poder aumentado!');
    }

    // Devolve o total de moedas dos jogadores.
    getTotalCoins() {

        // Vai buscar a cena do nível que abriu a loja.
        const level = this.scene.get(this.levelSceneKey);

        // Se não existir nível ou moedas, devolve 0.
        if (!level || !level.coins) return 0;

        // Soma as moedas do player 1 e player 2.
        return (level.coins.p1 || 0) + (level.coins.p2 || 0);
    }

    // Gasta moedas dos jogadores.
    spendCoins(amount) {

        // Vai buscar a cena do nível.
        const level = this.scene.get(this.levelSceneKey);

        // Se não existir nível ou moedas, não faz nada.
        if (!level || !level.coins) return;

        // Guarda a quantidade que ainda falta descontar.
        let remaining = amount;

        // Gasta primeiro moedas do player 1.
        const p1Spend = Math.min(level.coins.p1 || 0, remaining);

        // Remove moedas do player 1.
        level.coins.p1 -= p1Spend;

        // Atualiza o valor restante.
        remaining -= p1Spend;

        // Se ainda faltarem moedas para pagar.
        if (remaining > 0) {

            // Gasta moedas do player 2.
            const p2Spend = Math.min(level.coins.p2 || 0, remaining);

            // Remove moedas do player 2.
            level.coins.p2 -= p2Spend;

            // Atualiza o valor restante.
            remaining -= p2Spend;
        }

        // Garante que as moedas do player 1 nunca ficam negativas.
        level.coins.p1 = Math.max(0, level.coins.p1 || 0);

        // Garante que as moedas do player 2 nunca ficam negativas.
        level.coins.p2 = Math.max(0, level.coins.p2 || 0);

        // Guarda as moedas atualizadas no registry.
        level.registry.set('coins', {

            // Guarda moedas do player 1.
            p1: level.coins.p1,

            // Guarda moedas do player 2.
            p2: level.coins.p2
        });
    }

    // Aplica o efeito do upgrade comprado.
    applyUpgrade(tipo) {

        // Vai buscar a cena do nível.
        const level = this.scene.get(this.levelSceneKey);

        // Se o nível não existir, não faz nada.
        if (!level) return;

        // Cria uma lista com os jogadores do nível.
        const players = [
            {
                // Identificador do player 1.
                id: 'p1',

                // Referência ao objeto player1.
                player: level.player1,

                // Chave do registry usada para guardar os dados do player 1.
                dataKey: 'player1Hero'
            },
            {
                // Identificador do player 2.
                id: 'p2',

                // Referência ao objeto player2.
                player: level.player2,

                // Chave do registry usada para guardar os dados do player 2.
                dataKey: 'player2Hero'
            }

        // Remove entradas que não têm player.
        ].filter(entry => entry.player);

        // Percorre todos os jogadores existentes.
        players.forEach(entry => {

            // Guarda o player atual.
            const player = entry.player;

            // Se o player não tiver dados de personagem, ignora.
            if (!player.personagem) return;

            // VIDA

            // Se o upgrade comprado for vida.
            if (tipo === 'vida') {

                // Aumenta a vida máxima do personagem.
                player.personagem.vidaMax += 20;

                // Ao comprar vida, enche logo até ao máximo novo.
                player.personagem.vidaAtual = player.personagem.vidaMax;
            }

            // VELOCIDADE

            // Se o upgrade comprado for velocidade.
            if (tipo === 'speed') {

                // Aumenta o valor base de velocidade do personagem.
                player.personagem.speed += 1;

                // O Player usa speed * 15

                // Se a velocidade atual do objeto player for número.
                if (typeof player.speed === 'number') {

                    // Atualiza a velocidade real usada no movimento.
                    player.speed = player.personagem.speed * 15;
                }
            }

            // PODER

            // Se o upgrade comprado for poder.
            if (tipo === 'poder') {

                // Aumenta o poder do personagem.
                player.personagem.poder += 5;
            }

            // ATUALIZAR DADOS DO LEVEL

            // Se este entry for do player 1.
            if (entry.id === 'p1') {

                // Atualiza os dados do player 1 guardados no nível.
                level.p1Data = {
                    ...level.p1Data,
                    ...player.personagem
                };
            }

            // Se este entry for do player 2.
            if (entry.id === 'p2') {

                // Atualiza os dados do player 2 guardados no nível.
                level.p2Data = {
                    ...level.p2Data,
                    ...player.personagem
                };
            }

            // GUARDAR NO REGISTRY

            // Guarda os dados atualizados do jogador no registry.
            level.registry.set(entry.dataKey, {

                // Copia todos os dados atuais do personagem.
                ...player.personagem
            });
        });

        // ATUALIZAR HUD

        // Atualiza o HUD do nível.
        this.refreshLevelHUD();

        // Se o nível tiver hudSystem.
        if (level.hudSystem) {

            // Atualiza o HUD, caso esta função exista.
            level.hudSystem.updateHUD?.();

            // Atualiza a barra de vida, caso esta função exista.
            level.hudSystem.updateLifeUI?.();
        }
    }

    // Atualiza a interface da loja.
    refreshShopUI() {

        // Vai buscar o total atual de moedas.
        const totalCoins = this.getTotalCoins();

        // Se existir texto de moedas.
        if (this.coinsText) {

            // Atualiza o texto das moedas.
            this.coinsText.setText(`${totalCoins}`);
        }

        // Atualiza visualmente se os cards podem ser comprados.
        this.updateCardAffordability();
    }

    // Atualiza a aparência dos cards conforme o jogador pode ou não comprar.
    updateCardAffordability() {

        // Se não existirem cards, não faz nada.
        if (!this.shopCards) return;

        // Vai buscar o total de moedas.
        const totalCoins = this.getTotalCoins();

        // Percorre todos os cards.
        this.shopCards.forEach(card => {

            // Se o card ou item não existir, ignora.
            if (!card || !card.item) return;

            // Verifica se o jogador tem moedas suficientes para comprar.
            const canBuy = totalCoins >= card.item.price;

            // Se existir texto de preço.
            if (card.priceText) {

                // Mantém o preço branco.
                card.priceText.setColor('#ffffff');
            }

            // Se existir ícone da moeda.
            if (card.coin) {

                // Deixa a moeda normal se puder comprar, ou transparente se não puder.
                card.coin.setAlpha(canBuy ? 1 : 0.45);
            }

            // Se existir ícone do upgrade.
            if (card.icon) {

                // Deixa o ícone normal se puder comprar, ou transparente se não puder.
                card.icon.setAlpha(canBuy ? 1 : 0.55);
            }

            // Se existir descrição.
            if (card.desc) {

                // Deixa a descrição normal se puder comprar, ou transparente se não puder.
                card.desc.setAlpha(canBuy ? 1 : 0.65);
            }
        });
    }

    // Atualiza o HUD do nível enquanto a loja está aberta.
    refreshLevelHUD() {

        // Vai buscar a cena do nível.
        const level = this.scene.get(this.levelSceneKey);

        // Se não existir nível, não faz nada.
        if (!level) return;

        // Vai buscar a cena do HUD.
        const hud = this.scene.get('LevelHUDScene');

        // Se não existir HUD ou se o HUD não estiver ativo, não faz nada.
        if (!hud || !this.scene.isActive('LevelHUDScene')) return;

        // Atualizações gerais, se existirem

        // Chama updateHUD se existir.
        hud.updateHUD?.();

        // Chama atualizarHUD se existir.
        hud.atualizarHUD?.();

        // Chama updatePlayersHUD se existir.
        hud.updatePlayersHUD?.();

        // Chama updatePlayerHUD se existir.
        hud.updatePlayerHUD?.();

        // Chama updateLifeUI se existir.
        hud.updateLifeUI?.();

        // Força atualização manual do P1, se a HUD usar barras diretas

        // Se existir barra de vida do P1 e player1.
        if (hud.p1HealthBar && level.player1?.personagem) {

            // Guarda os dados do player 1.
            const p1 = level.player1.personagem;

            // Calcula a percentagem de vida do player 1.
            const percentP1 = Phaser.Math.Clamp(p1.vidaAtual / p1.vidaMax, 0, 1);

            // Se existir largura máxima da barra de vida do P1.
            if (hud.p1HealthBarMaxWidth) {

                // Atualiza a largura da barra conforme a vida.
                hud.p1HealthBar.width = hud.p1HealthBarMaxWidth * percentP1;
            }
        }

        // Força atualização manual do P2, se existir

        // Se existir barra de vida do P2 e player2.
        if (hud.p2HealthBar && level.player2?.personagem) {

            // Guarda os dados do player 2.
            const p2 = level.player2.personagem;

            // Calcula a percentagem de vida do player 2.
            const percentP2 = Phaser.Math.Clamp(p2.vidaAtual / p2.vidaMax, 0, 1);

            // Se existir largura máxima da barra de vida do P2.
            if (hud.p2HealthBarMaxWidth) {

                // Atualiza a largura da barra conforme a vida.
                hud.p2HealthBar.width = hud.p2HealthBarMaxWidth * percentP2;
            }
        }
    }

    // Mostra uma mensagem temporária na loja.
    showShopMessage(text) {

        // Se não vier texto, não faz nada.
        if (!text) return;

        // Se já existir timer de mensagem.
        if (this.shopMessageTimer) {

            // Remove o timer anterior.
            this.shopMessageTimer.remove(false);

            // Limpa a referência do timer.
            this.shopMessageTimer = null;
        }

        // Se já existir mensagem no ecrã.
        if (this.shopMessage) {

            // Cancela tweens ativos nessa mensagem.
            this.tweens.killTweensOf(this.shopMessage);

            // Destrói a mensagem anterior.
            this.shopMessage.destroy();

            // Limpa a referência.
            this.shopMessage = null;
        }

        // Guarda a largura da câmara.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara.
        const height = this.cameras.main.height;

        // Define a posição inicial da mensagem.
        const startY = height * 0.705;

        // Define a posição intermédia da mensagem.
        const middleY = height * 0.685;

        // Define a posição final da mensagem.
        const endY = height * 0.66;

        // Cria o texto da mensagem.
        this.shopMessage = this.add.text(width / 2, startY, String(text), {

            // Define a fonte.
            fontFamily: 'MedievalSharp, serif',

            // Define o tamanho da fonte.
            fontSize: '18px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5,

            // Alinha o texto ao centro.
            align: 'center'
        })

        // Centra a mensagem.
        .setOrigin(0.5)

        // Coloca a mensagem por cima de tudo.
        .setDepth(999)

        // Começa invisível.
        .setAlpha(0);

        // Cria animação de entrada da mensagem.
        this.tweens.add({

            // Define o texto como alvo da animação.
            targets: this.shopMessage,

            // A mensagem aparece.
            alpha: 1,

            // A mensagem sobe até à posição intermédia.
            y: middleY,

            // Duração da entrada.
            duration: 220,

            // Define a suavização da animação.
            ease: 'Power2',

            // Quando a animação de entrada termina.
            onComplete: () => {

                // Cria um timer para esperar antes de desaparecer.
                this.shopMessageTimer = this.time.delayedCall(1000, () => {

                    // Se a mensagem já não existir, cancela.
                    if (!this.shopMessage) return;

                    // Cria animação de saída da mensagem.
                    this.tweens.add({

                        // Define o texto como alvo.
                        targets: this.shopMessage,

                        // Faz a mensagem desaparecer.
                        alpha: 0,

                        // Move a mensagem para cima.
                        y: endY,

                        // Duração da saída.
                        duration: 260,

                        // Define a suavização da animação.
                        ease: 'Power2',

                        // Quando a animação de saída termina.
                        onComplete: () => {

                            // Se a mensagem ainda existir.
                            if (this.shopMessage) {

                                // Destroi a mensagem.
                                this.shopMessage.destroy();

                                // Limpa a referência.
                                this.shopMessage = null;
                            }

                            // Limpa o timer.
                            this.shopMessageTimer = null;
                        }
                    });
                });
            }
        });
    }

    // Cria um botão genérico.
    createButton(x, y, text, callback) {

        // Cria um container para o botão.
        const container = this.add.container(x, y)

            // Define a profundidade do botão.
            .setDepth(5);

        // Cria a imagem do botão.
        const btnImg = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da imagem.
            .setScale(0.24);

        // Cria o texto do botão.
        const label = this.add.text(0, 5, text, {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '16px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona imagem e texto ao container.
        container.add([btnImg, label]);

        // Define o tamanho da área clicável.
        container.setSize(240, 55);

        // Torna o botão interativo.
        container.setInteractive({ useHandCursor: true });

        // Guarda a imagem do botão nos dados do container.
        container.setData('btnImg', btnImg);

        // Guarda o texto do botão nos dados do container.
        container.setData('label', label);

        // Quando o rato passa por cima.
        container.on('pointerover', () => {

            // Aumenta ligeiramente a imagem.
            btnImg.setScale(0.255);

            // Muda o texto para amarelo.
            label.setColor('#ffd700');
        });

        // Quando o rato sai do botão.
        container.on('pointerout', () => {

            // Volta ao tamanho normal.
            btnImg.setScale(0.24);

            // Volta o texto a branco.
            label.setColor('#ffffff');
        });

        // Quando o rato pressiona o botão.
        container.on('pointerdown', () => {

            // Diminui ligeiramente para efeito de clique.
            btnImg.setScale(0.225);

            // Mantém o texto amarelo.
            label.setColor('#ffd700');
        });

        // Quando o rato solta o botão.
        container.on('pointerup', () => {

            // Volta a escala de hover.
            btnImg.setScale(0.255);

            // Executa a função recebida no botão.
            callback();
        });

        // Devolve o botão criado.
        return container;
    }

    // Fecha a loja e volta ao nível.
    closeShop() {

        // Se já estiver a fechar, não faz nada.
        if (this.isClosing) return;

        // Marca que a loja está a fechar.
        this.isClosing = true;

        // Vai buscar a cena do nível.
        const level = this.scene.get(this.levelSceneKey);

        // Se o nível existir.
        if (level) {

            // Marca no nível que a loja já não está aberta.
            level.shopOpen = false;

            // Se existirem moedas no nível.
            if (level.coins) {

                // Guarda as moedas no registry.
                level.registry.set('coins', {

                    // Guarda moedas do player 1.
                    p1: level.coins.p1 || 0,

                    // Guarda moedas do player 2.
                    p2: level.coins.p2 || 0
                });
            }

            // Atualiza o HUD do nível.
            this.refreshLevelHUD();
        }

        // Faz fade out da loja.
        this.cameras.main.fadeOut(250, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Se o nível estiver pausado, retoma o nível.
                if (this.scene.isPaused(this.levelSceneKey)) {
                    this.scene.resume(this.levelSceneKey);
                }

                // Se o HUD já estiver ativo.
                if (this.scene.isActive('LevelHUDScene')) {

                    // Coloca o HUD por cima.
                    this.scene.bringToTop('LevelHUDScene');
                }

                // Se o HUD não estiver ativo, mas o nível existir.
                else if (level) {

                    // Lança novamente a cena do HUD.
                    this.scene.launch('LevelHUDScene', {

                        // Passa a referência do nível ao HUD.
                        levelScene: level,

                        // Passa a chave do nível ao HUD.
                        levelKey: this.levelSceneKey
                    });

                    // Coloca o HUD por cima.
                    this.scene.bringToTop('LevelHUDScene');
                }

                // Para a cena da loja.
                this.scene.stop();
            }
        );
    }
}