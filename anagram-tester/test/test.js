const TEST_URL = 'http://localhost:7071/api/test';

const axios = require('axios').default;

const examples = require('../anagrams/example.json');

var assert = require('assert');
describe('AnagramApiTesting', async function () {
  describe('/test', async function () {
    it('should return anagram=true when words are anagram', async function () {
      const words = examples.anagrams[getRandomInt(3)];
      const response = await axios.post(TEST_URL,words);
      assert.equal(response.data.anagram, true);
    });
    it('should return anagram=false when words are not anagram', async function () {
        const words = examples.notAnagrams[getRandomInt(1)];
        const response = await axios.post(TEST_URL,words);
        assert.equal(response.data.anagram, false);
      });
  });
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }