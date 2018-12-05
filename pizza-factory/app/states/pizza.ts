import { CurrentSessionFactory, EntityDictionary, injectionNames, Transitionable } from "assistant-source";
import { needs } from "assistant-validations";
import { inject, injectable } from "inversify";

import { MergedSetupSet } from "../../config/handler";
import { ApplicationState } from "./application";

/**
 * This is the PizzaState
 * If the conversation is in the state, the user wants to order a pizza
 * The user can add toppings to his pizza and get all current toppings which he has add
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

  /**
   * This intent is called, if the user wants to add toppings to his pizza
   * The user choose one of the predefined toppings
   * Available toppings are: salami, tuna, gouda, onions, tomatoes, spinach
   * If you want to extend the available toppings, you have to add this topping to the valid toppings array in the entityDictionary
   */
  @needs("topping")
  public async addToppingToPizzaIntent(machine: Transitionable): Promise<void> {
    // with the help of levenshtein distance the entityDictionary get one of the valid toppings
    const addedTopping = this.entities.getClosest("topping", ["salami", "tuna", "gouda", "onions", "tomatoes", "spinach"]) as string;

    // store topping in session storage
    const temporaryToppingArray: string[] = this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("temporaryToppingArray"));
    temporaryToppingArray.push(addedTopping);
    await this.sessionFactory().set("temporaryToppingArray", JSON.stringify(temporaryToppingArray));

    this.prompt(this.t({ topping: addedTopping }));
  }

  /**
   * This intent is called, if the user wants to know, which ingredients are added on his pizza so far
   * Return all added toppings
   */
  public async getCurrentToppingsIntent() {
    const temporaryToppingArray: string[] = this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("temporaryToppingArray"));

    // check, if temporaryToppingArray is empty
    if (temporaryToppingArray.length === 0) {
      this.prompt(this.t(".noToppings"));
    } else {
      this.prompt(this.t(".addedToppings", { topping: await this.parseToppingListToReadableString(temporaryToppingArray) }));
    }
  }

  /**
   * This intent is called, if the user wants to add another topping to his pizza
   */
  public yesGenericIntent() {
    this.prompt(this.t());
  }

  /**
   * This intent is called, if the user is done adding toppings to his pizza
   * The assistant repeats all toppings and transit to OrderState
   */
  public async noGenericIntent(machine: Transitionable) {
    const temporaryToppingArray: string[] = this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("temporaryToppingArray"));

    this.prompt(this.t({ topping: await this.parseToppingListToReadableString(temporaryToppingArray) }));
    return machine.transitionTo("OrderState");
  }
}
