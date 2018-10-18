const assert = require('assert');
const { CosmosDBKeyEscape } = require('../');

describe('CosmosDBKeyEscape', function() {
    it('should handle possible collisions', function() {
        let validKey1 = '*2atest*2a';
        let validKey2 = '*test*';

        let escaped1 = CosmosDBKeyEscape.escapeKey(validKey1);
        let escaped2 = CosmosDBKeyEscape.escapeKey(validKey2);

        assert.notEqual(escaped1, escaped2, `${escaped1} should be different that ${escaped2}`)
    });
});