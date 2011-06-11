var assert = require('assert');

/**
 * @param members A hash keyed by member names, with required types as the values
 */
var Contract = module.exports = function(members) {
  this.members = members;
  var contract = this;

  /**
   * Test target against the interface
   *
   * @param target Class to test against
   * @returns true or false
   */
  this.implementedBy = function(target) {
    for(var i in this.members) {
      // Compare types against the interface members
      if(typeof target[i] !== typeof this.members[i]) {
        return false;
      }

      // Compare function signatures
      if(typeof this.members[i] === 'function' && this.members[i].length !== target[i].length) {
        return false;
      }
    }
    return true;
  };

  /**
   * Get a batch of Vows for an *Implementation* of this Contract
   *
   * If all these generated tests pass on your implementation, then calling implementedBy()
   * on the contract that generated the tests, passing your implementation as the argument,
   * will return true. Likewise, if the tests fail, the implementedBy() call will return false.
   *
   * @usage
   * addBatch({
   *   "YourImplementation": {
   *     topic: YourImplementation,
   *     "": YourContract.getVowsFor(YourImplementation),
   *     "the rest of your tests...": {
   *     }
   *   }
   * });
   *
   * @param implementation Contract implementation to generate vows for
   * @returns Vows context, to be inserted into a batch, as a context with an empty name
   */
  this.getVowsFor = function(implementation) {
    var batch = {};

    for(var member_name in contract.members) {
      var context = "." + member_name;
      batch[context] = {topic: member_name,};

      batch[context][" should be a " + typeof contract.members[member_name]] = function(topic) {
        assert.equal(typeof(implementation[topic]), typeof(contract.members[topic]));
      }

      if(typeof contract.members[member_name] === "function") {
        batch[context][" should take " + contract.members[member_name].length + " arguments"] =
          function(topic) {assert.equal(contract.members[topic].length, implementation[topic].length);};
      }
    }

    return batch;
  };
}
