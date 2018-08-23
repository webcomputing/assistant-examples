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

    if ((await this.sessionFactory().get("toppingArray")) !== undefined) {
      const tempToppingArray = JSON.parse((await this.sessionFactory().get("toppingArray")) || "");
      tempToppingArray.push(addedTopping);
      await this.sessionFactory().set("toppingArray", JSON.stringify(tempToppingArray));
    } else {
      await this.sessionFactory().set("toppingArray", JSON.stringify([addedTopping]));
    }

    this.prompt(this.t({ topping: addedTopping }));
  }

  public async getCurrentToppingsIntent() {
    const toppingList = await this.getToppingList();

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
    const toppingList = await this.getToppingList();

    this.prompt(this.t({ topping: toppingList }));
    return machine.transitionTo("OrderState");
  }

  private async getToppingList() {
    let toppingArray = "";
    const sessionToppingArray = await this.sessionFactory().get("toppingArray");

    if (sessionToppingArray !== undefined) {
      toppingArray = JSON.parse(sessionToppingArray);
    } else {
      toppingArray = "";
    }

    let toppingList: string = "";
    let counter: number = 1;

    for (const topping of toppingArray) {
      if (toppingArray === undefined) {
        toppingList = "";
      } else if (toppingArray.length === 1) {
        toppingList += topping;
      } else if (counter < toppingArray.length) {
        toppingList += topping + ", ";
        counter++;
      } else {
        toppingList = toppingList.substring(0, toppingList.length - 2);
        toppingList += " and " + topping;
      }
    }

    return toppingList;
  }
}
