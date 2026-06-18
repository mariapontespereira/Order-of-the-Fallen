// Cria uma classe Enemy que herda de Phaser.Physics.Arcade.Sprite.
// Ou seja, cada inimigo é um sprite com física arcade.
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    // Constructor é chamado quando crias um novo inimigo.
    // scene = cena onde o inimigo aparece.
    // x, y = posição inicial.
    // type = tipo do inimigo, exemplo: enemy0, enemy1, enemy8.
    // config = configurações opcionais, como vida, dano, velocidade, etc.
    constructor(scene, x, y, type, config = {}) {
        // Chama o constructor da classe Sprite do Phaser.
        // Usa como textura inicial `${type}_idle`.
        super(scene, x, y, `${type}_idle`);

        // Guarda a cena dentro do inimigo.
        this.scene = scene;
        // Guarda o tipo do inimigo. Isto é usado para saber que animações tocar.
        this.type = type;

        // Adiciona o inimigo visualmente à cena.
        scene.add.existing(this);
        // Ativa física no inimigo.
        scene.physics.add.existing(this);

        // Vida máxima do inimigo.
        // Se vier config.vidaMax, usa esse valor.
        // Se não vier, usa 100.
        this.vidaMax = config.vidaMax || 100;
        // Vida atual começa igual à vida máxima.
        this.vidaAtual = this.vidaMax;

        // Dano que o inimigo causa ao jogador.
        this.dano = config.dano || 10;
        // Velocidade do inimigo.
        this.speed = config.speed || 50;
        // Distância mínima para atacar o jogador.
        this.attackRange = config.attackRange || 30;
        // Distância em que o inimigo deteta o jogador e começa a perseguir.
        this.detectRange = config.detectRange || 100;

        // Configuração de projétil.
        // Usado por inimigos que disparam, como o enemy8.
        this.projectile = config.projectile || null;

        // Estado que indica se o inimigo está morto.
        this.isDead = false;
        // Estado que indica se o inimigo está a atacar.
        this.isAttacking = false;
        // Estado que indica se o inimigo está a levar dano.
        this.isHurting = false;
        // Controla se o inimigo pode atacar neste momento.
        this.canAttack = true;
        // Garante que o score só é dado uma vez quando o inimigo morre.
        this.scoreGiven = false;

        // Estado inicial do inimigo.
        // patrol = patrulhar.
        this.state = 'patrol';

        // Ponto para onde o inimigo vai andar durante a patrulha.
        this.patrolTarget = null;
        // Tempo até o inimigo escolher outro ponto de patrulha.
        this.patrolMoveTime = 0;
        // Tempo até o inimigo sair da pausa da patrulha.
        this.patrolPauseTime = 0;
        // Diz se o inimigo está parado durante a patrulha.
        this.isPatrolPaused = false;

        // Guarda a animação atual para evitar reiniciar a mesma animação várias vezes.
        this.currentAnim = null;

        // Define a profundidade/camada do inimigo no mapa.
        // Quanto maior, mais por cima aparece.
        this.setDepth(20);
        // Impede o inimigo de sair dos limites do mundo.
        this.setCollideWorldBounds(true);

        // Se o inimigo tiver corpo físico, ajusta a hitbox.
        if (this.body) {
            // Define o tamanho da colisão do inimigo.
            // A imagem pode ser 100x100, mas a hitbox fica só 28x28.
            this.body.setSize(28, 28);
            // Move a hitbox para ficar alinhada com os pés/corpo do inimigo.
            this.body.setOffset(36, 35);
        }

        // Começa com a animação parado.
        this.playAnim('idle');
    }

    // Atualiza o comportamento do inimigo a cada frame. Recebe uma lista de jogadores.
    update(players = []) {
        // Se estiver morto, não faz nada.
        if (this.isDead) return;

        // Procura o jogador mais próximo.
        const target = this.getClosestPlayer(players);

        // Se não encontrar jogador, fica em patrulha.
        if (!target) {
            this.state = 'patrol';
            this.patrol();
            return;
        }

        // Calcula a distância entre o inimigo e o jogador.
        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        // Se estiver perto o suficiente, ataca.
        if (dist <= this.attackRange) {
            this.state = 'attack';
            this.attack(target);
        }
        // Se estiver dentro da zona de deteção, persegue.
        else if (dist <= this.detectRange) {
            this.state = 'chase';
            this.chase(target);
        }
        // Se estiver longe, patrulha.
        else {
            this.state = 'patrol';
            this.patrol();
        }
    }

    // Procura o jogador vivo mais próximo do inimigo.
    getClosestPlayer(players) {
        // Guarda o jogador mais próximo encontrado.
        let closest = null;
        // Começa com distância infinita para qualquer jogador ser menor.
        let closestDist = Infinity;

        // Percorre todos os jogadores recebidos.
        players.forEach(player => {
            // Ignora jogadores inexistentes, mortos ou inativos.
            if (!player || player.isDead || !player.active) return;

            // Calcula a distância entre inimigo e jogador.
            const dist = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                player.x,
                player.y
            );

            // Se este jogador estiver mais perto, guarda-o.
            if (dist < closestDist) {
                closest = player;
                closestDist = dist;
            }
        });

        // Devolve o jogador mais próximo.
        return closest;
    }

    // Movimento de patrulha do inimigo.
    patrol() {
        // Se estiver a atacar, a levar dano ou morto, não patrulha.
        if (this.isAttacking || this.isHurting || this.isDead) return;

        // Guarda o tempo atual da cena.
        const now = this.scene.time.now;

        // Se o inimigo estiver pausado na patrulha.
        if (this.isPatrolPaused) {
            // Para o movimento.
            this.setVelocity(0, 0);
            // Toca animação parado.
            this.playAnim('idle');

            // Se o tempo de pausa acabou, volta a patrulhar.
            if (now >= this.patrolPauseTime) {
                this.isPatrolPaused = false;
                this.choosePatrolTarget();
            }

            return;
        }

        // Se não existir alvo de patrulha ou se o tempo acabou, escolhe um novo ponto.
        if (!this.patrolTarget || now >= this.patrolMoveTime) {
            this.choosePatrolTarget();
        }

        // Calcula a distância até ao ponto de patrulha.
        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.patrolTarget.x,
            this.patrolTarget.y
        );

        // Se chegou perto do alvo, para por algum tempo.
        if (dist < 6) {
            this.setVelocity(0, 0);
            this.isPatrolPaused = true;
            // Pausa entre 700ms e 1500ms.
            this.patrolPauseTime = now + Phaser.Math.Between(700, 1500);
            // Fica em idle.
            this.playAnim('idle');
            return;
        }

        // Calcula o ângulo até ao alvo de patrulha.
        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.patrolTarget.x,
            this.patrolTarget.y
        );

        // Move o inimigo na direção do ponto de patrulha. Usa 35% da velocidade normal para patrulhar mais devagar.
        this.setVelocity(
            Math.cos(angle) * (this.speed * 0.35),
            Math.sin(angle) * (this.speed * 0.35)
        );

        // Vira o sprite para a esquerda se estiver a andar para a esquerda.
        this.flipX = this.body.velocity.x < 0;

        // Toca animação de andar.
        this.playAnim('walk');
    }

    // Escolhe um novo ponto aleatório para patrulhar.
    choosePatrolTarget() {
        // Distância máxima que o inimigo pode escolher à volta dele.
        const range = 50;

        // Cria um ponto aleatório perto da posição atual.
        this.patrolTarget = {
            x: this.x + Phaser.Math.Between(-range, range),
            y: this.y + Phaser.Math.Between(-range, range)
        };

        // Define durante quanto tempo ele vai tentar ir para esse ponto.
        this.patrolMoveTime = this.scene.time.now + Phaser.Math.Between(1200, 2200);
    }

    // Faz o inimigo perseguir o jogador.
    chase(target) {
        // Se estiver ocupado, não persegue.
        if (this.isAttacking || this.isHurting || this.isDead) return;

        // Calcula o ângulo entre o inimigo e o jogador.
        const angle = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            target.x,
            target.y
        );

        // Move o inimigo na direção do jogador.
        this.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );

        // Move o inimigo na direção do jogador.
        this.flipX = target.x < this.x;

        // Toca animação de andar.
        this.playAnim('walk');
    }

    // Faz o inimigo atacar o jogador.
    attack(target) {
        // Se não puder atacar, estiver morto ou a levar dano, sai.
        if (!this.canAttack || this.isDead || this.isHurting) return;
        // Se o alvo não existir ou estiver morto, sai.
        if (!target || target.isDead) return;

        // Para o inimigo antes de atacar.
        this.setVelocity(0, 0);

        // Bloqueia ataques até o cooldown terminar.
        this.canAttack = false;
        // Marca que está a atacar.
        this.isAttacking = true;

        this.flipX = target.x < this.x;

        // Cria uma lista de ataques que existem como animação.
        const attacks = ['atk1', 'atk2', 'atk3'].filter(atk => {
            return this.scene.anims.exists(`${this.type}_${atk}`);
        });

        // Escolhe aleatoriamente um dos ataques disponíveis.
        // Se nenhum existir, usa atk1.
        const chosenAttack = Phaser.Utils.Array.GetRandom(attacks) || 'atk1';

        // Toca a animação escolhida.
        this.playAnim(chosenAttack);

        // Espera 300ms antes de aplicar dano.
        // Isto faz o dano acontecer no meio da animação, não instantaneamente.
        this.scene.time.delayedCall(300, () => {
            // Se o inimigo morreu ou o alvo já não existe, cancela.
            if (this.isDead || !target || target.isDead) return;

            // SKELETON ARCHER DISPARA FLECHA

            // Se o inimigo for enemy8, ele ataca com flecha.
            if (this.type === 'enemy8') {
                this.shootArrow(target);
                return;
            }

            // OUTROS INIMIGOS DÃO DANO NORMAL

            // Calcula novamente a distância no momento do dano.
            const dist = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                target.x,
                target.y
            );

            // Só dá dano se o jogador ainda estiver perto.
            if (dist <= this.attackRange + 8) {
                // Usa a função damagePlayer da cena, se existir.
                if (this.scene.damagePlayer) {
                    this.scene.damagePlayer(target, this.dano);
                }
            }
        });

        // Depois de 900ms, o inimigo pode atacar outra vez.
        this.scene.time.delayedCall(900, () => {
            // Se morreu entretanto, cancela.
            if (this.isDead) return;

            // Liberta o ataque.
            this.canAttack = true;
            // Diz que já não está a atacar.
            this.isAttacking = false;
            // Limpa a animação atual.
            this.currentAnim = null;

            // Volta para idle.
            if (!this.isDead) {
                this.playAnim('idle');
            }
        });
    }

    // Aplica dano ao inimigo.
    takeDamage(damage) {
        // Se já morreu, não recebe mais dano.
        if (this.isDead) return;

        // Subtrai a vida.
        this.vidaAtual -= damage;

        // Impede a vida de ficar negativa.
        if (this.vidaAtual < 0) {
            this.vidaAtual = 0;
        }

        // Se a vida chegou a 0, morre.
        if (this.vidaAtual <= 0) {
            this.die();
            return;
        }

        // Marca que o inimigo está a levar dano.
        this.isHurting = true;
        // Para o movimento.
        this.setVelocity(0, 0);
        // Aplica um tom vermelho para feedback visual.
        this.setTint(0xff5555);

        // Se existir animação de dano, toca.
        if (this.scene.anims.exists(`${this.type}_hurt`)) {
            this.anims.play(`${this.type}_hurt`, true);
        }

        // Depois de 150ms, remove o efeito de dano.
        this.scene.time.delayedCall(150, () => {
            // Se já não estiver ativo ou morreu, cancela.
            if (!this.active || this.isDead) return;

            // Remove o vermelho do dano.
            this.clearTint();
            // Diz que já não está a levar dano.
            this.isHurting = false;
            // Limpa animação atual para permitir trocar de animação.
            this.currentAnim = null;
        });
    }

    // Função usada pelo enemy8 para disparar uma flecha.
    shootArrow(target) {
        // Guarda a cena numa variável.
        const scene = this.scene;

         // Se não existir cena ou alvo, cancela.
        if (!scene || !target) return;
        // Se o inimigo não estiver ativo ou estiver morto, cancela.
        if (!this.active || this.isDead) return;

        // Vai buscar a configuração do projétil.
        const projectileConfig = this.projectile;

        // Se não existir configuração de projétil, cancela.
        if (!projectileConfig) return;

        // Verifica se a textura da flecha existe.
        if (!scene.textures.exists(projectileConfig.key)) {
            console.warn('Texture da flecha do inimigo não existe:', projectileConfig.key);
            return;
        }

        // Cria a flecha como sprite físico na posição do inimigo.
        const arrow = scene.physics.add.sprite(this.x, this.y, projectileConfig.key);

        // Coloca a flecha acima de outros elementos visuais.
        arrow.setDepth(30);
        // Define o tamanho visual da flecha.
        arrow.setScale(projectileConfig.scale ?? 1);

        // Se a flecha tiver corpo físico.
        if (arrow.body) {
            // Desativa gravidade da flecha.
            arrow.body.allowGravity = false;

            // Calcula o ângulo entre o inimigo e o jogador.
            const angle = Phaser.Math.Angle.Between(
                this.x,
                this.y,
                target.x,
                target.y
            );

            // Define a velocidade da flecha.
            const speed = projectileConfig.speed || 120;

            // Aplica velocidade à flecha na direção calculada.
            scene.physics.velocityFromRotation(angle, speed, arrow.body.velocity);

            // Roda a flecha visualmente para apontar na direção certa.
            arrow.setRotation(angle);

            // Define o tamanho da hitbox da flecha.
            arrow.body.setSize(
                projectileConfig.hitboxLength || 24,
                projectileConfig.hitboxThickness || 6
            );

            // Centraliza a hitbox dentro da imagem da flecha.
            arrow.body.setOffset(
                (arrow.width - arrow.body.width) / 2,
                (arrow.height - arrow.body.height) / 2
            );
        }

        // Define o dano da flecha.
        // Se projectileConfig.damage existir, usa esse.
        // Caso contrário usa dano do inimigo.Caso contrário usa 10.
        const damage = projectileConfig.damage ?? this.dano ?? 10;

        // Cria overlap entre a flecha e o alvo. Quando tocar no jogador, dá dano.
        scene.physics.add.overlap(arrow, target, () => {
            // Se a flecha já não existe, cancela.
            if (!arrow || !arrow.active) return;
            // Se o alvo não existe ou morreu, cancela.
            if (!target || target.isDead) return;

            // Aplica dano através da função da cena.
            if (scene.damagePlayer) {
                scene.damagePlayer(target, damage);

            // Alternativa de segurança se damagePlayer não existir.
            } else if (target.personagem) {
                target.personagem.vidaAtual -= damage;
            }

            // Destrói a flecha depois de acertar.
            arrow.destroy();
        });

        // Se existir parede principal, a flecha colide com ela.
        if (scene.paredeLayer) {
            scene.physics.add.collider(arrow, scene.paredeLayer, () => {
                if (arrow && arrow.active) arrow.destroy();
            });
        }

        // Se existir parede secundária, a flecha também colide com ela.
        if (scene.parede2Layer) {
            scene.physics.add.collider(arrow, scene.parede2Layer, () => {
                if (arrow && arrow.active) arrow.destroy();
            });
        }

        // A flecha também colide com paredes invisíveis.
        if (scene.paredesInvisiveis) {
            scene.physics.add.collider(arrow, scene.paredesInvisiveis, () => {
                if (arrow && arrow.active) arrow.destroy();
            });
        }

         //Destroi a flecha automaticamente depois de algum tempo.
        //Evita que fique perdida no mapa para sempre.
        scene.time.delayedCall(projectileConfig.duration || 1200, () => {
            if (arrow && arrow.active) {
                arrow.destroy();
            }
        });
    }

    // Mata o inimigo.
    die() {
        // Se já morreu, não faz nada.
        if (this.isDead) return;

        // Marca como morto.
        this.isDead = true;
        // Cancela estados de ataque/dano.
        this.isAttacking = false;
        this.isHurting = false;
        // Impede novos ataques.
        this.canAttack = false;

        // Para o movimento.
        this.setVelocity(0, 0);
        // Remove tint vermelho, se existir.
        this.clearTint();

        // Desativa a hitbox física.
        if (this.body) {
            this.body.enable = false;
        }

        // SCORE DO INIMIGO
        // Se ainda não deu score e existir ScoreSystem, adiciona pontos por matar este inimigo.
        if (!this.scoreGiven && this.scene.scoreSystem) {
            this.scoreGiven = true;
            this.scene.scoreSystem.addEnemy(this.type);
        }

        // Nome da animação de morte.
        const deathAnim = `${this.type}_death`;

        // Se a animação de morte existir, toca.
        if (this.scene.anims.exists(deathAnim)) {
            this.anims.play(deathAnim, true);

            // Quando a animação acabar, destrói o inimigo.
            this.once('animationcomplete', () => {
                if (this.active) {
                    this.destroy();
                }
            });

            // Segurança: se a animação não disparar evento, destrói o inimigo após 1200ms.
            this.scene.time.delayedCall(1200, () => {
                if (this.active) {
                    this.destroy();
                }
            });
        // Se não houver animação de morte, destrói logo.
        } else {
            this.destroy();
        }
    }

    // Chamado quando o inimigo bate numa parede.
    onWallHit() {
        // Se estiver morto, a atacar ou a levar dano, ignora.
        if (this.isDead || this.isAttacking || this.isHurting) return;

        // Se estava em patrulha, força uma pausa e depois escolhe novo caminho.
        if (this.state === 'patrol') {
            this.setVelocity(0, 0);
            this.patrolTarget = null;
            this.isPatrolPaused = true;
            this.patrolPauseTime = this.scene.time.now + 300;
        }
    }

    // Toca uma animação do inimigo.
    playAnim(animName) {
        // Se morreu, não toca animações.
        if (this.isDead) return;

        // Monta o nome completo da animação.
        const key = `${this.type}_${animName}`;

        // Se a animação não existir, não faz nada.
        if (!this.scene.anims.exists(key)) return;
        // Se já está a tocar essa animação, não reinicia.
        if (this.currentAnim === key) return;

        // Guarda a animação atual.
        this.currentAnim = key;
        // Toca a animação.
        this.anims.play(key, true);
    }
}