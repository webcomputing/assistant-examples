import { BasicAnswerTypes, GenericIntent, Session } from "assistant-source";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  /** Simulate an intent call and returns the response results */
  callIntent(intent: GenericIntent | string): Promise<Partial<BasicAnswerTypes>>;
}

describe("MainState", function() {
  let responseResult: Partial<BasicAnswerTypes>;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.callIntent = async intent => {
        await this.platforms.alexa.pretendIntentCalled(intent, false);
        await this.platforms.alexa.specSetup.runMachine("MainState");
        return this.platforms.alexa.specSetup.getResponseResults();
      };
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Help);
        expect(await this.translateValuesFor()("mainState.helpGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Cancel);
        expect(await this.translateValuesFor()("root.cancelGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });
  });
});
