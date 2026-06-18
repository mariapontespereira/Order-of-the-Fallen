// Importa a cena BootScene, responsável por carregar recursos iniciais do jogo.
import BootScene from './scenes/BootScene.js';

// Importa a cena inicial do jogo.
import StartScene from './scenes/StartScene.js';

// Importa a cena da história/introdução narrativa.
import StoryScene from './scenes/StoryScene.js';

// Importa a cena do menu principal.
import MenuScene from './scenes/MenuScene.js';

// Importa a cena onde aparecem os recordes.
import RecordsScene from './scenes/RecordsScene.js';

// Importa a cena onde o jogador escreve/escolhe o nome.
import NameScene from './scenes/NameScene.js';

// Importa a cena de seleção de personagem.
import CharSelect from './scenes/CharSelect.js';

// Importa a cena do HUD do nível, onde aparecem vida, tempo, moedas, inventário, etc.
import LevelHUDScene from './scenes/LevelHUDScene.js';

// Importa o primeiro nível do jogo.
import Level1 from './scenes/Level1.js';

// Importa o segundo nível do jogo.
import Level2 from './scenes/Level2.js';

// Importa o nível final do jogo.
import LevelFinal from './scenes/LevelFinal.js';

// Importa a cena da loja bónus.
import BonusShopScene from './scenes/BonusShopScene.js';

// Importa a cena de Game Over.
import GameOver from './scenes/GameOver.js';

// Importa a cena de vitória de um nível normal.
import VictoryScene from './scenes/VictoryScene.js';

// Importa a cena de vitória final do jogo.
import FinalVictoryScene from './scenes/FinalVictoryScene.js';

// Importa a cena dos controlos.
import ControlsScene from './scenes/ControlsScene.js';

// Importa a cena de pausa.
import PauseScene from './scenes/PauseScene.js';

// Importa a cena “Sobre”/informações do jogo.
import AboutScene from './scenes/AboutScene.js';

// Cria o objeto de configuração principal do jogo Phaser.
const config = {
    // Define o tipo de renderização.
    // Phaser.AUTO deixa o Phaser escolher automaticamente entre WebGL ou Canvas.
    type: Phaser.AUTO,

    // Define o elemento HTML onde o jogo vai ser colocado.
    // Neste caso, usa a div com id "game-container".
    parent: 'game-container',

    // Define a largura interna do jogo.
    width: 1280,

    // Define a altura interna do jogo.
    height: 720,

    // Ativa o modo pixel art para manter os sprites com aspeto pixelizado.
    pixelArt: true,

    // Desativa suavização das imagens.
    // Isto evita que pixel art fique desfocada.
    antialias: false,

    // Arredonda os pixels para evitar tremores/blur em alguns movimentos.
    roundPixels: true,

    // Configuração de escala do jogo.
    scale: {
        // Faz o jogo ajustar-se ao tamanho da janela mantendo a proporção.
        mode: Phaser.Scale.FIT,

        // Centra o jogo horizontalmente e verticalmente no ecrã.
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    // Configuração da física do jogo.
    physics: {
        // Define Arcade Physics como sistema de física padrão.
        default: 'arcade',

        // Configurações específicas da física Arcade.
        arcade: {
            // Desativa o modo debug das hitboxes e colisões.
            debug: false
        }
    },

    // Lista de cenas registadas no jogo.
    // A ordem é importante porque o Phaser reconhece estas cenas a partir daqui.
    scene: [
        // Cena de carregamento inicial.
        BootScene,

        // Cena inicial.
        StartScene,

        // Cena da história.
        StoryScene,

        // Menu principal.
        MenuScene,

        // Cena dos recordes.
        RecordsScene,

        // Cena para nome do jogador.
        NameScene,

        // Cena de seleção de personagem.
        CharSelect,

        // Cena dos controlos.
        ControlsScene,

        // Cena sobre/informações.
        AboutScene,

        // HUD usado durante os níveis.
        LevelHUDScene,

        // Primeiro nível.
        Level1,

        // Segundo nível.
        Level2,

        // Nível final.
        LevelFinal,

        // Loja bónus.
        BonusShopScene,

        // Cena de vitória entre níveis.
        VictoryScene,

        // Cena de vitória final.
        FinalVictoryScene,

        // Cena de game over.
        GameOver,

        // Cena de pausa.
        PauseScene
    ]
};

// Cria uma nova instância do jogo Phaser usando a configuração definida acima.
const game = new Phaser.Game(config);