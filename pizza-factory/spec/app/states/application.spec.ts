import { GenericIntent, injectionNames } from "assistant-source";
import { ApplicationState } from "../../../app/states/application";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentState: ApplicationState;
}

describe("ApplicationState", function() {
  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.fixMathSeed();
    });

    describe("cancelGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "cancelGenericIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("root.cancelGenericIntent"))[0]);
        expect(this.responseHandlerResults).toEndSession();
      });
    });

    describe("stopGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "cancelGenericIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("root.cancelGenericIntent"))[0]);
        expect(this.responseHandlerResults).toEndSession();
      });
    });

    describe("getToppingsIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "getToppingsIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("lists all available toppings", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("root.getToppingsIntent"))[0]);
      });
    });
  });
});
