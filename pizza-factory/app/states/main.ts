import { injectionNames, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";

import { ApplicationState } from "./application";
import { MergedSetupSet } from "../../config/handler";

/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
 */

@injectable()
export class MainState extends ApplicationState {
  constructor(@inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet) {
    super(stateSetupSet);
  }

  /**
   * The invokeGenericIntent method (GenericIntent.invoke) is your "main entrance" into your application. 
   * It is called as soon as the application is launched, e. g. if user says "launch xxxxx".
   */
  public invokeGenericIntent(machine: Transitionable) {
    this.prompt(this.t());
  }

  public async getIngredientsIntent(machine: Transitionable) {
    this.endSessionWith(this.t());
  }

  public async addIngredientsToPizzaIntent(machine: Transitionable) {
    this.endSessionWith(this.t());
  }
}