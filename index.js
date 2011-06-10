var assert = require('assert');

/**
 * @param members A hash keyed by member names, with required types as the values
 * @param vows Function which returns tests to be run against implementations
 */
var Contract = module.exports = function(members, vows) {
  this.members = members;
  this.implementation_vows = vows || function() {return {};};
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
   * This applies in the same context as implementedBy(), except it returns a batch of Vows that make
   * up the implementation comparison, ready for passing to vows.addBatch().
   */
  this.vows = function(implementation) {
    var batch = contract.implementation_vows(implementation);
    var name = this;

    // The single context should be the Contract to test
      for(var member_name in contract.members) {
        var context = "." + member_name;
        var vow =  " should be a " + typeof contract.members[member_name];
        batch[context] = {
          topic: function() {
            return (typeof(implementation[member_name]) == typeof(contract.members[member_name]));
          }
        };
        batch[context][vow] = function(topic) {assert.isTrue(topic);};
    }

    return batch;
  };
}
