# NihonGo! (Japonezando) • Plataforma de Aprendizado da Língua Japonesa

Aplicativo web moderno, intuitivo, responsivo e 100% em português brasileiro (PT-BR) projetado para o aprendizado completo da língua japonesa: **Hiragana**, **Katakana**, **Kanjis essenciais**, **Vocabulário contextual**, **Gramática & Partículas**, **Diálogos conversacionais**, **Leituras Graduadas (Tadoku)** e um **Estúdio de Escrita/Caligrafia interativo**.

Desenvolvido sob a arquitetura **Offline-First com sincronização em nuvem (Supabase)**: funciona perfeitamente sem conexão direto no navegador do estudante, salvando o progresso localmente no `LocalStorage` e sincronizando automaticamente na nuvem quando conectado.

---

## 🚀 Tecnologias Utilizadas

- **React 19:** Componentização reativa, moderna e de alta performance.
- **TypeScript:** Tipagem estrita de ponta a ponta sem uso de `any`.
- **Tailwind CSS v3:** Interface elegante, minimalista, com suporte a Dark/Light Mode e 100% responsiva (Desktop, Tablets, Android e iOS).
- **Vite 8:** Ferramenta de build ultrarrápida e otimizada.
- **Supabase (`@supabase/supabase-js`):** Autenticação (Login, Cadastro e Recuperação de Senha) e sincronização de progresso do usuário em nuvem (Cloud Sync).
- **WanaKana (`wanakana`):** Manipulação, validação e conversão inteligente de caracteres japoneses (Romaji ⇄ Kana).
- **Web Speech API:** Síntese de voz nativa japonesa (`ja-JP`) para pronúncia em áudio offline de kanas, vocabulário e diálogos.
- **HTML5 Canvas API:** Motor de desenho interativo para prática de caligrafia e reconhecimento de traçado.
- **PWA (Progressive Web App):** Suporte nativo para instalação em dispositivos móveis (iOS e Android), Service Workers com Workbox, ícones em alta resolução e modo *Standalone* (tela cheia sem barra do navegador).
- **Lucide React:** Ícones modernos, minimalistas e acessíveis.
- **Oxlint & TSX:** Linting de alta velocidade e suíte de validação de testes automatizados.

---

## 📚 Escopo Pedagógico Completo

### 1. Alfabetos Fonéticos: Hiragana & Katakana
Abrange todo o sistema fonético com mais de 200 variações e combinações:
- **Gojūon (46 básicos cada):** Todas as linhas (Vogais, K, S, T, N, H, M, Y, R, W e o caractere final N).
- **Dakuon & Handakuon (25 modificados cada):** Linhas G, Z, D, B (Tenten `゛`) e Linha P (Handakuten `゜`).
- **Combinações Yōon (ようおん - 33 cada):** Sons contraídos formados pela junção com pequenos ya, yu, yo (ex: きゃ, しゅ, ちょ / キャ, シュ, チョ).
- **Pausa Fonética Sokuon (っ / ッ):** Regras de corte e duplicação consonantal com exemplos práticos.
- **Sons Especiais do Katakana Moderno (Gairaigo):** Mapeamento de sons ocidentais modernos como ヴ (vu), ファ (fa), ウィ (wi), シェ (she), ティ (ti), etc.
- Cada caractere inclui: visualização em fonte `Noto Sans JP`, romanização oficial (Romaji), pronúncia aproximada para brasileiros, família fonética, mnemônicos ilustrados e áudio nativo.

### 2. Kanjis Essenciais (N5 & Fundamentais)
- **Metodologia de Decomposição:** Estudo dos ideogramas divididos em seus radicais fundamentais (*bushu*), permitindo compreender a lógica de formação dos caracteres como "blocos de LEGO".
- **Leituras Oficiais:** Apresentação clara de *On'yomi* (leitura chinesa) e *Kun'yomi* (leitura japonesa).
- **Contagem e Guia de Traços:** Quantidade de traços (*kakusuu*) e ordem recomendada de escrita.
- **Filosofia Anki & Vocabulário em Contexto:** Seguindo os princípios de materiais didáticos conceituados (como TUFS e Luiz Rafael), os kanjis são aprendidos associados a palavras reais e frases de exemplo com suporte a *Furigana* interativo.

