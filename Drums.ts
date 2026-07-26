import { WaveAudioGenerator } from "./Yuu API/Audio/WaveAudioGenerator";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { registerStart } from "./Yuu API/RegisterStart";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";

registerStart(start);

function start() {
  createFloor();
  createDrumSet();
}

type DrumPadDefinition = {
  name: string;
  color: Color;
  pos: Vector3;
  wave: "Sine" | "Square" | "Triangle" | "Sawtooth" | "Noise";
  frequency: number;
  volume: number;
  pitch: number;
};

function createFloor() {
  const floor = spawnPrimitive.plane(
    "Both",
    new Vector3(0, -0.5, 0),
    new Vector3(8, 8, 8),
    Quaternion.one,
    new Color(0.16, 0.16, 0.18),
    1,
    "None",
    "Empty",
    undefined
  );

  floor.mesh.color.set(new Color(0.2, 0.2, 0.24), 1);
}

function createDrumSet() {
  const pads: DrumPadDefinition[] = [
    { name: "Kick", color: Color.red, pos: new Vector3(-1.2, 0.4, -2), wave: "Sine", frequency: 80, volume: 0.8, pitch: 0.95 },
    { name: "Snare", color: Color.blue, pos: new Vector3(0, 0.4, -2), wave: "Noise", frequency: 2400, volume: 0.55, pitch: 1.05 },
    { name: "Hi-Hat", color: Color.yellow, pos: new Vector3(1.2, 0.4, -2), wave: "Square", frequency: 1800, volume: 0.45, pitch: 1.2 },
    { name: "Tom", color: Color.green, pos: new Vector3(-0.6, 0.4, -1), wave: "Triangle", frequency: 420, volume: 0.65, pitch: 1.0 },
    { name: "Crash", color: Color.purple, pos: new Vector3(0.6, 0.4, -1), wave: "Sawtooth", frequency: 650, volume: 0.5, pitch: 0.92 },
  ];

  pads.forEach((pad) => {
    const cube = spawnPrimitive.cube(
      pad.pos,
      new Vector3(0.6, 0.45, 0.45),
      Quaternion.one,
      pad.color,
      1,
      true,
      "Empty",
      undefined
    );

    cube.mesh.color.set(pad.color, 1);
    cube.rayClick.initialize(false);
    cube.rayClick.setClickFunction(() => {
      playPadSound(cube, pad);
    });

    cube.audio.createFromByteArray(
      WaveAudioGenerator.generate16Bit(pad.wave, {
        frequency: pad.frequency,
        duration: 0.22,
        amplitude: 0.35,
        sampleRate: 44_100,
      }),
      true
    );

    cube.audio.volume.set(pad.volume);
    cube.audio.pitch.set(pad.pitch);
    cube.audio.maxDistance.set(15);
    cube.audio.unitSize.set(2);
  });
}

function playPadSound(cube: ReturnType<typeof spawnPrimitive.cube>, pad: DrumPadDefinition) {
  cube.audio.stop();
  cube.audio.play();
}
