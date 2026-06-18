// Objeto principal que guarda as configurações de todos os níveis do jogo.
// Aqui defines o mapa, o próximo nível, o tempo, a intro, os inimigos e os itens.
const LEVEL_CONFIG = {
     // CONFIGURAÇÃO DO NÍVEL 1
    Level1: {
        // Chave do mapa carregado no BootScene.
        // Esta key tem de bater certo com o nome usado no load.tilemapTiledJSON.
        mapKey: 'mapaNivel1',
        // Define qual é o próximo nível depois de terminar o Level1.
        nextLevel: 'Level2',
        // Tempo máximo do nível em segundos.
        // 180 segundos = 3 minutos.
        time: 180,

        // Configuração da tela de introdução do nível.
        intro: {
            // Número que aparece na intro.
            levelNumber: '1',
            // Nome do nível que aparece na intro.
            levelName: 'VALE DAS RUÍNAS',
            // Dificuldade mostrada ao jogador.
            difficulty: 'FÁCIL',
            // Imagem de fundo usada na intro deste nível.
            backgroundKey: 'bg_level1'
        },

        // Lista dos inimigos que vão nascer no Level1.
        // Cada repetição representa mais um inimigo daquele tipo.
        enemies: [
            'enemy3', 'enemy3', 'enemy3', 'enemy3',
            'enemy4', 'enemy4', 'enemy4',
            'enemy5', 'enemy5', 'enemy5'
        ],

        // Lista dos itens que vão aparecer no Level1.
        // Cada repetição representa mais um item daquele tipo.
        items: [
            'apple', 'apple', 'apple', 'apple', //vida

            'coin', 'coin', 'coin', 'coin', 'coin','coin','coin', //cristais moeda
            'coin', 'coin', 'coin', 'coin', 'coin','coin','coin',

            'icecream', 'icecream', 'icecream', //enche a barra de coldown

            'magnet', 'magnet' // servem para puxar moedas para o jogador.
        ]
    },

    // CONFIGURAÇÃO DO NÍVEL 2
    Level2: {
        // Chave do mapa do Level2.
        mapKey: 'mapaNivel2',
        // Depois do Level2, o jogo vai para o LevelFinal.
        nextLevel: 'LevelFinal',
        // Tempo máximo do Level2.
        // 280 segundos = 4 minutos e 40 segundos.
        time: 280,

        // Dados da intro do Level2.
        intro: {
            // Número do nível mostrado na intro.
            levelNumber: '2',
            // Nome do nível.
            levelName: 'A MASMORRA DE ODYSSEUS',
            // Dificuldade mostrada.
            difficulty: 'MÉDIA',
            // Fundo usado na intro do Level2.
            backgroundKey: 'bg_level2'
        },

        // Lista de inimigos do Level2.
        enemies: [
            'enemy1', 'enemy1', 'enemy1',
            'enemy0', 'enemy0', 'enemy0',
            'enemy7', 'enemy7', 'enemy7', 'enemy7'
        ],

        // Lista de itens do Level2.
        items: [
            'apple', 'apple', 'apple', 'apple', 'apple',

            'coin', 'coin', 'coin', 'coin', 'coin','coin','coin','coin','coin',
            'coin', 'coin', 'coin', 'coin','coin','coin','coin','coin','coin',

            'icecream', 'icecream','icecream',

            'magnet', 'magnet'
        ]
    },

    // CONFIGURAÇÃO DO NÍVEL FINAL
    LevelFinal: {
        // Chave do mapa final.
        mapKey: 'mapaNivelFinal',
        // Como é o último nível, não existe próximo nível.
        nextLevel: null,
        // Tempo máximo do nível final.
        // 500 segundos = 8 minutos e 20 segundos.
        time: 500,

        // Dados da intro do nível final.
        intro: {
            // Texto mostrado como número do nível.
            // Tens espaços antes de FINAL para ajustar visualmente na intro.
            levelNumber: '      FINAL',
            // Nome do mapa/nivel final.
            levelName: 'A ALA SUPERIOR',
            // Dificuldade mostrada.
            difficulty: 'DIFÍCIL',
            // Fundo usado na intro do nível final.
            backgroundKey: 'bg_levelFinal'
        },

        // Lista de inimigos normais antes do boss.
        enemies: [
            'enemy2', 'enemy2','enemy2','enemy2','enemy2',
            'enemy6', 'enemy6',
            'enemy8', 'enemy8', 'enemy8','enemy8'
        ],

        // Lista de itens do nível final.
        items: [
            'apple', 'apple', 'apple', 'apple',

            'coin', 'coin', 'coin', 'coin', 'coin', 'coin',
            'coin', 'coin', 'coin', 

            'icecream', 'icecream',

            'magnet', 'magnet'
        ]
    },
};

export default LEVEL_CONFIG; // Exporta a configuração para ser usada pelos níveis.