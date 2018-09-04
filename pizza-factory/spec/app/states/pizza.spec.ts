import { BasicAnswerTypes, GenericIntent, injectionNames, Session } from "assistant-source";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentSessionFactory: () => Session;
  currentStateNameProvider: () => Promise<string>;
  /** Simulate an intent call and returns the response results */
  callIntent(intent: GenericIntent | string): Promise<Partial<BasicAnswerTypes>>;
}

describe("PizzaState", function() {
  let responseResult: Partial<BasicAnswerTypes>;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.callIntent = async intent => {
        await this.platforms.alexa.pretendIntentCalled(intent, false);
        await this.platforms.alexa.specSetup.runMachine("MainState");
        this.currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        this.currentStateNameProvider = this.container.inversifyInstance.get(injectionNames.current.stateNameProvider);
        return this.platforms.alexa.specSetup.getResponseResults();
      };
    });

    describe("getCurrentToppingsIntent", function() {
      it("offers the user to add another topping to the pizza", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Yes);
        expect(await this.translateValuesFor()("pizzaState.yesGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("yesGenericIntent", function() {
      it("offers the user to add another topping to the pizza", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Yes);
        expect(await this.translateValuesFor()("pizzaState.yesGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("noGenericIntent", function() {
      it("finish adding toppings to pizza", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.No);
        expect(await this.translateValuesFor()("pizzaState.noGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Help);
        expect(await this.translateValuesFor()("pizzaState.helpGenericIntent")).toContain(responseResult.voiceMessage!.text);
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
