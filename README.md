# NihonGo! • Aplicativo Web para Aprendizado de Japonês (Hiragana & Katakana)

Aplicativo web moderno, intuitivo, responsivo e 100% em português brasileiro (PT-BR) para ensinar os alfabetos fonéticos japoneses **Hiragana (ひらがな)** e **Katakana (カタカナ)**.

Desenvolvido para funcionar completamente no lado do cliente (Client-Side), sem necessidade de backend, banco de dados ou autenticação. Funciona perfeitamente offline direto no navegador do estudante.

---

## 🚀 Tecnologias Utilizadas

- **TypeScript:** Tipagem estrita de primeira classe sem uso de `any`.
- **React 19:** Componentização modular, reativa e de alta performance.
- **Tailwind CSS v3:** Interface elegante, minimalista e 100% responsiva (Desktop, Tablets, Android e iOS).
- **Vite:** Build rápido e otimizado.
- **WanaKana (`wanakana`):** Manipulação, conversão e validação inteligente de caracteres japoneses.
- **Web Speech API:** Síntese de voz nativa japonesa (`ja-JP`) para pronúncia em áudio offline.
- **PWA (Progressive Web App):** Suporte nativo para instalação em dispositivos móveis (iOS e Android), ícones dedicados em alta resolução e modo *Standalone* (tela cheia sem barra do navegador).
- **Lucide React:** Ícones modernos e acessíveis.

---

## 📚 Escopo Pedagógico (92 Caracteres Básicos)

O aplicativo abrange todos os 46 caracteres básicos do **Hiragana** e os 46 do **Katakana**, divididos em 11 famílias fonéticas:
1. **Vogais Puras:** あ/ア (a), い/イ (i), う/ウ (u), え/エ (e), お/オ (o)
2. **Linha K:** か/カ (ka), き/キ (ki), く/ク (ku), け/ケ (ke), こ/コ (ko)
3. **Linha S:** さ/サ (sa), し/シ (shi), す/ス (su), せ/セ (se), そ/ソ (so)
4. **Linha T:** た/タ (ta), ち/チ (chi), つ/ツ (tsu), て/テ (te), と/ト (to)
5. **Linha N:** な/ナ (na), に/ニ (ni), ぬ/ヌ (nu), ね/ネ (ne), の/ノ (no)
6. **Linha H:** は/ハ (ha), ひ/ヒ (hi), ふ/フ (fu), へ/ヘ (he), ほ/ホ (ho)
7. **Linha M:** ま/マ (ma), み/ミ (mi),む/ム (mu), め/メ (me), も/モ (mo)
8. **Linha Y:** や/ヤ (ya), ゆ/ユ (yu), よ/ヨ (yo)
9. **Linha R:** ら/ラ (ra), り/リ (ri), る/ル (ru), れ/レ (re), ろ/ロ (ro)
10. **Linha W:** わ/ワ (wa), を/ヲ (wo)
11. **Caractere Final:** ん/ン (n)

Cada caractere possui:
- Caractere japonês em fonte de alta legibilidade (`Noto Sans JP`).
- Romanização oficial (Romaji).
- Pronúncia aproximada para falantes de português brasileiro.
- Família fonética correspondente.
- Dica mnemônica ilustrada para fixação na memória.
- Áudio de pronúncia falada nativa.

---

## 🎮 Funcionalidades Principais

### 1. Dashboard Inicial
- Apresentação visual e didática.
- Métricas da sessão atual e históricas (caracteres estudados de 0 a 92, pontuação, aproveitamento geral).
- Acesso rápido aos alfabetos e às 5 modalidades de exercícios.
- Guia fonético com dicas preciosas para brasileiros.

### 2. Área de Aprendizado (Hiragana & Katakana)
- **Tabela Gojūon (五十音):** Matriz clássica 5x10 com cabeçalho de vogais, células interativas e scroll horizontal em dispositivos móveis.
- **Grade de Cards:** Agrupada por famílias de consoantes com descrições didáticas.
- **Modo Flashcards:** Cartões 3D interativos com mecanismo de flip (frente/verso), áudio, botões de avanço e botão "Já Aprendi!".
- **Modal de Estudo Detalhado:** Estudo individual de cada caractere com navegação sequencial por setas do teclado e tecla Espaço para ouvir pronúncia.

