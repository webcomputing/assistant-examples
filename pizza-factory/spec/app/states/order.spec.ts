import { injectionNames, SessionFactory } from "assistant-source";
import { OrderState } from "../../../app/states/order";
import { ThisContext } from "../../support/this-context";

interface CurrentThisContext extends ThisContext {
  currentState: OrderState;
}

describe("OrderState", function() {
  beforeEach(async function(this: CurrentThisContext) {
    this.fixMathSeed();
  });

  describe("on platform = alexa", function() {
    describe("yesGenericIntent", function() {
      describe("start new order", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("OrderState", "yesGenericIntent");
          await this.runMachineAndGetResults("OrderState");
        });

        it("invites the user to add toppings to another pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("orderState.yesGenericIntent"))[0]);
        });

        it("transits to PizzaState", async function() {
          const state = await this.getCurrentStateName();
          expect(state).toEqual("PizzaState");
        });
      });
    });

    describe("noGenericIntent", function() {
      describe("order 1 pizza with 1 topping", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const pizzasWithToppingsArray = [["salami"]];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with salami! ${await this.translateValuesFor()("root.pizzaDelivery.yourPizza")}`,
            }))[0]
          );
        });
      });

      describe("order 1 pizza with 2 toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const pizzasWithToppingsArray = [["salami", "gouda"]];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with salami and gouda! ${await this.translateValuesFor()("root.pizzaDelivery.yourPizza")}`,
            }))[0]
          );
        });
      });

      describe("order 1 pizza with 3 toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const pizzasWithToppingsArray = [["salami", "gouda", "spinach"]];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with salami, gouda and spinach! ${await this.translateValuesFor()("root.pizzaDelivery.yourPizza")}`,
            }))[0]
          );
        });
      });

      describe("order more pizzas", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const pizzasWithToppingsArray = [["tuna"], ["salami", "gouda", "spinach"], ["gouda", "tuna", "tomatoes"], ["onions", "spinach"]];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with tuna, a pizza with salami, gouda and spinach, a pizza with gouda, tuna and tomatoes and a pizza with onions and spinach! ${await this.translateValuesFor()(
                "root.beginning.they"
              )}`,
            }))[0]
          );
        });
      });

      describe("finish", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.runMachineAndGetResults("OrderState");
        });

        it("ends session", async function(this: CurrentThisContext) {
          expect(this.responseHandlerResults).toEndSession();
        });
      });
    });
  });
});
