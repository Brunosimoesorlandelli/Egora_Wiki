# 🗺️ Egora — Wiki do Cenário

> Wiki interativa de **Egora**, um cenário de RPG de fantasia medieval e steampunk para D&D, com mapa navegável, regiões, personagens, política, panteão, raças e glossário.

[![Site no ar](https://img.shields.io/badge/🌐%20ver%20site-GitHub%20Pages-2ea44f)](https://brunosimoesorlandelli.github.io/Egora_Wiki/)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

🔗 **Acesse a wiki:** <https://brunosimoesorlandelli.github.io/Egora_Wiki/>

<!--
  TODO: adicione uma captura de tela ou GIF do mapa.
  Crie a pasta /docs e use:
  ![Prévia da Egora Wiki](docs/preview.png)
-->

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [O cenário Egora](#-o-cenário-egora)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Arquitetura](#-arquitetura)
- [Como executar localmente](#-como-executar-localmente)
- [Publicação (GitHub Pages)](#-publicação-github-pages)
- [Como editar o conteúdo](#-como-editar-o-conteúdo)
- [Como estender o projeto](#-como-estender-o-projeto)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Créditos e aviso legal](#-créditos-e-aviso-legal)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Sobre o projeto

A **Egora Wiki** transforma o material de um cenário de RPG (originalmente um documento em PDF) em uma página web navegável, pensada como **guia de consulta rápida** para mestres e jogadores durante a preparação de campanhas e as sessões.

Em vez de folhear um documento extenso, é possível explorar o mundo pelo **mapa**, abrir cada **região**, consultar **personagens**, entender **alianças e rivalidades** e pesquisar qualquer termo.

**Para quem é:**

- 🎲 Mestres que conduzem campanhas em Egora
- 🧙 Jogadores que querem conhecer o mundo dos seus personagens
- ✍️ Quem se interessa por worldbuilding de fantasia

---

## 🌍 O cenário Egora

Egora é um cenário de **fantasia medieval e steampunk**, jogado em **D&D** e com raízes em **Forgotten Realms**. É uma era de descobertas tecnológicas em que o passado encontra o futuro, e **cada região ecoa uma cultura do nosso mundo**.

O mundo reúne **treze povos, reinos e ilhas** disputando um espaço em constante transformação. Acima de todos os deuses do panteão está **Ao**, o Deus Supremo.

> ⚠️ Egora está em constante desenvolvimento, e tudo pode mudar.

---

## ✨ Funcionalidades

| Seção | O que oferece |
|-------|---------------|
| 🗺️ **Mapa** | Mapa interativo com territórios recortados que abrem a região ao clicar. Ao passar o mouse, mostra alianças (verde) e rivalidades (vermelho). Arraste para mover; use **+**, **−** ou **Ctrl + roda** para o zoom; **⟲** para resetar a visão |
| 🏰 **Regiões** | Os treze povos, reinos e ilhas do cenário |
| 👤 **Personagens** | Reis, cavaleiros, líderes tribais e conspiradores, com atalho para a região de cada um |
| ⚖️ **Política e Tempo** | **Relações** (alianças e rivalidades), **Comparador** e **Linha do tempo** de eventos |
| ✨ **Panteão** | Os deuses de Egora, liderados por Ao |
| 🧝 **Raças** | Todas as raças encontradas no cenário |
| 📖 **Glossário** | Termos e organizações do mundo |
| ⌕ **Busca** | Pesquisa de conteúdo em toda a wiki |
| 🎲 **Modo Mestre** | Mostra os segredos de cada região e um bloco de anotações pessoais, salvo no navegador, com exportação e importação em JSON |
| ◐ **Tema** | Alternância de tema visual |
| ♿ **Acessibilidade** | Link "Pular para o conteúdo" para navegação por teclado |

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura da página (`index.html`) |
| **CSS3** | Estilo, temas e identidade visual, dividido por responsabilidade |
| **JavaScript (ES6+ / ES Modules)** | Mapa interativo, busca, Modo Mestre, tema e navegação |
| **JSON** | Todo o conteúdo da wiki (regiões, personagens, glossário etc.) |
| **LocalStorage** | Tema escolhido, estado do Modo Mestre e anotações do mestre |

Projeto 100% estático: roda no navegador, sem servidor próprio, banco de dados, framework ou etapa de build.

---

## 📁 Estrutura do repositório

```
Egora_Wiki/
├── index.html              # Estrutura da página e ponto de entrada (<script type="module">)
├── README.md
├── css/
│   ├── global.css          # Variáveis, reset, tipografia, foco e movimento reduzido
│   ├── layout.css          # Navegação, hero, seções e grades
│   ├── components.css      # Cards, tags, abas, comparador, linha do tempo, busca, glossário
│   ├── region.css          # Página de região em tela cheia e Modo Mestre
│   ├── map.css             # Mapa interativo
│   ├── themes.css          # Tema claro automático e temas manuais (claro / steampunk)
│   └── print.css           # Impressão
├── js/
│   ├── main.js             # Ponto de entrada: só inicializa e coordena
│   ├── core/               # Sistemas compartilhados
│   │   ├── data.js         #   carregamento (fetch + cache) dos JSON
│   │   ├── router.js       #   rotas por hash (#região, #seção, #g-termo)
│   │   ├── loader.js       #   carregamento sob demanda das seções
│   │   ├── navigation.js   #   botões da barra superior
│   │   ├── search.js       #   índice e consulta da busca
│   │   ├── theme.js        #   temas
│   │   ├── state.js        #   estado global e eventos entre módulos
│   │   ├── linkify.js      #   links automáticos (regiões e glossário) nos textos
│   │   ├── reveal.js       #   animação de entrada ao rolar
│   │   ├── storage.js      #   localStorage seguro
│   │   └── dom.js          #   helpers de DOM (h(), s(), $)
│   ├── modules/            # Funcionalidades da wiki (cada uma com initXxx)
│   │   ├── map.js  regions.js  characters.js  politics.js  timeline.js
│   │   ├── pantheon.js  races.js  glossary.js
│   │   ├── region-view.js  # página de região
│   │   └── master.js       # Modo Mestre
│   └── components/         # Peças reutilizáveis de interface
│       ├── modal.js  cards.js  sidebar.js  search-bar.js
├── data/                   # Conteúdo (JSON)
│   ├── regions.json  politics.json  characters.json  pantheon.json
│   ├── races.json  glossary.json  timeline.json  map-territories.json
├── assets/
│   ├── maps/egora.jpg
│   └── images/{regioes,personagens}/
└── docs/RELATORIO_REFATORACAO.md
```

---

## 🏛️ Arquitetura

- **Estrutura × apresentação × lógica × conteúdo** são independentes: HTML em `index.html`, estilos em `css/`, código em `js/`, conteúdo em `data/`.
- **`main.js` só coordena.** Ele inicializa tema, busca, navegação, Modo Mestre, o roteador e o carregador de seções.
- **Carregamento sob demanda.** Cada seção (`mapa`, `regioes`, `personagens`, `politica`, `panteao`, `racas`, `glossario`) tem seu módulo JS e seus JSON carregados com `import()` / `fetch()` só quando ela se aproxima da tela, ou quando um link, a busca ou o hash da URL levam até ela. A linha do tempo só carrega quando sua aba é aberta; a página de região, na primeira vez que uma região é aberta.
- **Módulos independentes.** Eles não se importam entre si: conversam por `core/state.js` (eventos como `route` e `master:change`) e compartilham dados via `core/data.js`.
- **Segurança.** O conteúdo dos JSON é inserido no DOM com `createElement` / `textContent` (helper `h()` de `core/dom.js`), nunca com `innerHTML`.
- **Caminhos relativos.** Os JSON são resolvidos a partir de `import.meta.url`, então o site funciona em qualquer subdiretório (como `/Egora_Wiki/` no GitHub Pages).

---

## 🚀 Como executar localmente

Como o projeto usa **ES Modules** e `fetch()`, ele precisa ser servido por HTTP: abrir o `index.html` com duplo clique (`file://`) **não funciona** em navegadores modernos.

```bash
git clone https://github.com/Brunosimoesorlandelli/Egora_Wiki.git
cd Egora_Wiki

# Python
python -m http.server 8000

# ou Node.js
npx serve .
```

Acesse `http://localhost:8000`. Nenhuma instalação de dependências é necessária.

---

## 🌐 Publicação (GitHub Pages)

O site está publicado em <https://brunosimoesorlandelli.github.io/Egora_Wiki/>.

Para publicar uma cópia própria (fork ou novo repositório):

1. Vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione a branch **`main`** e a pasta **`/ (root)`** e salve.
4. Após alguns minutos, o site estará disponível em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

---

## ✏️ Como editar o conteúdo

O conteúdo fica em `data/*.json`; não é preciso mexer em código para editar textos.

| Para editar... | Arquivo | Observações |
|---|---|---|
| Regiões (lema, história, resumo, abas, segredos) | `data/regions.json` | `camposResumo` define a ordem do quadro "Resumo" |
| Alianças e rivalidades | `data/politics.json` | `relacoes.<id>.aliados` / `inimigos` (ids de regiões); `diagrama` guarda os textos do diagrama |
| Personagens | `data/characters.json` | `regiao` é o id de uma região; `imagem` aponta para `assets/images/personagens/` |
| Panteão / Raças / Glossário / Linha do tempo | `pantheon.json`, `races.json`, `glossary.json`, `timeline.json` | Ids de região devem existir em `regions.json` |
| Formato dos territórios do mapa | `data/map-territories.json` | Caminhos SVG por id de região |

**Adicionar uma região nova**

1. Acrescente o objeto em `data/regions.json` (com `id` único, `cor`, `mapa: {x, y}` e `imagem`) e a imagem em `assets/images/regioes/`.
2. Acrescente `relacoes.<id>` em `data/politics.json`.
3. Acrescente o caminho do território em `data/map-territories.json` para que ela apareça recortada no mapa.

Depois de editar, confira no navegador (servidor local), faça commit e push; o GitHub Pages atualiza o site.

```bash
git add .
git commit -m "docs: atualiza região X"
git push origin main
```

---

## 🧩 Como estender o projeto

**Nova seção/funcionalidade**

1. Crie a `<section id="minha-secao">` em `index.html`.
2. Crie `js/modules/minha-secao.js` exportando `async function initMinhaSecao(section)`.
3. Registre-a em `SECTIONS` no `js/core/loader.js`: `minhasecao: () => import('../modules/minha-secao.js').then(m => m.initMinhaSecao)`.
4. Se tiver dados, crie `data/minha-secao.json` e um getter em `js/core/data.js`.

**Novo componente reutilizável**

Crie `js/components/meu-componente.js` exportando funções que **devolvem elementos DOM** (use `h()` de `core/dom.js`) e importe onde precisar. Estilos vão em `css/components.css`.

**Comunicação entre módulos**

Use `emit()` / `on()` de `core/state.js` em vez de importar um módulo do outro.

---

## 🗺️ Roadmap

- [ ] Adicionar capturas de tela ao README
- [x] Separar o `index.html` (≈ 2,5 MB) em `css/`, `js/`, `data/` e `assets/`
- [x] Mover o conteúdo (regiões, personagens, glossário) para arquivos de dados (JSON)
- [ ] Otimizar imagens (WebP) — hoje são JPEGs já pequenos, em arquivos separados com carregamento tardio
- [ ] Revisar responsividade em celulares
- [ ] Completar o conteúdo de todas as regiões, personagens e glossário
- [ ] Domínio próprio

---

## 🤝 Contribuindo

Sugestões e correções são bem-vindas!

1. Faça um **fork** do projeto
2. Crie uma branch: `git checkout -b feature/minha-melhoria`
3. Faça o commit: `git commit -m "feat: descrição da melhoria"`
4. Envie: `git push origin feature/minha-melhoria`
5. Abra um **Pull Request**

Você também pode abrir uma [issue](https://github.com/Brunosimoesorlandelli/Egora_Wiki/issues) para relatar erros ou propor novas seções.

---

## ⚖️ Créditos e aviso legal

- O cenário **Egora**, seus textos e sua lore pertencem ao(s) criador(es) original(is).
- O design foi **inspirado** em sites de universo e mapa de regiões de jogos online. Este é um projeto independente, **sem afiliação ou endosso** das empresas ou marcas que serviram de inspiração.
- Menções a **D&D** e **Forgotten Realms** são apenas referências ao sistema e ao cenário-base; essas marcas pertencem aos seus respectivos detentores.

<!-- TODO: liste créditos de arte, fontes tipográficas e demais recursos usados. -->

---

## 📄 Licença

<!--
  TODO: escolha uma licença e adicione o arquivo LICENSE.
  Sugestões: MIT (código) ou CC BY-NC 4.0 (conteúdo autoral, sem uso comercial).
  Guia: https://choosealicense.com/
-->

Licença ainda não definida. Até que um arquivo `LICENSE` seja adicionado, todos os direitos permanecem reservados ao autor.

---

## 👤 Autor

Feito por **[Brunosimoesorlandelli](https://github.com/Brunosimoesorlandelli)**.

Se o projeto te ajudou ou te inspirou, deixe uma ⭐ no repositório!
