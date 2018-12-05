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

  /**
   * User wants to abort, meaning - as a default - end the application.
   */
  public stopGenericIntent() {
    this.endSessionWith(this.t());
  }

  /**
   * Parse stringified topping array and return an string array
   * Either its filled with toppings or if undefined its empty
   * @param {string|undefined} unparsedToppingArray
   */
  public parseStringifiedToppingArrayToStringArray(unparsedToppingArray: string | undefined): string[] {
    // check if undefined
    const toppingArray: string[] = unparsedToppingArray !== undefined ? JSON.parse(unparsedToppingArray) : [];
    return toppingArray;
  }

  /**
   * Parse stringified pizzaWithToppings array and return an string array
   * Either its filled with pizzaWithToppings or if undefined its empty
   * @param {string|undefined} unparsedToppingArray
   */
  public parseStringifiedPizzasWithToppingsArrayToStringArray(unparsedPizzasWithToppingsArray: string | undefined): string[][] {
    // check if undefined
    const pizzasWithToppingsArray: string[][] = unparsedPizzasWithToppingsArray !== undefined ? JSON.parse(unparsedPizzasWithToppingsArray) : [];
    return pizzasWithToppingsArray;
  }

  /**
   * Create a readable string with all toppings
   * @param {string[]} toppingArray
   */
  public async parseToppingListToReadableString(toppingArray: string[]): Promise<string> {
    return toppingArray.join(", ").replace(/,(?!.*,)/, ` ${await this.t(".connectors.and")}`);
  }
}
