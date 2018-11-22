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
   * The user names one of the predefined toppings
   * Available toppings are: salami, tuna, gouda, onions, tomatoes, spinach
   * If you want to extend the available toppings, you have to add this topping to the valid toppings array in the entityDictionary
   */
  @needs("topping")
  public async addToppingToPizzaIntent(machine: Transitionable): Promise<void> {
    // with the help of levenshtein distance the entityDictionary get one of the valid toppings
    const addedTopping = this.entities.getClosest("topping", ["salami", "tuna", "gouda", "onions", "tomatoes", "spinach"]) as string;
    // get the actual amount of pizzas and generate a key for the sessionFactory
    const key: string = this.returnSessionStorageKey(await this.sessionFactory().get("amountOfPizzas"));

    const toppingArray = await this.sessionFactory().get(key);

    // check, if this is the first topping on the pizza
    if (toppingArray !== undefined) {
      // if the topping is not the first, all toppings so far get stored in a temporaryArray
      const tempToppingArray = JSON.parse(toppingArray);
      // push new topping to temporaryArray
      tempToppingArray.push(addedTopping);
      // store temporaryArray with new topping in sessionFactory
      await this.sessionFactory().set(key, JSON.stringify(tempToppingArray));
    } else {
      await this.sessionFactory().set(key, JSON.stringify([addedTopping]));
    }

    this.prompt(this.t({ topping: addedTopping }));
  }

  /**
   * This intent is called, if the user wants to know, which ingredients are added on his pizza so far
   * Return all added toppings
   */
  public async getCurrentToppingsIntent() {
    // get the actual amount of pizzas and generate a key for the sessionFactory
    const key: string = this.returnSessionStorageKey(await this.sessionFactory().get("amountOfPizzas"));

    // parse toppingArray to
    const toppingArray = this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get(key));

    // check, if toppingList is empty
    if (toppingArray.length === 0) {
      this.prompt(this.t(".noToppings"));
    } else {
      this.prompt(this.t(".addedToppings", { topping: await this.parseToppingList(toppingArray) }));
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
    // get the actual amount of pizzas and generate a key for the sessionFactory
    const key: string = this.returnSessionStorageKey(await this.sessionFactory().get("amountOfPizzas"));

    // create a readable string with all toppings
    const toppingList = await this.parseToppingList(this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get(key)));

    this.prompt(this.t({ topping: toppingList }));
    return machine.transitionTo("OrderState");
  }
}
