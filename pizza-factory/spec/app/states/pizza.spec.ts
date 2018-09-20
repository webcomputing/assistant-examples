import { AlexaSpecificHandable, AlexaSpecificTypes } from "assistant-alexa";
import { BasicAnswerTypes, BasicHandler, GenericIntent, injectionNames, Session } from "assistant-source";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentSessionFactory: () => Session;
  currentStateNameProvider: () => Promise<string>;
  /**  */
  prepareTopping: (topping?: string) => Promise<AlexaSpecificHandable<AlexaSpecificTypes>>;
  /** Simulate an intent call and returns the response results */
  callIntent: (intent: GenericIntent | string) => Promise<Partial<BasicAnswerTypes>>;
}

describe("PizzaState", function() {
  const myTopping = "salami";
  let responseResult: Partial<BasicAnswerTypes>;
  let currentSessionFactory: () => Session;

  describe("on platform = alexa", function() {
    beforeEach(async function(this: CurrentThisContext) {
      await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });

      // Store number in session factory
      /* currentSessionFactory = this.container.inversifyInstance.get(injectionNames.current.sessionFactory);
      await currentSessionFactory().set("myNumber", "1"); */

      // Mindeste
      await this.specHelper.runMachine("PizzaState");
    });

    describe("addToppingToPizzaIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        console.log("Test");
      });

      describe("when topping is valid topping", function() {
        it("adds a topping to the pizza", async function(this: CurrentThisContext) {
          console.log("Test");
        });
      });

      describe("when topping is misspoken", function() {
        it("adds a topping to the pizza", async function(this: CurrentThisContext) {
          console.log("Test");
        });
      });

      describe("when no topping was passed", function() {
        it("adds a topping to the pizza", async function(this: CurrentThisContext) {
          console.log("Test");
        });
      });

      describe("check amount of pizzas", function() {
        it("counts the amount of pizzas for session factory (key)", async function(this: CurrentThisContext) {
          console.log("Test");
        });
      });

      describe("check topping array", function() {
        it("stores the topping of pizzas for session factory (value)", async function(this: CurrentThisContext) {
          console.log("Test");
        });
      });
    });

    describe("getCurrentToppingsIntent", function() {
      it("gets current toppings on pizza", async function(this: CurrentThisContext) {});
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
