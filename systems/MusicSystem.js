// Cria a classe MusicSystem, responsável por controlar as músicas do jogo.
export default class MusicSystem {

    // Guarda a música que está atualmente a tocar.
    static currentMusic = null;

    // Guarda a key da música atual.
    static currentKey = null;

    // Guarda o volume principal da música vindo do localStorage.
    static masterVolume = Number(localStorage.getItem('musicVolume'));

    // Guarda o volume específico da cena atual.
    static sceneVolume = 0.45;

    // Lista de todas as keys de músicas usadas no jogo.
    static musicKeys = [
        'music_menu',
        'music_interior',
        'music_story',
        'music_level1',
        'music_level2',
        'music_levelFinal',
        'music_boss',
        'music_victory',
        'music_finalVictory',
        'music_gameOver'
    ];

    // Inicializa o volume caso ainda não exista um valor válido.
    static initVolume() {

        // Se o volume guardado não for um número válido.
        if (Number.isNaN(MusicSystem.masterVolume)) {

            // Define o volume principal padrão.
            MusicSystem.masterVolume = 0.55;

            // Guarda o volume padrão no localStorage.
            localStorage.setItem('musicVolume', MusicSystem.masterVolume);
        }
    }

    // Calcula o volume final da música.
    static getFinalVolume() {

        // Garante que o volume principal está inicializado.
        MusicSystem.initVolume();

        // Devolve o volume final limitado entre 0 e 1.
        return Phaser.Math.Clamp(
            MusicSystem.masterVolume * MusicSystem.sceneVolume,
            0,
            1
        );
    }

    // Para outras instâncias de músicas que possam estar a tocar indevidamente.
    static stopOtherMusicInstances(scene, keepKey = null) {

        // Se não houver cena ou sistema de som, não faz nada.
        if (!scene || !scene.sound) return;

        // Percorre todas as músicas registadas.
        MusicSystem.musicKeys.forEach(key => {

            // Ignora a música que deve ser mantida.
            if (key === keepKey) return;

            // Vai buscar todas as instâncias desta música.
            const sounds = scene.sound.getAll(key);

            // Percorre todas as instâncias encontradas.
            sounds.forEach(sound => {

                // Se o som não existir, ignora.
                if (!sound) return;

                // Se for a música atual principal, não remove aqui.
                if (sound === MusicSystem.currentMusic) return;

                // Para o som.
                sound.stop();

                // Destroi o som.
                sound.destroy();
            });
        });
    }

    // Toca uma música.
    static play(scene, key, config = {}) {

        // Se faltar cena, sistema de som ou key da música, não faz nada.
        if (!scene || !scene.sound || !key) return;

        // Garante que o volume está inicializado.
        MusicSystem.initVolume();

        // Define se a música fica em loop.
        const loop = config.loop ?? true;

        // Define a duração do fade.
        const fade = config.fade ?? 1200;

        // Define o volume específico desta música/cena.
        MusicSystem.sceneVolume = config.volume ?? 0.45;

        // Calcula o volume final da música.
        const finalVolume = MusicSystem.getFinalVolume();

        // Limpa músicas antigas perdidas, tipo music_menu por baixo

        // Para outras músicas que não sejam a música atual desejada.
        MusicSystem.stopOtherMusicInstances(scene, key);

        // Se a mesma música já está a tocar, só ajusta o volume

        // Verifica se a música pedida já é a música atual e está a tocar.
        if (
            MusicSystem.currentMusic &&
            MusicSystem.currentKey === key &&
            MusicSystem.currentMusic.isPlaying
        ) {

            // Faz transição suave para o volume correto.
            scene.tweens.add({

                // Define a música atual como alvo.
                targets: MusicSystem.currentMusic,

                // Define o novo volume.
                volume: finalVolume,

                // Define a duração da transição.
                duration: 400,

                // Define suavização.
                ease: 'Sine.easeInOut'
            });

            // Para a função porque não é preciso criar nova música.
            return;
        }

        // Guarda a música antiga para fazer fade out.
        const oldMusic = MusicSystem.currentMusic;

        // Cria uma nova música com volume inicial zero.
        const newMusic = scene.sound.add(key, {

            // Começa sem som para fazer fade in.
            volume: 0,

            // Define se a música fica em loop.
            loop: loop
        });

        // Começa a tocar a nova música.
        newMusic.play();

        // Guarda a nova música como música atual.
        MusicSystem.currentMusic = newMusic;

        // Guarda a key da música atual.
        MusicSystem.currentKey = key;

        // Faz fade in da nova música.
        scene.tweens.add({

            // Define a nova música como alvo.
            targets: newMusic,

            // Define o volume final.
            volume: finalVolume,

            // Define a duração do fade.
            duration: fade,

            // Define suavização.
            ease: 'Sine.easeInOut'
        });

        // Se havia música antiga a tocar.
        if (oldMusic && oldMusic.isPlaying) {

            // Faz fade out da música antiga.
            scene.tweens.add({

                // Define a música antiga como alvo.
                targets: oldMusic,

                // Baixa o volume até zero.
                volume: 0,

                // Define a duração do fade.
                duration: fade,

                // Define suavização.
                ease: 'Sine.easeInOut',

                // Quando o fade out terminar.
                onComplete: () => {

                    // Se a música antiga ainda existir.
                    if (oldMusic) {

                        // Para a música antiga.
                        oldMusic.stop();

                        // Destroi a música antiga.
                        oldMusic.destroy();
                    }
                }
            });
        }
    }

