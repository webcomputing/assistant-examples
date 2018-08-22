import { EntityDictionary, injectionNames, Transitionable } from "assistant-source";
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
export class OrderState extends ApplicationState {
  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet,
    @inject(injectionNames.current.entityDictionary) public entities: EntityDictionary
  ) {
    super(stateSetupSet);
  }

  public yesGenericIntent() {
    this.prompt(this.t());
  }

  public async noGenericIntent(machine: Transitionable) {
    this.prompt(this.t());
  }
}
