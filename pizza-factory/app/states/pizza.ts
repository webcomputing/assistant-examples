import { CurrentSessionFactory, EntityDictionary, injectionNames, Transitionable } from "assistant-source";
import { needs } from "assistant-validations";
import { inject, injectable } from "inversify";

import { MergedSetupSet } from "../../config/handler";
import { ApplicationState } from "./application";

/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
 */

@injectable()
export class PizzaState extends ApplicationState {
  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet,
    @inject(injectionNames.current.entityDictionary) public entities: EntityDictionary,
    @inject(injectionNames.current.sessionFactory) public sessionFactory: CurrentSessionFactory
  ) {
    super(stateSetupSet);
  }

  @needs("topping")
  public async addToppingToPizzaIntent(machine: Transitionable): Promise<void> {
    const addedTopping = this.entities.getClosest("topping", ["salami", "tuna", "gouda", "onions", "tomatoes", "spinach"]) as string;
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const key: string = "pizza" + amountOfPizzas;

    if ((await this.sessionFactory().get(key)) !== undefined) {
      const tempToppingArray = JSON.parse((await this.sessionFactory().get(key)) || "");
      tempToppingArray.push(addedTopping);
      await this.sessionFactory().set(key, JSON.stringify(tempToppingArray));
    } else {
      await this.sessionFactory().set(key, JSON.stringify([addedTopping]));
    }

    this.prompt(this.t({ topping: addedTopping }));
  }

  public async getCurrentToppingsIntent() {
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const key: string = "pizza" + amountOfPizzas;
    const sessionToppingArray = await this.sessionFactory().get(key);

    const toppingList = await this.getToppingList(sessionToppingArray);

    if (toppingList === "") {
      this.prompt("I'm sorry, you have not selected any toppings yet!");
    } else {
      this.prompt(this.t({ topping: toppingList }));
    }
  }

  public yesGenericIntent() {
    this.prompt(this.t());
  }

  public async noGenericIntent(machine: Transitionable) {
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const key: string = "pizza" + amountOfPizzas;
    const sessionToppingArray = await this.sessionFactory().get(key);

    const toppingList = await this.getToppingList(sessionToppingArray);

    this.prompt(this.t({ topping: toppingList }));
    return machine.transitionTo("OrderState");
  }
}
