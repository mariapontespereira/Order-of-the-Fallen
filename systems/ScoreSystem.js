// Cria a classe ScoreSystem, responsável por controlar a pontuação do nível.
export default class ScoreSystem {

    // Construtor do sistema.
    constructor(scene) {

        // Guarda a referência da cena onde o sistema vai funcionar.
        this.scene = scene;

        // Guarda a pontuação total atual.
        this.score = 0;

        // Define os pontos atribuídos a cada item, inimigo e bónus.
        this.points = {

            // Pontos ganhos ao apanhar uma maçã.
            apple: 10,

            // Pontos ganhos ao apanhar um gelado.
            icecream: 20,

            // Pontos ganhos ao apanhar uma moeda.
            coin: 15,

            // Pontos ganhos ao matar o enemy0.
            enemy0: 50,

            // Pontos ganhos ao matar o enemy1.
            enemy1: 40,

            // Pontos ganhos ao matar o enemy2.
            enemy2: 35,

            // Pontos ganhos ao matar o enemy3.
            enemy3: 20,

            // Pontos ganhos ao matar o enemy4.
            enemy4: 45,

            // Pontos ganhos ao matar o enemy5.
            enemy5: 40,

            // Pontos ganhos ao matar o enemy6.
            enemy6: 55,

            // Pontos ganhos ao matar o enemy7.
            enemy7: 60,

            // Pontos ganhos ao matar o enemy8.
            enemy8: 45,

            // Pontos ganhos ao concluir o nível.
            finishLevel: 100,

            // Pontos extra por terminar com mais de 1 minuto restante.
            finishUnderOneMinute: 100,

            // Pontos extra por terminar sem sofrer dano.
            noDamage: 500
        };

        // Guarda a divisão dos pontos por categoria.
        this.breakdown = {

            // Pontos ganhos com itens.
            items: 0,

            // Pontos ganhos com inimigos.
            enemies: 0,

            // Pontos ganhos por terminar o nível.
            finishLevel: 0,

            // Pontos ganhos pelo bónus de tempo.
            timeBonus: 0,

            // Pontos ganhos pelo bónus sem dano.
            noDamageBonus: 0
        };

        // Guarda estatísticas usadas no resumo final do nível.
        this.stats = {

            // Quantidade de maçãs apanhadas.
            apples: 0,

            // Quantidade de gelados apanhados.
            icecreams: 0,

            // Quantidade de moedas apanhadas.
            coins: 0,

            // Quantidade total de inimigos mortos.
            enemiesKilled: 0,

            // Quantidade de enemy0 mortos.
            enemy0Killed: 0,

            // Quantidade de enemy1 mortos.
            enemy1Killed: 0,

            // Quantidade de enemy2 mortos.
            enemy2Killed: 0,

            // Quantidade de enemy3 mortos.
            enemy3Killed: 0,

            // Quantidade de enemy4 mortos.
            enemy4Killed: 0,

            // Quantidade de enemy5 mortos.
            enemy5Killed: 0,

            // Quantidade de enemy6 mortos.
            enemy6Killed: 0,

            // Quantidade de enemy7 mortos.
            enemy7Killed: 0,

            // Quantidade de enemy8 mortos.
            enemy8Killed: 0
        };
    }

    // Adiciona pontos diretamente à pontuação total.
    add(points) {

        // Soma os pontos recebidos ao score total.
        this.score += points;
    }

    // Adiciona pontos de um item apanhado.
    addItem(itemKey) {

        // Vai buscar os pontos correspondentes ao item.
        const points = this.points[itemKey] || 0;

        // Adiciona os pontos ao score total.
        this.add(points);

        // Adiciona os pontos à categoria de itens.
        this.breakdown.items += points;

        // Se o item for maçã, aumenta a contagem de maçãs.
        if (itemKey === 'apple') this.stats.apples++;

        // Se o item for gelado, aumenta a contagem de gelados.
        if (itemKey === 'icecream') this.stats.icecreams++;

        // Se o item for moeda, aumenta a contagem de moedas.
        if (itemKey === 'coin') this.stats.coins++;
    }

    // Adiciona pontos por matar um inimigo.
    addEnemy(enemyType) {

        // Vai buscar os pontos correspondentes ao tipo de inimigo.
        const points = this.points[enemyType] || 0;

        // Adiciona os pontos ao score total.
        this.add(points);

        // Adiciona os pontos à categoria de inimigos.
        this.breakdown.enemies += points;

        // Aumenta a contagem total de inimigos mortos.
        this.stats.enemiesKilled++;

        // Cria o nome da estatística específica do inimigo.
        const killKey = `${enemyType}Killed`;

        // Se essa estatística existir.
        if (this.stats[killKey] !== undefined) {

            // Aumenta a contagem desse inimigo específico.
            this.stats[killKey]++;
        }
    }

    // Adiciona o bónus de conclusão do nível.
    addFinishBonus() {

        // Vai buscar os pontos de conclusão do nível.
        const points = this.points.finishLevel;

        // Adiciona os pontos ao score total.
        this.add(points);

        // Adiciona os pontos à categoria de conclusão.
        this.breakdown.finishLevel += points;
    }

    // Adiciona o bónus de tempo, se o nível foi terminado com tempo suficiente.
    addTimeBonus() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se ainda restar mais de 60 segundos.
        if ((scene.levelTimeLeft || 0) > 60) {

            // Vai buscar os pontos do bónus de tempo.
            const points = this.points.finishUnderOneMinute;

            // Adiciona os pontos ao score total.
            this.add(points);

            // Adiciona os pontos à categoria de bónus de tempo.
            this.breakdown.timeBonus += points;
        }
    }

    // Adiciona o bónus por terminar sem sofrer dano.
    addNoDamageBonus() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena, não faz nada.
        if (!scene) return;

        // Se o jogador não sofreu dano durante o nível.
        if (!scene.playerTookDamage) {

            // Vai buscar os pontos do bónus sem dano.
            const points = this.points.noDamage;

            // Adiciona os pontos ao score total.
            this.add(points);

            // Adiciona os pontos à categoria de bónus sem dano.
            this.breakdown.noDamageBonus += points;
        }
    }

    // Finaliza a pontuação do nível.
    finishLevel() {

        // Guarda a referência da cena.
        const scene = this.scene;

        // Se não houver cena ou registry, não faz nada.
        if (!scene || !scene.registry) return;

        // Adiciona o bónus por terminar o nível.
        this.addFinishBonus();

        // Adiciona o bónus de tempo, se cumprir a condição.
        this.addTimeBonus();

        // Adiciona o bónus sem dano, se cumprir a condição.
        this.addNoDamageBonus();

        // Guarda o score total do nível no registry.
        scene.registry.set('levelScore', this.score);

        // Guarda a divisão dos pontos no registry.
        scene.registry.set('scoreBreakdown', this.breakdown);

        // Guarda as estatísticas do nível no registry.
        scene.registry.set('scoreStats', this.stats);
    }
}