// Objeto principal que guarda a configuração de ataques de todos os heróis.
// Cada hero tem os seus ataques: atk1, atk2, atk3 e block.
const ATTACK_CONFIG = {

    // HERO0 - Arqueiro / KAEL
    hero0: {
        // Primeiro ataque do hero0.
        atk1: {
            // Dano causado pelo ataque.
            damage: 12,
            // Distância máxima do ataque.
            range: 90,
            // Largura da hitbox do ataque.
            width: 6,
            // Nome da animação que o player vai tocar ao atacar.
            anim: 'hero0_atk1',
            // Configuração do projétil disparado.
            projectile: {
                // Imagem usada como projétil.
                key: 'arrow01',
                // Velocidade da flecha.
                speed: 320,
                // Dano causado pela flecha.
                damage: 12,
                // Tamanho visual da flecha.
                scale: 1,

                // false permite disparar em 8 direções: cima, baixo, esquerda, direita e diagonais.
                onlyHorizontal: false,

                // Comprimento da hitbox da flecha.
                hitboxLength: 24,
                // Espessura da hitbox da flecha.
                hitboxThickness: 6,
                // Raio de colisão alternativo.
                // Está a 0 porque aqui estás a usar hitbox retangular.
                hitRadius: 0,

                // true permite atravessar vários inimigos.
                pierce: true,
                // true faz a flecha rodar visualmente conforme a direção.
                rotateWithDirection: true
            }
        },

        // Segundo ataque do hero0.
        atk2: {
            // Dano do ataque.
            damage: 25,
            // Alcance maior que o atk1.
            range: 120,
            // Largura da hitbox.
            width: 6,
            // Animação usada no ataque 2.
            anim: 'hero0_atk2',
            // Tempo de recarga do ataque em milissegundos.
            // 15000 = 15 segundos.
            cooldown: 15000,
            // Duração máxima relacionada ao ataque/animação.
            maxDuration: 1300,
            // Duração principal do ataque.
            duration: 1000,
            // Configuração do projétil do ataque 2.
            projectile: {
                // Configuração da imagem do ataque 2.
                key: 'arrow02',
                // Velocidade do projétil.
                speed: 380,
                // Dano do projétil.
                damage: 25,
                // Escala visual.
                scale: 1,

                // Permite disparar em 8 direções
                onlyHorizontal: false,

                // Comprimento da hitbox.
                hitboxLength: 26,
                // Espessura da hitbox.
                hitboxThickness: 6,
                // Sem raio circular.
                hitRadius: 0,

                // A flecha atravessa inimigos.
                pierce: true,
                // A flecha roda conforme a direção.
                rotateWithDirection: true
            }
        },

        // Hero0 não tem ataque 3.
        atk3: null,
        // Hero0 não tem block.
        block: null
    },

    // HERO1 - Guerreiro
    hero1: {
         // Ataque básico.
        atk1: {
            // Dano do ataque.
            damage: 18,
            // Alcance curto porque é corpo a corpo.
            range: 45,
            // Animação do ataque 1.
            anim: 'hero1_atk1'
        },

        // Segundo ataque.
        atk2: {
            // Dano maior que o atk1
            damage: 25,
            // Alcance um pouco maior.
            range: 55,
            // Animação do ataque 2.
            anim: 'hero1_atk2'
        },

        // Terceiro ataque.
        atk3: {
            // Dano forte.
            damage: 40,
            // Alcance maior.
            range: 70,
            // Animação do ataque 3.
            anim: 'hero1_atk3'
        },

        // Hero1 não tem defesa.
        block: null
    },

    // HERO2 - Cavaleiro
    hero2: {
        // Ataque básico.
        atk1: {
            // Dano do ataque 1.
            damage: 10,
            // Alcance do ataque.
            range: 55,
            // Animação usada.
            anim: 'hero2_atk1'
        },

        // Segundo ataque.
        atk2: {
            // Dano do ataque 2.
            damage: 30,
            // Alcance do ataque.
            range: 65,
            // Animação usada.
            anim: 'hero2_atk2'
        },

        // Terceiro ataque.
        atk3: {
            // Dano mais forte.
            damage: 50,
            // Maior alcance.
            range: 80,
            // Animação usada.
            anim: 'hero2_atk3'
        },

        // Defesa do hero2.
        block: {
             // Animação da defesa.
            anim: 'hero2_block',
            // Redução de dano. 0 significa que bloqueia totalmente ou reduz conforme a lógica do AttackSystem.
            reduction: 0,
            // Duração da defesa.
            // 3000 = 3 segundos.
            duration: 3000,
            // Tempo de espera até poder defender outra vez.
            // 4000 = 4 segundos.
            cooldown: 4000
        }
    },

    // HERO3 - Sacerdotisa
    hero3: {
        // Ataque básico mágico.
        atk1: {
            // Dano do ataque.
            damage: 8,
            // Alcance do ataque.
            range: 70,
            // Animação do ataque.
            anim: 'hero3_atk1',
            // Efeito mágico do ataque.
            fx: {
                // Sprite do efeito.
                key: 'priest_attack_fx',
                // Animação do efeito.
                anim: 'priest_attack_fx',
                // Deslocamento horizontal do FX em relação ao player.
                offsetX: 24,
                // Deslocamento vertical do FX.
                offsetY: 14,
                // Deslocamento vertical quando o player está virado para baixo.
                offsetYDown: 14,
                // Ajuste horizontal extra.
                horizontalAdjust: 0,

                // false significa que o FX não fica colado ao player.
                follow: false,
                // Velocidade do FX.
                speed: 300,
                // Dano causado pelo FX.
                damage: 8,
                // Escala visual do FX.
                scale: 0.5,

                // Tamanho da hitbox.
                hitbox: 18,
                // Raio de acerto.
                hitRadius: 45,

                // false significa que este FX não roda conforme a direção.
                rotateWithDirection: false
            }
        },
        // Segundo ataque da sacerdotisa.
        // Neste caso não é ataque, é cura.
        atk2: {
            // Quantidade de vida que cura.
            heal: 50,
            // Alcance/área da cura.
            range: 80,
            // Animação usada para a skill.
            anim: 'hero3_skill',
            // Define que esta habilidade é de cura.
            type: 'heal',
            // Efeito visual da cura.
            fx: {
                // Sprite da cura.
                key: 'priest_heal_fx',
                // Animação da cura.
                anim: 'priest_heal_fx',
                // Sem deslocamento horizontal.
                offsetX: 0,
                // Sem deslocamento vertical.
                offsetY: 0,

                // true significa que o efeito fica em cima/segue o player.
                follow: true,

                // Tamanho visual da cura.
                scale: 1,
                // Duração do efeito.
                duration: 380
            }
        },

        // Hero3 não tem ataque 3.
        atk3: null,
        // Hero3 não tem block.
        block: null
    },

    // HERO4 - Soldado
    hero4: {
        // Ataque básico corpo a corpo.
        atk1: {
            // Dano.
            damage: 10,
            // Alcance.
            range: 50,
            // Animação.
            anim: 'hero4_atk1'
        },

        // Segundo ataque.
        atk2: {
            // Dano.
            damage: 28,
            // Alcance.
            range: 60,
            // Animação.
            anim: 'hero4_atk2'
        },

        // Terceiro ataque com projétil.
        atk3: {
            // Dano.
            damage: 43,
            // Alcance.
            range: 150,
            // Largura da hitbox.
            width: 6,
            // Animação do ataque.
            anim: 'hero4_atk3',
            // Configuração do projétil.
            projectile: {
                // Imagem do projétil.
                key: 'arrow03',
                // Velocidade do projétil.
                speed: 320,
                // Dano do projétil.
                damage: 43,
                // Escala visual.
                scale: 1,

                // Permite disparar em 8 direções
                onlyHorizontal: false,

                // Comprimento da hitbox.
                hitboxLength: 24,
                // Espessura da hitbox.
                hitboxThickness: 6,
                // Sem raio circular.
                hitRadius: 0,

                // Atravessa inimigos.
                pierce: true,
                // Roda conforme a direção.
                rotateWithDirection: true
            }
        },

        // Hero4 não tem block.
        block: null
    },

    // HERO5 - Mago
    hero5: {
        // Primeiro ataque mágico.
        atk1: {
            // Dano do ataque.
            damage: 20,
            // Alcance do ataque.
            range: 80,
            // Animação do player.
            anim: 'hero5_atk1',
            // Efeito mágico do ataque.
            fx: {
                // Sprite do FX.
                key: 'wizard_attack01_fx',
                // Animação do FX.
                anim: 'wizard_attack01_fx',
                // Deslocamento horizontal.
                offsetX: 24,
                // Deslocamento horizontal.
                offsetY: 14,
                // Deslocamento vertical quando está virado para baixo.
                offsetYDown: 14,
                // Ajuste horizontal extra.
                horizontalAdjust: 0,

                // false significa que o efeito é lançado, não fica preso ao player.
                follow: false,
                // Velocidade do efeito.
                speed: 300,
                // Dano do efeito.
                damage: 20,
                // Escala visual.
                scale: 0.4,

                // Tamanho da hitbox.
                hitbox: 24,
                // Raio de acerto.
                hitRadius: 50,

                // Faz o FX rodar conforme a direção do player
                rotateWithDirection: true
            }
        },

        // Segundo ataque mágico.
        atk2: {
            // Dano.
            damage: 35,
            // Alcance
            range: 90,
            // Animação do ataque 2.
            anim: 'hero5_atk2',
            // Efeito mágico do ataque 2.
            fx: {
                // Sprite do FX.
                key: 'wizard_attack02_fx',
                // Animação do FX.
                anim: 'wizard_attack02_fx',
                // Deslocamento horizontal.
                offsetX: 24,
                // Deslocamento vertical.
                offsetY: 14,
                // Deslocamento vertical quando está virado para baixo.
                offsetYDown: 14,
                // Ajuste horizontal extra.
                horizontalAdjust: 0,

                // false significa que é um efeito lançado.
                follow: false,
                // Velocidade do ataque.
                speed: 330,
                // Dano do ataque.
                damage: 35,
                // Escala visual.
                scale: 0.8,

                // Tamanho da hitbox.
                hitbox: 18,
                // Raio de acerto.
                hitRadius: 45,

                // Faz o FX rodar conforme a direção do player
                rotateWithDirection: true
            }
        },

        // Hero5 não tem ataque 3.
        atk3: null,
        // Hero5 não tem block.
        block: null
    },

    // HERO6 - Paladino
    hero6: {
         // Ataque básico.
        atk1: {
            // Dano.
            damage: 18,
            // Alcance
            range: 45,
            // Animação.
            anim: 'hero6_atk1'
        },

        // Segundo ataque.
        atk2: {
            // Dano.
            damage: 25,
            // Alcance.
            range: 55,
            // Animação
            anim: 'hero6_atk2'
        },

        // Terceiro ataque.
        atk3: {
            // Dano
            damage: 40,
            // Alcance
            range: 70,
            // Animação.
            anim: 'hero6_atk3'
        },

        // Hero6 não tem block.
        block: null
    }
};

// Exporta a configuração para ser usada no AttackSystem e nos níveis.
export default ATTACK_CONFIG;

