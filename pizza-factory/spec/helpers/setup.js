require("reflect-metadata");
let initializeSetups = require("../../index").initializeSetups;
let AssistantSource = require("assistant-source");
let Alexa = require("assistant-alexa");
let GoogleAssistant = require("assistant-google");

beforeEach(function() {
  // Initialize AssistantJS spec helper and register some useful abbrevations
  this.specHelper = new AssistantSource.SpecHelper();
  this.assistantJs = this.specHelper.setup;
  this.container = this.assistantJs.container;

  // Initialize states, strategies, configuration, ... the same way index.ts does
  initializeSetups(this.assistantJs, new AssistantSource.StateMachineSetup(this.assistantJs), new AssistantSource.FilterSetup(this.assistantJs));

  // Initialize platform specific spec helpers; remember that all of them fulfill the AssistantSource.unifierInterfaces.PlatformSpecHelper interface!
  this.platforms = {
    alexa: new Alexa.AlexaSpecHelper(this.specHelper),
    googleAssistant: new GoogleAssistant.GoogleSpecHelper(this.specHelper),
  };

  // Set "current" platform to alexa as default
  this.platforms.current = this.platforms.alexa;

  // Execute bindings
  this.specHelper.prepare();

  // Shorten access to i18next helper
  this.translateValuesFor = () => this.container.inversifyInstance.get(AssistantSource.injectionNames.current.i18nTranslateValuesFor);
});
