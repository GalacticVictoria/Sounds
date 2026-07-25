import { Async } from "../Async";
import { Quaternion } from "../Basic Types/Quaternion";
import { Vector3 } from "../Basic Types/Vector3";
import { Entity } from "../Entity";


export type PlayAudioOptions = {
  volume: number,
  pitch: number,
  maxDistance: number,
  unitSize: number,
}

export const PlayAudio = {
  atPos: playAudioAtPos,
  global: playAudioGlobal,
}


function playAudioAtPos(filePath: string, pos: Vector3, options: Partial<PlayAudioOptions>) {
  playAudioAtPosInternal(filePath, pos, options, true);
}

function playAudioGlobal(filePath: string, options: Partial<PlayAudioOptions>) {
  playAudioAtPosInternal(filePath, Vector3.zero, options, false);
}


async function playAudioAtPosInternal(filePath: string, pos: Vector3, options: Partial<PlayAudioOptions>, isSpatial: boolean) {
  const musicEntity = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Empty');

  musicEntity.audio.createFromFilePath(filePath, isSpatial);

  musicEntity.audio.volume.set(options.volume ?? 0.86);
  musicEntity.audio.pitch.set(options.pitch ?? 1);
  musicEntity.audio.maxDistance.set(options.maxDistance ?? 16);
  musicEntity.audio.unitSize.set(options.unitSize ?? 5);

  musicEntity.audio.play();

  await Async.wait(1_000);
  while (musicEntity.audio.isPlaying()) {
    await Async.wait(1_000);
  }

  musicEntity.destroy();
}