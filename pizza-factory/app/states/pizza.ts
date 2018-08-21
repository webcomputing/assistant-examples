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

    await this.sessionFactory().set("ingredientList", addedIngredient);
    this.prompt(this.t({ ingredient: addedIngredient }));
  }

  public yesGenericIntent() {
    this.prompt(this.t());
  }

  public async noGenericIntent(machine: Transitionable) {
    const ingredientList = (await this.sessionFactory().get("ingredientList")) || "";

    this.prompt(this.t({ ingredient: ingredientList }));
    return machine.transitionTo("OrderState");
  }
}
