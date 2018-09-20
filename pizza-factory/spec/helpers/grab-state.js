beforeEach(function() {
  this.grabState = stateName => {
    const stateFactory = this.container.inversifyInstance.get("core:state-machine:state-factory");
    return stateFactory(stateName);
  };
});
