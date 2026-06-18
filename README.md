# ⚔️ Order of the Fallen

**Order of the Fallen** é um jogo de RPG de ação com perspetiva **2D Top-Down**, desenvolvido em JavaScript com a framework **Phaser 3**. O jogador explora mapas, enfrenta inimigos, recolhe itens estratégicos e avança por níveis desafiantes até ao confronto final.

O jogo conta com modos **Single Player** e **Multiplayer Local (Co-op)** no mesmo teclado.

> ### 🎮 [CLICA AQUI PARA JOGAR ONLINE](https://mariapontespereira.github.io/Order_of_the_Fallen)
> *(Joga diretamente no teu navegador através do GitHub Pages)*

---

## 📜 Universo e Enredo

O enredo desenrola-se em Valdoria, um reino que viveu em paz durante séculos graças aos cristais mágicos. O equilíbrio é quebrado quando **Odysseus**, um dos mais prestigiados e influentes cavaleiros da ordem protetora, cede à ambição e trai os seus juramentos. Ao corromper a fonte dos cristais com magia negra, ele desencadeia uma reação em cadeia que transforma criaturas pacíficas em monstros e espalha a ruína pelas províncias.
Para enfrentar este desafio, o jogador escolhe um herói e percorre  níveis cheios de inimigos, obstáculos e caminhos bloqueados. Durante a aventura, é necessário explorar o mapa, recolher cristais, usar itens e encontrar chaves para conseguir avançar.
O objetivo principal é chegar até Odysseus e derrotá-lo, restaurando a segurança de Valdoria.

---

## ⚙️ Funcionalidades

* 👇 Estilo Top-Down: Movimentação fluída com visão aérea e combate baseado na direção do personagem.  
* 👥 Co-op Local: Joga sozinho ou com dois jogadores no mesmo teclado.  
* ⚔️ Combate Completo: Ataques normais, habilidades com recarga, ataques especiais e defesa ativa.  
* 🗺️ Mundo Interativo: Mapas criados no Tiled com zonas de perigo, baús de tesouro e portas trancadas por chaves. 

---

## 🎮 Controlos

### Jogador 1

* Mover: Setas Direcionais (`↑` `↓` `←` `→`)
* Ataque Normal: `J`
* Ataque 2: `K`
* Ataque 3: `L`
* Defender: `B`
* Interagir: `E`

### Jogador 2

* Mover: `W` `A` `S` `D`
* Ataque Normal: `R`
* Ataque 2: `T`
* Ataque 3: `Q`
* Defender: `CTRL`
* Interagir: `E`

---

##  💻 Como Correr o Jogo Localmente
O Phaser necessita de um servidor local para carregar os ficheiros de imagem, som e mapas (restrições de segurança de CORS dos navegadores modernos).

**Passo a Passo:**

1. Abre a pasta do projeto no Visual Studio Code.

2. Certifica-se de que a extensão Live Server está instalada.

3. Clica com o botão direito no ficheiro index.html.

4. Seleciona a opção Open with Live Server.

5. O jogo abrirá automaticamente no teu navegador padrão.

---

## 📝 Reflexão Académica 
O desenvolvimento de Order of the Fallen foi um grande desafio técnico, especialmente devido ao prazo curto para planear, programar e polir o jogo.

 **Maiores Dificuldades**

  * *Modularização:* Dividir o código em classes e cenas separadas (jogadores, inimigos, loja) para evitar um código confuso e garantir que os dados (moedas e vida) passavam bem entre níveis.  

  * *Singleplayer* vs *Multiplayer:* Ajustar os níveis para funcionarem com um ou dois jogadores no mesmo teclado.

  * *Animações Fluidas:* Calibrar a movimentação Top-Down e camadas, garantindo que o personagem passa de forma natural pela frente ou por trás dos cenários e que nenhuma animação do sprite trave.

  * *Código sem Erros:* Descobrir e corrigir bugs minuciosos num sistema que corre em loop contínuo e onde qualquer erro estraga a experiência.  

  * *Pouco Tempo:* Gerir o curto prazo de entrega, o que obrigou a focar nas mecânicas principais e a resolver problemas de forma rápida e prática.

---

## 🎨 Créditos e Recursos (Assets)

Tecnologias: Phaser 3, JavaScript (ES6+), Tiled Map Editor e VS Code.

> ⚠️ **Nota Importante:** Este projeto foi desenvolvido estritamente para **fins académicos e educativos**. Todos os recursos visuais e sonoros pertencem aos seus respetivos autores e criadores originais.

* **Sprites dos Personagens:** [Zerie](https://zerie.itch.io/) (via itch.io)
* **Tilesets e Mapas:** [BeyonderBoy](https://beyonderboy.itch.io/) e [Szadi art](https://szadiart.itch.io/) (via itch.io)
* **Imagens de Fundo:** Imagens e referências visuais obtidas via Pinterest.
* **Músicas e Áudio:** Faixas e composições musicais de domínio público / uso livre para projetos académicos.