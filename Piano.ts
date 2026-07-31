import { registerStart } from "./Yuu API/RegisterStart";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Color } from "./Yuu API/Basic Types/Color";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { DefaultAudio } from "./Yuu API/Audio/DefaultAudio";


registerStart(Start);
function Start() {
createPiano();
}


type PianoKeyDefinition = {
    name: string;
    color: Color;
    pos: Vector3;
    rot: Quaternion;
    scale: Vector3;
    audioFilePath: string;
    volume: number;
    pitch: number;
};

function createPiano() {
    const keys: PianoKeyDefinition[] = [
        { name: "C Chord Long", color: new Color(1, 0, 0), pos: new Vector3(-3, 1.4, -2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.4), audioFilePath: DefaultAudio.filePaths.instruments.piano.cChordLong, volume: 1, pitch: 1 },
        { name: "C Chord Short", color: new Color(1, 0, 0), pos: new Vector3(-2.8, 1.4, -2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.4), audioFilePath: DefaultAudio.filePaths.instruments.piano.cChordShort, volume: 1, pitch: 1 },
        { name: "C Long", color: new Color(1, 0, 0), pos: new Vector3(-2.6, 1.4, -2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.4), audioFilePath: DefaultAudio.filePaths.instruments.piano.cLong, volume: 1, pitch: 1 },
        { name: "C Short", color: new Color(1, 0, 0), pos: new Vector3(-2.4, 1.4, -2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.4), audioFilePath: DefaultAudio.filePaths.instruments.piano.cShort, volume: 1, pitch: 1 },
        { name: "C Long Minor", color: new Color(1, 0, 0), pos: new Vector3(-2.2, 1.4, -2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.4), audioFilePath: DefaultAudio.filePaths.instruments.piano.cLongMinor, volume: 1, pitch: 1 },
        { name: "C Short Minor", color: new Color(1, 0, 0), pos: new Vector3(-2, 1.4, -2), rot: new Quaternion(0, 0, 0, 1), scale: new Vector3(0.2, 0.2, 0.4), audioFilePath: DefaultAudio.filePaths.instruments.piano.cShortMinor, volume: 1, pitch: 1 },
    ];

    keys.forEach((key) => {
        const cube = spawnPrimitive.cube(
            key.pos,
            key.scale,
            key.rot,
            key.color,
            1,
            false,
            "Empty",
            undefined,
        );

        cube.mesh.color.set(key.color, 1);

    });


}