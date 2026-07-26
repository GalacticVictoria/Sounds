import { DefaultAudio } from "./Yuu API/Audio/DefaultAudio";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { registerStart } from "./Yuu API/RegisterStart";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";

registerStart(start);

const drumPadPlayCallbacks: Array<(padName: string) => void> = [];
const drumPads = new Map<string, ReturnType<typeof spawnPrimitive.cube>>();

export function registerDrumPadPlayedCallback(callback: (padName: string) => void) {
  drumPadPlayCallbacks.push(callback);
}

export function playDrumPadByName(padName: string) {
  const pad = drumPads.get(padName);

  if (pad) {
    pad.audio.stop();
    pad.audio.play();
  }
}

function start() {
  createDrumSet();
}

type DrumPadDefinition = {
  name: string;
  color: Color;
  pos: Vector3;
  rot: Quaternion;
  scale: Vector3;
  audioFilePath: string;
  volume: number;
  pitch: number;
};



function createDrumSet() {
  const pads: DrumPadDefinition[] = [
    { name: "Kick", color: Color.orange, pos: new Vector3(-0.3, 1.4, -1.9), rot: new Quaternion(0.2, 0.35, 0, 1), scale: new Vector3(0.2, 0.2, 0.2), audioFilePath: DefaultAudio.filePaths.instruments.drums.drum, volume: 0.8, pitch: 0.95 },
    { name: "Snare", color: Color.yellow, pos: new Vector3(0, 1.4, -2), rot: new Quaternion(0.2, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.2), audioFilePath: DefaultAudio.filePaths.instruments.drums.snareDrum, volume: 0.8, pitch: 1.05 },
    { name: "Hi-Hat", color: Color.green, pos: new Vector3(-0.25, 1.7, -2.2), rot: new Quaternion(0, 0.2, 0, 1), scale: new Vector3(0.2, 0.05, 0.2), audioFilePath: DefaultAudio.filePaths.instruments.drums.highHat, volume: 1.0, pitch: 1.2 },
    { name: "Tom", color: Color.red, pos: new Vector3(0.3, 1.4, -1.9), rot: new Quaternion(0.2, -0.35, 0, 1), scale: new Vector3(0.2, 0.2, 0.2), audioFilePath: DefaultAudio.filePaths.instruments.drums.hit, volume: 0.8, pitch: 1.0 },
    { name: "Crash", color: Color.blue, pos: new Vector3(0.25, 1.7, -2.2), rot: new Quaternion(0, -0.2, 0, 1), scale: new Vector3(0.2, 0.05, 0.2), audioFilePath: DefaultAudio.filePaths.instruments.drums.cymbal, volume: 0.8, pitch: 0.92 },
    { name: "Cowbell", color: Color.lavender, pos: new Vector3(0, 1.8, -2.2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.1, 0.2, 0.1), audioFilePath: DefaultAudio.filePaths.instruments.drums.cowBell, volume: 0.8, pitch: 1.0 }
  ];

  pads.forEach((pad) => {
    const cube = spawnPrimitive.cube(
      pad.pos,
      pad.scale,
      pad.rot,
      pad.color,
      1,
      true,
      "Empty",
      undefined
    );

    cube.mesh.color.set(pad.color, 1);

    cube.trigger.initialize(0.15, undefined, ["Left Hand", "Right Hand"], undefined);
    cube.trigger.setOccupiedFunction(() => {
      playPadSound(cube, pad);
    });

    drumPads.set(pad.name, cube);

    cube.audio.createFromFilePath(pad.audioFilePath, true);

    cube.audio.volume.set(pad.volume);
    cube.audio.pitch.set(pad.pitch);
    cube.audio.maxDistance.set(15);
    cube.audio.unitSize.set(2);
  });
}

function playPadSound(cube: ReturnType<typeof spawnPrimitive.cube>, pad: DrumPadDefinition) {
  cube.audio.stop();
  cube.audio.play();

  drumPadPlayCallbacks.forEach((callback) => {
    callback(pad.name);
  });
}
