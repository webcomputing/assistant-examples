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
          const myTopping = "salami";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });
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
          const myTopping = "salamaWurst";
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });
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
          const myTopping = undefined;
          await this.prepareCurrentStateForTest("PizzaState", "addToppingToPizzaIntent", { entities: { topping: myTopping } });
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
          const myTopping = ["salami"];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent", {});
          this.currentState = this.grabState<PizzaState>(await this.getCurrentStateName());
          await this.currentState.sessionFactory().set("amountOfPizzas", "1");
          await this.currentState.sessionFactory().set("pizza1", JSON.stringify(myTopping));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("gets current topping on pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.getCurrentToppingsIntent.addedToppings", { topping: "salami" }))[0]
          );
        });
      });
      describe("pizza has more toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const myToppings = ["salami", "gouda", "spinach"];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent", {});
          this.currentState = this.grabState<PizzaState>(await this.getCurrentStateName());
          await this.currentState.sessionFactory().set("amountOfPizzas", "1");
          await this.currentState.sessionFactory().set("pizza1", JSON.stringify(myToppings));
          await this.runMachineAndGetResults("PizzaState");
        });

        it("gets current toppings on pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("pizzaState.getCurrentToppingsIntent.addedToppings", { topping: "salami, gouda and spinach" }))[0]
          );
        });
      });
      describe("pizza has no toppings yet", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const myToppings = [];
          await this.prepareCurrentStateForTest("PizzaState", "getCurrentToppingsIntent", {});
          this.currentState = this.grabState<PizzaState>(await this.getCurrentStateName());
          await this.currentState.sessionFactory().set("amountOfPizzas", "1");
          await this.currentState.sessionFactory().set("pizza1", JSON.stringify(myToppings));
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
      beforeEach(async function(this: CurrentThisContext) {
        await this.prepareCurrentStateForTest("PizzaState", "yesGenericIntent");
        await this.runMachineAndGetResults("PizzaState");
      });

      it("offers the user to add another topping to the pizza", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("pizzaState.yesGenericIntent"))[0]);
      });
    });

    describe("noGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        const myToppings = ["salami", "gouda", "spinach"];
        await this.prepareCurrentStateForTest("PizzaState", "noGenericIntent");
        this.currentState = this.grabState<PizzaState>(await this.getCurrentStateName());
        await this.currentState.sessionFactory().set("amountOfPizzas", "1");
        await this.currentState.sessionFactory().set("pizza1", JSON.stringify(myToppings));
        await this.runMachineAndGetResults("PizzaState");
      });

      it("finishes adding toppings to pizza and return topping List", async function(this: CurrentThisContext) {
        expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
          (await this.translateValuesFor()("pizzaState.noGenericIntent", { topping: "salami, gouda and spinach" }))[0]
        );
      });

      it("transit to OrderState", async function() {
        const state = await this.getCurrentStateName();
        expect(state).toEqual("OrderState");
      });
    });
  });
});
