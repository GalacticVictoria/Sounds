import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { createUIElement } from "./Yuu API/CreateUIElement";
import { Entity } from "./Yuu API/Entity";
import { registerStart } from "./Yuu API/RegisterStart";
import { playDrumPadByName, registerDrumPadPlayedCallback } from "./Drums";

registerStart(start);

type RecordedEvent = {
  padName: string;
  step: number;
};

type RecordedTrack = {
  id: number;
  events: RecordedEvent[];
};

let isRecording = false;
let isPlaying = false;
let recordingStartTime = 0;
let currentTrack: RecordedTrack | null = null;
let recordedTracks: RecordedTrack[] = [];
let nextTrackId = 1;
let playbackLoopTimerId: number | undefined;
let playbackTimerIds: number[] = [];
let statusText: Entity | undefined;
let trackCountText: Entity | undefined;
let bpmText: Entity | undefined;
let bpm = 120;

function start() {
  registerDrumPadPlayedCallback((padName: string) => {
    if (isRecording && currentTrack) {
      const elapsed = Date.now() - recordingStartTime;
      const step = quantizeStep(elapsed);
      currentTrack.events.push({ padName, step });
    }
  });

  createLoopingControls();
  updateStatusText();
}

function createLoopingControls() {
  const recordButton = createUIElement.button(new Vector3(-0.42, 2.08, -2.4), new Vector3(0.24, 0.1, 0.1), Quaternion.one, "Rec", Color.white, 6, Color.red, undefined);
  recordButton.rayClick.setClickFunction(() => {
    toggleRecording();
  });

  const playButton = createUIElement.button(new Vector3(-0.14, 2.08, -2.4), new Vector3(0.24, 0.1, 0.1), Quaternion.one, "Play", Color.white, 6, Color.green, undefined);
  playButton.rayClick.setClickFunction(() => {
    togglePlayback();
  });

  const pauseButton = createUIElement.button(new Vector3(0.14, 2.08, -2.4), new Vector3(0.24, 0.1, 0.1), Quaternion.one, "Pause", Color.white, 6, Color.orange, undefined);
  pauseButton.rayClick.setClickFunction(() => {
    stopPlayback();
  });

  const resetButton = createUIElement.button(new Vector3(0.42, 2.08, -2.4), new Vector3(0.24, 0.1, 0.1), Quaternion.one, "Reset", Color.white, 6, Color.blue, undefined);
  resetButton.rayClick.setClickFunction(() => {
    resetTracks();
  });

  const bpmMinusButton = createUIElement.button(new Vector3(-0.24, 1.82, -2.4), new Vector3(0.1, 0.08, 0.08), Quaternion.one, "-", Color.white, 6, Color.gray, undefined);
  bpmMinusButton.rayClick.setClickFunction(() => {
    setBpm(bpm - 5);
  });

  const bpmPlusButton = createUIElement.button(new Vector3(0.24, 1.82, -2.4), new Vector3(0.1, 0.08, 0.08), Quaternion.one, "+", Color.white, 6, Color.gray, undefined);
  bpmPlusButton.rayClick.setClickFunction(() => {
    setBpm(bpm + 5);
  });

  statusText = createTextLabel(new Vector3(0, 2.25, -2.4), "Ready", 8, Color.white);
  trackCountText = createTextLabel(new Vector3(0, 2.38, -2.4), "Tracks: 0", 14, Color.white);
  bpmText = createTextLabel(new Vector3(0, 1.94, -2.4), "BPM: 120", 12, Color.white);
}

function createTextLabel(pos: Vector3, text: string, fontSize: number, color: Color): Entity {
  const label = new Entity(pos, Quaternion.one, Vector3.one, undefined, "Static");
  label.text.create(text, fontSize, 0);
  label.text.doubleSided.set(false);
  label.text.color.set(color);
  return label;
}

function toggleRecording() {
  if (isRecording) {
    stopRecording();
  }
  else {
    startRecording();
  }
}

function startRecording() {
  isRecording = true;
  recordingStartTime = Date.now();
  currentTrack = { id: nextTrackId++, events: [] };
  updateStatusText();
}

function stopRecording() {
  if (currentTrack && currentTrack.events.length > 0) {
    recordedTracks.push(currentTrack);
  }

  currentTrack = null;
  isRecording = false;
  updateStatusText();
}

function togglePlayback() {
  if (isPlaying) {
    stopPlayback();
  }
  else {
    startPlayback();
  }
}

function startPlayback() {
  if (recordedTracks.length === 0) {
    updateStatusText();
    return;
  }

  isPlaying = true;
  const loopDurationMs = getLoopDurationMs();
  playRecordedTracks();
  playbackLoopTimerId = Async.setInterval(() => {
    playRecordedTracks();
  }, loopDurationMs);
  updateStatusText();
}

function stopPlayback() {
  isPlaying = false;
  clearPlaybackTimers();
  if (playbackLoopTimerId !== undefined) {
    Async.clearTimer(playbackLoopTimerId);
    playbackLoopTimerId = undefined;
  }
  updateStatusText();
}

function resetTracks() {
  stopPlayback();
  recordedTracks = [];
  currentTrack = null;
  isRecording = false;
  updateStatusText();
}

function playRecordedTracks() {
  clearPlaybackTimers();

  const loopDurationMs = getLoopDurationMs();

  recordedTracks.forEach((track) => {
    track.events.forEach((event) => {
      const delayMs = getStepDelayMs(event.step);
      playbackTimerIds.push(Async.setTimeout(() => {
        playPadByName(event.padName);
      }, delayMs));
    });
  });

  const loopTimer = Async.setTimeout(() => {
    clearPlaybackTimers();
  }, loopDurationMs);

  playbackTimerIds.push(loopTimer);
}

function clearPlaybackTimers() {
  playbackTimerIds.forEach((timerId) => {
    Async.clearTimer(timerId);
  });
  playbackTimerIds = [];
}

function getLoopDurationMs(): number {
  return Math.max(400, getStepDurationMs(16));
}

function getStepDurationMs(stepsPerBar: number): number {
  return (60_000 / bpm) * (4 / stepsPerBar);
}

function quantizeStep(elapsedMs: number): number {
  const stepsPerBar = 16;
  const stepDurationMs = getStepDurationMs(stepsPerBar);
  return Math.round(elapsedMs / stepDurationMs);
}

function getStepDelayMs(step: number): number {
  const stepsPerBar = 16;
  const stepDurationMs = getStepDurationMs(stepsPerBar);
  return step * stepDurationMs;
}

function setBpm(nextBpm: number) {
  bpm = Math.max(60, Math.min(220, nextBpm));
  if (bpmText) {
    bpmText.text.display.set(`BPM: ${bpm}`);
  }

  if (isPlaying) {
    stopPlayback();
    startPlayback();
  }
}

function playPadByName(padName: string) {
  playDrumPadByName(padName);
}

function updateStatusText() {
  if (!statusText || !trackCountText || !bpmText) {
    return;
  }

  const trackCountTextValue = `Tracks: ${recordedTracks.length}`;
  trackCountText.text.display.set(trackCountTextValue);
  bpmText.text.display.set(`BPM: ${bpm}`);

  if (isRecording) {
    statusText.text.display.set("Recording...");
  }
  else if (isPlaying) {
    statusText.text.display.set("Playing loop");
  }
  else {
    statusText.text.display.set("Ready");
  }
}
