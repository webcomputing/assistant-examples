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
    @inject(injectionNames.current.entityDictionary) private entities: EntityDictionary,
    @inject(injectionNames.current.sessionFactory) private sessionFactory: CurrentSessionFactory
  ) {
    super(stateSetupSet);
  }

  /**
   * This intent is called, if the user wants to add ingredients to another pizza
   */
  public async yesGenericIntent(machine: Transitionable) {
    this.prompt(this.t());

    // every single pizza is stored in his own key-value pair
    await this.sessionFactory().set("amountOfPizzas", String(this.parseAmountOfPizzasToNumber(await this.sessionFactory().get("amountOfPizzas")) + 1));

    return machine.transitionTo("PizzaState");
  }

  /**
   * This intent is called, if the user has finished his order
   * The assistant generate a list with all pizzas and their associated toppings and return it
   */
  public async noGenericIntent() {
    let pizzaList: string = "";
    const pizzaArray: string[] = [];
    const amountOfPizzas: number = this.parseAmountOfPizzasToNumber(await this.sessionFactory().get("amountOfPizzas"));

    // iterate the key-value pair of pizzas
    for (let i: number = 1; i <= amountOfPizzas; i++) {
      const test: string[] = this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("pizza" + i));

      pizzaList += test.join(", ").replace(/,(?!.*,)/, ` ${await this.t(".connectors.and")}`);
    }

    console.log("HSDKLFÖSDKLF", pizzaList);
    // a pizza with salami and a pizza with tuna and gouda and a pizza with spinach, onion and gouda! They

    /* toppingArray.join(", ").replace(/,(?!.*,)/, ` ${await this.t(".connectors.and")}`);

    pizzaList += "a pizza with ";

    const key: string = "pizza" + i;

    // create a readable string with all toppings
    const toppingList = await this.parseToppingList(this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get(key)));

    // add toppingList to string
    pizzaList += toppingList;

    if (i + 1 === amountOfPizzas) {
      pizzaList += " and ";
    } else if (i < amountOfPizzas) {
      pizzaList += ", ";
    } */

    if (amountOfPizzas > 1) {
      pizzaList += "! They";
    } else {
      pizzaList += "! Your pizza";
    }

    this.endSessionWith(this.t({ pizzas: pizzaList }));
  }
}
