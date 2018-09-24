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
  }

  /**
   * The invokeGenericIntent method (GenericIntent.invoke) is your "main entrance" into your application.
   * It is called as soon as the application is launched, if user says "launch pizza factory".
   */
  public async invokeGenericIntent(machine: Transitionable) {
    // set amount of pizzas to 1 in sessionFactory
    // it is important, if you want to order more than one pizza
    await this.sessionFactory().set("amountOfPizzas", "1");
    this.prompt(this.t());
  }

  /**
   * This intent is called, if the user wants to order a pizza
   * Transition to PizzaState
   * @param machine the state machine, can be used for transitions and redirects. Every intent method gets this parameter
   */
  public async orderPizzaIntent(machine: Transitionable): Promise<void> {
    this.prompt(this.t());
    return machine.transitionTo("PizzaState");
  }

  /**
   * return a list of all available toppings
   */
  public getToppingsIntent() {
    this.prompt(this.t());
  }
}
