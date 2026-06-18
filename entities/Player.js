// Cria a classe Player.
// Ela herda de Phaser.Physics.Arcade.Sprite,
// ou seja, o player é uma imagem/sprite com física Arcade.
export default class Player extends Phaser.Physics.Arcade.Sprite {

    // O constructor é chamado quando crias um novo player.
    // scene = cena onde o player aparece.
    // x, y = posição inicial.
    // texture = textura inicial do player.
    // data = dados do herói escolhido, como vida, nome, speed, poder, etc.
    constructor(scene, x, y, texture, data) {

        // Chama o constructor da classe Sprite do Phaser.
        // Cria o player na posição x/y com a textura recebida.
        super(scene, x, y, texture);

        // Adiciona o player visualmente à cena.
        scene.add.existing(this);

        // Ativa física Arcade no player.
        scene.physics.add.existing(this);

        // Guarda a cena dentro do player.
        this.scene = scene;
        // Guarda todos os dados do herói.
        this.heroData = data;

        // DADOS DO HERÓI

        // Nome do herói.
        this.nome = data.nome;
        // Tipo/classe do herói, se existir nos dados.
        this.tipo = data.tipo;

        // Guarda os dados completos do personagem.
        // É daqui que vem a vida atual, vida máxima, id, speed, etc.
        this.personagem = data;

        // Poder do herói.
        this.poder = data.poder;
        // Especial do herói.
        this.especial = data.especial;

        // Velocidade do player.
        // Multiplica por 15 para transformar o valor pequeno do data em velocidade real no Phaser.
        this.speed = data.speed * 15;

        // ESTADOS
        // Indica se o player está morto.
        this.isDead = false;
        // Indica se o player está a atacar.
        this.isAttacking = false;
        // Indica se o player está a levar dano.
        this.isHurting = false;
        // Indica se o player está a defender.
        this.isBlocking = false;

        // Multiplicador de dano durante a defesa.
        // 1 significa dano normal. 0.5 significa metade do dano.
        this.blockReduction = 1;

        // Bloqueia troca de animações automáticas.
        // Serve para o walk/idle não cancelar ataque, dano ou defesa.
        this.lockAnim = false;

        // DIREÇÃO DO PLAYER
        // Guarda a última direção em texto. Exemplo: right, left, up, down, up-right...
        this.lastDirection = 'right';

        // Guarda a última direção em vetor X.
        // 1 = direita, -1 = esquerda, 0 = sem direção horizontal.
        this.lastDirX = 1;
        // Guarda a última direção em vetor Y.
        // 1 = baixo, -1 = cima, 0 = sem direção vertical.
        this.lastDirY = 0;

        // VISUAL
        // Define o tamanho visual do player.
        this.setScale(1);

        // HITBOX
        // Define o tamanho da hitbox física do player. A sprite pode ser maior, mas a colisão fica 20x20.
        this.body.setSize(20, 20);
        // Move a hitbox para ficar alinhada com o corpo/pés do player.
        this.body.setOffset(40, 40);

        // ANIMAÇÃO INICIAL
        // Monta o nome da animação idle.
        const idleAnim = `${this.personagem.id}_idle`;

        // Se a animação existir, toca a animação parado.
        if (this.scene.anims.exists(idleAnim)) {
            this.play(idleAnim, true);
        }
    }

    // Movimento com as setas do teclado.
    //usado pelo Player 1.
    updateMovement(cursors) {

        // Se não existirem cursores, sai da função.
        if (!cursors) return;
        // Se faltar alguma tecla, sai da função.
        if (!cursors.left || !cursors.right || !cursors.up || !cursors.down) return;

        // Se o player estiver morto, a levar dano ou a defender, não se move.
        if (this.isDead || this.isHurting || this.isBlocking) return;

        // Se estiver a atacar, fica parado.
        if (this.isAttacking) {
            this.setVelocity(0);
            return;
        }

        // Começa sempre por parar o player.
        this.setVelocity(0);

        // Direção horizontal.
        let dirX = 0;
        // Direção vertical.
        let dirY = 0;

        // DIREÇÃO HORIZONTAL
        // Se carregar para a esquerda.
        if (cursors.left.isDown) {
            dirX = -1;
             // Vira a sprite para a esquerda.
            this.setFlipX(true);
        }
        // Se carregar para a direita.
        else if (cursors.right.isDown) {
            dirX = 1;
            // Vira a sprite para a direita.
            this.setFlipX(false);
        }

        // DIREÇÃO VERTICAL
        // Se carregar para cima.
        if (cursors.up.isDown) {
            dirY = -1;
        }
        // Se carregar para baixo.
        else if (cursors.down.isDown) {
            dirY = 1;
        }

        // Verifica se o player está a mover.
        const moving = dirX !== 0 || dirY !== 0;

        if (moving) {

            // Cria um vetor com a direção e normaliza.
            // Isto impede que andar na diagonal fique mais rápido.
            const vec = new Phaser.Math.Vector2(dirX, dirY).normalize();

            // Aplica velocidade ao player.
            this.setVelocity(vec.x * this.speed, vec.y * this.speed);

            // guarda direção em vetor
            // Isto é usado pelos ataques/projéteis.
            this.lastDirX = vec.x;
            this.lastDirY = vec.y;

            // guarda direção em texto
            if (dirX === 1 && dirY === 0) {
                this.lastDirection = 'right';
            }
            else if (dirX === -1 && dirY === 0) {
                this.lastDirection = 'left';
            }
            else if (dirX === 0 && dirY === -1) {
                this.lastDirection = 'up';
            }
            else if (dirX === 0 && dirY === 1) {
                this.lastDirection = 'down';
            }
            else if (dirX === 1 && dirY === -1) {
                this.lastDirection = 'up-right';
            }
            else if (dirX === -1 && dirY === -1) {
                this.lastDirection = 'up-left';
            }
            else if (dirX === 1 && dirY === 1) {
                this.lastDirection = 'down-right';
            }
            else if (dirX === -1 && dirY === 1) {
                this.lastDirection = 'down-left';
            }
        }

         // Vai buscar o id do personagem.
        const id = this.personagem.id;
        // Se estiver a mover, usa walk. Se estiver parado, usa idle.
        const targetAnim = moving ? `${id}_walk` : `${id}_idle`;

        // Só troca animação se não estiver bloqueado por ataque/dano/defesa.
        // Também evita reiniciar a mesma animação a cada frame.
        if (!this.lockAnim && this.anims.currentAnim?.key !== targetAnim) {
            this.play(targetAnim, true);
        }
    }

