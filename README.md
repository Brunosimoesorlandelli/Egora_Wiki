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
- [Como executar localmente](#-como-executar-localmente)
- [Publicação (GitHub Pages)](#-publicação-github-pages)
- [Como editar o conteúdo](#-como-editar-o-conteúdo)
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
| 🗺️ **Mapa** | Mapa interativo com marcadores clicáveis que abrem a região. Ao passar o mouse, mostra alianças (verde) e rivalidades (vermelho). Arraste para mover; use **+**, **−** ou **Ctrl + roda** para o zoom; **⟲** para resetar a visão |
| 🏰 **Regiões** | Os treze povos, reinos e ilhas do cenário |
| 👤 **Personagens** | Reis, cavaleiros, líderes tribais e conspiradores, com atalho para a região de cada um |
| ⚖️ **Política e Tempo** | **Relações** (alianças e rivalidades), **Comparador** e **Linha do tempo** de eventos |
| ✨ **Panteão** | Os deuses de Egora, liderados por Ao |
| 🧝 **Raças** | Todas as raças encontradas no cenário |
| 📖 **Glossário** | Termos e organizações do mundo |
| ⌕ **Busca** | Pesquisa de conteúdo em toda a wiki |
| 🎲 **Modo Mestre** | Visão voltada ao mestre <!-- TODO: descreva o que este modo mostra (ex.: informações restritas, segredos de campanha) --> |
| ◐ **Tema** | Alternância de tema visual |
| ♿ **Acessibilidade** | Link "Pular para o conteúdo" para navegação por teclado |

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **HTML5** | Estrutura e conteúdo |
| **CSS3** | Estilo, temas e identidade visual |
| **JavaScript** | Mapa interativo, busca, modo Mestre, tema e navegação |

Projeto 100% estático: roda no navegador, sem servidor, banco de dados ou etapa de build.

---

## 📁 Estrutura do repositório

```
Egora_Wiki/
├── index.html    # Wiki completa (conteúdo, estilos e scripts)
└── README.md     # Este arquivo
```

---

## 🚀 Como executar localmente

Basta um navegador moderno (Chrome, Edge, Firefox ou Safari).

**Opção 1 — Abrir direto**

```bash
git clone https://github.com/Brunosimoesorlandelli/Egora_Wiki.git
cd Egora_Wiki

# Windows: start index.html
# macOS:   open index.html
# Linux:   xdg-open index.html
```

**Opção 2 — Servidor local (recomendado ao desenvolver)**

```bash
# Python
python -m http.server 8000

# ou Node.js
npx serve .
```

Acesse `http://localhost:8000`.

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

Todo o conteúdo fica no `index.html`:

1. Abra o arquivo em um editor (por exemplo, o VS Code).
2. Localize a seção desejada (regiões, personagens, glossário etc.).
3. Edite ou adicione entradas seguindo o padrão das já existentes.
4. Abra no navegador para conferir.
5. Faça commit e push; o GitHub Pages atualiza o site automaticamente.

```bash
git add .
git commit -m "docs: atualiza região X"
git push origin main
```

---

## 🗺️ Roadmap

- [ ] Adicionar capturas de tela ao README
- [ ] Separar o `index.html` (≈ 2,5 MB) em `css/`, `js/`, `data/` e `assets/`, para facilitar a manutenção e acelerar o carregamento
- [ ] Mover o conteúdo (regiões, personagens, glossário) para arquivos de dados (JSON), separando conteúdo e código
- [ ] Otimizar imagens (compressão / WebP)
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