### 3. Banco de Palavras & Vocabulário
- Catálogo de centenas de vocábulos essenciais organizados por categorias:
  - *Saudações & Cortesia* (inclui **Bom dia** [*Ohayou gozaimasu*], **Boa noite ao se encontrar** [*Konbanwa*], **Boa noite ao dormir/despedida** [*Oyasuminasai*], **Olá/Boa tarde** [*Konnichiwa*], *Arigatou*, *Hajimemashite*, *Sumimasen*, etc.)
  - *Pessoas, Família & Pronomes*
  - *Escola, Cidade & Lugares*
  - *Comida & Bebida*
  - *Natureza, Clima & Tempo*
  - *Verbos Essenciais*
  - *Adjetivos & Qualidades*
  - *Sistema Demonstrativo (Ko-So-A-Do)*
  - *Katakana Moderno & Palavras Estrangeiras (Gairaigo)*
- Cada palavra conta com kanji original, leitura em kana, áudio nativo, tradução PT-BR, frase de exemplo com furigana segmentado, notas de uso, marcação de aprendida e lista de favoritos.
- **Quizzes e Flashcards de Vocabulário:** Modos dedicados para testar fixação rápida e memorização ativa.

### 4. Gramática, Partículas & Conjugação
- **Guia Interativo de Partículas Japonesas:** As 12 partículas fundamentais explicadas sob a ótica do raciocínio japonês:
  - は (*wa* - tópico), が (*ga* - sujeito/foco), を (*wo* - objeto direto), の (*no* - posse/ligação), に (*ni* - direção/tempo/alvo), で (*de* - meio/local de ação), へ (*he* - direção do movimento), と (*to* - companhia/enumeração fechada), や (*ya* - enumeração aberta), も (*mo* - inclusão "também"), から (*kara* - origem/ponto de partida) e まで (*made* - destino/limite).
  - Inclui Quiz de "preencher a lacuna" (*Fill-in-the-blank*) para testar a aplicação correta em frases reais.
- **Visualizador do Sistema Demonstrativo Ko-So-A-Do:**
  - Demonstração gráfica interativa da relação de proximidade espacial entre interlocutores:
    - **Ko (此):** Próximo do falante (*kore, kono, koko, kochira*).
    - **So (其):** Próximo do ouvinte (*sore, sono, soko, sochira*).
    - **A (彼):** Distante de ambos (*are, ano, asoko, achira*).
    - **Do (何):** Indagação/Dúvida (*dore, dono, doko, dochira*).
- **Conjugador Interativo de Verbos e Adjetivos:**
  - **Verbos:** Classificação visual dos 3 Grupos verbais (Grupo 1 - Godan, Grupo 2 - Ichidan, Grupo 3 - Irregulares: *suru* e *kuru*) com conjugação em 7 formas canônicas: Dicionário, Forma Masu, Masen, Mashita, Forma Nai, Forma Ta e Forma Te.
  - **Adjetivos:** Flexão dos adjetivos do Tipo-i (*i-keiyoushi*) e Tipo-na (*na-keiyoushi*), abrangendo afirmativo, negativo, passado e passado-negativo (incluindo exceções como *ii/yoi* e adjetivos enganosos como *kirei*).

### 5. Diálogos Conversacionais
- Roteiros conversacionais contextualizados (ex: diálogo clássico de apresentação pessoal *Hajimemashite* entre Sakura e Takeshi).
- Reprodução de áudio fala a fala com vozes alternadas (masculina/feminina via Web Speech API).
- Balões interativos com alternância de Furigana, Romaji e Tradução em português.
- Quiz de compreensão auditiva e interpretação no final do diálogo.

### 6. Leituras Graduadas Tadoku (Tadoku Graded Readers)
- Leitor imersivo de contos e fábulas japonesas adaptadas (Nível 0 - Iniciante N5, como *"A Raposa e o Grou"* / キツネとツル).
- Páginas ilustradas originais em alta resolução.
- Áudio nativo gravado página por página com player integrado.
- Texto japonês com suporte inteligente a Furigana (leituras em kanas acima de cada kanji), tradução linha a linha e glossário de termos específicos da página.