    // Movimento com teclas personalizadas.
    //usado pelo Player 2 com WASD.
    updateMovementKeys(keys) {

        // Se não existirem teclas, sai.
        if (!keys) return;
        // Se faltar alguma tecla, sai.
        if (!keys.left || !keys.right || !keys.up || !keys.down) return;

        // Se estiver morto, a levar dano ou a defender, não move.
        if (this.isDead || this.isHurting || this.isBlocking) return;

        // Se estiver a atacar, fica parado.
        if (this.isAttacking) {
            this.setVelocity(0);
            return;
        }

        // Se não tiver body físico, sai.
        if (!this.body) return;

        // Para o player antes de calcular nova direção.
        this.setVelocity(0);

        // Direção horizontal.
        let dirX = 0;
        // Direção vertical.
        let dirY = 0;

        // DIREÇÃO HORIZONTAL
        // Se carregar para a esquerda.
        if (keys.left.isDown) {
            dirX = -1;
            this.setFlipX(true);
        }
        // Se carregar para a direita.
        else if (keys.right.isDown) {
            dirX = 1;
            this.setFlipX(false);
        }

        // DIREÇÃO VERTICAL

        // Se carregar para cima.
        if (keys.up.isDown) {
            dirY = -1;
        }
         // Se carregar para baixo.
        else if (keys.down.isDown) {
            dirY = 1;
        }

        // Verifica se está em movimento.
        const moving = dirX !== 0 || dirY !== 0;

        // Se estiver a mover.
        if (moving) {

            // Normaliza a direção para a diagonal não ficar mais rápida.
            const vec = new Phaser.Math.Vector2(dirX, dirY).normalize();

            // Aplica velocidade.
            this.setVelocity(vec.x * this.speed, vec.y * this.speed);

            // Guarda direção em vetor para ataques/projéteis.
            this.lastDirX = vec.x;
            this.lastDirY = vec.y;

            // guarda direção em texto
            if (dirX === 1 && dirY === 0) {
                this.lastDirection = 'right';
            }
            else if (dirX === -1 && dirY === 0) {
                this.lastDirection = 'left';
            }
            else if (dirX === 0 && dirY === -1) {
                this.lastDirection = 'up';
            }
            else if (dirX === 0 && dirY === 1) {
                this.lastDirection = 'down';
            }
            else if (dirX === 1 && dirY === -1) {
                this.lastDirection = 'up-right';
            }
            else if (dirX === -1 && dirY === -1) {
                this.lastDirection = 'up-left';
            }
            else if (dirX === 1 && dirY === 1) {
                this.lastDirection = 'down-right';
            }
            else if (dirX === -1 && dirY === 1) {
                this.lastDirection = 'down-left';
            }
        }

        // Id do personagem.
        const id = this.personagem.id;
        // Escolhe animação walk ou idle.
        const targetAnim = moving ? `${id}_walk` : `${id}_idle`;

        // Toca a animação se ela for diferente da atual e se não estiver bloqueada.
        if (!this.lockAnim && this.anims.currentAnim?.key !== targetAnim) {
            this.play(targetAnim, true);
        }
    }

