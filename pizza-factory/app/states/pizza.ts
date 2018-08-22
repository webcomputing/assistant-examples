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

  @needs("ingredient")
  public async addIngredientToPizzaIntent(machine: Transitionable): Promise<void> {
    const addedIngredient = this.entities.getClosest("ingredient", ["salami", "tuna", "gouda", "onions", "tomatoes", "spinach"]) as string;

    if ((await this.sessionFactory().get("ingredientArray")) !== undefined) {
      const tempIngredientArray = JSON.parse((await this.sessionFactory().get("ingredientArray")) || "");
      tempIngredientArray.push(addedIngredient);
      await this.sessionFactory().set("ingredientArray", JSON.stringify(tempIngredientArray));
    } else {
      await this.sessionFactory().set("ingredientArray", JSON.stringify([addedIngredient]));
    }

    this.prompt(this.t({ ingredient: addedIngredient }));
  }

  public yesGenericIntent() {
    this.prompt(this.t());
  }

  public async noGenericIntent(machine: Transitionable) {
    const ingredientArray = JSON.parse((await this.sessionFactory().get("ingredientArray")) || "");
    let ingredientList: string = "";
    let counter: number = 1;

    for (const ingredient of ingredientArray) {
      if (counter < ingredientArray.length) {
        ingredientList += ingredient + ", ";
        counter++;
      } else {
        ingredientList += "and " + ingredient;
      }
    }

    // TBD Kommentare ergänzen

    this.prompt(this.t({ ingredient: ingredientList }));
    return machine.transitionTo("OrderState");
  }
}
