import { AlexaSpecHelper, AlexaSpecificHandable, AlexaSpecificTypes } from "assistant-alexa";
import { GoogleSpecHelper } from "assistant-google";
import { AssistantJSSetup, BaseState, CurrentSessionFactory, intent, SpecHelper, TranslateValuesFor } from "assistant-source";
import { Container } from "inversify-components";
import { MergedAnswerTypes, MergedHandler } from "../../config/handler";

export interface ThisContext {
  assistantJs: AssistantJSSetup;
  specHelper: SpecHelper;
  platforms: {
    alexa: AlexaSpecHelper;
    googleAssistant: GoogleSpecHelper;
    current: AlexaSpecHelper | GoogleSpecHelper;
  };
  container: Container;
  responseHandler: MergedHandler;

  /** resolved results from ResponseHandler after machine has run or ofter ResponseHandler.send() has been called */
  responseHandlerResults: Partial<MergedAnswerTypes>;
  translateValuesFor(): TranslateValuesFor;

  /** prepares current state with intent */
  prepareCurrentStateForTest(stateName: string, intent: intent, additionalExtractions?: {}): Promise<void>;

  /** prepares current state with intent and runs stateMachine immediately */
  prepareAndRunCurrentStateForTest(stateName: string, intent: intent, additionalExtractions?: {}): Promise<void>;

  resolveResponseHandlerResults(): Promise<void>;

  /**
   * Calls given intent with state machine. Creates the "current" context.
   * @param {intent} intent Name or identifier of the intent to call
   * @param {boolean} autoStart If set to true, state machine will start automatically
   * @param {object} additionalExtractions Additional extractions to use when calling this intent.
   * @return {Promise<MinimalResponseHandler>} the current response handler in promise
   */
  callIntent(intent: intent, autoStart?: boolean, additionalExtractions?: any): Promise<MergedHandler>;

  /**
   * Calls runMachine() and specHelper.getResponseResults()
   * @param state to use
   */
  runMachineAndGetResults(state?: string): Promise<void>;

  /** Returns a state instance by it's name. If you want to use spying, be sure to set stateMachineSetup.registerStatesInSingleton to true! */
  grabState<GivenState extends BaseState<MergedAnswerTypes, MergedHandler>>(stateName: string): GivenState;

  /** Sets context of core:i18n. Useful if you want to test states without hooks enabled / state machine */
  setI18nContext(stateName: string, intentName: string): void;
}
