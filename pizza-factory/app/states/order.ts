import { CurrentSessionFactory, EntityDictionary, injectionNames, Transitionable } from "assistant-source";
import { inject, injectable } from "inversify";

import { MergedSetupSet } from "../../config/handler";
import { ApplicationState } from "./application";

/**
 * This is your OrderState.
 * After the user has finished his pizza, he has the possibility to add ingredients to another pizza or to finish his order
 */
@injectable()
export class OrderState extends ApplicationState {
  constructor(
    @inject(injectionNames.current.stateSetupSet) stateSetupSet: MergedSetupSet,
    @inject(injectionNames.current.entityDictionary) private entities: EntityDictionary,
    @inject(injectionNames.current.sessionFactory) private sessionFactory: CurrentSessionFactory
  ) {
    super(stateSetupSet);
  }

  /**
   * This intent is called, if the user wants to add ingredients to another pizza
   */
  public async yesGenericIntent(machine: Transitionable) {
    this.prompt(this.t());
    return machine.transitionTo("PizzaState");
  }

  /**
   * This intent is called, if the user has finished his order
   * The assistant generate a list with all pizzas and their associated toppings and return it
   */
  public async noGenericIntent() {
    const pizzasWithToppingsArray: string[][] = this.parseStringifiedPizzasWithToppingsArrayToStringArray(
      await this.sessionFactory().get("pizzasWithToppingsArray")
    );

    // create a readable string
    const result: string = (await Promise.all(
      pizzasWithToppingsArray.map(
        async pizzasWithToppings => `${await this.t(".pizzaDelivery.aPizzaWith")} ${pizzasWithToppings.join(", ").replace(/,(?!.*,)/, ` and`)}`
      )
    ))
      .join(".")
      .replace(/[.](?=.*[.])/g, `, `)
      .replace(/[.](?!.*[.])/, ` ${await this.t(".connectors.and")} `);

    this.endSessionWith(
      this.t({
        pizzas:
          pizzasWithToppingsArray.length > 1
            ? result.concat(`! ${await this.t(".beginning.they")}`)
            : result.concat(`! ${await this.t(".pizzaDelivery.yourPizza")}`),
      })
    );
  }
}
