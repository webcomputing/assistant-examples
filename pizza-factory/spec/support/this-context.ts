import { AlexaSpecHelper, AlexaSpecificHandable, AlexaSpecificTypes } from "assistant-alexa";
import { GoogleSpecHelper } from "assistant-google";
import { AssistantJSSetup, CurrentSessionFactory, intent, SpecHelper, TranslateValuesFor } from "assistant-source";
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
}
