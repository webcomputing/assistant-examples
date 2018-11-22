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
   * Create key for session storage
   * @param {string|undefined} unparsedAmountOfPizzas
   */
  public returnSessionStorageKey(unparsedAmountOfPizzas: string | undefined): string {
    return "pizza" + this.parseAmountOfPizzasToNumber(unparsedAmountOfPizzas);
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
   * Parse stringified topping array or return a empty string if undefined
   * @param {string|undefined} unparsedAmountOfPizzas
   */
  public parseAmountOfPizzasToNumber(unparsedAmountOfPizzas: string | undefined): number {
    // check if undefined
    const amountOfPizzas: number = unparsedAmountOfPizzas !== undefined ? Number(unparsedAmountOfPizzas) : 0;
    return amountOfPizzas;
  }

  /**
   * Create a readable string with all toppings
   * @param {string[]} toppingArray
   */
  public async parseToppingList(toppingArray: string[]): Promise<string> {
    return toppingArray.join(", ").replace(/,(?!.*,)/, ` ${await this.t(".connectors.and")}`);
  }
}