### 7. Estúdio de Escrita & Caligrafia (Writing Studio)
- Canvas interativo de desenho para treino de caligrafia em Hiragana, Katakana e Kanji.
- Grid tradicional japonês quadriculado com guias de centro e proporção.
- Opção de exibir/ocultar a "marca-d'água" do caractere guia para desenhar de memória.
- Contador de traços (*strokes*) e algoritmo de avaliação de preenchimento e precisão do desenho.
- Suporte total a toque na tela em dispositivos móveis (Touch/Stylus) e mouse no Desktop.

---

## 🎮 Modalidades de Exercícios & Revisão

### As 5 Modalidades de Exercícios de Kana
1. **Reconhecimento:** Caractere em destaque com 4 alternativas em Romaji e atalhos de teclado (`1`, `2`, `3`, `4`).
2. **Digitação com WanaKana:** Entrada de texto com foco automático, suporte a tecla `Enter` e tolerância a convenções fonéticas PT-BR (ex: `shi`/`si`, `tsu`/`tu`, `chi`/`ti`, `fu`/`hu`).
3. **Conversão (Romaji ➔ Kana):** Identificação do caractere correspondente a partir de pistas sonoras e palavras de apoio.
4. **Identificação de Alfabeto:** Desafio rápido para distinguir visualmente se o caractere pertence ao Hiragana ou Katakana.
5. **Revisão Aleatória Mista:** Maratona combinando todos os formatos dinamicamente.

### Sistema de Avaliação & Revisão Inteligente
- Feedback imediato de acertos e erros com explicações pedagógicas.
- Relatório de conclusão de sessão com métricas de acertos, pontuação e gabarito detalhado.
- **Revisão de Erros Automática:** O sistema isola os caracteres errados e permite iniciar uma sessão direcionada apenas para sanar as dificuldades detectadas.
- Possibilidade de treinar apenas os caracteres que o usuário já marcou como "estudados" ou focar em grupos específicos.

---

## 🏆 Gamificação, UX & Sincronização

