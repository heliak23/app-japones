import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Type, 
  X,
  VolumeX,
  Compass
} from 'lucide-react';
import { TADOKU_STORIES } from '../../data/tadokuStories';
import type { TadokuStory, TadokuPage } from '../../types/story';
import { FuriganaText } from '../common/FuriganaText';
import { audioService } from '../../services/audioService';

interface TadokuReaderViewProps {
  onNavigateHome?: () => void;
}

export const TadokuReaderView: React.FC<TadokuReaderViewProps> = () => {
  const [selectedStory, setSelectedStory] = useState<TadokuStory | null>(TADOKU_STORIES[0]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
  const [showGoldenRulesModal, setShowGoldenRulesModal] = useState<boolean>(false);

  // Controles de leitura
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [showRomaji, setShowRomaji] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isStoryFinished, setIsStoryFinished] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPage: TadokuPage | undefined = selectedStory?.pages[currentPageIndex];
  const totalPages = selectedStory?.pages.length ?? 0;

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
  }, []);

  const goToNextPage = useCallback(() => {
    stopCurrentAudio();
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      setIsStoryFinished(true);
    }
  }, [currentPageIndex, totalPages, stopCurrentAudio]);

  const goToPrevPage = useCallback(() => {
    stopCurrentAudio();
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setIsStoryFinished(false);
    }
  }, [currentPageIndex, stopCurrentAudio]);

  const playPageAudio = useCallback(async () => {
    if (!currentPage) return;

    if (isPlayingAudio) {
      stopCurrentAudio();
      return;
    }

    setIsPlayingAudio(true);

    if (currentPage.audioUrl) {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = currentPage.audioUrl;
        audioRef.current.playbackRate = audioSpeed;
        audioRef.current.onended = () => setIsPlayingAudio(false);
        audioRef.current.onerror = async () => {
          // Fallback para Web Speech API se o arquivo falhar
          await audioService.speak(currentPage.rawJapanese, audioSpeed);
          setIsPlayingAudio(false);
        };
        await audioRef.current.play();
        return;
      } catch (err) {
        console.warn('Erro ao tocar áudio em arquivo:', err);
      }
    }

    await audioService.speak(currentPage.rawJapanese, audioSpeed);
    setIsPlayingAudio(false);
  }, [currentPage, isPlayingAudio, audioSpeed, stopCurrentAudio]);

  const startReading = (story: TadokuStory) => {
    stopCurrentAudio();
    setSelectedStory(story);
    setCurrentPageIndex(0);
    setIsStoryFinished(false);
    setIsReadingMode(true);
  };

  const exitReading = () => {
    stopCurrentAudio();
    setIsReadingMode(false);
  };

  // Suporte a teclas de atalho de seta para navegar páginas
  useEffect(() => {
    if (!isReadingMode || isStoryFinished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        playPageAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReadingMode, isStoryFinished, goToNextPage, goToPrevPage, playPageAudio]);

  // Limpa áudio no unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. TELA DA BIBLIOTECA (CATÁLOGO) */}
      {!isReadingMode && (
        <div className="space-y-6">
          {/* Hero Banner Tadoku */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl shadow-emerald-500/10">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-100 border border-white/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Metodologia Japonesa Tadoku (多読)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Biblioteca de Leituras Graduadas
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                Aprenda a ler japonês naturalmente através de histórias ilustradas, sem travar no dicionário. Desenvolva intuição real sobre gramática e vocabulário!
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowGoldenRulesModal(true)}
                  className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>As 4 Regras de Ouro do Tadoku</span>
                </button>
              </div>
            </div>
            
            {/* Decoração Visual de Fundo */}
            <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none text-9xl font-jp select-none font-black text-white">
              多読
            </div>
          </div>

          {/* Grid de Livros / Histórias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span>Histórias Disponíveis</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                1 de 1 história pronta
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TADOKU_STORIES.map((story) => (
                <div
                  key={story.id}
                  className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Capa com Proporção de Livro */}
                  <div className="relative aspect-[4/3] bg-emerald-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider shadow">
                      {story.level}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-xs font-semibold shadow">
                      {story.pages.length} páginas
                    </div>
                  </div>

                  {/* Informações da História */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {story.titleJapanese}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {story.synopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {story.author}
                      </div>
                      <button
                        onClick={() => startReading(story)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Ler Agora</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Card Placeholder "Mais histórias em breve" */}
              <div className="bg-slate-50 dark:bg-[#0f172a]/60 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    Novas Histórias em Breve!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Estamos preparando mais contos clássicos e lendas folclóricas japonesas adaptadas nos níveis N5 e N4.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LEITOR DE HISTÓRIAS EM TELA CHEIA */}
      {isReadingMode && selectedStory && currentPage && (
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Barra de Controle Superior do Leitor */}
          <div className="bg-white dark:bg-[#131b2e] rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={exitReading}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Voltar à Biblioteca"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Biblioteca</span>
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-none">
                {selectedStory.title}
              </span>
            </div>

            {/* Alternadores Didáticos (Furigana, Tradução, Romaji, Áudio) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Alternador de Furigana */}
              <button
                onClick={() => setShowFurigana(!showFurigana)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showFurigana
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/80'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Mostrar ou ocultar leituras em Hiragana (Furigana)"
              >
                <Type className="w-3.5 h-3.5" />
                <span>Furigana</span>
              </button>

              {/* Alternador de Tradução */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showTranslation
                    ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-300/80 dark:border-brand-700/80'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Mostrar ou ocultar tradução em português"
              >
                {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Tradução</span>
              </button>

              {/* Alternador de Romaji */}
              <button
                onClick={() => setShowRomaji(!showRomaji)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  showRomaji
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/80'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Ativar pronúncia em alfabeto ocidental (Romaji)"
              >
                Romaji
              </button>

              {/* Alternador de Velocidade Áudio */}
              <button
                onClick={() => setAudioSpeed(prev => prev === 0.9 ? 0.75 : 0.9)}
                className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Alternar velocidade da narração"
              >
                {audioSpeed}x
              </button>
            </div>
          </div>

          {/* Barra de Progresso de Leitura */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentPageIndex + 1) / totalPages) * 100}%` }}
            />
          </div>

          {/* Livro / Página Principal */}
          {!isStoryFinished ? (
            <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              
              {/* Ilustração Principal da Cena */}
              <div className="w-full max-h-[380px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 border-b border-slate-100 dark:border-slate-800/80">
                <img
                  src={currentPage.image}
                  alt={`Cena da página ${currentPage.pageNumber}`}
                  className="max-h-[340px] w-auto object-contain rounded-2xl shadow-sm transition-transform duration-200"
                />
              </div>

              {/* Área do Texto & Áudio */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Botão de Narração / Play */}
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Página {currentPage.pageNumber} de {totalPages}
                  </div>

                  <button
                    onClick={playPageAudio}
                    className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all ${
                      isPlayingAudio
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-105'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Pausar Áudio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>Ouvir em Japonês</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Linhas da História com Furigana e Tradução */}
                <div className="space-y-4">
                  {currentPage.lines.map((line, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors"
                    >
                      {/* Texto Japonês com Furigana */}
                      <div className="text-left">
                        <FuriganaText
                          fragments={line.fragments}
                          showFurigana={showFurigana}
                          size="xl"
                        />
                      </div>

                      {/* Romaji Auxiliar */}
                      {showRomaji && (
                        <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 italic">
                          {line.romaji}
                        </div>
                      )}

                      {/* Tradução Português */}
                      {showTranslation && (
                        <div className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                          {line.translation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Card de Apoio Didático: Vocabulário & Ponto Gramatical */}
                {(currentPage.vocabularyNotes || currentPage.grammarTip) && (
                  <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4" />
                      <span>💡 Entenda os Detalhes da Cena</span>
                    </div>

                    {currentPage.vocabularyNotes && currentPage.vocabularyNotes.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {currentPage.vocabularyNotes.map((vocab, vIdx) => (
                          <div key={vIdx} className="bg-white/80 dark:bg-slate-900/70 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-800/40">
                            <span className="font-bold text-slate-900 dark:text-white font-jp text-sm mr-1.5">
                              {vocab.word}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mr-1.5">
                              ({vocab.reading})
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              : {vocab.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentPage.grammarTip && (
                      <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-100/60 dark:bg-amber-950/50 p-3 rounded-xl border border-amber-300/50 dark:border-amber-800/60">
                        <strong className="font-bold font-jp">{currentPage.grammarTip.pattern}: </strong>
                        <span>{currentPage.grammarTip.explanation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Controles de Navegação (Anterior / Próximo) */}
              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPageIndex === 0}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    currentPageIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Página Anterior</span>
                </button>

                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                  Dica: Você também pode usar as setas do teclado (← e →)
                </div>

                <button
                  onClick={goToNextPage}
                  className="px-5 sm:px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>{currentPageIndex === totalPages - 1 ? 'Concluir História' : 'Próxima Página'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* 3. TELA DE PARABÉNS AO TERMINAR O LIVRO */
            <div className="bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-xl animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  おめでとう！ Parabéns!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Você acabou de ler uma história inteira em japonês pelo método <strong>Tadoku</strong>!
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 max-w-md mx-auto text-left space-y-2 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                <p className="font-bold">✨ O que você praticou nesta leitura:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Forma de convite amigável (<code>～ませんか</code>)</li>
                  <li>Forma propositiva de ação em conjunto (<code>～ましょう</code>)</li>
                  <li>Localização espacial (<code>の上にお皿があります</code>, <code>壺の中に肉があります</code>)</li>
                  <li>Leitura sem pausas e compreensão contextual natural</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setCurrentPageIndex(0);
                    setIsStoryFinished(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ler Novamente</span>
                </button>

                <button
                  onClick={exitReading}
                  className="px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Voltar à Biblioteca</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MODAL: AS 4 REGRAS DE OURO DO TADOKU */}
      {showGoldenRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#131b2e] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowGoldenRulesModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Metodologia NPO Tadoku</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                As 4 Regras de Ouro da Leitura Extensiva
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tadoku (多読) significa "ler muito". A melhor maneira de aprender japonês é ler materiais que você compreenda sem esforço, seguindo estas 4 diretrizes:
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Comece do nível mais fácil (やさしいレベルから読む)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Não tenha pressa. Histórias simples com ilustrações constroem confiança e fixam os padrões do idioma no cérebro.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Leia sem usar dicionário (辞書を引かないで読む)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Descubra o significado pelas ilustrações e pelo enredo. Parar a cada palavra quebra o prazer da leitura.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pule partes difíceis sem travar (わからないところは、とばして読む)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Não entendeu um termo? Continue lendo! O contexto das frases seguintes costuma esclarecer a mensagem.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Se empacar, troque de livro (進まなくなったら、他の本を読む)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    A leitura em japonês deve ser divertida e envolvente. Nunca force a leitura de algo frustrante.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGoldenRulesModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors"
            >
              Entendido! Vamos Ler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
