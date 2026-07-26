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
  time: number;
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

function start() {
  registerDrumPadPlayedCallback((padName: string) => {
    if (isRecording && currentTrack) {
      const elapsed = Date.now() - recordingStartTime;
      currentTrack.events.push({ padName, time: elapsed });
    }
  });

  createLoopingControls();
  updateStatusText();
}

function createLoopingControls() {
  const recordButton = createUIElement.button(new Vector3(-0.24, 2.05, -2.4), new Vector3(0.28, 0.12, 0.12), Quaternion.one, "Rec", Color.white, 24, Color.red, undefined);
  recordButton.rayClick.setClickFunction(() => {
    toggleRecording();
  });

  const playButton = createUIElement.button(new Vector3(0.24, 2.05, -2.4), new Vector3(0.28, 0.12, 0.12), Quaternion.one, "Play", Color.white, 24, Color.green, undefined);
  playButton.rayClick.setClickFunction(() => {
    togglePlayback();
  });

  statusText = createTextLabel(new Vector3(0, 1, -2.4), "Ready", 20, Color.white);
  trackCountText = createTextLabel(new Vector3(0, 2.38, -2.4), "Tracks: 0", 18, Color.lightGray);
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

function playRecordedTracks() {
  clearPlaybackTimers();

  const loopDurationMs = getLoopDurationMs();

  recordedTracks.forEach((track) => {
    track.events.forEach((event) => {
      playbackTimerIds.push(Async.setTimeout(() => {
        playPadByName(event.padName);
      }, event.time));
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
  const maxEventTime = recordedTracks.reduce((longest, track) => {
    const trackDuration = track.events.reduce((maxTime, event) => Math.max(maxTime, event.time), 0);
    return Math.max(longest, trackDuration);
  }, 0);

  return Math.max(800, maxEventTime + 400);
}

function playPadByName(padName: string) {
  playDrumPadByName(padName);
}

function updateStatusText() {
  if (!statusText || !trackCountText) {
    return;
  }

  const trackCountTextValue = `Tracks: ${recordedTracks.length}`;
  trackCountText.text.display.set(trackCountTextValue);

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
