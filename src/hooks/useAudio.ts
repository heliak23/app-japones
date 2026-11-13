import { useState, useCallback } from 'react';
import { audioService } from '../services/audioService';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string | null>(null);

  const playKana = useCallback(async (text: string, rate: number = 0.85) => {
    try {
      setIsPlaying(true);
      setCurrentText(text);
      await audioService.speak(text, rate);
    } catch (e) {
      console.warn('Falha na reprodução de voz:', e);
    } finally {
      setIsPlaying(false);
      setCurrentText(null);
    }
  }, []);

  return {
    playKana,
    isPlaying,
    currentText,
    isSupported: audioService.isSupported(),
  };
}

