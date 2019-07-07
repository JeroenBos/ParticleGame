import './integration.spec';
import './collision.detector.spec';
import './collision.handler.spec';
import './engine.spec';
import './geometry.spec';
import './forceComputer.spec';
import './countToπ.spec';
import './html.spec';


import * as seedrandom from 'seedrandom';
describe('seedrandom', () => {
    it('import succeeded', () => {
        const x = seedrandom('0')();
        if (!(0 < x && x < 1)) throw new Error();
    });
});
