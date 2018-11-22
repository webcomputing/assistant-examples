import { descriptor as alexaDescriptor } from "assistant-alexa";
import { descriptor as apiAiDescriptor } from "assistant-apiai";
import { descriptor as genericUtterancesDescriptor } from "assistant-generic-utterances";
import { descriptor as googleAssistantDescriptor } from "assistant-google";
import { AssistantJSSetup, FilterSetup, StateMachineSetup } from "assistant-source";
import { descriptor as validationsDescriptor } from "assistant-validations";
import componentConfiguration from "./config/components";

/**
 * Initialize AssistantJS
 * The only requirement for AssistantJS to work is to export an "assistantJs" object with the AssistantJSSetup configured.
 * Here, we are exporting all three used setups. Those setups are already initialized using the initializeSetups() function, see below.
 */
export const assistantJs = new AssistantJSSetup();
export const stateMachineSetup = new StateMachineSetup(assistantJs);
export const filterSetup = new FilterSetup(assistantJs);

/**
 * Initializes all needed setup types. This makes the initialization process, which is needed for a running production environment, reusable for specs.
 * @param localAssistantJs AssistantJS Setup object to initialize
 * @param localStateMachineSetup StateMachineSetup object to initialize
 * @param localFilterSetup FilterSetup object to initialize
 * @param addOnly If set to true, states will only be added, but not registered in the dependency injection container
 */
export function initializeSetups(
  localAssistantJs: AssistantJSSetup,
  localStateMachineSetup: StateMachineSetup,
  localFilterSetup: FilterSetup,
  addOnly = false
) {
  // Register all additional AssistantJS components
  localAssistantJs.registerComponent(alexaDescriptor);
  localAssistantJs.registerComponent(validationsDescriptor);
  localAssistantJs.registerComponent(apiAiDescriptor);
  localAssistantJs.registerComponent(genericUtterancesDescriptor);
  localAssistantJs.registerComponent(googleAssistantDescriptor);

  // Configure components
  localAssistantJs.addConfiguration(componentConfiguration);

  // Register all states and strategies
  localStateMachineSetup.registerByConvention(addOnly);

  // Register all filters
  localFilterSetup.registerByConvention(addOnly);
}

// Initialize the exported production setups
assistantJs.registerInternalComponents();
initializeSetups(assistantJs, stateMachineSetup, filterSetup);

// Print stack traces of rejected promises to console if we are in a non-production environment
// You possibly want to set up your own behaviour here
const nodeEnv = process.env.NODE_ENV;
if (!(typeof nodeEnv === "string" && nodeEnv.toLowerCase() === "production")) {
  process.on("unhandledRejection", exception => {
    if (typeof exception !== "undefined" && exception !== null) {
      console.log(exception);
    }
  });
}
