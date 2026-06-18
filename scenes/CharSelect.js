// Importa o sistema responsável por guardar o progresso do jogo.
import SaveSystem from '../systems/SaveSystem.js';

// Importa o sistema responsável pela música do jogo.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe CharSelect, responsável pela seleção de personagens.
export default class CharSelect extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "CharSelect".
        super('CharSelect');
    }

    // Função preload vazia porque os recursos já são carregados no BootScene.
    preload() {}

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Controla se a cena já está a trocar para outra cena.
        this.isChangingScene = false;

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Controla se o popup de confirmação está aberto.
        this.confirmacaoFase = false;

        // Toca a música interior nesta cena.
        MusicSystem.play(this, 'music_interior', {

            // Define o volume da música.
            volume: 0.45,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo do fade da música.
            fade: 1000
        });

        // Secção do background.

        // Adiciona a imagem de fundo da seleção de personagens.
        this.add.image(width / 2, height / 2, 'bgCharSelect')

            // Ajusta a imagem ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Coloca a imagem no fundo.
            .setDepth(0);

        // Fundo preto transparente por cima do background.

        // Adiciona um retângulo preto por cima da imagem de fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência do retângulo.
            .setAlpha(0.45)

            // Coloca o retângulo acima do fundo.
            .setDepth(1);

        // Secção dos dados.

        // Índice do personagem atualmente selecionado.
        this.currentIndex = 0;

        // Vai buscar qual jogador está a escolher personagem.
        this.currentPlayer = this.registry.get('currentPlayer') || 1;

        // Lista com todos os heróis disponíveis para seleção.
        this.opcoes = [
            {
                // ID usado para sprites, animações e identificação do herói.
                id: 'hero0',

                // Nome do herói.
                nome: 'KAEL',

                // Classe/tipo do herói.
                tipo: 'Arqueiro',

                // Vida máxima inicial.
                vidaMax: 100,

                // Vida atual inicial.
                vidaAtual: 100,

                // Valor de poder do herói.
                poder: 12,

                // Velocidade base do herói.
                speed: 6,

                // Descrição mostrada no painel.
                desc: 'Ágil e letal à distância.',

                // Nome da habilidade especial.
                especial: 'Flecha Perfurante'
            },
            {
                // ID usado para este herói.
                id: 'hero1',

                // Nome do herói.
                nome: 'THORN',

                // Classe/tipo do herói.
                tipo: 'Executor',

                // Vida máxima inicial.
                vidaMax: 150,

                // Vida atual inicial.
                vidaAtual: 150,

                // Valor de poder.
                poder: 18,

                // Velocidade base.
                speed: 4,

                // Descrição do herói.
                desc: 'Força bruta para combate próximo.',

                // Nome do especial.
                especial: 'Golpe de Eixo'
            },
            {
                // ID usado para este herói.
                id: 'hero2',

                // Nome do herói.
                nome: 'EDWYN',

                // Classe/tipo do herói.
                tipo: 'Cavaleiro',

                // Vida máxima inicial.
                vidaMax: 180,

                // Vida atual inicial.
                vidaAtual: 180,

                // Valor de poder.
                poder: 10,

                // Velocidade base.
                speed: 4,

                // Descrição do herói.
                desc: 'Tanque com defesa reforçada.',

                // Nome do especial.
                especial: 'Lâmina Flamejante'
            },
            {
                // ID usado para este herói.
                id: 'hero3',

                // Nome do herói.
                nome: 'AMARA',

                // Classe/tipo do herói.
                tipo: 'Sacerdotisa',

                // Vida máxima inicial.
                vidaMax: 100,

                // Vida atual inicial.
                vidaAtual: 100,

                // Valor de poder.
                poder: 8,

                // Velocidade base.
                speed: 5,

                // Descrição do herói.
                desc: 'Suporte que cura aliados.',

                // Nome do especial.
                especial: 'Luz de Cura'
            },
            {
                // ID usado para este herói.
                id: 'hero4',

                // Nome do herói.
                nome: 'BRUTUS',

                // Classe/tipo do herói.
                tipo: 'Soldado',

                // Vida máxima inicial.
                vidaMax: 120,

                // Vida atual inicial.
                vidaAtual: 120,

                // Valor de poder.
                poder: 10,

                // Velocidade base.
                speed: 5,

                // Descrição do herói.
                desc: 'Forte e preparado para tudo.',

                // Nome do especial.
                especial: 'Ataque Rápido'
            },
            {
                // ID usado para este herói.
                id: 'hero5',

                // Nome do herói.
                nome: 'MAGNUS',

                // Classe/tipo do herói.
                tipo: 'Mago',

                // Vida máxima inicial.
                vidaMax: 80,

                // Vida atual inicial.
                vidaAtual: 80,

                // Valor de poder.
                poder: 20,

                // Velocidade base.
                speed: 5,

                // Descrição do herói.
                desc: 'Dano mágico em área elevado.',

                // Nome do especial.
                especial: 'Explosão Arcana'
            },
            {
                // ID usado para este herói.
                id: 'hero6',

                // Nome do herói.
                nome: 'PRINCE',

                // Classe/tipo do herói.
                tipo: 'Paladino',

                // Vida máxima inicial.
                vidaMax: 110,

                // Vida atual inicial.
                vidaAtual: 110,

                // Valor de poder.
                poder: 18,

                // Velocidade base.
                speed: 6,

                // Descrição do herói.
                desc: 'Corta antes que vejas o golpe.',

                // Nome do especial.
                especial: 'Corte Relâmpago'
            }
        ];

        // Se for o Jogador 2, não deixa começar no mesmo herói do Jogador 1.
        if (this.currentPlayer === 2) {

            // Ajusta o índice caso o herói atual já tenha sido escolhido pelo jogador 1.
            this.ajustarIndexSeHeroiJaFoiEscolhido();
        }

        // Secção das posições gerais.

        // Guarda o centro X do ecrã.
        this.centerX = width / 2;

        // Guarda o centro Y do ecrã.
        this.centerY = height / 2;

        // Define a posição X do sprite do personagem.
        this.charX = width * 0.495;

        // Define a posição Y do sprite do personagem.
        this.charY = height * 0.725;

        // Define a posição X dos textos de informação.
        this.infoX = width * 0.71;

        // Define a posição Y inicial dos textos de informação.
        this.infoY = height * 0.35;

        // Define a posição X dos botões.
        this.buttonX = this.charX - 415;

        // Secção do título com caixa.

        // Adiciona a caixa decorativa do título.
        this.caixaTitulo = this.add.image(
            this.centerX,
            height * 0.16,
            'caixaTitulo'
        )

        // Centra a imagem da caixa.
        .setOrigin(0.5)

        // Define a escala da caixa.
        .setScale(0.24)

        // Define a profundidade da caixa.
        .setDepth(2);

        // Define o nome do jogador que está a escolher.
        const playerName = this.currentPlayer === 1

            // Se for player 1, usa o nome guardado ou "JOGADOR 1".
            ? this.registry.get('player1Name') || 'JOGADOR 1'

            // Se for player 2, usa o nome guardado ou "JOGADOR 2".
            : this.registry.get('player2Name') || 'JOGADOR 2';

        // Cria o texto do título da cena.
        this.tituloTxt = this.add.text(
            this.centerX,
            height * 0.18,
            `${playerName.toUpperCase()}, SELECIONA O TEU HERÓI`,
            {
                // Define o tamanho da fonte.
                fontSize: '22px',

                // Define a fonte usada.
                fontFamily: 'MedievalSharp, Arial',

                // Define a cor branca.
                color: '#ffffff',

                // Coloca o texto em negrito.
                fontStyle: 'bold',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 5
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima da caixa.
        .setDepth(3);

        // Secção do nome do personagem.

        // Cria o texto onde aparece o nome do herói selecionado.
        this.nomeTxt = this.add.text(
            this.charX + 5,
            height * 0.83,
            '',
            {
                // Define o tamanho do texto.
                fontSize: '28px',

                // Define a cor branca.
                color: '#ffffff',

                // Coloca o texto em negrito.
                fontStyle: 'bold',

                // Define a fonte.
                fontFamily: 'MedievalSharp, Arial',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            }
        )

        // Centra o texto.
        .setOrigin(0.5)

        // Define a profundidade do texto.
        .setDepth(5);

        // Secção do sprite do personagem.

        // Cria o sprite do personagem inicial.
        this.spritePersonagem = this.add.sprite(this.charX, this.charY, 'hero0')

            // Aumenta o sprite.
            .setScale(4)

            // Define a profundidade do sprite.
            .setDepth(4);

        // Secção das setas.

        // Estilo visual usado nas setas de navegação.
        const arrowStyle = {

            // Define o tamanho da fonte.
            fontSize: '26px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca a seta em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 7
        };

        // Cria a seta esquerda.
        this.btnEsquerda = this.add.text(
            this.charX - 90,
            this.charY,
            '<',
            arrowStyle
        )

        // Centra a seta.
        .setOrigin(0.5)

        // Coloca a seta por cima.
        .setDepth(10)

        // Torna a seta clicável.
        .setInteractive({ useHandCursor: true });

        // Cria a seta direita.
        this.btnDireita = this.add.text(
            this.charX + 90,
            this.charY,
            '>',
            arrowStyle
        )

        // Centra a seta.
        .setOrigin(0.5)

        // Coloca a seta por cima.
        .setDepth(10)

        // Torna a seta clicável.
        .setInteractive({ useHandCursor: true });

        // Quando clica na seta esquerda, muda para o personagem anterior.
        this.btnEsquerda.on('pointerdown', () => this.mudarPersonagem(-1));

        // Quando clica na seta direita, muda para o próximo personagem.
        this.btnDireita.on('pointerdown', () => this.mudarPersonagem(1));

        // Secção do teclado.

        // Cria a tecla esquerda.
        this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        // Cria a tecla direita.
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla cima.
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Cria a tecla baixo.
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Cria a tecla ESC.
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Secção da caixa das características.

        // Cria a caixa visual onde aparecem as estatísticas do herói.
        this.charInfoBox = this.add.image(
            width * 0.82,
            height * 0.53,
            'caixaChar'
        )

        // Centra a caixa.
        .setOrigin(0.5)

        // Define a escala da caixa.
        .setScale(0.30)

        // Define a profundidade da caixa.
        .setDepth(2);

        // Secção dos textos das características.

        // Cria o texto do tipo/classe do herói.
        this.tipoTxt = this.add.text(this.infoX, this.infoY, '', {

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor dourada clara.
            color: '#f3e0a2',

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Define a profundidade do texto.
        .setDepth(3);

        // Cria o texto da vida.
        this.vidaTxt = this.add.text(this.infoX, this.infoY + 50, '', {

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a fonte.
            fontFamily: 'Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Define a profundidade do texto.
        .setDepth(3);

        // Cria o texto do poder.
        this.poderTxt = this.add.text(this.infoX, this.infoY + 92, '', {

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a fonte.
            fontFamily: 'Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Define a profundidade do texto.
        .setDepth(3);

        // Cria o texto da velocidade.
        this.speedTxt = this.add.text(this.infoX, this.infoY + 134, '', {

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a fonte.
            fontFamily: 'Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Define a profundidade do texto.
        .setDepth(3);

        // Cria o texto do especial.
        this.especialTxt = this.add.text(this.infoX, this.infoY + 176, '', {

            // Define o tamanho do texto.
            fontSize: '25px',

            // Define a cor dourada.
            color: '#ffd700',

            // Coloca o texto em itálico.
            fontStyle: 'italic',

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Define a profundidade do texto.
        .setDepth(3);

        // Cria o texto da descrição.
        this.descTxt = this.add.text(this.infoX, this.infoY + 225, '', {

            // Define o tamanho do texto.
            fontSize: '20px',

            // Define a cor cinzenta.
            color: '#cccccc',

            // Define quebra de linha automática.
            wordWrap: { width: 320 },

            // Define a fonte.
            fontFamily: 'Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Define a profundidade do texto.
        .setDepth(3);

        // Secção dos botões.

        // Cria o botão de selecionar personagem.
        this.criarBotaoEscolher();

        // Cria o botão de voltar ao menu.
        this.criarBotaoVoltar();

        // Cria o botão de voltar ao Player 1, se estiver no Player 2.
        this.criarBotaoVoltarP1();

        // Secção do popup.

        // Cria o popup de confirmação final.
        this.criarPopupConfirmacao();

        // Atualiza o painel com os dados do personagem atual.
        this.atualizarPainel();
    }

    // Função chamada a cada frame.
    update() {

        // Se o popup de confirmação estiver aberto.
        if (this.confirmacaoFase) {

            // Se carregar na tecla cima.
            if (Phaser.Input.Keyboard.JustDown(this.keyUp)) {

                // Move a seleção do popup para cima.
                this.popupSelectedIndex--;

                // Se passar do primeiro, vai para o último.
                if (this.popupSelectedIndex < 0) {
                    this.popupSelectedIndex = this.popupOptions.length - 1;
                }

                // Atualiza visualmente a seleção do popup.
                this.updatePopupSelection();
            }

            // Se carregar na tecla baixo.
            if (Phaser.Input.Keyboard.JustDown(this.keyDown)) {

                // Move a seleção do popup para baixo.
                this.popupSelectedIndex++;

                // Se passar do último, volta ao primeiro.
                if (this.popupSelectedIndex >= this.popupOptions.length) {
                    this.popupSelectedIndex = 0;
                }

                // Atualiza visualmente a seleção do popup.
                this.updatePopupSelection();
            }

            // Se carregar ENTER.
            if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {

                // Executa a ação da opção selecionada no popup.
                this.popupOptions[this.popupSelectedIndex].action();
            }

            // Se carregar ESC.
            if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

                // Fecha o popup de confirmação.
                this.esconderConfirmacaoFinal();
            }

            // Para aqui para não controlar a seleção normal enquanto o popup está aberto.
            return;
        }

        // Se carregar na seta esquerda.
        if (Phaser.Input.Keyboard.JustDown(this.keyLeft)) {

            // Muda para o personagem anterior.
            this.mudarPersonagem(-1);
        }

        // Se carregar na seta direita.
        if (Phaser.Input.Keyboard.JustDown(this.keyRight)) {

            // Muda para o próximo personagem.
            this.mudarPersonagem(1);
        }

        // Se carregar ENTER.
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {

            // Seleciona o personagem atual.
            this.selecionarPersonagem();
        }
    }

    // Devolve o ID do herói bloqueado para o Player 2.
    getHeroiBloqueadoId() {

        // Se não for o Player 2, não há herói bloqueado.
        if (this.currentPlayer !== 2) return null;

        // Vai buscar o herói escolhido pelo Player 1.
        const player1Hero = this.registry.get('player1Hero');

        // Se o Player 1 ainda não escolheu herói, não há bloqueio.
        if (!player1Hero) return null;

        // Devolve o ID do herói escolhido pelo Player 1.
        return player1Hero.id;
    }

    // Verifica se um herói está bloqueado.
    isHeroiBloqueado(heroId) {

        // Vai buscar o ID do herói bloqueado.
        const bloqueadoId = this.getHeroiBloqueadoId();

        // Devolve verdadeiro se existir bloqueio e se o ID for igual.
        return bloqueadoId && heroId === bloqueadoId;
    }

    // Ajusta o índice se o personagem atual já tiver sido escolhido.
    ajustarIndexSeHeroiJaFoiEscolhido() {

        // Vai buscar o herói bloqueado.
        const bloqueadoId = this.getHeroiBloqueadoId();

        // Se não existir herói bloqueado, não faz nada.
        if (!bloqueadoId) return;

        // Se a opção atual não existir, não faz nada.
        if (!this.opcoes[this.currentIndex]) return;

        // Se a opção atual não for o herói bloqueado, não faz nada.
        if (this.opcoes[this.currentIndex].id !== bloqueadoId) return;

        // Percorre todas as opções.
        for (let i = 0; i < this.opcoes.length; i++) {

            // Procura um herói que não seja o bloqueado.
            if (this.opcoes[i].id !== bloqueadoId) {

                // Define esse herói como selecionado.
                this.currentIndex = i;

                // Termina a função.
                return;
            }
        }
    }

    // Mostra uma mensagem quando o Player 2 tenta escolher o mesmo herói do Player 1.
    mostrarAvisoHeroiBloqueado() {

        // Se já existir aviso, remove o aviso anterior.
        if (this.avisoHeroiBloqueado) {
            this.avisoHeroiBloqueado.destroy();
        }

        // Vai buscar a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Cria o texto de aviso.
        this.avisoHeroiBloqueado = this.add.text(
            width / 2,
            height * 0.92,
            'Este herói já foi escolhido pelo Jogador 1',
            {
                // Define a fonte do aviso.
                fontFamily: 'Arial',

                // Define o tamanho do aviso.
                fontSize: '18px',

                // Define a cor vermelha.
                color: '#ff4444',

                // Coloca o aviso em negrito.
                fontStyle: 'bold',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 4
            }
        )

        // Centra o aviso.
        .setOrigin(0.5)

        // Coloca o aviso acima de outros elementos.
        .setDepth(100);

        // Depois de 1800ms, remove o aviso.
        this.time.delayedCall(1800, () => {

            // Se o aviso ainda existir.
            if (this.avisoHeroiBloqueado) {

                // Destroi o aviso.
                this.avisoHeroiBloqueado.destroy();

                // Limpa a referência do aviso.
                this.avisoHeroiBloqueado = null;
            }
        });
    }

    // Muda o personagem selecionado.
    mudarPersonagem(direcao) {

        // Se o popup estiver aberto, não deixa mudar.
        if (this.confirmacaoFase) return;

        // Guarda o número total de opções.
        const total = this.opcoes.length;

        // Tenta encontrar uma opção válida.
        for (let i = 0; i < total; i++) {

            // Atualiza o índice de forma circular.
            this.currentIndex =
                (this.currentIndex + direcao + total) % total;

            // Guarda o personagem atual.
            const char = this.opcoes[this.currentIndex];

            // Se o personagem não estiver bloqueado.
            if (!this.isHeroiBloqueado(char.id)) {

                // Atualiza a textura do sprite.
                this.spritePersonagem.setTexture(char.id);

                // Atualiza o painel de informações.
                this.atualizarPainel();

                // Termina a função.
                return;
            }
        }
    }

    // Atualiza o painel com os dados do herói selecionado.
    atualizarPainel() {

        // Guarda o personagem selecionado.
        const char = this.opcoes[this.currentIndex];

        // Atualiza o texto com o nome do personagem.
        this.nomeTxt.setText(char.nome);

        // Atualiza a textura do sprite do personagem.
        this.spritePersonagem.setTexture(char.id);

        // Se o sprite tiver sistema de animações.
        if (this.spritePersonagem.anims) {

            // Define o frame inicial.
            this.spritePersonagem.setFrame(1);
        }

        // Atualiza o texto da vida.
        this.vidaTxt.setText('Vida: ' + char.vidaMax + ' HP');

        // Atualiza o texto do poder.
        this.poderTxt.setText('Poder: ' + char.poder);

        // Atualiza o texto da velocidade.
        this.speedTxt.setText('Velocidade: ' + char.speed);

        // Atualiza o texto do especial.
        this.especialTxt.setText('★ ' + char.especial);

        // Atualiza o texto da descrição.
        this.descTxt.setText(char.desc);

        // Se este herói estiver bloqueado.
        if (this.isHeroiBloqueado(char.id)) {

            // Muda o nome para cinzento.
            this.nomeTxt.setColor('#777777');

            // Mostra texto de bloqueio no tipo.
            this.tipoTxt.setText('HERÓI JÁ ESCOLHIDO');

            // Muda o texto para vermelho.
            this.tipoTxt.setColor('#ff4444');
        } else {

            // Mantém o nome branco.
            this.nomeTxt.setColor('#ffffff');

            // Mostra o tipo do herói.
            this.tipoTxt.setText('Tipo: ' + char.tipo);

            // Mantém a cor dourada clara.
            this.tipoTxt.setColor('#f3e0a2');
        }
    }

    // Seleciona o personagem atual.
    selecionarPersonagem() {

        // Se o popup estiver aberto, não faz nada.
        if (this.confirmacaoFase) return;

        // Guarda o herói selecionado.
        const heroiSelecionado = this.opcoes[this.currentIndex];

        // Vai buscar o modo de jogo.
        const modo = this.registry.get('gameMode');

        // Guarda qual player está a escolher.
        const p = this.currentPlayer;

        // Secção de bloqueio de herói repetido no multiplayer.

        // Se for multiplayer e for o player 2.
        if (modo === 'multi' && p === 2) {

            // Vai buscar o herói escolhido pelo player 1.
            const player1Hero = this.registry.get('player1Hero');

            // Se o player 2 tentar escolher o mesmo herói.
            if (player1Hero && player1Hero.id === heroiSelecionado.id) {

                // Mostra aviso.
                this.mostrarAvisoHeroiBloqueado();

                // Cancela a seleção.
                return;
            }
        }

        // Guarda o herói selecionado no registry.
        this.registry.set(`player${p}Hero`, heroiSelecionado);

        // Se for singleplayer ou se o player 2 já escolheu.
        if (modo === 'single' || p === 2) {

            // Se existir função para resetar o botão escolher.
            if (this.resetBotaoEscolher) {

                // Reseta visualmente o botão.
                this.resetBotaoEscolher();
            }

            // Mostra popup final de confirmação.
            this.mostrarConfirmacaoFinal();
        } else {

            // Define que agora é o Player 2 que vai escolher.
            this.registry.set('currentPlayer', 2);

            // Reinicia a cena para atualizar o título e estado.
            this.scene.restart();
        }
    }

    // Cria o botão de selecionar personagem.
    criarBotaoEscolher() {

        // Guarda a altura da câmara.
        const { height } = this.cameras.main;

        // Define a posição X do botão.
        const btnX = this.buttonX;

        // Define a posição Y do botão.
        const btnY = height * 0.44;

        // Cria um container para o botão escolher.
        this.btnEscolherContainer = this.add.container(btnX, btnY)

            // Define a profundidade do botão.
            .setDepth(10);

        // Cria a imagem do botão.
        const btnImg = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da imagem.
            .setScale(0.24);

        // Cria o texto do botão selecionar.
        const texto = this.add.text(0, 5, 'SELECIONAR', {

            // Define o tamanho da fonte.
            fontSize: '18px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona a imagem e o texto ao container.
        this.btnEscolherContainer.add([btnImg, texto]);

        // Define o tamanho da área clicável.
        this.btnEscolherContainer.setSize(210, 55);

        // Torna o botão interativo.
        this.btnEscolherContainer.setInteractive({ useHandCursor: true });

        // Função que volta o botão ao estado normal.
        const resetBtn = () => {

            // Volta a imagem à escala normal.
            btnImg.setScale(0.24);

            // Volta o texto a branco.
            texto.setColor('#ffffff');
        };

        // Função que aplica visual de hover.
        const hoverBtn = () => {

            // Aumenta ligeiramente a imagem.
            btnImg.setScale(0.255);

            // Muda o texto para amarelo.
            texto.setColor('#ffd700');
        };

        // Função que aplica visual de clique.
        const clickBtn = () => {

            // Reduz ligeiramente a imagem.
            btnImg.setScale(0.225);

            // Muda o texto para amarelo.
            texto.setColor('#ffd700');
        };

        // Quando o rato passa por cima do botão.
        this.btnEscolherContainer.on('pointerover', () => {

            // Se o popup estiver aberto, ignora.
            if (this.confirmacaoFase) return;

            // Aplica visual de hover.
            hoverBtn();
        });

        // Quando o rato sai do botão.
        this.btnEscolherContainer.on('pointerout', () => {

            // Volta o botão ao normal.
            resetBtn();
        });

        // Quando o rato pressiona o botão.
        this.btnEscolherContainer.on('pointerdown', () => {

            // Se o popup estiver aberto, ignora.
            if (this.confirmacaoFase) return;

            // Aplica visual de clique.
            clickBtn();
        });

        // Quando o rato solta o botão.
        this.btnEscolherContainer.on('pointerup', () => {

            // Se o popup estiver aberto, ignora.
            if (this.confirmacaoFase) return;

            // Aplica visual de hover.
            hoverBtn();

            // Seleciona o personagem.
            this.selecionarPersonagem();
        });

        // Guarda a função de reset para usar depois.
        this.resetBotaoEscolher = resetBtn;
    }

    // Cria o botão de voltar ao menu.
    criarBotaoVoltar() {

        // Guarda a altura da câmara.
        const { height } = this.cameras.main;

        // Define a posição X do botão.
        const btnX = this.buttonX;

        // Define a posição Y do botão.
        const btnY = height * 0.62;

        // Cria o container do botão voltar.
        this.btnVoltarMenu = this.add.container(btnX, btnY)

            // Define a profundidade do botão.
            .setDepth(10);

        // Cria a imagem do botão.
        const btnImg = this.add.image(0, 0, 'botaoSelecionar')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da imagem.
            .setScale(0.24);

        // Cria o texto do botão voltar.
        const texto = this.add.text(0, 5, 'VOLTAR AO MENU', {

            // Define o tamanho da fonte.
            fontSize: '16px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5);

        // Adiciona a imagem e o texto ao container.
        this.btnVoltarMenu.add([btnImg, texto]);

        // Define o tamanho da área clicável.
        this.btnVoltarMenu.setSize(210, 55);

        // Torna o botão interativo.
        this.btnVoltarMenu.setInteractive({ useHandCursor: true });

        // Função que volta o botão ao normal.
        const resetBtn = () => {

            // Volta a imagem à escala normal.
            btnImg.setScale(0.24);

            // Volta o texto a branco.
            texto.setColor('#ffffff');
        };

        // Função que aplica hover.
        const hoverBtn = () => {

            // Aumenta ligeiramente a imagem.
            btnImg.setScale(0.255);

            // Muda o texto para amarelo.
            texto.setColor('#ffd700');
        };

        // Função que aplica clique.
        const clickBtn = () => {

            // Reduz ligeiramente a imagem.
            btnImg.setScale(0.225);

            // Muda o texto para amarelo.
            texto.setColor('#ffd700');
        };

        // Quando o rato passa por cima.
        this.btnVoltarMenu.on('pointerover', () => {

            // Se o popup estiver aberto, ignora.
            if (this.confirmacaoFase) return;

            // Aplica hover.
            hoverBtn();
        });

        // Quando o rato sai do botão.
        this.btnVoltarMenu.on('pointerout', () => {

            // Volta ao normal.
            resetBtn();
        });

        // Quando o rato pressiona o botão.
        this.btnVoltarMenu.on('pointerdown', () => {

            // Se o popup estiver aberto, ignora.
            if (this.confirmacaoFase) return;

            // Aplica clique.
            clickBtn();
        });

        // Quando o rato solta o botão.
        this.btnVoltarMenu.on('pointerup', () => {

            // Se o popup estiver aberto, ignora.
            if (this.confirmacaoFase) return;

            // Volta para o jogador 1.
            this.registry.set('currentPlayer', 1);

            // Remove a escolha do player 1.
            this.registry.remove('player1Hero');

            // Remove a escolha do player 2.
            this.registry.remove('player2Hero');

            // Faz fade out.
            this.cameras.main.fadeOut(400, 0, 0, 0);

            // Quando o fade out acabar.
            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                () => {

                    // Inicia o menu principal.
                    this.scene.start('MenuScene');
                }
            );
        });
    }

    // Cria o botão para voltar à seleção do Player 1 no modo multiplayer.
    criarBotaoVoltarP1() {

        // Vai buscar o modo de jogo.
        const modo = this.registry.get('gameMode');

        // Só cria este botão se for multiplayer e se estiver no Player 2.
        if (modo !== 'single' && this.currentPlayer === 2) {

            // Cria o texto clicável para alterar o Player 1.
            this.btnVoltarP1 = this.add.text(
                this.centerX - 5,
                this.cameras.main.height * 0.91,
                '↩ Alterar Player 1',
                {
                    // Define o tamanho da fonte.
                    fontSize: '18px',

                    // Define a cor amarela.
                    color: '#ffcc00',

                    // Define a fonte.
                    fontFamily: 'Arial',

                    // Coloca em negrito.
                    fontStyle: 'bold',

                    // Define a cor do contorno.
                    stroke: '#000000',

                    // Define a espessura do contorno.
                    strokeThickness: 5
                }
            )

            // Centra o texto.
            .setOrigin(0.5)

            // Coloca por cima.
            .setDepth(10)

            // Torna o texto interativo.
            .setInteractive({ useHandCursor: true });

            // Quando o rato passa por cima.
            this.btnVoltarP1.on('pointerover', () => {

                // Se não estiver no popup.
                if (!this.confirmacaoFase) {

                    // Muda a cor para branco.
                    this.btnVoltarP1.setStyle({ color: '#ffffff' });
                }
            });

            // Quando o rato sai.
            this.btnVoltarP1.on('pointerout', () => {

                // Volta a cor para amarelo.
                this.btnVoltarP1.setStyle({ color: '#ffcc00' });
            });

            // Quando clica no botão.
            this.btnVoltarP1.on('pointerdown', () => {

                // Se o popup estiver aberto, ignora.
                if (this.confirmacaoFase) return;

                // Volta para o Player 1
                this.registry.set('currentPlayer', 1);

                // Apaga a escolha anterior do Player 1
                this.registry.remove('player1Hero');

                // Apaga também a escolha do Player 2, para não ficar preso
                this.registry.remove('player2Hero');

                // Reinicia a cena do CharSelect
                this.scene.restart();
            });
        }
    }

    // Cria o popup de confirmação depois de escolher o herói.
    criarPopupConfirmacao() {

        // Guarda a largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Cria o container do popup.
        this.popupContainer = this.add.container(0, 0)

            // Começa invisível.
            .setVisible(false)

            // Coloca por cima de tudo.
            .setDepth(1000);

        // Fundo escuro por cima de tudo

        // Cria o fundo escuro do popup.
        const fader = this.add.rectangle(0, 0, width, height, 0x000000)

            // Define origem no canto superior esquerdo.
            .setOrigin(0)

            // Define transparência do fundo.
            .setAlpha(0.62);

        // Secção da posição do popup no meio.

        // Define a posição X central do popup.
        const menuX = width / 2;

        // Define a posição Y central do popup.
        const menuY = height / 2;

        // Título.

        // Cria o título do popup.
        const titulo = this.add.text(menuX, menuY - 95, 'CONFIRMAR HERÓI?', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '34px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o título.
        .setOrigin(0.5);

        // Cria o subtítulo do popup.
        const subtitulo = this.add.text(menuX, menuY - 50, 'Preparado para entrar em combate?', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '18px',

            // Define a cor cinzenta clara.
            color: '#d8d8d8',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o subtítulo.
        .setOrigin(0.5);

        // Barra selecionada.

        // Cria a barra visual da opção selecionada.
        this.popupSelectorBar = this.add.rectangle(
            menuX,
            menuY + 20,
            300,
            34,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência da barra.
        .setAlpha(0.35);

        // Losango à esquerda da opção.

        // Cria o losango indicador da opção selecionada.
        this.popupSelector = this.add.polygon(
            menuX - 164,
            menuY + 20,
            [
                0, 8,
                13, 0,
                26, 8,
                13, 16
            ],
            0xffd36a
        )

        // Centra o losango.
        .setOrigin(0.5);

        // Cria uma animação no losango do popup.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.popupSelector,

            // Move o losango para a direita.
            x: this.popupSelector.x + 8,

            // Define a duração.
            duration: 500,

            // Faz voltar à posição inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização.
            ease: 'Sine.easeInOut'
        });

        // Define a primeira opção do popup como selecionada.
        this.popupSelectedIndex = 0;

        // Lista de opções do popup.
        this.popupOptions = [
            {
                // Texto da primeira opção.
                text: 'Voltar',

                // Posição Y da opção.
                y: menuY + 20,

                // Ação da opção.
                action: () => {

                    // Fecha o popup.
                    this.esconderConfirmacaoFinal();
                }
            },
            {
                // Texto da segunda opção.
                text: 'Avançar',

                // Posição Y da opção.
                y: menuY + 68,

                // Ação da opção.
                action: () => {

                    // Se já está a mudar de cena, cancela.
                    if (this.isChangingScene) return;

                    // Marca que a cena está a mudar.
                    this.isChangingScene = true;

                    // Faz fade out.
                    this.cameras.main.fadeOut(500, 0, 0, 0);

                    // Quando o fade terminar.
                    this.cameras.main.once(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        () => {

                            // Guarda o progresso inicial do jogo.
                            SaveSystem.saveProgress({

                                // Guarda que o próximo nível é o Level1.
                                levelKey: 'Level1',

                                // Guarda o modo de jogo.
                                gameMode: this.registry.get('gameMode') || 'single',

                                // Guarda o herói do player 1.
                                player1Hero: this.registry.get('player1Hero'),

                                // Guarda o herói do player 2.
                                player2Hero: this.registry.get('player2Hero'),

                                // Guarda o nome do player 1.
                                player1Name: this.registry.get('player1Name'),

                                // Guarda o nome do player 2.
                                player2Name: this.registry.get('player2Name'),

                                // Guarda moedas iniciais.
                                coins: { p1: 0, p2: 0 }
                            });

                            // Começa o Level1.
                            this.scene.start('Level1');
                        }
                    );
                }
            }
        ];

        // Lista onde serão guardados os textos das opções do popup.
        this.popupTexts = [];

        // Percorre as opções do popup.
        this.popupOptions.forEach((option, index) => {

            // Cria o texto da opção.
            const txt = this.add.text(menuX, option.y, option.text, {

                // Define a fonte.
                fontFamily: 'Arial',

                // Define o tamanho.
                fontSize: '24px',

                // Define a cor cinzenta.
                color: '#dcdcdc',

                // Define a cor do contorno.
                stroke: '#000000',

                // Define a espessura do contorno.
                strokeThickness: 3
            })

            // Centra o texto.
            .setOrigin(0.5)

            // Torna a opção clicável.
            .setInteractive({ useHandCursor: true });

            // Quando passa o rato por cima.
            txt.on('pointerover', () => {

                // Atualiza o índice selecionado.
                this.popupSelectedIndex = index;

                // Atualiza a seleção visual.
                this.updatePopupSelection();
            });

            // Quando clica na opção.
            txt.on('pointerdown', () => {

                // Executa a ação da opção.
                option.action();
            });

            // Guarda o texto na lista.
            this.popupTexts.push(txt);
        });

        // Cria o texto de ajuda do popup.
        const ajuda = this.add.text(menuX, menuY + 140, '↑ ↓ Navegar    ENTER Selecionar    ESC Voltar', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '15px',

            // Define a cor branca.
            color: '#ffffff',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto de ajuda.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.85);

        // Adiciona todos os elementos ao container do popup.
        this.popupContainer.add([
            fader,
            titulo,
            subtitulo,
            this.popupSelectorBar,
            this.popupSelector,
            ...this.popupTexts,
            ajuda
        ]);

        // Atualiza a seleção visual inicial do popup.
        this.updatePopupSelection();
    }

    // Atualiza visualmente a opção selecionada no popup.
    updatePopupSelection() {

        // Se não houver textos ou opções, não faz nada.
        if (!this.popupTexts || !this.popupOptions) return;

        // Percorre os textos do popup.
        for (let i = 0; i < this.popupTexts.length; i++) {

            // Guarda o texto atual.
            const txt = this.popupTexts[i];

            // Se este texto for o selecionado.
            if (i === this.popupSelectedIndex) {

                // Muda a cor para branco.
                txt.setColor('#ffffff');

                // Aumenta ligeiramente o texto.
                txt.setScale(1.08);
            } else {

                // Volta a cor normal.
                txt.setColor('#dcdcdc');

                // Volta a escala normal.
                txt.setScale(1);
            }
        }

        // Guarda a opção selecionada.
        const selected = this.popupOptions[this.popupSelectedIndex];

        // Move a barra para a opção selecionada.
        this.popupSelectorBar.y = selected.y;

        // Move o losango para a opção selecionada.
        this.popupSelector.y = selected.y;
    }

    // Mostra o popup de confirmação final.
    mostrarConfirmacaoFinal() {

        // Marca que está na fase de confirmação.
        this.confirmacaoFase = true;

        // Mostra o container do popup.
        this.popupContainer.setVisible(true);

        // Desativa a seta esquerda.
        this.btnEsquerda.input.enabled = false;

        // Desativa a seta direita.
        this.btnDireita.input.enabled = false;

        // Desativa o botão selecionar.
        this.btnEscolherContainer.input.enabled = false;

        // Desativa o botão voltar ao menu.
        this.btnVoltarMenu.input.enabled = false;

        // Se existir botão de voltar ao player 1.
        if (this.btnVoltarP1) {

            // Esconde o botão de voltar ao player 1.
            this.btnVoltarP1.setVisible(false);
        }

        // Se existir função para resetar botão escolher.
        if (this.resetBotaoEscolher) {

            // Reseta visualmente o botão escolher.
            this.resetBotaoEscolher();
        }
    }

    // Esconde o popup de confirmação final.
    esconderConfirmacaoFinal() {

        // Sai da fase de confirmação.
        this.confirmacaoFase = false;

        // Esconde o container do popup.
        this.popupContainer.setVisible(false);

        // Reativa a seta esquerda.
        this.btnEsquerda.input.enabled = true;

        // Reativa a seta direita.
        this.btnDireita.input.enabled = true;

        // Reativa o botão selecionar.
        this.btnEscolherContainer.input.enabled = true;

        // Reativa o botão voltar ao menu.
        this.btnVoltarMenu.input.enabled = true;

        // Se existir botão de voltar ao player 1.
        if (this.btnVoltarP1) {

            // Mostra o botão novamente.
            this.btnVoltarP1.setVisible(true);
        }

        // Se existir função para resetar botão escolher.
        if (this.resetBotaoEscolher) {

            // Reseta visualmente o botão escolher.
            this.resetBotaoEscolher();
        }
    }
}