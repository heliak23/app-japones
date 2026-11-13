/**
 * Serviço de áudio e pronúncia japonesa usando Web Speech API nativa.
 * Funciona offline no navegador e em dispositivos móveis sem requisições a servidores externos.
 */
class AudioService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadJapaneseVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadJapaneseVoice();
      }
    }
  }

  private loadJapaneseVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioriza vozes japonesas
    this.voice = voices.find(v => v.lang.startsWith('ja') || v.lang === 'ja_JP' || v.lang === 'ja-JP') || null;
    this.initialized = true;
  }

  /**
   * Pronuncia um caractere ou palavra em japonês
   * @param text Caractere japonês ou palavra
   * @param rate Velocidade de reprodução (padrão 0.85 para clareza didática)
   */
  public speak(text: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('SpeechSynthesis não suportado neste navegador.');
        resolve();
        return;
      }

      // Cancela pronúncias anteriores em andamento para evitar sobreposição
      this.synth.cancel();

      if (!this.voice && !this.initialized) {
        this.loadJapaneseVoice();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = rate; // Um pouco mais lento para o estudante ouvir com nitidez
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn('Erro ao reproduzir pronúncia:', e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Verifica se o recurso de áudio está disponível no navegador atual
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const audioService = new AudioService();

