import { AlexaConfigurationAttribute } from "assistant-alexa";
import { ApiaiConfigurationAttribute } from "assistant-apiai";
import { AssistantJSConfiguration } from "assistant-source";
/*
 * In AssistantJS, every component may have it's own configuration settings. For example,
 * the interface "I18nConfiguration" describes the configuration of AssistantJS's internal
 * i18n component.
 * But to make it easier for you, you don't need to split up these configuations on your own: 
 * The interface "AssistantJSConfiguration" already describes all configuration options of all core AssistantJS components.
 *
 * If you want to add configuration settings from another component, for example "assistant-alexa", you
 * possibly want to add their interface using the intersection operator. For example:
 * > import { AlexaConfigurationAttribute } from "assistant-alexa";
 * > const configuration: AssistantJSConfiguration & AlexaConfigurationAttribute = ...
 */
const configuration: AssistantJSConfiguration & AlexaConfigurationAttribute & ApiaiConfigurationAttribute = {
  /** Configuration of AssistantJS's i18n component (interface = I18nConfiguration) */
  "core:i18n": {
    // This is basically the i18next configuration. Check out https://www.i18next.com/ for more information!
    i18nextAdditionalConfiguration: {
      // This entry is needed and tells i18next where to find your language files.
      backend: {
        loadPath: process.cwd() + "/config/locales/{{lng}}/{{ns}}.json",
      },
      lngs: ["en"],
      fallbackLng: "en",
      // If you encouter problems with i18next, change this to true
      debug: false,
    },
  },

  // There are also other settings available. Just have a look at the "AssistantJSConfiguration" interface.
  alexa: {
    applicationID: "amzn1.ask.skill.b65ad48a-e27e-4c0e-ba68-f687d18bf769",
    route: "/alexa",
    useVerifier: false,
    invocationName: "pizza factory",
    entities: {
      ASSISTANT_FOOD: "FOOD",
    },
  },

  apiai: {
    route: "/apiai",
    entities: {
      ASSISTANT_FOOD: "@sys.any",
    },
    authenticationHeaders: {
      myFirstSecretHeader: "myVerySecretValue",
      mySecondSecretHeader: "mySecondVerySecretValue",
    },
  },

  "core:unifier": {
    entities: {
      ASSISTANT_FOOD: ["ingredient"],
    },
    /* entitySets: {
      ingredients: {
        mapsTo: "LITERAL",
        values: {
          en: [
            {
              value: "cheese",
              synonyms: ["gouda"]
            },
            {
              value: "salami",
              synonyms: [""]
            }
          ]
        }
      }
    } */
  },
};

// The linking between your configuration and your application is done in your index.ts
export default configuration;
