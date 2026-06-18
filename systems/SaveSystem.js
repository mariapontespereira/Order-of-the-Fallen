// Cria a classe SaveSystem, responsável por guardar, carregar e apagar o progresso do jogo.
export default class SaveSystem {

    // Define a chave usada no localStorage para guardar o save.
    static SAVE_KEY = 'order_of_the_fallen_save';

    // Guarda o progresso do jogo.
    static saveProgress(data = {}) {

        // Cria o objeto com os dados que vão ser guardados.
        const saveData = {

            // Guarda o nível atual ou usa Level1 como padrão.
            levelKey: data.levelKey || 'Level1',

            // Guarda o modo de jogo ou usa singleplayer como padrão.
            gameMode: data.gameMode || 'single',

            // Guarda o herói do Player 1.
            player1Hero: data.player1Hero || null,

            // Guarda o herói do Player 2.
            player2Hero: data.player2Hero || null,

            // Guarda o nome do Player 1.
            player1Name: data.player1Name || '',

            // Guarda o nome do Player 2.
            player2Name: data.player2Name || '',

            // Guarda as moedas dos jogadores ou usa zero como padrão.
            coins: data.coins || { p1: 0, p2: 0 },

            // Guarda o score total do Player 1.
            totalScoreP1: data.totalScoreP1 || 0,

            // Guarda o score total do Player 2.
            totalScoreP2: data.totalScoreP2 || 0,

            // Guarda a data/hora em que o progresso foi guardado.
            savedAt: Date.now()
        };

        // Tenta guardar os dados.
        try {

            // Guarda o objeto no localStorage convertido para texto JSON.
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));

            // Mostra no console os dados guardados.
            console.log('JOGO GUARDADO:', saveData);
        } catch (error) {

            // Mostra aviso caso ocorra erro ao guardar.
            console.warn('ERRO AO GUARDAR JOGO:', error);
        }
    }

    // Carrega o progresso guardado.
    static loadProgress() {

        // Guarda o texto bruto vindo do localStorage.
        let raw = null;

        // Tenta ler o save do localStorage.
        try {

            // Vai buscar o save guardado.
            raw = localStorage.getItem(this.SAVE_KEY);
        } catch (error) {

            // Mostra aviso caso ocorra erro ao ler.
            console.warn('ERRO AO LER SAVE:', error);

            // Devolve null porque não conseguiu ler.
            return null;
        }

        // Se não existir save guardado.
        if (!raw) {

            // Mostra mensagem no console.
            console.log('NÃO EXISTE SAVE');

            // Devolve null porque não há progresso.
            return null;
        }

        // Tenta converter o texto JSON em objeto.
        try {

            // Converte o save de texto para objeto.
            const save = JSON.parse(raw);

            // Se o save não existir ou não tiver nível guardado.
            if (!save || !save.levelKey) {

                // Mostra aviso de save inválido.
                console.warn('SAVE INVÁLIDO. A APAGAR.');

                // Apaga o save inválido.
                this.clearProgress();

                // Devolve null porque o save não é válido.
                return null;
            }

            // Mostra no console o save carregado.
            console.log('SAVE LIDO:', save);

            // Devolve os dados do save.
            return save;
        } catch (error) {

            // Mostra aviso caso o JSON esteja corrompido.
            console.warn('SAVE CORROMPIDO. A APAGAR.');

            // Apaga o save corrompido.
            this.clearProgress();

            // Devolve null porque não foi possível carregar.
            return null;
        }
    }

    // Apaga o progresso guardado.
    static clearProgress() {

        // Tenta apagar o save.
        try {

            // Remove o save do localStorage.
            localStorage.removeItem(this.SAVE_KEY);

            // Mostra mensagem no console.
            console.log('SAVE APAGADO');
        } catch (error) {

            // Mostra aviso caso ocorra erro ao apagar.
            console.warn('ERRO AO APAGAR SAVE:', error);
        }
    }

    // Verifica se existe progresso guardado.
    static hasProgress() {

        // Tenta carregar o progresso e devolve true se existir save válido.
        return this.loadProgress() !== null;
    }
}