- **Ofensivas Diárias (Streaks):** Rastreador de dias consecutivos de estudo com widget na tela inicial e contagem de recorde pessoal (*max streak*).
- **Flashcards 3D:** Cartões interativos com animação de flip tridimensional (frente com kanji/kana e verso com leitura, áudio e significado).
- **Tema Escuro & Claro (Dark/Light Mode):** Paleta moderna com fundo grafite azulado (#0b0f19) e superfície (#131b2e) para máximo conforto visual em sessões noturnas, sem piscar de tela (anti-FOUC).
- **Nuvem & Offline-First:**
  - Login seguro com Supabase Auth (E-mail/Senha).
  - Recuperação de senha integrada com fluxo protegido.
  - Sincronização automática de progresso na nuvem (`user_learning_state`).
  - Funcionamento ininterrupto mesmo sem internet, salvando no navegador do usuário e subindo alterações assim que a conexão estiver estável.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior.
- Gerenciador de pacotes `npm`.

### 1. Clonar o Repositório e Instalar Dependências
```bash
git clone <URL_DO_REPOSITORIO>
cd app-japones
npm install
```

### 2. Configurar Variáveis de Ambiente (Opcional)
O projeto já conta com credenciais de demonstração e fallback seguro caso nenhuma variável seja fornecida. Para apontar para o seu próprio projeto Supabase, copie o arquivo de exemplo:
```bash
cp .env.example .env
```
Edite `.env`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
O servidor estará disponível por padrão em `http://localhost:5173`.

### 4. Executar os Testes Automatizados (172 Testes)
```bash
npm test
```
Executa a suíte completa de validação cobrindo alfabetos, WanaKana, geradores de exercícios, gramática, diálogos, kanjis, leituras Tadoku, estúdio de escrita, vocabulário (saudações, bom dia, boa noite), autenticação e sincronização.

Para validar o sistema de temas (Dark/Light):
```bash
npx tsx scripts/test-theme.ts
```

### 5. Checagem de Código (Lint) & Build de Produção
```bash
# Análise estática com Oxlint
npm run lint

# Geração de build otimizado para produção
npm run build

# Pré-visualização local do build
npm run preview
```

---

## 📲 Instalação como App no Celular (PWA)

O aplicativo foi desenvolvido como um **Progressive Web App (PWA)** com suporte completo para uso como aplicativo nativo (em tela cheia, sem barra de navegação e com ícone exclusivo na tela inicial).

### 🍏 No iPhone (iOS)
> **Importante:** No iOS, utilize o navegador **Safari** para habilitar o modo PWA nativo:

1. Abra o site no **Safari**.
2. Toque no botão de **Compartilhar** (ícone do quadrado com a seta apontando para cima `⎋` na barra inferior).
3. Role para baixo e selecione **"Adicionar à Tela de Início"** (*Add to Home Screen*).
4. O app será identificado como **Japonezando** com o ícone oficial `あ`. Toque em **Adicionar** no canto superior direito.
5. Pronto! O aplicativo será aberto em tela cheia com adaptação total ao Notch/Dynamic Island e área segura de gestos do iOS.

### 🤖 No Celular Android
Funciona nos principais navegadores (Google Chrome, Samsung Internet, Edge, Opera):
- **Instalação Automática:** Ao acessar pelo Chrome, toque no banner inferior *"Instalar aplicativo"* ou *"Adicionar Japonezando à tela inicial"*.
- **Instalação Manual:**
  1. Toque no menu de **três pontinhos (⋮)** no canto superior direito.
  2. Selecione a opção **"Instalar aplicativo"** (ou *"Adicionar à tela inicial"*).
  3. Confirme em **"Instalar"**. O app estará disponível na tela inicial e na gaveta de aplicativos.

---

## 📁 Estrutura do Projeto

```text
app-japones/
├── materials/                 # Apostilas, referências pedagógicas e planos de implementação
├── public/                    # Assets estáticos, áudios e ilustrações das histórias Tadoku
├── scripts/
│   ├── test-validation.ts     # Suíte com 169 testes automatizados de regras pedagógicas e de negócio
│   └── test-theme.ts          # Validador de temas Dark/Light e anti-FOUC
├── src/
│   ├── assets/                # Imagens e vetores gráficos da aplicação
│   ├── components/
│   │   ├── auth/              # Modais de login, cadastro e redefinição de senha
│   │   ├── common/            # Navbar, ThemeToggle, UserMenu, ProgressBar, FuriganaText
│   │   ├── dashboard/         # Visão geral, estatísticas, ofensiva (StreakWidget) e atalhos rápidos
│   │   ├── grammar/           # Guia interativo de partículas e conjugador de verbos/adjetivos
│   │   ├── kanji/             # Cards de kanji, detalhe modal, explorador de radicais e flashcards
│   │   ├── phrases/           # Módulos de frases, diálogos conversacionais e sistema Ko-So-A-Do
│   │   ├── practice/          # Contêiner dos 5 tipos de exercícios e tela de resultados
│   │   ├── review/            # Módulo de revisão inteligente com foco nos erros cometidos
│   │   ├── stories/           # Leitor de contos graduados Tadoku (Graded Readers)
│   │   ├── study/             # Tabelas Gojūon, cards e flashcards 3D de Hiragana e Katakana
│   │   ├── vocabulary/        # Banco de palavras, categorias, flashcards e quiz de vocabulário
│   │   └── writing/           # Canvas interativo de caligrafia e prática de traçado
│   ├── contexts/              # Contextos globais (AuthContext, ThemeContext)
│   ├── data/                  # Datasets de kanas, kanjis, vocabulário, histórias, gramática e diálogos
│   ├── hooks/                 # Hooks customizados (useAuth, useAudio, useTheme, useLearningProgress)
│   ├── services/              # Serviços de áudio, armazenamento, WanaKana, sincronização Supabase e streak
│   ├── types/                 # Definições de tipos TypeScript
│   ├── App.tsx                # Roteamento e orquestrador principal de visualizações
│   └── main.tsx               # Ponto de entrada React com provedores de tema e autenticação
├── tailwind.config.js         # Configurações de cores, fontes japonesas e responsividade
└── vite.config.ts             # Configuração do Vite, React plugin e PWA com Workbox
```

---

## 📄 Licença e Uso

Este projeto foi desenvolvido para fins educacionais e estudo prático da língua japonesa para a comunidade lusófona. Sinta-se à vontade para estudar, sugerir melhorias e expandir as lições!
