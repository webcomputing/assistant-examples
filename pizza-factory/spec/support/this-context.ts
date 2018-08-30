import { AlexaSpecHelper } from "assistant-alexa";
import { GoogleSpecHelper } from "assistant-google";
import { AssistantJSSetup, CurrentSessionFactory, SpecHelper, TranslateValuesFor } from "assistant-source";
import { Container } from "inversify-components";

export interface ThisContext {
  assistantJs: AssistantJSSetup;
  specHelper: SpecHelper;
  platforms: {
    alexa: AlexaSpecHelper;
    googleAssistant: GoogleSpecHelper;
  };
  container: Container;
  translateValuesFor(): TranslateValuesFor;
}