    // Faz transição para outra música.
    static fadeTo(scene, key, config = {}) {

        // Usa a função play com fade padrão de 1500 se não for definido.
        MusicSystem.play(scene, key, {

            // Mantém as configurações recebidas.
            ...config,

            // Define o fade padrão.
            fade: config.fade ?? 1500
        });
    }

    // Para a música atual com fade out.
    static stop(scene, fade = 1000) {

        // Se não houver cena ou música atual, não faz nada.
        if (!scene || !MusicSystem.currentMusic) return;

        // Guarda a música atual.
        const oldMusic = MusicSystem.currentMusic;

        // Faz fade out da música atual.
        scene.tweens.add({

            // Define a música como alvo.
            targets: oldMusic,

            // Baixa o volume até zero.
            volume: 0,

            // Define a duração do fade.
            duration: fade,

            // Define suavização.
            ease: 'Sine.easeInOut',

            // Quando o fade terminar.
            onComplete: () => {

                // Se a música ainda existir.
                if (oldMusic) {

                    // Para a música.
                    oldMusic.stop();

                    // Destroi a música.
                    oldMusic.destroy();
                }

                // Se esta música ainda for a música atual.
                if (MusicSystem.currentMusic === oldMusic) {

                    // Limpa a referência da música atual.
                    MusicSystem.currentMusic = null;

                    // Limpa a key da música atual.
                    MusicSystem.currentKey = null;
                }
            }
        });
    }

    // Para todas as músicas registadas.
    static stopAll(scene) {

        // Se não houver cena ou sistema de som, não faz nada.
        if (!scene || !scene.sound) return;

        // Percorre todas as keys de música.
        MusicSystem.musicKeys.forEach(key => {

            // Vai buscar todas as instâncias desta música.
            const sounds = scene.sound.getAll(key);

            // Percorre cada instância encontrada.
            sounds.forEach(sound => {

                // Se o som não existir, ignora.
                if (!sound) return;

                // Para o som.
                sound.stop();

                // Destroi o som.
                sound.destroy();
            });
        });

        // Limpa a música atual.
        MusicSystem.currentMusic = null;

        // Limpa a key da música atual.
        MusicSystem.currentKey = null;
    }

    // Define o volume principal da música.
    static setVolume(value) {

        // Garante que o volume está inicializado.
        MusicSystem.initVolume();

        // Define o volume principal limitado entre 0 e 1.
        MusicSystem.masterVolume = Phaser.Math.Clamp(value, 0, 1);

        // Guarda o volume no localStorage.
        localStorage.setItem('musicVolume', MusicSystem.masterVolume);

        // Se existir música atual.
        if (MusicSystem.currentMusic) {

            // Atualiza o volume da música atual.
            MusicSystem.currentMusic.setVolume(MusicSystem.getFinalVolume());
        }
    }

    // Aumenta o volume principal.
    static increaseVolume(step = 0.1) {

        // Soma o valor do step ao volume atual.
        MusicSystem.setVolume(MusicSystem.masterVolume + step);
    }

    // Diminui o volume principal.
    static decreaseVolume(step = 0.1) {

        // Subtrai o valor do step ao volume atual.
        MusicSystem.setVolume(MusicSystem.masterVolume - step);
    }

    // Devolve o volume em percentagem.
    static getVolumePercent() {

        // Garante que o volume está inicializado.
        MusicSystem.initVolume();

        // Converte o volume de 0-1 para percentagem.
        return Math.round(MusicSystem.masterVolume * 100);
    }
}