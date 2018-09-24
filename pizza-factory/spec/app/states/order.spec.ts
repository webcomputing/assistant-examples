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
      describe("increment amount of pizzas", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("OrderState", "yesGenericIntent");
          this.currentState = this.grabState<OrderState>(await this.getCurrentStateName());
          await this.currentState.sessionFactory().set("amountOfPizzas", "1");
          await this.runMachineAndGetResults("OrderState");
        });

        it("increments the amount of Pizzas", async function(this: CurrentThisContext) {
          const amountOfPizzas = (await this.currentState.sessionFactory().get("amountOfPizzas")) || 0;
          const newAmountOfPizzas: number = +amountOfPizzas + 1;
          expect(+newAmountOfPizzas).toBeGreaterThan(1);
          expect(newAmountOfPizzas).toBeGreaterThan(+amountOfPizzas);
        });
      });

      describe("start new order", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("OrderState", "yesGenericIntent");
          await this.runMachineAndGetResults("OrderState");
        });

        it("invite the user to add toppings to another pizza", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain((await this.translateValuesFor()("orderState.yesGenericIntent"))[0]);
        });

        it("transit to PizzaState", async function() {
          const state = await this.getCurrentStateName();
          expect(state).toEqual("PizzaState");
        });
      });
    });

    describe("noGenericIntent", function() {
      describe("order 1 pizza", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const myToppings = ["salami", "gouda", "spinach"];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.currentState.sessionFactory().set("amountOfPizzas", "1");
          await this.currentState.sessionFactory().set("pizza1", JSON.stringify(myToppings));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", { pizzas: "a pizza with salami, gouda and spinach! Your pizza" }))[0]
          );
        });
      });

      describe("order more pizzas", function() {
        beforeEach(async function(this: CurrentThisContext) {
          const myToppings1 = ["salami", "gouda", "spinach"];
          const myToppings2 = ["gouda", "tuna", "tomatoes"];
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.currentState.sessionFactory().set("amountOfPizzas", "2");
          await this.currentState.sessionFactory().set("pizza1", JSON.stringify(myToppings1));
          await this.currentState.sessionFactory().set("pizza2", JSON.stringify(myToppings2));
          await this.runMachineAndGetResults("OrderState");
        });

        it("returns the list of pizzas", async function(this: CurrentThisContext) {
          expect(await this.responseHandlerResults.voiceMessage!.text).toContain(
            (await this.translateValuesFor()("orderState.noGenericIntent", {
              pizzas: "a pizza with salami, gouda and spinach and a pizza with gouda, tuna and tomatoes! They",
            }))[0]
          );
        });
      });

      describe("finish", function() {
        beforeEach(async function(this: CurrentThisContext) {
          await this.prepareCurrentStateForTest("OrderState", "noGenericIntent");
          await this.runMachineAndGetResults("OrderState");
        });

        it("should end the pizza factory", async function(this: CurrentThisContext) {
          expect(this.responseHandlerResults.shouldSessionEnd).toBeTruthy();
        });
      });
    });
  });
});
