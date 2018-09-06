import { CurrentSessionFactory, EntityDictionary, injectionNames, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";

import { MergedSetupSet } from "../../config/handler";
import { ApplicationState } from "./application";

/**
 * This is your OrderState.
 * After the user has finished his pizza, he has the possibility to add ingredients to another pizza or to finish his order
 */

@injectable()
export class OrderState extends ApplicationState {
  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet,
    @inject(injectionNames.current.entityDictionary) public entities: EntityDictionary,
    @inject(injectionNames.current.sessionFactory) public sessionFactory: CurrentSessionFactory
  ) {
    super(stateSetupSet);
  }

  /**
   * This intent is called, if the user wants to add ingredients to another pizza
   * @param machine
   */
  public async yesGenericIntent(machine: Transitionable) {
    this.prompt(this.t());

    // increment amount of pizzas
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const newAmountOfPizzas: number = +amountOfPizzas + 1;
    // every single pizza is stored in his own key-value pair
    await this.sessionFactory().set("amountOfPizzas", String(newAmountOfPizzas));

    return machine.transitionTo("PizzaState");
  }

  /**
   * This intent is called, if the user has finished his order
   * The assistant generate a list with all pizzas and their associated toppings and return it
   */
  public async noGenericIntent() {
    let pizzaList: string = "";
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";

    // iterate the key-value pair of pizzas
    for (let i: number = 1; i <= +amountOfPizzas; i++) {
      pizzaList += "a pizza with ";

      const key: string = "pizza" + i;
      const sessionToppingArray = await this.sessionFactory().get(key);
      // get toppingList
      const toppingList = await this.getToppingList(sessionToppingArray);

      // add toppingList to string
      pizzaList += toppingList;

      if (i + 1 === +amountOfPizzas) {
        pizzaList += " and ";
      } else if (i < +amountOfPizzas) {
        pizzaList += ", ";
      }
    }

    if (+amountOfPizzas > 1) {
      pizzaList += "! They";
    } else {
      pizzaList += "! Your pizza";
    }

    this.endSessionWith(this.t({ pizzas: pizzaList }));
  }
}
