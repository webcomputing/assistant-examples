beforeEach(function() {
  this.callIntent = async (intent, autoStart = true, additionalExtractions = undefined, getResponseHandlerResults = true) => {
    // Append device to context @ google
    const additionalGoogleContext = { body: { originalDetectIntentRequest: { payload: { surface: { capabilities: [] } } } } };
    const additionalContext = this.platforms.current === this.platforms.google ? additionalGoogleContext : {};
    // Append device to additionalExtractions
    if (typeof this._current_device !== "undefined") {
      additionalExtractions = { ...additionalExtractions, device: this._current_device };
    }
    // Append additional request context if wanted
    if (typeof this.additionalRequestContext !== "undefined") Object.assign(additionalContext, this.additionalRequestContext);
    let responseHandler = await this.platforms.current.pretendIntentCalled(intent, false, additionalExtractions, additionalContext);
    if (autoStart) {
      await this.specHelper.runMachine();
      // is only possible after running the statemachine
      if (getResponseHandlerResults) {
        this.responseHandlerResults = this.specHelper.getResponseResults();
      }
    }
    return responseHandler;
  };
  this.runMachineAndGetResults = async state => {
    await this.specHelper.runMachine(state);
    this.responseHandlerResults = this.specHelper.getResponseResults();
  };
});
