import { CurrentSessionFactory, injectionNames, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";

import { MergedSetupSet } from "../../config/handler";
import { ApplicationState } from "./application";

/**
 * This is your MainState.
 * Every assistantJS application has to have a state called "MainState", which acts as the default state applied when the conversation starts.
 * Therefore all intent methods implemented here can be called directly from the starting point.
 */

@injectable()
export class MainState extends ApplicationState {
  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet,
    @inject(injectionNames.current.sessionFactory) public sessionFactory: CurrentSessionFactory
  ) {
    super(stateSetupSet);
    // TBD: Kommentare ergänzen
    // TBD: Tests schreiben
  }

  /**
   * The invokeGenericIntent method (GenericIntent.invoke) is your "main entrance" into your application.
   * It is called as soon as the application is launched, e. g. if user says "launch xxxxx".
   */
  public async invokeGenericIntent(machine: Transitionable) {
    await this.sessionFactory().set("amountOfPizzas", "1");
    this.prompt(this.t());
  }

  public getToppingsIntent() {
    this.prompt(this.t());
  }

  public async orderPizzaIntent(machine: Transitionable): Promise<void> {
    this.prompt(this.t());
    return machine.transitionTo("PizzaState");
  }
}
