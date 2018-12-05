import { MainState } from "../../../app/states/main";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentState: MainState;
}

describe("MainState", function() {
  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.fixMathSeed();
    });

    describe("invokeGenericIntent", function() {
      describe("test amount of pizzas", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("MainState", "invokeGenericIntent");
          this.currentState = this.grabState<MainState>(await this.getCurrentStateName());
          // The current states sessionFactory received from the container
          await this.sessionFactory().set("amountOfPizzas", "1");
          await this.runMachineAndGetResults("MainState");
        });

        it("stores amount of pizzas into session", async function(this: CurrentThisContext) {
          const amountOfPizzas = (await this.sessionFactory().get("amountOfPizzas")) || 0;
          expect(+amountOfPizzas).toBe(1);
          expect(+amountOfPizzas).not.toBe(0);
        });
      });

      describe("prompt", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("MainState", "invokeGenericIntent");
          await this.runMachineAndGetResults("MainState");
        });

        it("greets and prompts for command", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("mainState.invokeGenericIntent.alexa"))[0]);
        });
      });
    });

    describe("getToppingsIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "getToppingsIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("lists all available toppings", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("mainState.getToppingsIntent"))[0]);
      });
    });

    describe("orderPizzaIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "orderPizzaIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("order pizza", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("mainState.orderPizzaIntent"))[0]);
      });

      it("transit to PizzaState", async function() {
        const state = await this.getCurrentStateName();
        expect(state).toEqual("PizzaState");
      });
    });

    describe("helpGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "helpGenericIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("tries to help", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("mainState.helpGenericIntent"))[0]);
      });
    });

    describe("cancelGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("MainState", "cancelGenericIntent");
        await this.runMachineAndGetResults("MainState");
      });

      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("root.cancelGenericIntent"))[0]);
      });
    });
  });
});
