beforeEach(function() {
  this.prepareCurrentStateForTest = async (stateName, intent, additionalExtractions = undefined) => {
    // Tell AssistantJS that the assistant called the "intent", but do not run state machine yet
    this.responseHandler = await this.callIntent(intent, false, additionalExtractions);
    // Store the State instance which will be used
    this.currentState = this.grabState(stateName);
  };
  this.prepareAndRunCurrentStateForTest = async (stateName, intent, additionalExtractions = undefined) => {
    await this.prepareCurrentStateForTest(stateName, intent, additionalExtractions);
    // Run state machine!
    await this.specHelper.runMachine(stateName);
    this.responseHandlerResults = this.specHelper.getResponseResults();
    this.responseHandlerResults;
  };
  /** Sets context if i18next, if needed */
  this.setI18nContext = (stateName, intentName) => {
    const context = this.container.inversifyInstance.get("core:i18n:current-context");
    context.state = stateName;
    context.intent = intentName;
  };
});
