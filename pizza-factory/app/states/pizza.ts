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
   * Available toppings are: salami, tuna, gouda, onions, toamatoes, spinach
   * If you want to extend the available toppings, you have to add this topping to the valid toppings array in the entityDictionary
   * @param machine
   */
  @needs("topping")
  public async addToppingToPizzaIntent(machine: Transitionable): Promise<void> {
    // with the help of levenshtein distance the entityDictionary get one of the valid toppings
    const addedTopping = this.entities.getClosest("topping", ["salami", "tuna", "gouda", "onions", "tomatoes", "spinach"]) as string;
    // get the actual amount of pizzas and generate a key for the sessionFactory
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const key: string = "pizza" + amountOfPizzas;

    // check, if this is the first topping on the pizza
    if ((await this.sessionFactory().get(key)) !== undefined) {
      // if the topping is not the first, all toppings so far get stored in a temporaryArray
      const tempToppingArray = JSON.parse((await this.sessionFactory().get(key)) || "");
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
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const key: string = "pizza" + amountOfPizzas;
    // get all toppings out of sessionFactory
    const sessionToppingArray = await this.sessionFactory().get(key);

    // create a readable string with all toppings
    const toppingList: string = await this.getToppingList(sessionToppingArray);

    // check, if toppingList is empty
    if (toppingList === "") {
      this.prompt(this.t(".noToppings"));
    } else {
      this.prompt(this.t(".addedToppings", { topping: toppingList }));
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
   * @param machine
   */
  public async noGenericIntent(machine: Transitionable) {
    // get the actual amount of pizzas and generate a key for the sessionFactory
    const amountOfPizzas: string = (await this.sessionFactory().get("amountOfPizzas")) || "";
    const key: string = "pizza" + amountOfPizzas;
    // get all toppings out of sessionFactory
    const sessionToppingArray = await this.sessionFactory().get(key);

    // create a readable string with all toppings
    const toppingList = await this.getToppingList(sessionToppingArray);

    this.prompt(this.t({ topping: toppingList }));
    return machine.transitionTo("OrderState");
  }
}
