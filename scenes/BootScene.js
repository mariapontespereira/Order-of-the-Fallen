// Importa a classe Animations, responsável por criar todas as animações do jogo.
import Animations from '../animations/Animations.js';

// Cria a cena BootScene, que normalmente é a primeira cena do jogo.
export default class BootScene extends Phaser.Scene {

    // Construtor da cena.
    constructor() {

        // Regista esta cena no Phaser com o nome "BootScene".
        super('BootScene');
    }

    // Função preload, usada para carregar imagens, sons, mapas, spritesheets e outros recursos.
    preload() {

        // Secção da loading screen com estilo RPG.

        // Guarda a largura da câmara principal.
        const width = this.cameras.main.width;

        // Guarda a altura da câmara principal.
        const height = this.cameras.main.height;

        // Fundo escuro.

        // Cria um retângulo escuro que ocupa o ecrã inteiro.
        this.add.rectangle(0, 0, width, height, 0x020305)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Coloca este fundo na profundidade 0.
            .setDepth(0);

        // Vinheta / sombra.

        // Cria outro retângulo preto por cima para dar efeito de sombra.
        this.add.rectangle(0, 0, width, height, 0x000000)

            // Define a origem no canto superior esquerdo.
            .setOrigin(0)

            // Define a transparência da sombra.
            .setAlpha(0.35)

            // Coloca a sombra por cima do fundo.
            .setDepth(1);

        // Título grande.

        // Cria o texto principal da loading screen.
        const titleText = this.add.text(width / 2, height * 0.34, 'A CARREGAR', {

            // Define a fonte do texto.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho da letra.
            fontSize: '38px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 7
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Coloca o texto por cima dos fundos.
        .setDepth(5);

        // Subtítulo.

        // Cria o texto secundário da loading screen.
        const loadingText = this.add.text(width / 2, height * 0.43, 'Preparando o reino...', {

            // Define a fonte do subtítulo.
            fontFamily: 'MedievalSharp, Arial',

            // Define o tamanho do subtítulo.
            fontSize: '17px',

            // Define a cor dourada clara.
            color: '#ecd493',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 4
        })

        // Centra o subtítulo.
        .setOrigin(0.5)

        // Coloca o subtítulo por cima dos fundos.
        .setDepth(5);

        // Painel da barra.

        // Define a largura do painel da barra.
        const panelWidth = 430;

        // Define a altura do painel da barra.
        const panelHeight = 58;

        // Calcula o X do painel para ficar centrado.
        const panelX = width / 2 - panelWidth / 2;

        // Define a posição Y do painel.
        const panelY = height * 0.52;

        // Cria o painel principal da barra de carregamento.
        const panel = this.add.rectangle(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            0x07090d,
            0.72
        )

        // Define a origem no canto superior esquerdo.
        .setOrigin(0, 0)

        // Define a borda dourada do painel.
        .setStrokeStyle(2, 0xd8b568, 0.95)

        // Coloca o painel numa profundidade acima do fundo.
        .setDepth(3);

        // Cria um painel interior para dar mais detalhe visual.
        const innerPanel = this.add.rectangle(
            panelX + 6,
            panelY + 6,
            panelWidth - 12,
            panelHeight - 12,
            0x020305,
            0.35
        )

        // Define a origem no canto superior esquerdo.
        .setOrigin(0, 0)

        // Define uma borda interior.
        .setStrokeStyle(1, 0x8b6a32, 0.55)

        // Coloca o painel interior por cima do painel principal.
        .setDepth(4);

        // Losangos decorativos.

        // Cria o losango decorativo do lado esquerdo.
        const leftDiamond = this.add.polygon(
            panelX + 22,
            panelY + panelHeight / 2,
            [
                0, -7,
                10, 0,
                0, 7,
                -10, 0
            ],
            0xd8b568
        )

        // Coloca o losango por cima do painel.
        .setDepth(6);

        // Cria o losango decorativo do lado direito.
        const rightDiamond = this.add.polygon(
            panelX + panelWidth - 22 + 18,
            panelY + panelHeight / 2,
            [
                0, -7,
                10, 0,
                0, 7,
                -10, 0
            ],
            0xd8b568
        )

        // Coloca o losango por cima do painel.
        .setDepth(6);

        // Cria uma animação para o losango esquerdo.
        this.tweens.add({

            // Define o losango esquerdo como alvo.
            targets: leftDiamond,

            // Move o losango 5 pixels para a direita.
            x: leftDiamond.x + 5,

            // Define a duração da animação.
            duration: 600,

            // Faz o losango voltar à posição inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização da animação.
            ease: 'Sine.easeInOut'
        });

        // Cria uma animação para o losango direito.
        this.tweens.add({

            // Define o losango direito como alvo.
            targets: rightDiamond,

            // Move o losango 5 pixels para a esquerda.
            x: rightDiamond.x - 5,

            // Define a duração da animação.
            duration: 600,

            // Faz o losango voltar à posição inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização da animação.
            ease: 'Sine.easeInOut'
        });

        // Barra.

        // Define a largura da barra de progresso.
        const barWidth = 330;

        // Define a altura da barra de progresso.
        const barHeight = 14;

        // Calcula a posição X para centrar a barra.
        const barX = width / 2 - barWidth / 2;

        // Define a posição Y da barra.
        const barY = panelY + 22;

        // Cria o fundo da barra de progresso.
        const barBg = this.add.rectangle(
            barX,
            barY,
            barWidth,
            barHeight,
            0x111111,
            0.95
        )

        // Define a origem no canto superior esquerdo.
        .setOrigin(0, 0)

        // Define a borda da barra.
        .setStrokeStyle(1, 0x8b6a32, 0.75)

        // Coloca a barra acima do painel.
        .setDepth(6);

        // Cria o objeto gráfico que vai desenhar a barra preenchida.
        const progressBar = this.add.graphics().setDepth(7);

        // Cria o objeto gráfico que vai desenhar o brilho da barra.
        const progressLight = this.add.graphics().setDepth(8);

        // Cria o texto da percentagem de carregamento.
        const percentText = this.add.text(width / 2, panelY + 42, '0%', {

            // Define a fonte do texto.
            fontFamily: 'Arial',

            // Define o tamanho da percentagem.
            fontSize: '12px',

            // Define a cor do texto.
            color: '#ffffff',

            // Coloca o texto a negrito.
            fontStyle: 'bold',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto da percentagem.
        .setOrigin(0.5)

        // Coloca o texto acima da barra.
        .setDepth(8);

        // Texto pequeno em baixo.

        // Cria um texto informativo em baixo da loading screen.
        const tipText = this.add.text(width / 2, height * 0.68, 'A invocar heróis, inimigos e mapas...', {

            // Define a fonte do texto.
            fontFamily: 'Arial',

            // Define o tamanho do texto.
            fontSize: '13px',

            // Define a cor cinzenta clara.
            color: '#cfcfcf',

            // Define a cor do contorno.
            stroke: '#000000',

            // Define a espessura do contorno.
            strokeThickness: 3
        })

        // Centra o texto.
        .setOrigin(0.5)

        // Define a transparência inicial.
        .setAlpha(0.8)

        // Coloca o texto acima do fundo.
        .setDepth(5);

        // Cria uma animação para o texto piscar suavemente.
        this.tweens.add({

            // Define o texto como alvo.
            targets: tipText,

            // Reduz a transparência.
            alpha: 0.35,

            // Define a duração da animação.
            duration: 700,

            // Faz a transparência voltar ao valor inicial.
            yoyo: true,

            // Repete infinitamente.
            repeat: -1,

            // Define a suavização da animação.
            ease: 'Sine.easeInOut'
        });

        // Evento que é chamado sempre que o carregamento avança.
        this.load.on('progress', (value) => {

            // Converte o valor de 0 a 1 para percentagem de 0 a 100.
            const percent = Math.round(value * 100);

            // Calcula a largura preenchida da barra.
            const fillWidth = barWidth * value;

            // Limpa o desenho anterior da barra.
            progressBar.clear();

            // Define um gradiente dourado para a barra.
            progressBar.fillGradientStyle(
                0xd8b568,
                0xffd36a,
                0xd8b568,
                0xffd36a,
                1
            );

            // Desenha a parte preenchida da barra.
            progressBar.fillRoundedRect(barX + 2, barY + 2, Math.max(0, fillWidth - 4), barHeight - 4, 3);

            // Limpa o brilho anterior.
            progressLight.clear();

            // Define a cor branca transparente para o brilho.
            progressLight.fillStyle(0xffffff, 0.22);

            // Desenha o brilho por cima da barra preenchida.
            progressLight.fillRoundedRect(barX + 4, barY + 3, Math.max(0, fillWidth - 8), 3, 2);

            // Atualiza o texto da percentagem.
            percentText.setText(`${percent}%`);
        });

        // Evento chamado quando todos os recursos terminam de carregar.
        this.load.on('complete', () => {

            // Para a animação do losango esquerdo.
            this.tweens.killTweensOf(leftDiamond);

            // Para a animação do losango direito.
            this.tweens.killTweensOf(rightDiamond);

            // Para a animação do texto em baixo.
            this.tweens.killTweensOf(tipText);

            // Remove o título da loading screen.
            titleText.destroy();

            // Remove o subtítulo da loading screen.
            loadingText.destroy();

            // Remove o painel principal.
            panel.destroy();

            // Remove o painel interior.
            innerPanel.destroy();

            // Remove o losango esquerdo.
            leftDiamond.destroy();

            // Remove o losango direito.
            rightDiamond.destroy();

            // Remove o fundo da barra.
            barBg.destroy();

            // Remove a barra de progresso.
            progressBar.destroy();

            // Remove o brilho da barra.
            progressLight.destroy();

            // Remove o texto da percentagem.
            percentText.destroy();

            // Remove o texto pequeno em baixo.
            tipText.destroy();
        });

        // Secção de backgrounds.

        // Carrega o fundo do menu.
        this.load.image('bgMenu', 'assets/images/backgrounds/background_menu.png');

        // Carrega o fundo da seleção de personagens.
        this.load.image('bgCharSelect', 'assets/images/backgrounds/background_charselect.png');

        // Carrega o fundo da cena de Game Over.
        this.load.image('bgGameOver', 'assets/images/backgrounds/bgGameOver.png');

        // Carrega o fundo da cena de vitória.
        this.load.image('bgVictory', 'assets/images/backgrounds/bgVictory.png');

        // Carrega o fundo da vitória final.
        this.load.image('bgFinalVictory', 'assets/images/backgrounds/bgFinalVictory.png');

        // Carrega o fundo da intro do nível 1.
        this.load.image('bg_level1','assets/images/backgrounds/Intro1.png');   

        // Carrega o fundo da intro do nível 2.
        this.load.image('bg_level2','assets/images/backgrounds/Intro2.png');

        // Carrega o fundo da intro do nível final.
        this.load.image('bg_levelFinal','assets/images/backgrounds/Intro3.png');

        // Secção das caixas e botões.

        // Carrega a imagem base dos botões.
        this.load.image('botaoSelecionar','assets/images/caixas/Botao.png');

        // Carrega a caixa decorativa com caveira.
        this.load.image('btnControlsCav','assets/images/caixas/BoxCaveira.png');

        // Carrega a caixa decorativa com cruz em losango.
        this.load.image('btnControlsLos','assets/images/caixas/BoxCruzLosango.png');

        // Carrega a caixa decorativa com cruz redonda.
        this.load.image('btnControlsRed','assets/images/caixas/BoxCruzRedonda.png');

        // Carrega a caixa decorativa com escudo.
        this.load.image('btnControlsEsc','assets/images/caixas/BoxEscudo.png');

        // Carrega a caixa usada para títulos.
        this.load.image('caixaTitulo','assets/images/caixas/TituloBox.png');

        // Carrega a caixa usada na seleção de personagem.
        this.load.image('caixaChar','assets/images/caixas/CharBox.png');

        // Secção das músicas.

        // Carrega a música do menu.
        this.load.audio('music_menu', 'assets/audio/music/Menu.ogg');

        // Carrega a música de menus interiores.
        this.load.audio('music_interior', 'assets/audio/music/InteriorMenu.ogg');

        // Carrega a música da cena de história.
        this.load.audio('music_story', 'assets/audio/music/StoryScene.wav');

        // Carrega a música do nível 1.
        this.load.audio('music_level1', 'assets/audio/music/Nivel1.mp3');

        // Carrega a música do nível 2.
        this.load.audio('music_level2', 'assets/audio/music/Nivel2.wav');

        // Carrega a música do nível final.
        this.load.audio('music_levelFinal', 'assets/audio/music/NivelFinal.mp3');

        // Carrega a música do boss.
        this.load.audio('music_boss', 'assets/audio/music/Boss.ogg');

        // Carrega a música de vitória.
        this.load.audio('music_victory', 'assets/audio/music/Victory.ogg');

        // Carrega a música de vitória final.
        this.load.audio('music_finalVictory', 'assets/audio/music/FinalVictory.mp3');

        // Carrega a música de Game Over.
        this.load.audio('music_gameOver', 'assets/audio/music/GameOver.ogg');

        // Secção dos mapas e tilesets.

        // Carrega o tileset freelavatileset-Sheet como spritesheet.
        this.load.spritesheet('lavaTiles', 'assets/tilesets/freelavatileset-Sheet.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset decorativo do nível 1.
        this.load.spritesheet('decorativeTiles', 'assets/tilesets/decorative.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset principal do nível 1.
        this.load.spritesheet('mainLev2', 'assets/tilesets/MainLev2.0.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset principal das catacumbas.
        this.load.spritesheet('mainLevBuildTiles', 'assets/tilesets/catacombs/mainlevbuild.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega a imagem do tileset de vela.
        this.load.image('candleTiles', 'assets/tilesets/catacombs/candleA_01.png');

        // Carrega a imagem do tileset de tocha.
        this.load.image('torchTiles', 'assets/tilesets/catacombs/torch_2.png');

        // Carrega a imagem do espinho 0.
        this.load.image('spike_0', 'assets/images/spikes/spike_0.png');

        // Carrega a imagem do espinho 1.
        this.load.image('spike_1', 'assets/images/spikes/spike_1.png');

        // Carrega a imagem do espinho 2.
        this.load.image('spike_2', 'assets/images/spikes/spike_2.png');

        // Carrega a imagem do espinho 3.
        this.load.image('spike_3', 'assets/images/spikes/spike_3.png');

        // Carrega a imagem do espinho 4.
        this.load.image('spike_4', 'assets/images/spikes/spike_4.png');

        // Carrega o tileset decorativo das catacumbas.
        this.load.spritesheet('decorativeCatTiles', 'assets/tilesets/catacombs/decorative.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset decorativo do castelo com key principal.
        this.load.spritesheet('decorativeCastleTiles', 'assets/tilesets/castle/decorativecastle.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset principal do castelo com key principal.
        this.load.spritesheet('mainLevBuildCastleTiles', 'assets/tilesets/castle/mainlevbuildcastle.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset decorativo do castelo com alias.
        this.load.spritesheet('decorativecastle', 'assets/tilesets/castle/decorativecastle.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });

        // Carrega o tileset principal do castelo com alias.
        this.load.spritesheet('mainlevbuildcastle', 'assets/tilesets/castle/mainlevbuildcastle.png', {

            // Define a largura de cada tile.
            frameWidth: 16,

            // Define a altura de cada tile.
            frameHeight: 16
        });
 
        // Carrega o mapa do nível 1 feito no Tiled.
        this.load.tilemapTiledJSON('mapaNivel1', 'assets/maps/Nivel_1.tmj');

        // Carrega o mapa do nível 2 feito no Tiled.
        this.load.tilemapTiledJSON('mapaNivel2', 'assets/maps/Nivel_2.tmj');

        // Carrega o mapa do nível final feito no Tiled.
        this.load.tilemapTiledJSON('mapaNivelFinal', 'assets/maps/NivelFinal.tmj');

        // Secção dos players.

        // Lista com os dados dos heróis e os ficheiros das spritesheets.
        const players = [
            {id: 'hero0',folder: 'archer',file: 'Archer',attacks: ['Attack01', 'Attack02']},

            {id: 'hero1',folder: 'axeman',file: 'ArmoredAxeman',attacks: ['Attack01', 'Attack02', 'Attack03']},

            {id: 'hero2',folder: 'knight',file: 'Knight',attacks: ['Attack01', 'Attack02', 'Attack03'],block: true},
            
            {id: 'hero3',folder: 'priest',file: 'Priest',attacks: ['Attack'],skillName: 'Heal'},

            {id: 'hero4',folder: 'soldier',file: 'Soldier',attacks: ['Attack01', 'Attack02', 'Attack03']},
            
            {id: 'hero5',folder: 'wizard',file: 'Wizard',attacks: ['Attack01', 'Attack02']},
            
            {id: 'hero6',folder: 'swordsman',file: 'Swordsman',attacks: ['Attack01', 'Attack02', 'Attack03']}
        ];

        // Percorre todos os players da lista.
        players.forEach(p => {

            // Cria o caminho base da pasta do player.
            const basePath = `assets/images/players/${p.folder}`;

            // Carrega a spritesheet principal do player.
            this.load.spritesheet(p.id, `${basePath}/${p.file}.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação idle do player.
            this.load.spritesheet(`${p.id}_idle`, `${basePath}/${p.file}-Idle.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação walk do player.
            this.load.spritesheet(`${p.id}_walk`, `${basePath}/${p.file}-Walk.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação hurt do player.
            this.load.spritesheet(`${p.id}_hurt`, `${basePath}/${p.file}-Hurt.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação death do player.
            this.load.spritesheet(`${p.id}_death`, `${basePath}/${p.file}-Death.png`, {frameWidth: 100,frameHeight: 100});

            // ataques: hero0_atk1, hero0_atk2, hero1_atk3, etc.

            // Percorre os ataques do player.
            p.attacks.forEach((attackName, index) => {

                // Carrega a spritesheet de cada ataque do player.
                this.load.spritesheet(`${p.id}_atk${index + 1}`, `${basePath}/${p.file}-${attackName}.png`, {

                    // Define a largura de cada frame.
                    frameWidth: 100,

                    // Define a altura de cada frame.
                    frameHeight: 100
                });
            });

            // skill principal.

            // Se o player tiver uma skill com nome próprio.
            if (p.skillName) {

                // Carrega a spritesheet da skill.
                this.load.spritesheet(`${p.id}_skill`, `${basePath}/${p.file}-${p.skillName}.png`, {

                    // Define a largura de cada frame.
                    frameWidth: 100,

                    // Define a altura de cada frame.
                    frameHeight: 100
                });
            } else {

                // Vai buscar o último ataque da lista.
                const lastAttack = p.attacks[p.attacks.length - 1];

                // Usa o último ataque como skill.
                this.load.spritesheet(`${p.id}_skill`, `${basePath}/${p.file}-${lastAttack}.png`, {

                    // Define a largura de cada frame.
                    frameWidth: 100,

                    // Define a altura de cada frame.
                    frameHeight: 100
                });
            }

            // block opcional.

            // Se o player tiver block.
            if (p.block) {

                // Carrega a spritesheet de block do player.
                this.load.spritesheet(`${p.id}_block`, `${basePath}/${p.file}-Block.png`, {

                    // Define a largura de cada frame.
                    frameWidth: 100,

                    // Define a altura de cada frame.
                    frameHeight: 100
                });
            }
        });

        // Secção dos enemies.

        // Lista com os dados dos inimigos e os ficheiros das spritesheets.
        const enemies = [
            {id: 'enemy0',folder: 'armoredOrc',file: 'ArmoredOrc',attacks: ['Attack01', 'Attack02', 'Attack03'],block: true},
            
            {id: 'enemy1',folder: 'orc',file: 'Orc',attacks: ['Attack01', 'Attack02']},
            
            {id: 'enemy2',folder: 'skeleton',file: 'Skeleton',attacks: ['Attack01', 'Attack02'],block: true},
           
            {id: 'enemy3',folder: 'slime', file: 'Slime',attacks: ['Attack01', 'Attack02']},
           
            {id: 'enemy4',folder: 'werebear',file: 'Werebear',attacks: ['Attack01', 'Attack02', 'Attack03']},
            
            {id: 'enemy5',folder: 'werewolf',file: 'Werewolf',attacks: ['Attack01', 'Attack02']},
           
            {id: 'enemy6',folder: 'armoredSkeleton',file: 'ArmoredSkeleton',attacks: ['Attack01', 'Attack02']},
            
            {id: 'enemy7',folder: 'greatswordSkeleton', file: 'GreatswordSkeleton',attacks: ['Attack01', 'Attack02', 'Attack03']},
            
            {id: 'enemy8',folder: 'skeletonArcher',file: 'SkeletonArcher',attacks: ['Attack']}
        ];

        // Percorre todos os inimigos da lista.
        enemies.forEach(e => {

            // Cria o caminho base da pasta do inimigo.
            const basePath = `assets/images/enemies/${e.folder}`;

            // Carrega a spritesheet principal do inimigo.
            this.load.spritesheet(e.id, `${basePath}/${e.file}.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação idle do inimigo.
            this.load.spritesheet(`${e.id}_idle`, `${basePath}/${e.file}-Idle.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação walk do inimigo.
            this.load.spritesheet(`${e.id}_walk`, `${basePath}/${e.file}-Walk.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação hurt do inimigo.
            this.load.spritesheet(`${e.id}_hurt`, `${basePath}/${e.file}-Hurt.png`, {frameWidth: 100,frameHeight: 100});

            // Carrega a animação death do inimigo.
            this.load.spritesheet(`${e.id}_death`, `${basePath}/${e.file}-Death.png`, {frameWidth: 100,frameHeight: 100});

            // Percorre os ataques do inimigo.
            e.attacks.forEach((attackName, index) => {

                // Carrega a spritesheet de cada ataque do inimigo.
                this.load.spritesheet(`${e.id}_atk${index + 1}`, `${basePath}/${e.file}-${attackName}.png`, {

                    // Define a largura de cada frame.
                    frameWidth: 100,

                    // Define a altura de cada frame.
                    frameHeight: 100
                });
            });

            // Se o inimigo tiver block.
            if (e.block) {

                // Carrega a spritesheet de block do inimigo.
                this.load.spritesheet(`${e.id}_block`, `${basePath}/${e.file}-Block.png`, {

                    // Define a largura de cada frame.
                    frameWidth: 100,

                    // Define a altura de cada frame.
                    frameHeight: 100
                });
            }
        });

        // Secção dos projéteis de flechas.

        // Carrega a primeira flecha.
        this.load.image('arrow01', 'assets/images/projectiles/arrows/Arrow01.png');

        // Carrega a segunda flecha.
        this.load.image('arrow02', 'assets/images/projectiles/arrows/Arrow02.png');

        // Carrega a terceira flecha.
        this.load.image('arrow03', 'assets/images/projectiles/arrows/Arrow03.png');

        // Secção dos projéteis mágicos.

        // Carrega o efeito de ataque da sacerdotisa.
        this.load.spritesheet('priest_attack_fx', 'assets/images/projectiles/magic/Priest-Attack_Effect.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega o efeito de cura da sacerdotisa.
        this.load.spritesheet('priest_heal_fx', 'assets/images/projectiles/magic/Priest-Heal_Effect.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega o primeiro efeito de ataque do mago.
        this.load.spritesheet('wizard_attack01_fx', 'assets/images/projectiles/magic/Wizard-Attack01_Effect.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega o segundo efeito de ataque do mago.
        this.load.spritesheet('wizard_attack02_fx', 'assets/images/projectiles/magic/Wizard-Attack02_Effect.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Secção dos itens.

        // Carrega o cristal.
        this.load.image('crystal', 'assets/images/items/crystal.png');

        // Carrega a moeda.
        this.load.image('coin', 'assets/images/items/coin.png');

        // Carrega a maçã.
        this.load.image('apple', 'assets/images/items/apple.png');

        // Carrega o gelado.
        this.load.image('icecream', 'assets/images/items/icecream.png');

        // Carrega o íman.
        this.load.image('magnet', 'assets/images/items/magnet.png');

        // Carrega a chave.
        this.load.image('key', 'assets/images/items/key.png');

        // Carrega a ampulheta.
        this.load.image('hourglass', 'assets/images/items/hourglass.png');

        // Carrega a espada.
        this.load.image('sword', 'assets/images/items/sword.png');

        // Carrega o baú fechado.
        this.load.image('chest', 'assets/images/items/Chest01.png');

        // Carrega o baú aberto.
        this.load.image('chestAberto', 'assets/images/items/ChestAberto.png');

        // Secção dos upgrades.

        // Carrega o ícone de velocidade extra.
        this.load.image('ExtraSpeed', 'assets/images/items/energy.png');

        // Carrega o ícone de vida extra.
        this.load.image('ExtraVida', 'assets/images/items/heart.png');

        // Carrega o ícone de poder extra.
        this.load.image('ExtraPoder', 'assets/images/items/power.png');

        // Secção do boss.

        // Carrega a spritesheet principal do boss.
        this.load.spritesheet('boss0', 'assets/images/boss/lancerBoss/Lancer.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação idle do boss.
        this.load.spritesheet('boss0_idle', 'assets/images/boss/lancerBoss/Lancer-Idle.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação walk do boss.
        this.load.spritesheet('boss0_walk', 'assets/images/boss/lancerBoss/Lancer-Walk.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação do ataque 1 do boss.
        this.load.spritesheet('boss0_atk1', 'assets/images/boss/lancerBoss/Lancer-Attack01.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação do ataque 2 do boss.
        this.load.spritesheet('boss0_atk2', 'assets/images/boss/lancerBoss/Lancer-Attack02.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação do ataque 3 do boss.
        this.load.spritesheet('boss0_atk3', 'assets/images/boss/lancerBoss/Lancer-Attack03.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação de dano do boss.
        this.load.spritesheet('boss0_hurt', 'assets/images/boss/lancerBoss/Lancer-Hurt.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });

        // Carrega a animação de morte do boss.
        this.load.spritesheet('boss0_death', 'assets/images/boss/lancerBoss/Lancer-Death.png', {

            // Define a largura de cada frame.
            frameWidth: 100,

            // Define a altura de cada frame.
            frameHeight: 100
        });
        
    }

    // Função create, chamada depois de todos os recursos carregarem.
    create() {

        // Cria animações depois de carregar tudo.
        Animations.build(this);

        // Valores globais seguros.

        // Se ainda não existir gameMode no registry.
        if (!this.registry.has('gameMode')) {

            // Define o modo de jogo padrão como single.
            this.registry.set('gameMode', 'single');
        }

        // Se ainda não existir currentPlayer no registry.
        if (!this.registry.has('currentPlayer')) {

            // Define o jogador atual como 1.
            this.registry.set('currentPlayer', 1);
        }

        // Inicia a cena StartScene depois do carregamento.
        this.scene.start('StartScene');
    }
}