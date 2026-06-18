export default class Animations { // Exporta a classe Animations para poder usá-la noutros ficheiros

    // Função estática para criar uma animação no Phaser.
    // static significa que pode chamar sem criar um objeto:
    static createAnim(scene, animKey, textureKey, frameRate = 10, repeat = 0) { 
        if (scene.anims.exists(animKey)) return;  // Verifica se a animação já existe. Se já existir, para aqui para não criar a mesma animação duas vezes.

        // Verifica se a textura/spritesheet existe no jogo.
        // A textura tem de ter sido carregada no BootScene.
        if (!scene.textures.exists(textureKey)) {
            // Mostra um aviso no console caso a textura não exista.
            console.warn(`Animação ignorada: textura "${textureKey}" não existe.`);
            // Para a função para não tentar criar animação com textura inexistente.
            return;
        }

        // Cria a animação no sistema de animações do Phaser.
        scene.anims.create({
            // Nome da animação.Exemplo: hero0_idle, hero0_walk, enemy1_death.
            key: animKey,
            // Gera automaticamente todos os frames da spritesheet. Usa a textura indicada em textureKey.
            frames: scene.anims.generateFrameNumbers(textureKey),
             // Define a velocidade da animação.
            // Quanto maior o número, mais rápida a animação.
            frameRate,
            // Define se a animação repete.
            // 0 = toca uma vez.
            // -1 = repete infinitamente.
            repeat
        });
    }

     // Função principal que cria todas as animações do jogo. É chamada uma vez depois das imagens/spritesheets estarem carregadas.
    static build(scene) {

        // Lista com os IDs dos heróis/personagens jogáveis.
        const heroes = [
            'hero0',
            'hero1',
            'hero2',
            'hero3',
            'hero4',
            'hero5',
            'hero6'
        ];

        // Percorre todos os heróis da lista.
        heroes.forEach(h => {

            // Cria a animação parada do herói.
            // Exemplo: hero0_idle usa a textura hero0_idle.
            // 8 frames por segundo. -1 significa que fica em loop infinito.
            this.createAnim(scene, `${h}_idle`, `${h}_idle`, 8, -1);
            // Cria a animação de andar do herói.
            // 12 frames por segundo. -1 significa loop infinito enquanto o jogador anda.
            this.createAnim(scene, `${h}_walk`, `${h}_walk`, 12, -1);
            // Cria a animação de levar dano.
            // 10 frames por segundo. 0 significa que toca uma vez.
            this.createAnim(scene, `${h}_hurt`, `${h}_hurt`, 10, 0);
            // Cria a animação de morte. Toca uma vez quando o personagem morre.
            this.createAnim(scene, `${h}_death`, `${h}_death`, 10, 0);

             // Cria a animação do ataque 1 do herói. Exemplo: hero0_atk1.
            this.createAnim(scene, `${h}_atk1`, `${h}_atk1`, 14, 0);
            // Cria a animação do ataque 2 do herói.
            this.createAnim(scene, `${h}_atk2`, `${h}_atk2`, 14, 0);
            // Cria a animação do ataque 3 do herói.
            this.createAnim(scene, `${h}_atk3`, `${h}_atk3`, 14, 0);

            // Cria a animação da skill/especial do herói.
            this.createAnim(scene, `${h}_skill`, `${h}_skill`, 14, 0);

            // Cria a animação de defesa/block.
            // É opcional porque nem todos os personagens podem ter esta textura.
            // Se a textura não existir, a função createAnim ignora e mostra aviso.
            this.createAnim(scene, `${h}_block`, `${h}_block`, 10, 0);

            // Cria uma animação antiga chamada heroX_atk.
            // Isto serve para código antigo que ainda use "hero0_atk" em vez de "hero0_atk1".
            // A textura usada é a do ataque 1.
            this.createAnim(scene, `${h}_atk`, `${h}_atk1`, 14, 0);
        });


        // Lista com os IDs dos inimigos do jogo.
        const enemies = [
            'enemy0',
            'enemy1',
            'enemy2',
            'enemy3',
            'enemy4',
            'enemy5',
            'enemy6',
            'enemy7',
            'enemy8'
        ];

        // Percorre todos os inimigos da lista.
        enemies.forEach(e => {

            // Cria a animação parado do inimigo.
            this.createAnim(scene, `${e}_idle`, `${e}_idle`, 8, -1);
            // Cria a animação de andar do inimigo.
            this.createAnim(scene, `${e}_walk`, `${e}_walk`, 12, -1);
            // Cria a animação de dano do inimigo.
            this.createAnim(scene, `${e}_hurt`, `${e}_hurt`, 10, 0);
            // Cria a animação de morte do inimigo.
            this.createAnim(scene, `${e}_death`, `${e}_death`, 10, 0);

            // Cria a animação do ataque 1 do inimigo.
            this.createAnim(scene, `${e}_atk1`, `${e}_atk1`, 14, 0);
            // Cria a animação do ataque 2 do inimigo.
            this.createAnim(scene, `${e}_atk2`, `${e}_atk2`, 14, 0);
            // Cria a animação do ataque 3 do inimigo.
            this.createAnim(scene, `${e}_atk3`, `${e}_atk3`, 14, 0);

            // Cria a animação de defesa/block do inimigo.
            // Se algum inimigo não tiver essa textura, é ignorado.
            this.createAnim(scene, `${e}_block`, `${e}_block`, 10, 0);
        });


        // Cria a animação do efeito de ataque da sacerdotisa.
        this.createAnim(scene, 'priest_attack_fx', 'priest_attack_fx', 14, 0);
        // Cria a animação do efeito de cura da sacerdotisa.
        this.createAnim(scene, 'priest_heal_fx', 'priest_heal_fx', 14, 0);

        // Cria a animação do primeiro efeito mágico do mago.
        this.createAnim(scene, 'wizard_attack01_fx', 'wizard_attack01_fx', 14, 0);
         // Cria a animação do segundo efeito mágico do mago.
        this.createAnim(scene, 'wizard_attack02_fx', 'wizard_attack02_fx', 14, 0);


        // Lista de bosses do jogo.
        // Neste momento só tem o boss0.
        const bosses = ['boss0'];

         // Percorre todos os bosses da lista.
        bosses.forEach(b => {

            // Cria a animação parado do boss.
            this.createAnim(scene, `${b}_idle`, `${b}_idle`, 8, -1);
            // Cria a animação de andar do boss.
            this.createAnim(scene, `${b}_walk`, `${b}_walk`, 12, -1);

            // Cria a animação do ataque 1 do boss.
            this.createAnim(scene, `${b}_atk1`, `${b}_atk1`, 14, 0);
            // Cria a animação do ataque 2 do boss.
            this.createAnim(scene, `${b}_atk2`, `${b}_atk2`, 14, 0);
            // Cria a animação do ataque 3 do boss.
            this.createAnim(scene, `${b}_atk3`, `${b}_atk3`, 14, 0);

             // Cria a animação de defesa do boss.
            this.createAnim(scene, `${b}_block`, `${b}_block`, 10, 0);
            // Cria a animação de dano do boss.
            this.createAnim(scene, `${b}_hurt`, `${b}_hurt`, 10, 0);
            // Cria a animação de morte do boss.
            this.createAnim(scene, `${b}_death`, `${b}_death`, 10, 0);
        });
    }
}