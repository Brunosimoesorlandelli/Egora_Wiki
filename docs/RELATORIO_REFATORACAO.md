# Relatório da refatoração — Egora Wiki

## 1. Diagnóstico (Fase 1)

**Antes:** um único `index.html` de 2,65 MB, composto por:

| Parte | Tamanho aproximado |
|---|---|
| 59 imagens JPEG em base64 (o mapa aparecia **duas vezes**, idêntico, no hero e no mapa) | ≈ 2,57 MB |
| Dados da wiki (`DATA`) e caminhos SVG dos territórios (`TR`) embutidos no JS | ≈ 55 KB |
| CSS inline | ≈ 16 KB |
| Lógica JS (≈ 190 linhas densas) com ~30 funções globais de nomes curtos (`pn`, `tb`, `lay`, `H`, `Z`…) e handlers `onclick=""` inline | ≈ 20 KB |
| HTML estrutural | ≈ 6 KB |

**Inventário de funcionalidades encontradas:** mapa (arrastar, zoom por botões/Ctrl+roda/pinça, territórios SVG recortados, destaque de aliados/inimigos, tooltip, 5 camadas temáticas com legenda, alternar fronteiras); grade de regiões; página de região (banner com paralaxe, história com links automáticos, figuras, abas internas, resumo, aliados/inimigos, navegação ←/→, Esc, impressão, fundos por bioma); personagens com filtro por região; política (diagrama de relações, comparador de até 3 regiões, linha do tempo); panteão; raças; glossário com âncoras; busca (atalhos `/` e Ctrl+K, setas, Enter, índice com acentos normalizados); Modo Mestre (segredos, anotações por região, exportar/importar JSON); 3 temas persistidos; acessibilidade (skip link, foco visível, `aria-*`, `prefers-reduced-motion`, `tabindex` nos territórios, impressão).

**Riscos identificados:** handlers inline e funções globais (incompatíveis com módulos); `innerHTML` com dados; ordem de regras CSS (temas no meio do arquivo); âncoras para seções que agora nascem sob demanda; `:target` do glossário.

## 2. Nova arquitetura

Ver a seção *Arquitetura* do `README.md`. Resumo do antes/depois:

| | Antes | Depois |
|---|---|---|
| `index.html` | 2,65 MB | ≈ 5 KB |
| CSS | inline | 7 arquivos em `css/` |
| JS | 1 script inline, globais, handlers inline | 26 módulos ES em `js/` (core / modules / components), delegação de eventos |
| Dados | dentro do JS | 8 JSON em `data/` (≈ 65 KB) |
| Imagens | base64 (mapa duplicado) | arquivos em `assets/` (≈ 1,9 MB), carregamento tardio nos retratos |
| Carregamento | tudo de uma vez | nenhuma requisição de dados até a rolagem; cada seção, a linha do tempo, a página de região e o índice de busca são carregados sob demanda |

## 3. Decisões e justificativas

- **Sem frameworks nem build**, conforme pedido; apenas ES Modules.
- **Imagens mantidas em JPEG:** já são pequenas (≈ 25 KB em média, mapa 182 KB) e reencodar JPEG→WebP perde qualidade. Elimina-se a duplicação do mapa e o custo de 33 % do base64. WebP fica no roadmap.
- **`politics.json`:** as alianças/rivalidades estavam dentro de cada região; foram **movidas** (não duplicadas) para `politics.json`, que `core/data.js` recombina em memória. Os textos do diagrama e da linha do tempo, antes fixos no JS, foram movidos para os JSON.
- **Segurança:** nenhum `innerHTML`; os links automáticos de glossário/regiões são montados com `createElement`.
- **Arquivos extras além da referência:** `core/loader.js`, `core/reveal.js`, `core/storage.js`, `core/dom.js`, `modules/region-view.js`, `modules/master.js`, `css/region.css`, `css/print.css`, `data/map-territories.json` — cada um tem responsabilidade própria que não cabia nos nomes sugeridos.
- **Script de 4 linhas no `<head>`** só para aplicar o tema salvo antes da primeira pintura (evita "piscar").

## 4. Validação executada

Foram usados o jsdom e um conjunto de scripts de verificação (não incluídos no repositório, pois dependem do arquivo monolítico original):

- **Equivalência de DOM, 86 verificações:** original e refatorado receberam as mesmas interações (todas as 13 regiões, ←/→/Esc, Modo Mestre com digitação/exportar/importar/JSON inválido, 4 trocas de tema, buscas e atalhos, comparador, abas, hover no diagrama, filtros de personagens, 5 camadas do mapa, hover/tooltip, zoom, fronteiras, arrastar vs. clicar, âncora do glossário, links automáticos). **86/86 idênticas** (DOM, `localStorage`, tema, overflow).
- **Cascata do CSS:** comparado o estilo vencedor (especificidade + ordem) de cada declaração por elemento em 7 estados (3 temas, região aberta, Modo Mestre, outro bioma): **52.864/52.864 idênticas**.
- **Carregamento sob demanda:** com `IntersectionObserver` simulado, zero requisições ao abrir; cada JSON só aparece quando a seção/busca o exige.
- **Integridade:** todos os `href/src`, imagens dos JSON e JSON válidos; nenhum caminho absoluto; nenhum `innerHTML`.

**Não foi possível testar** (sem navegador real no ambiente): renderização visual pixel a pixel, gestos de toque reais e execução no GitHub Pages. Recomenda-se abrir o site publicado e conferir o console.

## 5. Desvios conhecidos (intencionais)

1. A **linha do tempo** só é montada ao abrir a aba (antes ficava pronta no carregamento).
2. A animação de entrada (`.rv`) calcula o atraso escalonado por lote de cada seção, não pelo índice global.
3. Após navegar para um termo do glossário cuja seção ainda não existia, o destaque usa a classe `.is-target` (equivalente ao `:target`).
4. **Abrir o `index.html` por `file://` deixou de funcionar** (limitação dos ES Modules/`fetch`); use um servidor local ou o GitHub Pages.

## 6. Problemas encontrados no código original (preservados, não corrigidos)

- Em `region-view.js`, as setas ←/→ trocam de região mesmo com o foco no campo de **anotações do Modo Mestre** (`TEXTAREA` não está na exclusão `INPUT|SELECT`). Correção sugerida: incluir `TEXTAREA` na expressão regular.
- O diagrama de relações não responde a Enter/Espaço (só a clique), ao contrário dos territórios do mapa.
- Regras CSS `.pin*` não correspondem a nenhum elemento (resquício de marcadores antigos).
- A fonte do Google Fonts continua sendo um recurso externo.
