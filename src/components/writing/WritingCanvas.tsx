import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  Eye,
  Grid,
  Sparkles,
  Palette,
  Undo2,
  Award,
} from 'lucide-react';
import type { WritingCharacterType } from '../../types/writing';
import { WritingStorageService } from '../../services/writingStorageService';

interface Point {
  x: number;
  y: number;
}

type Stroke = Point[];

interface WritingCanvasProps {
  character: string;
  characterId: string;
  type: WritingCharacterType;
  subtitle?: string;
  onComplete?: (score: number) => void;
  className?: string;
}

const BRUSH_SIZES = [
  { label: 'Fino', size: 5 },
  { label: 'Médio', size: 9 },
  { label: 'Pincel', size: 15 },
];

const INK_COLORS = [
  { id: 'sumi', label: 'Tinta Sumi-e', lightColor: '#0f172a', darkColor: '#f1f5f9' },
  { id: 'blue', label: 'Azul Caneta', lightColor: '#1d4ed8', darkColor: '#60a5fa' },
  { id: 'red', label: 'Vermelho Sensei', lightColor: '#dc2626', darkColor: '#f87171' },
  { id: 'green', label: 'Verde Matcha', lightColor: '#047857', darkColor: '#34d399' },
];

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  character,
  characterId,
  type,
  subtitle,
  onComplete,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Estados de desenho
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Configurações do traço e guia
  const [brushSize, setBrushSize] = useState<number>(9);
  const [inkColorIndex, setInkColorIndex] = useState<number>(0);
  const [guideOpacity, setGuideOpacity] = useState<number>(0.16); // Opacidade bem fraca por padrão (~16%)
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Avaliação e feedback
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    feedback: string;
    showCelebration: boolean;
  } | null>(null);

  // Reseta traços e avaliação quando o caractere muda
  const [prevId, setPrevId] = useState(characterId);
  if (prevId !== characterId) {
    setPrevId(characterId);
    setStrokes([]);
    setCurrentStroke([]);
    setEvaluationResult(null);
  }

  // Redesenha todos os traços no canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = document.documentElement.classList.contains('dark');
    const activeColor = isDark
      ? INK_COLORS[inkColorIndex].darkColor
      : INK_COLORS[inkColorIndex].lightColor;

    ctx.strokeStyle = activeColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allStrokes = currentStroke.length > 0 ? [...strokes, currentStroke] : strokes;

    allStrokes.forEach((stroke) => {
      if (stroke.length === 0) return;

      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = activeColor;
        ctx.fill();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);

      for (let i = 1; i < stroke.length - 1; i++) {
        const xc = (stroke[i].x + stroke[i + 1].x) / 2;
        const yc = (stroke[i].y + stroke[i + 1].y) / 2;
        ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, xc, yc);
      }

      if (stroke.length > 1) {
        const last = stroke[stroke.length - 1];
        const prev = stroke[stroke.length - 2];
        ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y);
      }

      ctx.stroke();
    });
  }, [strokes, currentStroke, brushSize, inkColorIndex]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Função auxiliar para obter coordenadas do ponteiro no canvas
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Handlers de ponteiro (suporta Mouse, Touch e Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const point = getCanvasPoint(e);
    setIsDrawing(true);
    setCurrentStroke([point]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    setCurrentStroke((prev) => [...prev, point]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignora erro se ponteiro já foi liberado
    }
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
  };

  const handlePointerCancel = () => {
    setIsDrawing(false);
    setCurrentStroke([]);
  };

  // Desfazer último traço
  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
    setEvaluationResult(null);
  };

  // Limpar todo o desenho
  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setEvaluationResult(null);
  };

  // Algoritmo de Avaliação do Traçado (Sobreposição de Pixels)
  const handleEvaluate = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Cria canvas temporário para rasterizar o caractere de referência
    const refCanvas = document.createElement('canvas');
    refCanvas.width = width;
    refCanvas.height = height;
    const refCtx = refCanvas.getContext('2d');
    if (!refCtx) return;

    refCtx.clearRect(0, 0, width, height);
    refCtx.fillStyle = '#000000';
    // Utiliza tamanho de fonte proporcional ao canvas com peso normal para traços nítidos e legíveis
    const fontSize = Math.round(width * 0.65);
    refCtx.font = `400 ${fontSize}px "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif`;
    refCtx.textAlign = 'center';
    refCtx.textBaseline = 'middle';
    refCtx.fillText(character, width / 2, height / 2 + fontSize * 0.04);

    const refData = refCtx.getImageData(0, 0, width, height).data;

    // 2. Obtém dados do desenho do usuário
    const userCtx = canvas.getContext('2d');
    if (!userCtx) return;
    const userData = userCtx.getImageData(0, 0, width, height).data;

    // 3. Compara cobertura de pixels
    let refPixelCount = 0;
    let coveredCount = 0;
    let strayCount = 0;

    // Amostragem em grade de 3px para alta performance
    const step = 3;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        const refAlpha = refData[idx + 3];
        const userAlpha = userData[idx + 3];

        const isRef = refAlpha > 40;
        const isUser = userAlpha > 40;

        if (isRef) {
          refPixelCount++;
          if (isUser) {
            coveredCount++;
          }
        } else if (isUser) {
          strayCount++;
        }
      }
    }

    if (refPixelCount === 0) return;

    // Taxa de cobertura do caractere base
    const coverage = coveredCount / refPixelCount;
    // Penalidade para traços muito fora do caractere
    const strayPenalty = Math.min(0.35, (strayCount / refPixelCount) * 0.25);
    
    // Pontuação balanceada pedagógica
    let calculatedScore = Math.round(Math.max(15, Math.min(100, (coverage - strayPenalty) * 125)));

    // Se o usuário cobriu mais de 70%, garantimos nota excelente
    if (coverage > 0.65 && strayPenalty < 0.15) {
      calculatedScore = Math.max(calculatedScore, 90);
    }

    let feedbackMsg = '';
    if (calculatedScore >= 85) {
      feedbackMsg = 'Excelente traçado! Formato elegante e proporções ideais.';
    } else if (calculatedScore >= 65) {
      feedbackMsg = 'Muito bom! Seu traço seguiu bem a forma do caractere.';
    } else {
      feedbackMsg = 'Bom começo! Tente cobrir todos os traços do caractere com mais calma.';
    }

    setEvaluationResult({
      score: calculatedScore,
      feedback: feedbackMsg,
      showCelebration: calculatedScore >= 70,
    });

    // Salva progresso no serviço
    WritingStorageService.recordPractice(characterId, character, type, calculatedScore);

    if (onComplete) {
      onComplete(calculatedScore);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Barra de Ferramentas Superior (Espessura do Pincel, Cores de Tinta e Opacidade da Guia) */}
      <div className="w-full max-w-md mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm text-xs">
        {/* Seletor de Espessura do Pincel */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
            Pincel:
          </span>
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.size}
              onClick={() => setBrushSize(b.size)}
              className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                brushSize === b.size
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              title={`Pincel ${b.label}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Cores de Tinta */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-0.5 hidden sm:inline">
            <Palette className="w-3.5 h-3.5 inline" />
          </span>
          {INK_COLORS.map((ink, idx) => (
            <button
              key={ink.id}
              onClick={() => setInkColorIndex(idx)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                inkColorIndex === idx ? 'scale-110 border-brand-500 ring-2 ring-brand-400/30' : 'border-transparent'
              }`}
              style={{
                backgroundColor:
                  document.documentElement.classList.contains('dark') ? ink.darkColor : ink.lightColor,
              }}
              title={ink.label}
            />
          ))}
        </div>

        {/* Alternador de Grade Tradicional 田 */}
        <button
          onClick={() => setShowGrid((prev) => !prev)}
          className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
            showGrid
              ? 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-300/60 dark:border-brand-800'
              : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
          title="Alternar grade de caligrafia (Genkouyoushi)"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Grade</span>
        </button>
      </div>

      {/* Área Principal do Canvas com Caractere em Guia d'Água */}
      <div
        ref={containerRef}
        className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] bg-white dark:bg-[#0c1220] rounded-3xl shadow-lg border-2 border-slate-300 dark:border-slate-700 overflow-hidden select-none transition-colors"
      >
        {/* Camada 1: Grade Tradicional Japonesa (田 e Diagonais) */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Linha vertical central tracejada */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0 border-r border-dashed border-slate-300 dark:border-slate-700" />
            {/* Linha horizontal central tracejada */}
            <div className="absolute top-1/2 left-0 right-0 h-0 border-b border-dashed border-slate-300 dark:border-slate-700" />
            {/* Diagonais suaves de apoio */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-200/70 dark:stroke-slate-800/70 stroke-[1] stroke-dasharray-[4_4]">
              <line x1="0" y1="0" x2="100%" y2="100%" />
              <line x1="100%" y1="0" x2="0" y2="100%" />
            </svg>
          </div>
        )}

        {/* Camada 2: Caractere Base com Opacidade Fraca (Marca d'Água para Desenhar por Cima - Peso Normal para Traçado Nítido) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-200"
          style={{ opacity: guideOpacity }}
        >
          <span className="font-jp text-[190px] sm:text-[230px] font-normal text-slate-900 dark:text-slate-100 leading-none select-none">
            {character}
          </span>
        </div>

        {/* Camada 3: Subtítulo/Dica discreta no canto superior */}
        {subtitle && (
          <div className="absolute top-3 left-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pointer-events-none">
            {subtitle}
          </div>
        )}

        {/* Camada 4: HTML5 Canvas Interativo para Traçado */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerUp}
          className="relative w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />

        {/* Dica de Toque/Desenho inicial se ainda não começou a desenhar */}
        {strokes.length === 0 && currentStroke.length === 0 && (
          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
            <span className="inline-block px-3 py-1 bg-slate-900/10 dark:bg-black/30 backdrop-blur-xs rounded-full text-[11px] font-medium text-slate-600 dark:text-slate-400 animate-pulse">
              Desenhe por cima da guia com o dedo, caneta ou mouse
            </span>
          </div>
        )}
      </div>

      {/* Controles de Opacidade da Guia */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Eye className="w-3.5 h-3.5 mr-0.5" />
        <span className="font-semibold text-[11px]">Guia:</span>
        {[
          { label: 'Fraca (16%)', val: 0.16 },
          { label: 'Média (35%)', val: 0.35 },
          { label: 'Forte (60%)', val: 0.60 },
          { label: 'Ocultar (0%)', val: 0.0 },
        ].map((op) => (
          <button
            key={op.label}
            onClick={() => setGuideOpacity(op.val)}
            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all ${
              guideOpacity === op.val
                ? 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Barra de Ações Inferior (Desfazer, Limpar, Avaliar Traçado) */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
            title="Desfazer último traço (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Desfazer</span>
          </button>

          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
            title="Limpar tela inteira"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={strokes.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Avaliar Traçado</span>
        </button>
      </div>

      {/* Caixa de Feedback do Traçado Avaliado */}
      {evaluationResult && (
        <div className="w-full max-w-md mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-brand-500/10 border border-emerald-500/30 dark:border-emerald-500/40 animate-fadeIn">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Precisão do Traçado: {evaluationResult.score}%
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                evaluationResult.score >= 80
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
              }`}
            >
              {evaluationResult.score >= 80 ? 'Excelente' : 'Bom esforço'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {evaluationResult.feedback}
          </p>
        </div>
      )}
    </div>
  );
};
