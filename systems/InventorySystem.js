// Cria a classe InventorySystem, responsável por usar itens do inventário dos jogadores.
export default class InventorySystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde o inventário vai funcionar.
        this.scene = scene;
    }

    // Input do inventário.

    // Verifica as teclas do inventário e usa o slot correspondente.
    handleInventoryInput() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, se o nível terminou ou se começou Game Over, não faz nada.
        if (!scene || scene.levelFinished || scene.gameOverStarted) return;

        // Se a introdução do nível estiver ativa ou os controlos bloqueados, não faz nada.
        if (scene.levelIntroActive || scene.canControlPlayers === false) return;

        // Se não existirem teclas do inventário do Player 1, não faz nada.
        if (!scene.invKeysP1) return;

        // Se a tecla 7 do Player 1 for pressionada.
        if (scene.invKeysP1.s7 && Phaser.Input.Keyboard.JustDown(scene.invKeysP1.s7)) {

            // Usa o slot 0 do inventário do Player 1.
            this.useInventorySlot('p1', 0);
        }

        // Se a tecla 8 do Player 1 for pressionada.
        if (scene.invKeysP1.s8 && Phaser.Input.Keyboard.JustDown(scene.invKeysP1.s8)) {

            // Usa o slot 1 do inventário do Player 1.
            this.useInventorySlot('p1', 1);
        }

        // Se a tecla 9 do Player 1 for pressionada.
        if (scene.invKeysP1.s9 && Phaser.Input.Keyboard.JustDown(scene.invKeysP1.s9)) {

            // Usa o slot 2 do inventário do Player 1.
            this.useInventorySlot('p1', 2);
        }

        // Se a tecla 0 do Player 1 for pressionada.
        if (scene.invKeysP1.s0 && Phaser.Input.Keyboard.JustDown(scene.invKeysP1.s0)) {

            // Usa o slot 3 do inventário do Player 1.
            this.useInventorySlot('p1', 3);
        }

        // Se não existir Player 2 ou teclas do inventário do Player 2, para aqui.
        if (!scene.player2 || !scene.invKeysP2) return;

        // Se a tecla 1 do Player 2 for pressionada.
        if (scene.invKeysP2.s1 && Phaser.Input.Keyboard.JustDown(scene.invKeysP2.s1)) {

            // Usa o slot 0 do inventário do Player 2.
            this.useInventorySlot('p2', 0);
        }

        // Se a tecla 2 do Player 2 for pressionada.
        if (scene.invKeysP2.s2 && Phaser.Input.Keyboard.JustDown(scene.invKeysP2.s2)) {

            // Usa o slot 1 do inventário do Player 2.
            this.useInventorySlot('p2', 1);
        }

        // Se a tecla 3 do Player 2 for pressionada.
        if (scene.invKeysP2.s3 && Phaser.Input.Keyboard.JustDown(scene.invKeysP2.s3)) {

            // Usa o slot 2 do inventário do Player 2.
            this.useInventorySlot('p2', 2);
        }

        // Se a tecla 4 do Player 2 for pressionada.
        if (scene.invKeysP2.s4 && Phaser.Input.Keyboard.JustDown(scene.invKeysP2.s4)) {

            // Usa o slot 3 do inventário do Player 2.
            this.useInventorySlot('p2', 3);
        }
    }

    // Usar slot.

    // Usa um item de um slot específico do inventário.
    useInventorySlot(playerId, index) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existirem inventários ou inventário do jogador, não faz nada.
        if (!scene.inventories || !scene.inventories[playerId]) return;

        // Guarda o inventário do jogador.
        const inv = scene.inventories[playerId];

        // Guarda o item que está no slot escolhido.
        const item = inv[index];

        // Escolhe o jogador conforme o playerId.
        const player = playerId === 'p1' ? scene.player1 : scene.player2;

        // Se o jogador não existir ou estiver morto, não faz nada.
        if (!player || player.isDead) return;

        // Se não existir item nesse slot, não faz nada.
        if (!item) return;

        // A chave não é consumível

        // Se o item for a chave, não usa nem consome.
        if (item.key === 'key') return;

        // Usa o item.
        this.useItem(playerId, item);

        // Reduz a quantidade do item.
        item.amount--;

        // Se a quantidade chegou a zero ou menos.
        if (item.amount <= 0) {

            // Remove o item do inventário.
            inv.splice(index, 1);
        }

        // A LevelHUDScene atualiza sozinha pelo update()
    }

    // Usar item.

    // Aplica o efeito de um item.
    useItem(playerId, item) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Escolhe o jogador conforme o playerId.
        const player = playerId === 'p1' ? scene.player1 : scene.player2;

        // Se não houver jogador ou dados da personagem, não faz nada.
        if (!player || !player.personagem) return;

        // Verifica qual item está a ser usado.
        switch (item.key) {

            // Caso o item seja maçã.
            case 'apple':

                // Cura 20 de vida sem ultrapassar a vida máxima.
                player.personagem.vidaAtual = Math.min(
                    player.personagem.vidaAtual + 20,
                    player.personagem.vidaMax
                );

                // Termina este caso.
                break;

            // Caso o item seja gelado.
            case 'icecream':

                // Reseta os cooldowns dos ataques do jogador.
                this.resetAttackCooldowns(playerId);

                // Termina este caso.
                break;

            // Caso o item seja íman.
            case 'magnet':

                // Se ainda não existir objeto magnet na cena.
                if (!scene.magnet) {

                    // Cria o estado do íman para os dois jogadores.
                    scene.magnet = { p1: false, p2: false };
                }

                // Ativa o íman para este jogador.
                scene.magnet[playerId] = true;

                // Depois de 8 segundos.
                scene.time.delayedCall(8000, () => {

                    // Se o objeto magnet ainda existir.
                    if (scene.magnet) {

                        // Desativa o íman deste jogador.
                        scene.magnet[playerId] = false;
                    }
                });

                // Termina este caso.
                break;
        }
    }

    // Reset cooldowns.

    // Reseta os cooldowns dos ataques de um jogador.
    resetAttackCooldowns(playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existirem cooldowns para este jogador, não faz nada.
        if (!scene.attackCooldowns || !scene.attackCooldowns[playerId]) return;

        // Reseta o cooldown do ataque 1.
        scene.attackCooldowns[playerId].atk1 = 0;

        // Reseta o cooldown do ataque 2.
        scene.attackCooldowns[playerId].atk2 = 0;

        // Reseta o cooldown do ataque 3.
        scene.attackCooldowns[playerId].atk3 = 0;

        // Reseta o cooldown do bloqueio.
        scene.attackCooldowns[playerId].block = 0;
    }

    // Funções vazias para não dar erro.

    // Função mantida para compatibilidade com código antigo.
    updateInventoryUI() {

        // A UI agora está na LevelHUDScene
    }

    // Função mantida para compatibilidade com código antigo.
    hide() {

        // A UI agora está na LevelHUDScene
    }

    // Função mantida para compatibilidade com código antigo.
    show() {

        // A UI agora está na LevelHUDScene
    }

    // Função chamada ao destruir o sistema.
    destroy() {

        // A UI agora está na LevelHUDScene
    }
}