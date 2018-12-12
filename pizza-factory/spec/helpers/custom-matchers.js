const customMatchers = {
  toEndSession: function(util, customEqualityTesters) {
    return {
      compare: function(responseHandlerResults, expected) {
        if (typeof expected !== "undefined") {
          throw new Error("You cannot use toEndSession with an expected value.");
        }
        if (typeof responseHandlerResults === "undefined") {
          throw new Error("You have to use endSession with a responseHandlerResult object. Currently passed undefined.");
        }

        if (!(typeof responseHandlerResults.shouldSessionEnd === "boolean" || typeof responseHandlerResults.shouldSessionEnd === "undefined")) {
          throw new Error(
            "You have to pass a responseHandlerResult object with an attribute called 'shouldSessionEnd' which is either true, false or undefined into toEndSession."
          );
        }

        const result = util.equals(responseHandlerResults.shouldSessionEnd, true, customEqualityTesters);
        return {
          pass: result,
          message: result ? "Expected response not to end voice session" : "Expected response to end voice session",
        };
      },
    };
  },

  toHaveVoiceMessage: function(util, customEqualityTesters) {
    return {
      compare: function(responseHandlerResults, expected) {
        if (typeof expected !== "string") {
          throw new Error("You have to pass an expected value in order to use toHaveVoiceMessage.");
        }
        if (typeof responseHandlerResults === "undefined") {
          throw new Error("You have to use toHaveVoiceMessage() with a responseHandlerResult object. Currently passed undefined.");
        }
        if (typeof responseHandlerResults.voiceMessage === "undefined") {
          throw new Error("The voice message object is undefined.");
        }
        if (typeof responseHandlerResults.voiceMessage !== "object") {
          throw new Error("The voice message is not an object.");
        }
        if (typeof responseHandlerResults.voiceMessage.text !== "string") {
          throw new Error("The voice message text is not a string.");
        }

        const result = util.equals(responseHandlerResults.voiceMessage.text, expected, customEqualityTesters);
        return {
          pass: result,
          message: result
            ? `Expected response not to emit voice message "${expected}"`
            : `Expected response to emit voice message "${expected}", but emitted "${
                responseHandlerResults.voiceMessage ? responseHandlerResults.voiceMessage.text : undefined
              }"`,
        };
      },
    };
  },
};

beforeEach(function() {
  jasmine.addMatchers(customMatchers);
});
