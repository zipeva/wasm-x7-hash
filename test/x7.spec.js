/* global describe, it, before */

const { expect } = require('chai');
const loadX7 = require('../lib/x7');

const {
  fox,
  empty,
  dash,
  longDream,
  buffer,
} = require('./fixtures');

// Define a constant timestamp for consistency
const TIMESTAMP = 1234567890; // Replace with an appropriate value if needed

describe('x7', () => {
  let x7;
  before(async () => {
    x7 = await loadX7();
  });

  describe('hashes', () => {
    it('empty string', async () => {
      expect(x7.digest(empty, TIMESTAMP).toString('hex'))
        .to.equal('2696a41483fc7b9159790d31954124bffdfe1e9b3e04ed6283ccd3a15e822400');
    });

    it('fox string', async () => {
      expect(x7.digest(fox, TIMESTAMP).toString('hex'))
        .to.equal('88cf9eeeae755398d966e89e304b67486da409cfebad034bcdcb99603002d046');
    });

    it('dash string', async () => {
      expect(x7.digest(dash, TIMESTAMP).toString('hex'))
        .to.equal('2d0c762fb300331b3d3a56ccd10e296c2eb0b7153e3eb6d4fddaf1ce2558032a');
    });

    it('dream string', async () => {
      expect(x7.digest(longDream, TIMESTAMP).toString('hex'))
        .to.equal('99d3277265007c08bbaab973e15ce3429232d43d305d5a2a3daffe6dd492404c');
    });

    it('buffer', async () => {
      expect(x7.digest(buffer, TIMESTAMP).toString('hex'))
        .to.equal('17f59a813a1c8b90e07f9ea1b97185d406f27633979517754bb988abb63b930b'); 
    });
  });
});
