declare namespace jasmine {
  function expect<T>(responseHandler: T): Matchers<T>;

  interface Matchers<T> {
    /** Checks if response handler results tells assistant to end the voice session */
    toEndSession(): void;

    /** Checks if response handler results emits given voice message */
    toHaveVoiceMessage(voiceMessage: string): void;
  }
}
