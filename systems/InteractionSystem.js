// Cria a classe InteractionSystem, responsável pelas interações com baús, portas e mensagens de objetivo.
export default class InteractionSystem {

    // Construtor do sistema.
    constructor(scene, config = {}) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;

        // Objetivo inicial do nível.

        // Controla se o objetivo inicial já foi mostrado.
        this.initialObjectiveShown = false;

        // Controla se o objetivo inicial já foi agendado.
        this.initialObjectiveScheduled = false;

        // Guarda o evento temporizado do objetivo inicial.
        this.initialObjectiveEvent = null;

        // Define o atraso antes de mostrar o objetivo inicial.
        this.initialObjectiveDelay = config.initialObjectiveDelay || 3000;

        // Tempo que a mensagem fica visível

        // Define durante quanto tempo o objetivo inicial fica visível.
        this.initialObjectiveDuration = config.initialObjectiveDuration || 5500;

        // Texto personalizado opcional

        // Guarda um texto personalizado de objetivo, se for enviado na configuração.
        this.initialObjectiveText = config.initialObjectiveText || null;
    }

    // Atualiza o sistema de interação.
    update() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, não faz nada.
        if (!scene) return;

        // Se o texto de interação estiver bloqueado, não altera nada.
        if (scene.interactionTextLocked) {
            return;
        }

        // Se o nível terminou, deu Game Over ou a cena está a mudar.
        if (scene.levelFinished || scene.gameOverStarted || scene.isChangingScene) {

            // Limpa o texto de interação.
            this.updateInteractionText('');

            // Para a função.
            return;
        }

        // Se a intro estiver ativa, loja aberta ou controlos bloqueados.
        if (scene.levelIntroActive || scene.shopOpen || scene.canControlPlayers === false) {

            // Limpa o texto de interação.
            this.updateInteractionText('');

            // Para a função.
            return;
        }

        // Objetivo inicial do nível.
        // Só agenda quando:
        // - a intro já acabou
        // - os controlos já estão ativos
        // - o timer já começou

        // Agenda o objetivo inicial do nível.
        this.scheduleInitialObjective();

        // Verifica se há objeto interativo perto.
        this.checkInteraction();
    }

    // Agenda a mensagem inicial de objetivo.
    scheduleInitialObjective() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não existir cena, não faz nada.
        if (!scene) return;

        // Se o objetivo já foi mostrado, não faz nada.
        if (this.initialObjectiveShown) return;

        // Se o objetivo já foi agendado, não faz nada.
        if (this.initialObjectiveScheduled) return;

        // Marca que o objetivo foi agendado.
        this.initialObjectiveScheduled = true;

        // Cria um evento atrasado para mostrar o objetivo.
        this.initialObjectiveEvent = scene.time.delayedCall(this.initialObjectiveDelay, () => {

            // Se o sistema já não tiver cena, não faz nada.
            if (!this.scene) return;

            // Se o jogo estiver num estado onde não deve mostrar o objetivo.
            if (
                scene.levelFinished ||
                scene.gameOverStarted ||
                scene.isChangingScene ||
                scene.levelIntroActive ||
                scene.shopOpen ||
                scene.canControlPlayers === false ||
                scene.interactionTextLocked
            ) {

                // Liberta o agendamento para tentar novamente depois.
                this.initialObjectiveScheduled = false;

                // Para a função.
                return;
            }

            // Vai buscar o texto do objetivo inicial.
            const objectiveText = this.getInitialObjectiveText();

            // Se não houver texto.
            if (!objectiveText) {

                // Marca como mostrado para não tentar novamente.
                this.initialObjectiveShown = true;

                // Para a função.
                return;
            }

            // Marca o objetivo como mostrado.
            this.initialObjectiveShown = true;

            // Mostra o objetivo como texto temporário.
            this.showTemporaryInteractionText(
                objectiveText,
                this.initialObjectiveDuration
            );
        });
    }

    // Devolve o texto do objetivo inicial.
    getInitialObjectiveText() {

        // Se foi definido texto personalizado, usa esse.
        if (this.initialObjectiveText) {
            return this.initialObjectiveText;
        }

        // Guarda a referência da cena.
        const scene = this.scene;

        // Vai buscar a key do nível atual.
        const levelKey = scene?.sys?.settings?.key;

        // Se estiver no Level1.
        if (levelKey === 'Level1') {

            // Objetivo do Level1.
            return 'Objetivo: encontra o baú';
        }

        // Se estiver no Level2.
        if (levelKey === 'Level2') {

            // Objetivo do Level2.
            return 'Objetivo: encontra o baú';
        }

        // Se estiver no LevelFinal.
        if (levelKey === 'LevelFinal') {

            // Objetivo do LevelFinal.
            return 'Objetivo: Derrote todos os inimigos!';
        }

        // Objetivo padrão.
        return 'Objetivo: encontra o baú';
    }

    // Verifica se há objetos interativos perto dos jogadores.
    checkInteraction() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou grupo de interativos.
        if (!scene || !scene.interativosGroup) {

            // Limpa o texto de interação.
            this.updateInteractionText('');

            // Para a função.
            return;
        }

        // Limpa o objeto próximo do Player 1.
        scene.objetoProximoP1 = null;

        // Limpa o objeto próximo do Player 2.
        scene.objetoProximoP2 = null;

        // Procura objeto próximo do Player 1.
        const objP1 = this.procurarObjetoProximo(scene.player1);

        // Procura objeto próximo do Player 2.
        const objP2 = this.procurarObjetoProximo(scene.player2);

        // Guarda objeto próximo do Player 1 na cena.
        scene.objetoProximoP1 = objP1;

        // Guarda objeto próximo do Player 2 na cena.
        scene.objetoProximoP2 = objP2;

        // Usa primeiro o objeto do Player 1, ou o do Player 2 se não houver do Player 1.
        const obj = objP1 || objP2;

        // Se não houver objeto perto.
        if (!obj) {

            // Limpa texto de interação.
            this.updateInteractionText('');

            // Para a função.
            return;
        }

        // Se o objeto for o baú final.
        if (obj.name === 'bau_final') {

            // Não mostra texto aqui porque o baú final é tratado à parte.
            this.updateInteractionText('');

            // Para a função.
            return;
        }

        // Se o objeto for baú.
        if (obj.name === 'bau') {

            // Se o baú já estiver aberto.
            if (obj.aberto) {

                // Mostra que o baú já foi aberto.
                this.updateInteractionText('Baú Aberto!');
            } else {

                // Mostra instrução para abrir o baú.
                this.updateInteractionText('E: Abrir baú');
            }
        }

        // Se o objeto for porta de saída.
        else if (obj.name === 'porta_saida') {

            // Verifica se o Player 1 tem chave.
            const p1Has = this.playerHasKey('p1');

            // Verifica se o Player 2 tem chave.
            const p2Has = this.playerHasKey('p2');

            // Verifica se alguém tem chave.
            const alguemTemChave = p1Has || p2Has;

            // Se ninguém tiver chave.
            if (!alguemTemChave) {

                // Mostra aviso de chave necessária.
                this.updateInteractionText('É preciso chave');
            }

            // Se existir Player 2.
            else if (scene.player2) {

                // Calcula distância do Player 1 até à porta.
                const distP1 = Phaser.Math.Distance.Between(
                    scene.player1.x,
                    scene.player1.y,
                    obj.x,
                    obj.y
                );

                // Calcula distância do Player 2 até à porta.
                const distP2 = Phaser.Math.Distance.Between(
                    scene.player2.x,
                    scene.player2.y,
                    obj.x,
                    obj.y
                );

                // Se algum dos jogadores estiver longe da porta.
                if (distP1 > 80 || distP2 > 80) {

                    // Mostra aviso para os dois ficarem perto.
                    this.updateInteractionText('Ambos precisam de estar na porta');
                } else {

                    // Mostra instrução para sair.
                    this.updateInteractionText('Encontraste a Porta ! E: Sair');
                }
            }

            // Se for singleplayer.
            else {

                // Mostra instrução para sair.
                this.updateInteractionText('Encontraste a Porta ! E: Sair');
            }
        }

        // Para outros objetos interativos.
        else {

            // Mostra texto genérico de interação.
            this.updateInteractionText('E: Interagir');
        }

        // Se existir tecla E e ela foi pressionada.
        if (scene.keyE && Phaser.Input.Keyboard.JustDown(scene.keyE)) {

            // Trata a interação com o objeto.
            this.handleInteraction(obj);
        }
    }

    // Procura o objeto interativo mais próximo de um jogador.
    procurarObjetoProximo(player) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, devolve null.
        if (!scene) return null;

        // Se não houver jogador ou o jogador estiver morto, devolve null.
        if (!player || player.isDead) return null;

        // Se não houver grupo de interativos, devolve null.
        if (!scene.interativosGroup) return null;

        // Guarda o objeto encontrado.
        let found = null;

        // Guarda a menor distância encontrada.
        let closestDist = Infinity;

        // Percorre todos os objetos interativos.
        scene.interativosGroup.getChildren().forEach(obj => {

            // Ignora objetos inválidos ou inativos.
            if (!obj || !obj.active) return;

            // Ignora o baú final.
            if (obj.name === 'bau_final') return;

            // Define o alcance de interação do objeto.
            const range = obj.interactionRange || 90;

            // Calcula a distância entre jogador e objeto.
            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                obj.x,
                obj.y
            );

            // Se estiver dentro do alcance e for o mais próximo.
            if (dist <= range && dist < closestDist) {

                // Atualiza a menor distância.
                closestDist = dist;

                // Guarda este objeto como encontrado.
                found = obj;
            }
        });

        // Devolve o objeto mais próximo ou null.
        return found;
    }

    // Atualiza o texto de interação.
    updateInteractionText(text, force = false) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Garante que o texto é uma string segura.
        const safeText = text ? String(text) : '';

        // Se a cena tiver método próprio para atualizar o texto.
        if (scene.setInteractionText && typeof scene.setInteractionText === 'function') {

            // Usa esse método.
            scene.setInteractionText(safeText, force);

            // Para a função.
            return;
        }

        // Se não existir texto antigo de interação, não faz nada.
        if (!scene.textoInteracao || !scene.textoInteracao.scene) {
            return;
        }

        // Se o texto estiver vazio.
        if (safeText.trim() === '') {

            // Limpa o texto.
            scene.textoInteracao.setText('');

            // Esconde o texto.
            scene.textoInteracao.setVisible(false);

            // Para a função.
            return;
        }

        // Atualiza e mostra o texto antigo de interação.
        scene.textoInteracao
            .setText(safeText)
            .setVisible(true)
            .setAlpha(1);
    }

    // Trata a interação com um objeto.
    handleInteraction(obj) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou objeto, não faz nada.
        if (!scene || !obj) return;

        // Limpa o texto de interação.
        this.updateInteractionText('');

        // Define o Player 1 como jogador padrão da interação.
        let playerId = 'p1';

        // Se apenas o Player 2 estiver próximo do objeto.
        if (
            scene.player2 &&
            scene.objetoProximoP2 === obj &&
            scene.objetoProximoP1 !== obj
        ) {

            // Define a interação como sendo do Player 2.
            playerId = 'p2';
        }

        // Se os dois jogadores estiverem próximos do mesmo objeto.
        if (
            scene.player2 &&
            scene.objetoProximoP1 === obj &&
            scene.objetoProximoP2 === obj
        ) {

            // Calcula distância do Player 1 até ao objeto.
            const d1 = Phaser.Math.Distance.Between(
                scene.player1.x,
                scene.player1.y,
                obj.x,
                obj.y
            );

            // Calcula distância do Player 2 até ao objeto.
            const d2 = Phaser.Math.Distance.Between(
                scene.player2.x,
                scene.player2.y,
                obj.x,
                obj.y
            );

            // Escolhe o jogador mais próximo.
            playerId = d1 < d2 ? 'p1' : 'p2';
        }

        // Se o objeto for baú.
        if (obj.name === 'bau') {

            // Abre o baú.
            this.openChest(obj, playerId);

            // Para a função.
            return;
        }

        // Se o objeto for porta de saída.
        if (obj.name === 'porta_saida') {

            // Tenta abrir a porta.
            this.openDoor(obj);

            // Para a função.
            return;
        }
    }

    // Abre um baú.
    openChest(obj, playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou objeto, não faz nada.
        if (!scene || !obj) return;

        // Se o baú já estiver aberto.
        if (obj.aberto) {

            // Mostra mensagem temporária.
            this.showTemporaryInteractionText('Já foi aberto');

            // Para a função.
            return;
        }

        // Marca o baú como aberto.
        obj.aberto = true;

        // Se o objeto puder mudar textura e a textura existir.
        if (obj.setTexture && scene.textures.exists('chestAberto')) {

            // Muda a textura para baú aberto.
            obj.setTexture('chestAberto');
        }

        // Remove tint do baú, se existir.
        obj.clearTint?.();

        // Garante opacidade total do baú.
        obj.setAlpha?.(1);

        // Se existir inventário para o jogador.
        if (scene.inventories && scene.inventories[playerId]) {

            // Adiciona uma chave ao inventário do jogador.
            scene.inventories[playerId].push({
                key: 'key',
                amount: 1
            });
        }

        // Marca que a cena tem chave.
        scene.temChave = true;

        // Se existir sistema de inventário.
        if (scene.inventorySystem) {

            // Atualiza a UI do inventário, se existir função.
            scene.inventorySystem.updateInventoryUI?.();
        }

        // Atualiza o HUD.
        this.updateHUD();

        // Mostra mensagem temporária de chave obtida.
        this.showTemporaryInteractionText('Chave obtida! Encontra a saída.');
    }

    // Abre ou tenta abrir a porta de saída.
    openDoor(obj) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou objeto, não faz nada.
        if (!scene || !obj) return;

        // Verifica se Player 1 tem chave.
        const p1Has = this.playerHasKey('p1');

        // Verifica se Player 2 tem chave.
        const p2Has = this.playerHasKey('p2');

        // Verifica se alguém tem chave.
        const alguemTemChave = p1Has || p2Has;

        // Singleplayer.

        // Se não houver Player 2, está em singleplayer.
        if (!scene.player2) {

            // Se Player 1 não tiver chave.
            if (!p1Has) {

                // Mostra mensagem de chave necessária.
                this.showTemporaryInteractionText('É preciso chave');

                // Para a função.
                return;
            }

            // Agora o singleplayer também mostra mensagem antes de sair

            // Mostra mensagem de abertura da porta.
            this.showTemporaryInteractionText('A abrir porta...', 500);

            // Espera 500ms antes de terminar o nível.
            scene.time.delayedCall(500, () => {

                // Guarda as moedas atuais no registry.
                scene.registry.set('coins', {
                    p1: scene.coins?.p1 || 0,
                    p2: scene.coins?.p2 || 0
                });

                // Se existir função de terminar nível.
                if (scene.finishLevel) {

                    // Termina o nível.
                    scene.finishLevel();
                }
            });

            // Para a função.
            return;
        }

        // Multiplayer.

        // Calcula distância do Player 1 à porta.
        const distP1 = Phaser.Math.Distance.Between(
            scene.player1.x,
            scene.player1.y,
            obj.x,
            obj.y
        );

        // Calcula distância do Player 2 à porta.
        const distP2 = Phaser.Math.Distance.Between(
            scene.player2.x,
            scene.player2.y,
            obj.x,
            obj.y
        );

        // Se algum jogador estiver longe da porta.
        if (distP1 >= 80 || distP2 >= 80) {

            // Mostra mensagem para ambos ficarem na porta.
            this.showTemporaryInteractionText('Ambos precisam de estar na porta');

            // Para a função.
            return;
        }

        // Se ninguém tiver chave.
        if (!alguemTemChave) {

            // Mostra mensagem de chave necessária.
            this.showTemporaryInteractionText('É preciso chave');

            // Para a função.
            return;
        }

        // Mostra mensagem de abertura da porta.
        this.showTemporaryInteractionText('A abrir porta...', 500);

        // Espera 500ms antes de terminar o nível.
        scene.time.delayedCall(500, () => {

            // Guarda as moedas atuais no registry.
            scene.registry.set('coins', {
                p1: scene.coins?.p1 || 0,
                p2: scene.coins?.p2 || 0
            });

            // Se existir função de terminar nível.
            if (scene.finishLevel) {

                // Termina o nível.
                scene.finishLevel();
            }
        });
    }

    // Verifica se um jogador tem chave.
    playerHasKey(playerId) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, inventários ou inventário deste jogador.
        if (!scene || !scene.inventories || !scene.inventories[playerId]) {

            // O jogador não tem chave.
            return false;
        }

        // Verifica se existe item com key igual a "key".
        return scene.inventories[playerId].some(i => i.key === 'key');
    }

    // Mostra texto de interação temporário.
    showTemporaryInteractionText(text, duration = 1500) {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Bloqueia o texto de interação temporariamente.
        scene.interactionTextLocked = true;

        // Mostra o texto temporário.
        this.updateInteractionText(text, true);

        // Cria evento para esconder o texto depois da duração.
        scene.time.delayedCall(duration, () => {

            // Se não houver cena, não faz nada.
            if (!scene) return;

            // Liberta o texto de interação.
            scene.interactionTextLocked = false;

            // Vai buscar a cena do HUD.
            const hud = scene.scene?.get('LevelHUDScene');

            // Se o HUD estiver ativo e estiver a mostrar este texto.
            if (
                scene.scene?.isActive('LevelHUDScene') &&
                hud &&
                hud.interactionText &&
                hud.interactionText.text === String(text) &&
                hud.setInteractionText
            ) {

                // Limpa o texto no HUD.
                hud.setInteractionText('', true);

                // Para a função.
                return;
            }

            // Se o texto antigo de interação estiver a mostrar este texto.
            if (
                scene.textoInteracao &&
                scene.textoInteracao.scene &&
                scene.textoInteracao.text === String(text)
            ) {

                // Limpa o texto de interação.
                this.updateInteractionText('', true);
            }
        });
    }

    // Atualiza o HUD.
    updateHUD() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Vai buscar a cena do HUD.
        const hud = scene.scene?.get('LevelHUDScene');

        // Se o HUD não estiver ativo ou não existir, não faz nada.
        if (!scene.scene?.isActive('LevelHUDScene') || !hud) return;

        // Se o HUD tiver função geral updateHUD.
        if (hud.updateHUD) {

            // Atualiza o HUD completo.
            hud.updateHUD();

            // Para a função.
            return;
        }

        // Se existir função para moedas, atualiza moedas.
        if (hud.updateCoinUI) hud.updateCoinUI();

        // Se existir função para inventário, atualiza inventário.
        if (hud.updateInventoryUI) hud.updateInventoryUI();

        // Se existir função para timer, atualiza timer.
        if (hud.updateTimerUI) hud.updateTimerUI();
    }

    // Destroi o sistema e limpa eventos.
    destroy() {

        // Se existir evento do objetivo inicial.
        if (this.initialObjectiveEvent) {

            // Remove o evento.
            this.initialObjectiveEvent.remove(false);

            // Limpa a referência.
            this.initialObjectiveEvent = null;
        }

        // Remove a referência da cena.
        this.scene = null;
    }
}