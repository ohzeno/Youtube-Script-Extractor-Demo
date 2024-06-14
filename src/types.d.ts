interface TranscriptDict {
  title: string;
  transcript: Array<string | [string, string]>;
}

interface InputElementDict {
  [key: string]: HTMLInputElement;
}

interface ButtonElementDict {
  [key: string]: HTMLButtonElement;
}

interface NotificationElement extends HTMLElement {
  timeoutId?: number;
}