    // Ataque simples antigo do Player.
    // O AttackSystem trata os ataques principais, mas esta função ainda pode existir por compatibilidade.
    attack() {
        // Se já estiver a atacar, morto, a levar dano ou a defender, não ataca.
        if (this.isAttacking || this.isDead || this.isHurting || this.isBlocking) return;

        // Marca o player como a atacar.
        this.isAttacking = true;
        // Bloqueia animações automáticas.
        this.lockAnim = true;
        // Para o movimento.
        this.setVelocity(0);

        // Nome da animação do ataque 1.
        const animKey = `${this.personagem.id}_atk1`;

        // Se a animação existir, toca.
        if (this.scene.anims.exists(animKey)) {
            this.play(animKey, true);
        }

        // Espera a animação acabar.
        this.once('animationcomplete', (anim) => {
            // Confirma se a animação que acabou é mesmo a do ataque.
            if (anim.key === animKey) {

                // Liberta o estado de ataque.
                this.isAttacking = false;
                // Permite novamente trocar animações.
                this.lockAnim = false;

                // Se não morreu, volta para idle.
                if (!this.isDead) {
                    this.play(`${this.personagem.id}_idle`, true);
                }
            }
        });
    }

    // Defesa/block do player.
    // duration = tempo de defesa.
    // reduction = multiplicador do dano recebido.
    block(duration = 600, reduction = 0.5) {
        // Se estiver morto, a levar dano, a atacar ou já a defender, não bloqueia.
        if (this.isDead || this.isHurting || this.isAttacking || this.isBlocking) return;

        // Nome da animação de defesa.
        const animKey = `${this.personagem.id}_block`;

        // Se não existir animação de defesa, não faz nada.
        if (!this.scene.anims.exists(animKey)) return;

        // Marca que está a defender.
        this.isBlocking = true;
        // Bloqueia outras animações.
        this.lockAnim = true;
        // Define quanto dano recebe durante o block.
        this.blockReduction = reduction;

        // Para o player.
        this.setVelocity(0);
        // Toca a animação de defesa.
        this.play(animKey, true);

        // Depois da duração definida, termina a defesa.
        this.scene.time.delayedCall(duration, () => {
            // Se o player já não existir ou morreu, cancela.
            if (!this.active || this.isDead) return;

            // Desativa defesa.
            this.isBlocking = false;
            // Liberta animações.
            this.lockAnim = false;
            // Volta o dano recebido ao normal.
            this.blockReduction = 1;

            // Volta para idle.
            this.play(`${this.personagem.id}_idle`, true);
        });
    }

    // Função para o player receber dano.
    takeDamage(amount) {

        // Se já está morto, não recebe dano.
        if (this.isDead) return;

        // Se estiver a defender, reduz o dano recebido.
        if (this.isBlocking) {
            amount = Math.floor(amount * this.blockReduction);
        }

        // Retira vida ao personagem.
        this.personagem.vidaAtual -= amount;

        // Impede a vida de ficar abaixo de 0.
        if (this.personagem.vidaAtual < 0) {
            this.personagem.vidaAtual = 0;
        }

        // Aplica tint vermelho para indicar dano.
        this.setTint(0xff0000);

        // Depois de 100ms, remove o tint vermelho.
        this.scene.time.delayedCall(100, () => {
            if (this.active) {
                this.clearTint();
            }
        });

        // Se a vida chegou a 0, o player morre.
        if (this.personagem.vidaAtual <= 0) {

            // Marca como morto.
            this.isDead = true;
            // Cancela estado de dano.
            this.isHurting = false;
            // Cancela estado de ataque.
            this.isAttacking = false;
            // Cancela estado de defesa.
            this.isBlocking = false;
            // Bloqueia animações automáticas.
            this.lockAnim = true;

            // Para o player.
            this.setVelocity(0);

            // Desativa a hitbox física.
            if (this.body) {
                this.body.enable = false;
            }

            // Nome da animação de morte.
            const deathAnim = `${this.personagem.id}_death`;

            // Se a animação de morte existir, toca.
            if (this.scene.anims.exists(deathAnim)) {
                this.play(deathAnim, true);
            }

            // Para aqui, porque o player morreu.
            return;
        }

        // Se estiver a defender, recebe o dano reduzido, mas não toca animação de hurt.
        if (this.isBlocking) return;

        // Marca que está a levar dano.
        this.isHurting = true;
        // Bloqueia animações automáticas.
        this.lockAnim = true;
        // Para o player.
        this.setVelocity(0);

        // Nome da animação de dano.
        const hurtAnim = `${this.personagem.id}_hurt`;

        // Se a animação de dano existir, toca.
        if (this.scene.anims.exists(hurtAnim)) {
            this.play(hurtAnim, true);
        }

        // Espera a animação de dano terminar.
        this.once('animationcomplete', (anim) => {
            // Confirma que foi a animação hurt que terminou.
            if (anim.key === hurtAnim) {
                // Sai do estado de dano.
                this.isHurting = false;
                // Liberta animações automáticas.
                this.lockAnim = false;

                // Se não morreu, volta para idle.
                if (!this.isDead) {
                    this.play(`${this.personagem.id}_idle`, true);
                }
            }
        });
    }
}