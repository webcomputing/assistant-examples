import { BaseState } from "assistant-source";
import { injectable, unmanaged } from "inversify";
import { MergedAnswerTypes, MergedHandler, MergedSetupSet } from "../../config/handler";

@injectable()
export class ApplicationState extends BaseState<MergedAnswerTypes, MergedHandler> {
  constructor(@unmanaged() setupSet: MergedSetupSet) {
    super(setupSet);
  }

  /**
   * Called if user says "Help me!" or "What can I do now?"
   */
  public helpGenericIntent() {
    this.prompt(this.t());
  }

  /**
   * User wants to abort, meaning - as a default - end the application.
   */
  public cancelGenericIntent() {
    this.endSessionWith(this.t());
  }

  public async getToppingList(sessionToppingArray) {
    let toppingArray = "";

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
