import { PizzaState } from "../../../app/states/pizza";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentState: PizzaState;
}

describe("PizzaState", function() {
  beforeEach(async function(this: CurrentThisContext) {
    this.fixMathSeed();
  });

  describe("on platform = alexa", function() {
    describe("addToppingToPizzaIntent", function() {
      describe("when topping is valid topping", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.myTopping = "salami";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: this.params.myTopping } });
          await this.runMachineAndGetResults("PizzaState");
        });

        it("adds a topping to the pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.addToppingToPizzaIntent", { topping: "salami" }))[0]
          );
        });
      });

      describe("when topping is misspoken", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.myTopping = "salamaWurst";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: this.params.myTopping } });
          await this.runMachineAndGetResults("PizzaState");
        });

        it("calculates a Levenshtein distance to find out the closest valid value and adds it to the pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.addToppingToPizzaIntent", { topping: "salami" }))[0]
          );
        });
      });

      describe("when no topping was passed", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.myTopping = undefined;
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: this.params.myTopping } });
          await this.runMachineAndGetResults("PizzaState");
        });

        it("tries to help", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("promptState.topping"))[0]);
        });
      });
    });

    describe("getCurrentToppingsIntent", function() {
      describe("pizza has 1 topping", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = ["salami"];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("gets current topping on pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.getCurrentToppingsIntent.addedToppings", { topping: this.params.temporaryToppingArray[0] }))[0]
          );
        });
      });

      describe("pizza has 2 toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = ["salami", "gouda"];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("gets current topping on pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.getCurrentToppingsIntent.addedToppings", {
              topping: `${this.params.temporaryToppingArray[0]} and ${this.params.temporaryToppingArray[1]}`,
            }))[0]
          );
        });
      });

      describe("pizza has more toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = ["salami", "gouda", "spinach"];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("gets current toppings on pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.getCurrentToppingsIntent.addedToppings", {
              topping: `${this.params.temporaryToppingArray[0]}, ${this.params.temporaryToppingArray[1]} and ${this.params.temporaryToppingArray[2]}`,
            }))[0]
          );
        });
      });

      describe("pizza has no toppings yet", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = [];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("returns a message that the pizza has no toppings yet", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.getCurrentToppingsIntent.noToppings"))[0]
          );
        });
      });
    });

    describe("yesGenericIntent", function() {
      describe("pizza has no toppings yet", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = [];
          await this.prepareCurrentStateForTest("PizzaState", "yesGenericIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("returns a message that the pizza has no toppings yet", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.yesGenericIntent.noToppings"))[0]
          );
        });
      });

      describe("pizza has a toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = ["salami"];
          await this.prepareCurrentStateForTest("PizzaState", "yesGenericIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("offers the user to add another topping to the pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.yesGenericIntent.addedToppings"))[0]
          );
        });
      });
    });

    fdescribe("noGenericIntent", function() {
      describe("pizza has no toppings yet", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = [];
          await this.prepareCurrentStateForTest("PizzaState", "noGenericIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("returns a message that the pizza has no toppings yet", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("pizzaState.noGenericIntent.noToppings"))[0]);
        });
      });

      describe("pizza has a toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.temporaryToppingArray = ["salami", "gouda", "spinach"];
          await this.prepareCurrentStateForTest("PizzaState", "noGenericIntent");
          await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(this.params.temporaryToppingArray));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("finishes adding toppings to pizza and returns topping List", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.noGenericIntent.addedToppings", { topping: "salami, gouda and spinach" }))[0]
          );
        });

        it("transits to OrderState", async function() {
          this.params.state = await this.getCurrentStateName();
          expect(this.params.state).toEqual("OrderState");
        });
      });
    });
  });
});
