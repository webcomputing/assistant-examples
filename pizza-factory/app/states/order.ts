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
    // every single pizza is stored in his own key-value pair
    // await this.sessionFactory().set("amountOfPizzas", String(this.parseAmountOfPizzasToNumber(await this.sessionFactory().get("amountOfPizzas")) + 1));

    // TBD Methode dafür
    // this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("pizzasWithToppingsArray"))

    const pizzasWithToppingsArray: string[][] = this.parseStringifiedPizzasWithToppingsArrayToStringArray(
      await this.sessionFactory().get("pizzasWithToppingsArray")
    );

    console.log("for dem pushen", await this.sessionFactory().get("pizzasWithToppingsArray"));

    pizzasWithToppingsArray.push(this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("temporaryToppingArray")));

    console.log("all currentPizzas:", pizzasWithToppingsArray);

    await this.sessionFactory().set("pizzasWithToppingsArray", JSON.stringify(pizzasWithToppingsArray));
    await this.sessionFactory().set("temporaryToppingArray", JSON.stringify([]));

    this.prompt(this.t());
    return machine.transitionTo("PizzaState");
  }

  /**
   * This intent is called, if the user has finished his order
   * The assistant generate a list with all pizzas and their associated toppings and return it
   */
  public async noGenericIntent() {
    // [['tuna', 'spinach', 'onions'], ['gouda', 'salami'], ['tuna', 'spinach', 'onions'] ]
    // a pizza with tuna, spinach and onions, a pizza with gouda and salami and a pizza with tuna, spinach and onions

    let pizzaList: string = "";
    const pizzaArray: string[] = [];

    const pizzasWithToppingsArray: string[][] = this.parseStringifiedPizzasWithToppingsArrayToStringArray(
      await this.sessionFactory().get("pizzasWithToppingsArray")
    );

    // const amountOfPizzas: number = this.parseAmountOfPizzasToNumber(await this.sessionFactory().get("amountOfPizzas"));

    // iterate the key-value pair of pizzas
    /* for (let i: number = 1; i <= amountOfPizzas; i++) {
      const toppings: string[] = this.parseStringifiedToppingArrayToStringArray(await this.sessionFactory().get("pizza" + i));
      pizzaArray.push(`${await this.t(".pizzaDelivery.aPizzaWith")} ` + toppings.join(", ").replace(/,(?!.*,)/, ` ${await this.t(".connectors.and")}`));
    } */

    // const test = pizzasWithToppingsArray.map(x => x.join(", ").replace(/,(?!.*,)/, ` and`));

    console.log("Vorher", pizzasWithToppingsArray);

    const tes = pizzasWithToppingsArray
      .map(pizzasWithToppings => pizzasWithToppings.join(", ").replace(/,(?!.*,)/, ` and`))
      .join(".")
      .replace(/[.](?=.*[.])/g, `, `)
      .replace(/[.](?!.*[.])/, ` ${await this.t(".connectors.and")} `);

    console.log("HUHU", tes);

    // create a readable string
    pizzaList = pizzaArray
      .join(".")
      .replace(/[.](?=.*[.])/g, `, `)
      .replace(/[.](?!.*[.])/, ` ${await this.t(".connectors.and")} `);

    this.endSessionWith(
      this.t({
        pizzas:
          pizzasWithToppingsArray.length > 1
            ? pizzaList.concat(`! ${await this.t(".beginning.they")}`)
            : pizzaList.concat(`! ${await this.t(".pizzaDelivery.yourPizza")}`),
      })
    );
  }
}
