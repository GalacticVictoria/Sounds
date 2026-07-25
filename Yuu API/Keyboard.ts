import { Async } from "./Async";
import { registerStart } from "./RegisterStart";


export const Keyboard = {
  show,
  hide,
  onKeyboardInput: onKeyboardInput,
  /**
   * The latest string displayed on the keyboard
   */
  keyboardEntry: '',
  unsubscribe: unsubscribe,
  clipboard: {
    set: setClipboard,
    get: getClipboard,
  },
}

let isShown = false;

function show(defaultText: string) {
  isShown = true;

  Keyboard.keyboardEntry = defaultText;
  Godot.keyboard.show(defaultText);

  callSubscribedFunctions(false);
}

function hide() {
  Godot.keyboard.hide();
}

function setClipboard(text: string) {
  Godot.keyboard.clipboard.set(text);
}

function getClipboard(): string {
  return Godot.keyboard.clipboard.get() ?? '';
}


registerStart(start);
function start() {
  Godot.events.onKeyboardInput((input) => { updateKeyboardString(input); });
}

let asyncID = 0;
function updateKeyboardString(input: string) {
  if (input === 'Backspace') {
    Keyboard.keyboardEntry = Keyboard.keyboardEntry.substring(0, Keyboard.keyboardEntry.length - 1);
  } else if (input.length === 1) {
    Keyboard.keyboardEntry += input;
  }

  Async.clearTimer(asyncID);
  asyncID = Async.setTimeout(() => {
    if (isShown) {
      if (input === 'Enter') {
        isShown = false;
      }

      callSubscribedFunctions(input === 'Enter');
    }
  }, 25);
}


const keyboardInputCallbackMap = new Map<number, (input: string, isEnterKey: boolean) => void>();
let callbackID = 0;

/**
 * Subscribe a function to receive keyboard input (input being the string displayed on the keyboard preview)
 * Enter key is a bool, but will be much better when we rewrite this whole keyboard mechanic to be internal to the Yuu Online app
 * The hacky Meta one needs to go as it has bugs if users select in between the current displayed string
 * @param func to use
 * @returns number id that can be used to unsubscribe
 */
function onKeyboardInput(func: (input: string, isEnterKey: boolean) => void): number {
  callbackID++;
  keyboardInputCallbackMap.set(callbackID, func);

  return callbackID;
}

/**
 * Using the id returned by subscribing to onKeyboardInput, you can unsubscribe
 * @param id to unsubscribe
 * @returns true if the id existed and has been removed, or false if the id does not exist.
 */
function unsubscribe(id: number): boolean {
  return keyboardInputCallbackMap.delete(id);
}


function callSubscribedFunctions(isEnterKey: boolean) {
  keyboardInputCallbackMap.forEach((func) => {
    func(Keyboard.keyboardEntry, isEnterKey);
  });
}