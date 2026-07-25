export type WaveType = | "Sine" | "Square" | "Triangle" | "Sawtooth" | "Noise";

export type WaveOptions = {
  frequency: number;
  duration: number;
  amplitude: number;
  sampleRate: number;
}


export const WaveAudioGenerator = {
  generate8Bit,
  generate16Bit,
}


function generate8Bit(type: WaveType, options: Partial<WaveOptions>): Uint8Array {
  const sampleRate = Math.max(1, options.sampleRate ?? 44100);
  const amplitude = Math.max(0, Math.min(1, options.amplitude ?? 0.5));
  const duration = Math.max(0, options.duration ?? 1);
  const frequency = Math.max(0, options.frequency ?? 220);

  const sampleCount = Math.floor(duration * sampleRate);

  const bytes = new Uint8Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const sample = getSample(type, frequency, t);

    bytes[i] = Math.min(255, Math.max(0, 128 + sample * amplitude * 127));
  }

  return bytes;
}

function generate16Bit(type: WaveType, options: Partial<WaveOptions>): Int16Array {
  const sampleRate = Math.max(1, options.sampleRate ?? 44100);
  const amplitude = Math.max(0, Math.min(1, options.amplitude ?? 0.5));
  const duration = Math.max(0, options.duration ?? 1);
  const frequency = Math.max(0, options.frequency ?? 220);

  const sampleCount = Math.floor(duration * sampleRate);

  const bytes = new Int16Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const sample = getSample(type, frequency, t);

    bytes[i] = Math.min(65_535, Math.max(0, 32767 + sample * amplitude * 65_535));
  }

  return bytes;
}


function getSample(type: WaveType, frequency: number, t: number): number {
  let sample = 0;

  if (type === 'Sine') {
    sample = Math.sin(2 * Math.PI * frequency * t);
  }
  else if (type === 'Square') {
    sample = Math.sin(2 * Math.PI * frequency * t) >= 0 ? 1 : -1;
  }
  else if (type === 'Triangle') {
    sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
  }
  else if (type === 'Sawtooth') {
    sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
  }
  else if (type === 'Noise') {
    sample = Math.random() * 2 - 1;
  }

  return sample;
}