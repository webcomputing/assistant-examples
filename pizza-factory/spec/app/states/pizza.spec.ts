import { AlexaSpecificHandable, AlexaSpecificTypes } from "assistant-alexa";
import { BasicAnswerTypes, BasicHandler, GenericIntent, injectionNames, Session } from "assistant-source";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentSessionFactory: () => Session;
  currentStateNameProvider: () => Promise<string>;
}

describe("PizzaState", function() {
  describe("on platform = alexa", function() {
    describe("addToppingToPizzaIntent", function() {
      describe("when topping is valid topping", function() {
        it("adds a topping to the pizza", async function(this: CurrentThisContext) {
          const myTopping = "salami";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });
          await this.runMachineAndGetResults("PizzaState");
          expect(await this.translateValuesFor()("pizzaState.addToppingToPizzaIntent", { topping: myTopping })).toContain(
            await this.responseHandlerResults.voiceMessage!.text
          );
        });
      });

      describe("when topping is misspoken", function() {
        it("calculates a Levenshtein distance to find out the closest valid value and adds it to the pizza", async function(this: CurrentThisContext) {
          const myTopping = "salamaWurst";
          const expectedTopping = "salami";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });
          await this.runMachineAndGetResults("PizzaState");
          expect(await this.translateValuesFor()("pizzaState.addToppingToPizzaIntent", { topping: expectedTopping })).toContain(
            await this.responseHandlerResults.voiceMessage!.text
          );
        });
      });

      describe("when no topping was passed", function() {
        it("adds a topping to the pizza", async function(this: CurrentThisContext) {
          const myTopping = "";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });
          await this.runMachineAndGetResults("PizzaState");
          expect(await this.translateValuesFor()("pizzaState.addToppingToPizzaIntent", { topping: myTopping })).toContain(
            await this.responseHandlerResults.voiceMessage!.text
          );
        });
      });

      describe("check amount of pizzas", function() {
        it("counts the amount of pizzas for session factory (key)", async function(this: CurrentThisContext) {});
      });

      describe("check topping array", function() {
        it("stores the topping of pizzas for session factory (value)", async function(this: CurrentThisContext) {});
      });
    });

    describe("getCurrentToppingsIntent", function() {
      describe("pizza has toppings", function() {
        it("gets current toppings on pizza", async function(this: CurrentThisContext) {});
      });
      describe("pizza has no toppings yet", function() {
        it("returns a message that the pizza has no toppings yet", async function(this: CurrentThisContext) {});
      });
    });

    describe("yesGenericIntent", function() {
      it("offers the user to add another topping to the pizza", async function(this: CurrentThisContext) {
        /* await this.callIntent(GenericIntent.Yes);
        expect(await this.translateValuesFor()("pizzaState.yesGenericIntent")).toContain(responseResult.voiceMessage!.text); */
      });
    });

    describe("noGenericIntent", function() {
      // TBD
      it("finish adding toppings to pizza", async function(this: CurrentThisContext) {
        /* await this.callIntent(GenericIntent.No);
        expect(await this.translateValuesFor()("pizzaState.noGenericIntent")).toContain(responseResult.voiceMessage!.text); */
      });
    });
  });
});
