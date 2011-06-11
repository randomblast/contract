var vows = require('vows');
var assert = require('assert');

var Contract = require('./');

var TestContract = new Contract({
  test_function: function(arg_1, arg_2, arg_3) {},
  test_string: "",
  test_bool: true,
  test_int: 1
});

var TestContractCorrectImplementation = {
  test_function: function(arg_1, arg_2, arg_3) {
    return arg_1 + ' ' + arg_2 + ' ' + arg_3;
  },
  test_string: "The content doesn't matter. You just have to be there",
  test_bool: true, // Why not
  test_int: 3.141
}

var TestContractIncorrectImplementation = {
  test_function: function(arg_1, arg_2) {
    return arg_1 + arg_2;
  },
  test_string: "The content doesn't matter. You just have to be there",
  test_bool: true, // Why not
  test_int: 3.141
}

var TestContractIncompleteImplementation = {
  test_function: function(arg_1, arg_2, arg_3) {
    return arg_1 + ' ' + arg_2 + ' ' + arg_3;
  },
  test_string: "The content doesn't matter. You just have to be there",
}

vows.describe('Contract').addBatch({
  "TestContract": {
    topic: TestContract,
    "should be an instance of 'Contract'": function(TestContract) {
      assert.isTrue(TestContract instanceof Contract);
    },

    ".implementedBy(<a correct implementation>)": {
      topic: TestContract.implementedBy(TestContractCorrectImplementation),
      "should return true": function(topic) {assert.isTrue(topic);}
    },

    ".implementedBy(<an incomplete implementation>)": {
      topic: TestContract.implementedBy(TestContractIncompleteImplementation),
      "should return false": function(topic) {assert.isFalse(topic);}
    },

    ".implementedBy(<complete implementation, except a function has a different number of arguments>)": {
      topic: TestContract.implementedBy(TestContractIncorrectImplementation),
      "should return false": function(topic) {assert.isFalse(topic);}
    },
  }
})
.addBatch({
  "TestContractCorrectImplementation": {
    topic: TestContractCorrectImplementation,
    // This is the correct way to add automatically generated vows
    "": TestContract.getVowsFor(TestContractCorrectImplementation),
    ".test_function('Goodbye', 'cruel', 'world')": {
      topic: function(self) {return self.test_function('Goodbye', 'cruel', 'world');},
      "should return 'Goodbye cruel world'": function(topic) {
        assert.equal(topic, 'Goodbye cruel world');
      }
    }
  }
})

/* Enable these batches if you want to test correct failure of automatic Contract vows
.addBatch({
  "TestContractIncorrectImplementation": {
    topic: TestContractIncorrectImplementation,
    // This is the correct way to add automatically generated vows
    "": TestContract.getVowsFor(TestContractIncorrectImplementation),
    ".test_function('Goodbye', 'cruel', 'world')": {
      topic: function(self) {return self.test_function('Goodbye', 'cruel', 'world');},
      "should return 'Goodbye cruel world'": function(topic) {
        assert.equal(topic, 'Goodbye cruel world');
      }
    }
  }
})
.addBatch({
  "TestContractIncompleteImplementation": {
    topic: TestContractIncompleteImplementation,
    // This is the correct way to add automatically generated vows
    "": TestContract.getVowsFor(TestContractIncompleteImplementation),
    ".test_function('Goodbye', 'cruel', 'world')": {
      topic: function(self) {return self.test_function('Goodbye', 'cruel', 'world');},
      "should return 'Goodbye cruel world'": function(topic) {
        assert.equal(topic, 'Goodbye cruel world');
      }
    }
  }
})
*/

.export(module);
