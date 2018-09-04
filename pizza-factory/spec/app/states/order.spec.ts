import { BasicAnswerTypes, GenericIntent, injectionNames, Session } from "assistant-source";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentSessionFactory: () => Session;
  currentStateNameProvider: () => Promise<string>;
  /** Invokes the guessNumberIntent and returns specific response results */
  preparePizzaList(): Promise<void>;
  /** Simulate an intent call and returns the response results */
  callIntent(intent: GenericIntent | string): Promise<Partial<BasicAnswerTypes>>;
}

describe("OrderState", function() {
  const pizza1 = ["tuna", "gouda"];
  const pizza2 = ["salami", "spinach"];
  const amount = 2;
  let responseResult: Partial<BasicAnswerTypes>;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      this.preparePizzaList = async () => {
        // Store amount in session factory
        this.currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        await this.currentSessionFactory().set("amount", pizzaList);

        // Store pizzaList in session factory
        this.currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        await this.currentSessionFactory().set("myNumber", pizzaList);
      };

      this.callIntent = async intent => {
        await this.platforms.alexa.pretendIntentCalled(intent, false);
        await this.platforms.alexa.specSetup.runMachine("OrderState");
        this.currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
        this.currentStateNameProvider = this.container.inversifyInstance.get(injectionNames.current.stateNameProvider);
        return this.platforms.alexa.specSetup.getResponseResults();
      };
    });

    describe("yesGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Yes);
      });

      it("invite the user to add toppings to another pizza", async function(this: CurrentThisContext) {
        expect(await this.translateValuesFor()("orderState.yesGenericIntent")).toContain(responseResult.voiceMessage!.text);
      });

      it("increment the amount of Pizzas", async function(this: CurrentThisContext) {
        const amountOfPizzas = (await this.currentSessionFactory().get("amountOfPizzas")) || 0;
        const newAmountOfPizzas: number = +amountOfPizzas + 1;
        expect(+amountOfPizzas).toBeGreaterThan(0);
        expect(newAmountOfPizzas).toBeGreaterThan(+amountOfPizzas);
      });

      it("sets the current conversation state to 'PizzaState'", async function(this: CurrentThisContext) {
        const currentStateName = await this.currentStateNameProvider();
        expect(currentStateName).toEqual("PizzaState");
      });
    });

    describe("noGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.No);
      });

      it("get the list of pizzas", async function(this: CurrentThisContext) {
        const amountOfPizzas = (await this.currentSessionFactory().get("amountOfPizzas")) || 0;
        expect(+amountOfPizzas).toBeGreaterThan(0);
      });

      it("should end with pizza list", async function(this: CurrentThisContext) {
        expect(responseResult.shouldSessionEnd).toBeTruthy();
        expect(await this.translateValuesFor()("orderState.noGenericIntent", { pizzas: pizzaList })).toContain(responseResult.voiceMessage!.text);
      });
    });

    describe("helpGenericIntent", function() {
      it("tries to help", async function(this: CurrentThisContext) {
        responseResult = await this.callIntent(GenericIntent.Help);
        expect(await this.translateValuesFor()("root.helpGenericIntent")).toContain(responseResult.voiceMessage!.text);
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
