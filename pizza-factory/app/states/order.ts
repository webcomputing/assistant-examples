import { CurrentSessionFactory, EntityDictionary, injectionNames, Transitionable } from "assistant-source";
import { needs } from "assistant-validations";
import { inject, injectable } from "inversify";

import { MergedSetupSet } from "../../config/handler";
import { ApplicationState } from "./application";
import { PizzaState } from "./pizza";

/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
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

  public async yesGenericIntent(machine: Transitionable) {
    this.prompt(this.t());

    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const newAmountOfPizzas: number = +amountOfPizzas + 1;
    await this.sessionFactory().set("amountOfPizzas", String(newAmountOfPizzas));

    return machine.transitionTo("PizzaState");
  }

  public async noGenericIntent() {
    let pizzaList: string = "";
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";

    for (let i: number = 1; i <= +amountOfPizzas; i++) {
      pizzaList += "a pizza with ";

      const key: string = "pizza" + i;
      const sessionToppingArray = await this.sessionFactory().get(key);
      const toppingList = await this.getToppingList(sessionToppingArray);

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
