import { BasicAnswerTypes, CurrentSessionFactory, GenericIntent, injectionNames, Session } from "assistant-source";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentSessionFactory: () => Session;
  currentStateNameProvider: () => Promise<string>;
}

describe("MainState", function() {
  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      /* this.callIntent = async intent => {
        await this.platforms.alexa.pretendIntentCalled(intent, false);
        await this.platforms.alexa.specSetup.runMachine("MainState");
        this.currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        this.currentStateNameProvider = this.container.inversifyInstance.get(injectionNames.current.stateNameProvider);
        return this.platforms.alexa.specSetup.getResponseResults();
      }; */
    });

    describe("invokeGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.callIntent(GenericIntent.Invoke);
        this.currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
      });

      it("stores amount of pizzas into session", async function(this: CurrentThisContext) {
        const amountOfPizzas = (await this.currentSessionFactory().get("amountOfPizzas")) || 0;
        expect(+amountOfPizzas).toBe(1);
        expect(+amountOfPizzas).not.toBe(0);
      });

      it("greets and prompts for command", async function(this: CurrentThisContext) {
        expect(await this.translateValuesFor()("mainState.invokeGenericIntent.alexa")).toContain(this.responseHandlerResults.voiceMessage!.text);
      });
    });

    describe("getToppingsIntent", function() {
      it("lists all available toppings", async function(this: CurrentThisContext) {
        await this.callIntent("getToppings");
        expect(await this.translateValuesFor()("mainState.getToppingsIntent")).toContain(this.responseHandlerResults.voiceMessage!.text);
      });
    });

    describe("orderPizzaIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        await this.callIntent("orderPizza");
        this.currentStateNameProvider = this.container.inversifyInstance.get(injectionNames.current.stateNameProvider);
      });

      it("order pizza", async function(this: CurrentThisContext) {
        expect(await this.translateValuesFor()("mainState.orderPizzaIntent")).toContain(this.responseHandlerResults.voiceMessage!.text);
      });

      it("sets the current conversation state to 'PizzaState'", async function(this: CurrentThisContext) {
        const currentStateName = await this.currentStateNameProvider();
        expect(currentStateName).toEqual("PizzaState");
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        await this.callIntent(GenericIntent.Help);
        expect(await this.translateValuesFor()("mainState.helpGenericIntent")).toContain(this.responseHandlerResults.voiceMessage!.text);
      });
    });

    describe("cancelGenericIntent", function() {
      it("says generic goodbye and ends session", async function(this: CurrentThisContext) {
        await this.callIntent(GenericIntent.Cancel);
        expect(await this.translateValuesFor()("root.cancelGenericIntent")).toContain(this.responseHandlerResults.voiceMessage!.text);
      });
    });
  });
});
