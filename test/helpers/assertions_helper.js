'use strict'

const {
  expect
} = require('chai')

class Assertions extends Helper {
  seeNumberOfElementsBetween(elementCount, minimum, maximum) {
    expect(elementCount >= minimum).to.be.true
    expect(elementCount <= maximum).to.be.true
  }

  seeNumberOfElementsAtLeastOne(elementCount, minimum) {
    expect(elementCount >= minimum).to.be.true
  }

  seeNumbersAreEqual(actual, expected) {
    expect(actual).to.equal(expected)
  }

  seeStringsAreEqual(actual, expected) {
    expect(actual).to.equal(expected)
  }

  seeTotalHasIncreased(actual, expected) {
    expect(actual > expected).to.be.true
  }

  seeTotalHasDecreased(actual, expected) {
    expect(actual < expected).to.be.true
  }
}

module.exports = Assertions