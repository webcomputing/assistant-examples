import { BaseState } from "assistant-source";
import { injectable, unmanaged } from "inversify";
import { MergedSetupSet, MergedAnswerTypes, MergedHandler } from "../../config/handler";

@injectable()
export class ApplicationState extends BaseState<MergedAnswerTypes, MergedHandler> {
  constructor(@unmanaged() setupSet: MergedSetupSet) {
    super(setupSet);
  }

  /** 
   * Called if user says "Help me!" or "What can I do now?"
   */
  helpGenericIntent() {
    this.prompt(this.t());
  }

  /**
   * User wants to abort, meaning - as a default - end the application.
   */
  cancelGenericIntent() {
    this.endSessionWith(this.t());
  }
}
