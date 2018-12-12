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

        it("invites the user to adds toppings to another pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("orderState.yesGenericIntent"))[0]);
        });

        it("transits to PizzaState", async function() {
          this.params.state = await this.getCurrentStateName();
          expect(this.params.state).toEqual("PizzaState");
        });
      });
    });

    describe("noGenericIntent", function() {
      beforeEach(async function(this: CurrentThisContext) {
        this.params.pizzasWithToppingsArray = [["salami"]];
      });

      describe("order 1 pizza with 1 topping", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(this.params.pizzasWithToppingsArray));
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
          this.params.pizzasWithToppingsArray[0].push("gouda");
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(this.params.pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with ${this.params.pizzasWithToppingsArray[0][0]} and ${
                this.params.pizzasWithToppingsArray[0][1]
              }! ${await this.translateValuesFor()("root.pizzaDelivery.yourPizza")}`,
            }))[0]
          );
        });
      });

      describe("order 1 pizza with 3 toppings", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.pizzasWithToppingsArray[0].push("gouda", "spinach");
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(this.params.pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with ${this.params.pizzasWithToppingsArray[0][0]}, ${this.params.pizzasWithToppingsArray[0][1]} and ${
                this.params.pizzasWithToppingsArray[0][2]
              }! ${await this.translateValuesFor()("root.pizzaDelivery.yourPizza")}`,
            }))[0]
          );
        });
      });

      describe("order more pizzas", function() {
        beforeEach(async function(this: CurrentThisContext) {
          this.params.pizzasWithToppingsArray = [["tuna"], ["salami", "gouda", "spinach"], ["gouda", "tuna", "tomatoes"], ["onions", "spinach"]];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(this.params.pizzasWithToppingsArray));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: `a pizza with ${this.params.pizzasWithToppingsArray[0][0]}, a pizza with ${this.params.pizzasWithToppingsArray[1][0]}, ${
                this.params.pizzasWithToppingsArray[1][1]
              } and ${this.params.pizzasWithToppingsArray[1][2]}, a pizza with ${this.params.pizzasWithToppingsArray[2][0]}, ${
                this.params.pizzasWithToppingsArray[2][1]
              } and ${this.params.pizzasWithToppingsArray[2][2]} and a pizza with ${this.params.pizzasWithToppingsArray[3][0]} and ${
                this.params.pizzasWithToppingsArray[3][1]
              }! ${await this.translateValuesFor()("root.beginning.they")}`,
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
