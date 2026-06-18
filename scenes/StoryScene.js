// Importa o sistema de música, usado para tocar a música da história.
import MusicSystem from '../systems/MusicSystem.js';

// Cria a classe StoryScene, responsável pela introdução narrativa do jogo.
export default class StoryScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "StoryScene".
        super('StoryScene');
    }

    // Função chamada quando a cena é criada.
    create() {

        // Guarda a largura e a altura da câmara principal.
        const { width, height } = this.cameras.main;

        // Faz fade in ao entrar na cena.
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Guarda a página atual da história.
        this.currentPage = 0;

        // Controla se a cena já está a mudar para outra.
        this.isChangingScene = false;

        // Controla se o texto ainda está a ser escrito.
        this.isTyping = false;

        // Guarda o texto completo da página atual.
        this.fullText = '';

        // Guarda o evento que escreve o texto aos poucos.
        this.typingEvent = null;

        // Guarda o evento que passa automaticamente para a próxima página.
        this.autoNextEvent = null;

        // Toca a música da história.
        MusicSystem.play(this, 'music_story', {

            // Define o volume da música.
            volume: 0.25,

            // Faz a música repetir em loop.
            loop: true,

            // Define o tempo do fade da música.
            fade: 5000
        });

        // Background.

        // Adiciona a imagem de fundo da seleção de personagens.
        this.add.image(width / 2, height / 2, 'bgCharSelect')

            // Ajusta a imagem ao tamanho do ecrã.
            .setDisplaySize(width, height)

            // Coloca o fundo na profundidade mais baixa.
            .setDepth(0);

        // Adiciona uma camada escura por cima do fundo.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da camada.
            .setAlpha(0.68)

            // Coloca a camada acima do fundo.
            .setDepth(1);

        // Título.

        // Adiciona a caixa visual do título.
        this.add.image(width / 2, height * 0.14, 'caixaTitulo')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define a escala da caixa.
            .setScale(0.24)

            // Coloca a caixa acima do fundo.
            .setDepth(2);

        // Adiciona o texto do título da história.
        this.add.text(width / 2, height * 0.16, 'A Lenda de Order of the Fallen', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '28px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto acima da caixa.
        .setDepth(3);

        // Cena / personagens.

        // Guarda os objetos visuais criados em cada página.
        this.sceneObjects = [];

        // Cria o grupo visual dos heróis.
        this.heroGroup = this.add.container(0, 0).setDepth(3);

        // Cria o grupo visual dos inimigos.
        this.enemyGroup = this.add.container(0, 0).setDepth(3);

        // Cria o grupo visual dos efeitos.
        this.fxGroup = this.add.container(0, 0).setDepth(3);

        // brilho/linha no chão

        // Cria uma linha dourada no chão para dar destaque à cena.
        this.groundGlow = this.add.rectangle(width / 2, height * 0.70, 520, 6, 0xd8b568)

            // Centra a linha.
            .setOrigin(0.5)

            // Define transparência.
            .setAlpha(0.20)

            // Define profundidade.
            .setDepth(2);

        // Caixa do texto.

        // Cria a caixa escura onde aparece o texto da história.
        this.textBox = this.add.rectangle(width / 2, height * 0.36, 850, 170, 0x000000)

            // Centra a caixa.
            .setOrigin(0.5)

            // Define transparência.
            .setAlpha(0.30)

            // Define profundidade.
            .setDepth(2);

        // Cria o texto principal da história.
        this.storyText = this.add.text(width / 2, height * 0.30, '', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do texto.
            fontSize: '26px',

            // Define a cor dourada clara.
            color: '#f6e4b0',

            // Centraliza o texto.
            align: 'center',

            // Define o espaçamento entre linhas.
            lineSpacing: 10,

            // Define a largura máxima do texto.
            wordWrap: {
                width: 760
            },

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 5
        })

        // Define a origem no centro em X e no topo em Y.
        .setOrigin(0.5, 0)

        // Coloca o texto acima da caixa.
        .setDepth(4);

        // Páginas.

        // Guarda as páginas da história e o tipo de animação de cada uma.
        this.pages = [
            {
                // Texto da primeira página.
                text: 'Conta a lenda que Valdoria era protegida por cristais mágicos, símbolos de equilíbrio e poder.',

                // Tipo de cena visual da primeira página.
                scene: 'peace'
            },
            {
                // Texto da segunda página.
                text: 'Mas um dos seus maiores cavaleiros, Odysseus, traiu o reino e corrompeu a energia dos cristais.',

                // Tipo de cena visual da segunda página.
                scene: 'darkness'
            },
            {
                // Texto da terceira página.
                text: 'Com o reino ameaçado, heróis escolhidos partem numa jornada por terras perigosas para enfrentar a ameaça.',

                // Tipo de cena visual da terceira página.
                scene: 'heroes'
            },
            {
                // Texto da quarta página.
                text: 'Assim começa Order of the Fallen: a missão para derrotar o cavaleiro caído e salvar Valdoria.',

                // Tipo de cena visual da última página.
                scene: 'final'
            }
        ];

        // Cria a barra do botão final.
        this.selectorBar = this.add.rectangle(
            width / 2,
            height * 0.82,
            420,
            36,
            0xd8b568
        )

        // Centra a barra.
        .setOrigin(0.5)

        // Define transparência.
        .setAlpha(0.22)

        // Define profundidade.
        .setDepth(4)

        // Começa invisível.
        .setVisible(false);

        // Torna a barra interativa.
        this.selectorBar.setInteractive({ useHandCursor: true });

        // Quando clica na barra.
        this.selectorBar.on('pointerdown', () => {

            // Se estiver na última página e o texto já acabou.
            if (this.currentPage === this.pages.length - 1 && !this.isTyping) {

                // Vai para o menu.
                this.irParaMenu();
            }
        });

        // Cria o losango decorativo do botão final.
        this.diamond = this.add.polygon(
            width / 2 - 235,
            height * 0.82,
            [
                0, 8,
                13, 0,
                26, 8,
                13, 16
            ],
            0xffd36a
        )

        // Centra o losango.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6)

        // Começa invisível.
        .setVisible(false);

        // Anima o losango.
        this.tweens.add({

            // Define o losango como alvo.
            targets: this.diamond,

            // Move o losango para a esquerda.
            x: this.diamond.x - 8,

            // Define a duração.
            duration: 500,

            // Faz voltar ao início.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

        // Cria o texto do botão de continuar na última página.
        this.continueText = this.add.text(width / 2, height * 0.82, 'ESCOLHER MODO', {

            // Define a fonte.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho.
            fontSize: '24px',

            // Define a cor branca.
            color: '#ffffff',

            // Coloca o texto em negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define profundidade.
        .setDepth(6)

        // Começa invisível.
        .setVisible(false)

        // Torna o texto interativo.
        .setInteractive({ useHandCursor: true });

        // Quando passa o rato por cima do texto.
        this.continueText.on('pointerover', () => {

            // Só muda a cor na última página.
            if (this.currentPage === this.pages.length - 1) {

                // Muda para dourado.
                this.continueText.setColor('#ffd700');
            }
        });

        // Quando o rato sai do texto.
        this.continueText.on('pointerout', () => {

            // Volta a cor para branco.
            this.continueText.setColor('#ffffff');
        });

        // Quando clica no texto.
        this.continueText.on('pointerdown', () => {

            // Se estiver na última página e o texto já acabou.
            if (this.currentPage === this.pages.length - 1 && !this.isTyping) {

                // Vai para o menu.
                this.irParaMenu();
            }
        });

        // Cria texto de ajuda.
        this.helpText = this.add.text(width / 2, height * 0.90, 'ENTER para avançar rápido    ESC para saltar história', {

            // Define a fonte.
            fontFamily: 'Arial',

            // Define o tamanho.
            fontSize: '16px',

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
        .setAlpha(0.85)

        // Define profundidade.
        .setDepth(6);

        // Teclas.

        // Cria a tecla ENTER.
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cria a tecla ESC.
        this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Mostra a primeira página.
        this.showPage();
    }

    // Função chamada a cada frame.
    update() {

        // Se a cena já estiver a mudar, não aceita inputs.
        if (this.isChangingScene) return;

        // Se carregar ENTER.
        if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {

            // Se o texto ainda estiver a escrever.
            if (this.isTyping) {

                // Completa o texto imediatamente.
                this.completeText();

                // Para a função.
                return;
            }

            // Na última página, ENTER vai para o menu

            // Se estiver na última página.
            if (this.currentPage === this.pages.length - 1) {

                // Vai para o menu.
                this.irParaMenu();

                // Para a função.
                return;
            }

            // Passa para a próxima página.
            this.nextPage();
        }

        // Se carregar ESC.
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {

            // Salta a história e vai para o menu.
            this.irParaMenu();
        }
    }

    // Mostrar página.

    // Mostra a página atual da história.
    showPage() {

        // Guarda a página atual.
        const page = this.pages[this.currentPage];

        // Limpa os objetos visuais da página anterior.
        this.clearSceneObjects();

        // Cria a animação visual desta página.
        this.createSceneAnimation(page.scene);

        // Começa a escrever o texto desta página.
        this.typeText(page.text);

        // Se for a última página.
        if (this.currentPage === this.pages.length - 1) {

            // Mostra a barra do botão.
            this.selectorBar.setVisible(true);

            // Mostra o losango.
            this.diamond.setVisible(true);

            // Mostra o texto de continuar.
            this.continueText.setVisible(true);

            // Muda o texto do botão para avançar.
            this.continueText.setText('AVANÇAR');
        } else {

            // Esconde a barra do botão.
            this.selectorBar.setVisible(false);

            // Esconde o losango.
            this.diamond.setVisible(false);

            // Esconde o texto de continuar.
            this.continueText.setVisible(false);
        }
    }

    // Texto a escrever sozinho.

    // Escreve o texto letra a letra.
    typeText(text) {

        // Se já existir evento de escrita.
        if (this.typingEvent) {

            // Remove o evento anterior.
            this.typingEvent.remove(false);

            // Limpa a referência.
            this.typingEvent = null;
        }

        // Se já existir evento de avanço automático.
        if (this.autoNextEvent) {

            // Remove o evento anterior.
            this.autoNextEvent.remove(false);

            // Limpa a referência.
            this.autoNextEvent = null;
        }

        // Guarda o texto completo.
        this.fullText = text;

        // Limpa o texto visível.
        this.storyText.setText('');

        // Marca que está a escrever.
        this.isTyping = true;

        // Índice atual da escrita.
        let index = 0;

        // Cria o evento que escreve o texto gradualmente.
        this.typingEvent = this.time.addEvent({

            // Tempo entre cada letra.
            delay: 28,

            // Repete até ao tamanho do texto.
            repeat: text.length - 1,

            // Função chamada a cada repetição.
            callback: () => {

                // Avança uma letra.
                index++;

                // Mostra o texto até ao índice atual.
                this.storyText.setText(text.substring(0, index));

                // Se chegou ao fim do texto.
                if (index >= text.length) {

                    // Marca que já não está a escrever.
                    this.isTyping = false;

                    // Só passa automaticamente se NÃO for a última página
                    if (this.currentPage < this.pages.length - 1) {

                        // Depois de 3200ms, passa para a próxima página.
                        this.autoNextEvent = this.time.delayedCall(3200, () => {
                            this.nextPage();
                        });
                    }
                }
            }
        });
    }

    // Completa imediatamente o texto da página atual.
    completeText() {

        // Se existir evento de escrita.
        if (this.typingEvent) {

            // Remove o evento.
            this.typingEvent.remove(false);

            // Limpa a referência.
            this.typingEvent = null;
        }

        // Mostra o texto completo.
        this.storyText.setText(this.fullText);

        // Marca que já não está a escrever.
        this.isTyping = false;

        // Se existir avanço automático.
        if (this.autoNextEvent) {

            // Remove o evento.
            this.autoNextEvent.remove(false);

            // Limpa a referência.
            this.autoNextEvent = null;
        }

        // Só passa automaticamente se NÃO for a última página
        if (this.currentPage < this.pages.length - 1) {

            // Depois de 1000ms, passa para a próxima página.
            this.autoNextEvent = this.time.delayedCall(1000, () => {
                this.nextPage();
            });
        }
    }

    // Passa para a próxima página.
    nextPage() {

        // Se ainda estiver a escrever.
        if (this.isTyping) {

            // Completa o texto primeiro.
            this.completeText();

            // Para a função.
            return;
        }

        // Se existir avanço automático.
        if (this.autoNextEvent) {

            // Remove o evento.
            this.autoNextEvent.remove(false);

            // Limpa a referência.
            this.autoNextEvent = null;
        }

        // Avança o índice da página.
        this.currentPage++;

        // Se passou da última página.
        if (this.currentPage >= this.pages.length) {

            // Vai para o menu.
            this.irParaMenu();

            // Para a função.
            return;
        }

        // Mostra a nova página.
        this.showPage();
    }

    // Animações por página.

    // Cria a animação visual conforme o tipo de página.
    createSceneAnimation(sceneType) {

        // Guarda largura e altura da câmara.
        const { width, height } = this.cameras.main;

        // Se a página for de paz.
        if (sceneType === 'peace') {

            // Cria o cristal no centro da cena.
            this.createCrystal(width / 2, height * 0.68);

            // Cria um herói ao lado do cristal.
            const hero = this.createHero('hero3', width / 2 - 90, height * 0.67, 3.2);

            // Começa o herói invisível.
            hero.setAlpha(0);

            // Faz o herói aparecer suavemente.
            this.tweens.add({
                targets: hero,
                alpha: 1,
                y: hero.y - 8,
                duration: 900,
                ease: 'Sine.easeOut'
            });

            // Cria uma luz flutuante à direita.
            this.createFloatingLight(width / 2 + 120, height * 0.61);

            // Cria uma luz flutuante à esquerda.
            this.createFloatingLight(width / 2 - 150, height * 0.60);
        }

        // Se a página for de escuridão.
        if (sceneType === 'darkness') {

            // Cria uma sombra circular atrás do boss.
            const shadow = this.add.circle(width / 2, height * 0.60, 115, 0x000000)

                // Começa invisível.
                .setAlpha(0)

                // Define profundidade.
                .setDepth(3);

            // Guarda a sombra para limpar depois.
            this.sceneObjects.push(shadow);

            // Anima a sombra a pulsar.
            this.tweens.add({
                targets: shadow,
                alpha: 0.60,
                scale: 1.25,
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Cria o boss fora do ecrã em baixo.
            const boss = this.createBoss('boss0', width / 2, height + 160, 4.2);

            // Anima a entrada do boss.
            this.tweens.add({
                targets: boss,
                y: height * 0.65,
                alpha: 1,
                duration: 900,
                ease: 'Back.easeOut',
                onComplete: () => {

                    // Depois da entrada, faz o boss flutuar.
                    this.tweens.add({
                        targets: boss,
                        y: boss.y - 8,
                        duration: 900,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            });
        }

        // Se a página for dos heróis.
        if (sceneType === 'heroes') {

            // Lista de heróis que aparecem na cena.
            const heroes = [
                { key: 'hero0', x: width * 0.20, y: height * 0.63, scale: 3.0 },
                { key: 'hero1', x: width * 0.30, y: height * 0.63, scale: 3.0 },
                { key: 'hero2', x: width * 0.40, y: height * 0.64, scale: 3.1 },
                { key: 'hero3', x: width * 0.50, y: height * 0.63, scale: 3.0 },
                { key: 'hero4', x: width * 0.60, y: height * 0.63, scale: 3.0 },
                { key: 'hero5', x: width * 0.70, y: height * 0.63, scale: 3.0 },
                { key: 'hero6', x: width * 0.80, y: height * 0.63, scale: 3.0 }
            ];

            // Percorre os heróis.
            heroes.forEach((data, index) => {

                // Cria o herói fora do ecrã em baixo.
                const hero = this.createHero(
                    data.key,
                    data.x,
                    height + 120,
                    data.scale,
                    false
                );

                // Anima a entrada de cada herói com atraso.
                this.tweens.add({
                    targets: hero,
                    y: data.y,
                    delay: index * 130,
                    duration: 550,
                    ease: 'Back.easeOut',
                    onComplete: () => {

                        // Depois da entrada, faz o herói flutuar.
                        this.tweens.add({
                            targets: hero,
                            y: hero.y - 8,
                            duration: 900,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                    }
                });
            });
        }

        // Se a página for final.
        if (sceneType === 'final') {

            // Cria a espada final.
            this.createSwordFinal(width / 2, height * 0.62);
        }
    }

    // Criar herói.

    // Cria um sprite de herói.
    createHero(key, x, y, scale = 3, autoFloat = true) {

        // Adiciona o sprite do herói.
        const hero = this.add.sprite(x, y, key)

            // Define a escala.
            .setScale(scale)

            // Define profundidade.
            .setDepth(4);

        // Tenta tocar a animação idle do herói.
        this.playAnimIfExists(hero, `${key}_idle`);

        // Se a flutuação automática estiver ativa.
        if (autoFloat) {

            // Cria animação de flutuação.
            this.tweens.add({
                targets: hero,
                y: y - 8,
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Guarda o herói para limpar quando mudar de página.
        this.sceneObjects.push(hero);

        // Devolve o herói criado.
        return hero;
    }

    // Criar inimigo.

    // Cria um sprite de inimigo.
    createEnemy(key, x, y, scale = 3) {

        // Adiciona o sprite do inimigo.
        const enemy = this.add.sprite(x, y, key)

            // Define escala.
            .setScale(scale)

            // Define profundidade.
            .setDepth(4);

        // Tenta tocar a animação idle do inimigo.
        this.playAnimIfExists(enemy, `${key}_idle`);

        // Cria animação de flutuação do inimigo.
        this.tweens.add({
            targets: enemy,
            y: y - 6,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Guarda o inimigo para limpar depois.
        this.sceneObjects.push(enemy);

        // Devolve o inimigo criado.
        return enemy;
    }

    // Cria o sprite do boss.
    createBoss(key, x, y, scale = 4) {

        // Adiciona o sprite do boss.
        const boss0 = this.add.sprite(x, y, key)

            // Define escala.
            .setScale(scale)

            // Começa invisível.
            .setAlpha(0)

            // Define profundidade.
            .setDepth(4);

        // Tenta tocar a animação idle do boss.
        this.playAnimIfExists(boss0, `${key}_idle`);

        // Guarda o boss para limpar depois.
        this.sceneObjects.push(boss0);

        // Devolve o boss criado.
        return boss0;
    }

    // Cria a espada da página final.
    createSwordFinal(x, y) {

        // círculo/brilho atrás da espada

        // Cria o brilho azul atrás da espada.
        const glow = this.add.circle(x, y - 50, 85, 0x7fdcff)

            // Define transparência.
            .setAlpha(0.13)

            // Define profundidade.
            .setDepth(2);


        // imagem da espada

        // Cria a imagem da espada.
        const sword = this.add.image(x, y - 20, 'sword')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define escala.
            .setScale(4)

            // Começa invisível.
            .setAlpha(0)

            // Define profundidade.
            .setDepth(4);

        // entrada suave da espada

        // Anima a entrada da espada.
        this.tweens.add({
            targets: sword,
            alpha: 1,
            y: sword.y - 20,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {

                // Depois da entrada, faz a espada flutuar.
                this.tweens.add({
                    targets: sword,
                    y: sword.y - 10,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // pulsar do círculo azul

        // Anima o brilho azul.
        this.tweens.add({
            targets: glow,
            alpha: 0.24,
            scale: 1.12,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Guarda os objetos para limpar depois.
        this.sceneObjects.push(glow, sword);
    }

    // Cristal.

    // Cria o cristal mágico.
    createCrystal(x, y) {

        // Cria a imagem do cristal.
        const crystal = this.add.image(x, y - 35, 'crystal')

            // Centra a imagem.
            .setOrigin(0.5)

            // Define escala.
            .setScale(2.5)

            // Define transparência.
            .setAlpha(0.95)

            // Define profundidade.
            .setDepth(4);

        // Cria brilho azul atrás do cristal.
        const glow = this.add.circle(x, y - 40, 70, 0x7fdcff)

            // Define transparência.
            .setAlpha(0.12)

            // Define profundidade.
            .setDepth(2);

        // Anima o cristal a flutuar.
        this.tweens.add({
            targets: crystal,
            y: crystal.y - 12,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Anima o brilho do cristal.
        this.tweens.add({
            targets: glow,
            alpha: 0.22,
            scale: 1.12,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Guarda os objetos para limpar depois.
        this.sceneObjects.push(crystal, glow);
    }

    // Luz flutuante.

    // Cria uma luz flutuante decorativa.
    createFloatingLight(x, y) {

        // Cria um círculo pequeno de luz.
        const light = this.add.circle(x, y, 8, 0xffe9a6)

            // Define transparência.
            .setAlpha(0.75)

            // Define profundidade.
            .setDepth(4);

        // Anima a luz a subir, descer e mudar transparência.
        this.tweens.add({
            targets: light,
            y: y - 35,
            alpha: 0.25,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Guarda a luz para limpar depois.
        this.sceneObjects.push(light);
    }

    // Tentar tocar animação.

    // Tenta tocar uma animação caso ela exista.
    playAnimIfExists(sprite, animKey) {

        // Se a animação existir.
        if (this.anims.exists(animKey)) {

            // Toca a animação.
            sprite.play(animKey);
        } else {

            // Caso contrário, usa o primeiro frame.
            sprite.setFrame(0);
        }
    }

    // Limpar objetos da página.

    // Limpa os objetos visuais da página atual.
    clearSceneObjects() {

        // Se não houver lista de objetos, não faz nada.
        if (!this.sceneObjects) return;

        // Percorre todos os objetos da página.
        this.sceneObjects.forEach(obj => {

            // Se o objeto existir.
            if (obj) {

                // Remove tweens ligados ao objeto.
                this.tweens.killTweensOf(obj);

                // Destroi o objeto.
                obj.destroy();
            }
        });

        // Limpa a lista.
        this.sceneObjects = [];
    }

    // Ir para o menu.

    // Avança para o menu de escolha de modo.
    irParaMenu() {

        // Se a cena já estiver a mudar, não faz nada.
        if (this.isChangingScene) return;

        // Marca que a cena está a mudar.
        this.isChangingScene = true;

        // Define o jogador atual como Player 1.
        this.registry.set('currentPlayer', 1);

        // Se existir evento de escrita.
        if (this.typingEvent) {

            // Remove o evento.
            this.typingEvent.remove(false);

            // Limpa a referência.
            this.typingEvent = null;
        }

        // Se existir evento automático de próxima página.
        if (this.autoNextEvent) {

            // Remove o evento.
            this.autoNextEvent.remove(false);

            // Limpa a referência.
            this.autoNextEvent = null;
        }

        // Faz fade out.
        this.cameras.main.fadeOut(500, 0, 0, 0);

        // Quando o fade out terminar.
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {

                // Vai para o menu principal.
                this.scene.start('MenuScene');
            }
        );
    }
}