### 3. As 5 Modalidades de Exercícios
- **Exercício 1 (Reconhecimento):** Caractere japonês com 4 alternativas em Romaji e atalhos numéricos (`1`, `2`, `3`, `4`).
- **Exercício 2 (Digitação):** Campo de digitação com foco automático, aceita `Enter` e valida com tolerâncias fonéticas (ex.: `shi`/`si`, `tsu`/`tu`).
- **Exercício 3 (Conversão):** Conversão de Romaji para Kana com apoio de vocabulário ilustrativo.
- **Exercício 4 (Identificação de Alfabeto):** Classificação rápida entre Hiragana ou Katakana.
- **Exercício 5 (Revisão Aleatória):** Maratona mista combinando formatos para retenção profunda.

### 4. Sistema de Avaliação
- Feedback imediato de acerto ou erro com explicação pedagógica e avanço por `Enter`.
- Tela de resultado ao finalizar a sessão com pontuação, acertos, erros, percentual (%) e gabarito completo.
- Botão "Revisar Somente os Erros" gerado dinamicamente para sanar falhas imediatas.

### 5. Sistema de Revisão Inteligente
- Identifica e isola os caracteres que o usuário errou nos exercícios.
- Ranqueamento por frequência de erro.
- Botão de prática imediata focado nos caracteres com dificuldade.
- Histórico completo de sessões salvo localmente em `LocalStorage`.

---

## 🛠️ Como Executar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Executar a suíte de testes automatizada (34 testes)
npm test

# 4. Gerar build de produção
npm run build
```

---

## 📲 Instalação como App no Celular (PWA)

O aplicativo foi desenvolvido como um **Progressive Web App (PWA)**. Você pode "instalá-lo" diretamente no seu celular sem precisar baixar nada da App Store ou Play Store. Ele se comportará como um **aplicativo nativo**: ganha ícone próprio na tela inicial e abre em **tela cheia** (sem a barra de endereços do navegador).

### 🍏 No iPhone (iOS)
> **Importante:** No iOS, o recurso de atalho como app nativo deve ser feito pelo **Safari**.

1. Acesse o site do projeto pelo navegador **Safari**.
2. Toque no botão de **Compartilhar** (ícone do quadrado com a seta apontando para cima `⎋` na barra inferior).
3. Role as opções para baixo e toque em **"Adicionar à Tela de Início"** (*Add to Home Screen*).
4. O app já virá identificado como **Japonezando** com o ícone oficial `あ`. Toque em **Adicionar** no canto superior direito.
5. Pronto! O ícone estará na tela inicial do seu iPhone e abrirá em tela cheia com adaptação para o Notch/Dynamic Island e barra de gestos do iOS.

### 🤖 No Celular Android
No Android, o PWA funciona na maioria dos navegadores (Google Chrome, Samsung Internet, Edge, Opera, etc.):

- **Instalação Automática:** Ao entrar no site pelo Chrome, o próprio navegador costuma exibir um banner no rodapé: *"Instalar aplicativo"* ou *"Adicionar Japonezando à tela inicial"*. Basta tocar em **Instalar**.
- **Instalação Manual:**
  1. Abra o site no **Google Chrome** (ou navegador de preferência).
  2. Toque no menu de **três pontinhos (⋮)** no canto superior direito.
  3. Selecione a opção **"Instalar aplicativo"** (ou *"Adicionar à tela inicial"*).
  4. Confirme tocando em **"Instalar"**.
  5. O aplicativo será adicionado tanto à sua **tela de início** quanto à sua **gaveta de aplicativos** do Android.

---

## 📱 Responsividade e Acessibilidade
- **Desktop:** Navegação superior fluida com indicadores e atalhos completos.
- **Mobile (Smartphones e Tablets):** Menu gaveta e **Bottom Navigation Bar** fixa no rodapé estilo aplicativo móvel nativo, facilitando o uso com uma só mão.
