import 'mocha';
import { assert } from "../jbsnorro";
import { Confiner } from '../physics/confinement';
import { Particle } from '../physics';
import configs from '../scenarios/countToπ';
import { DefaultConfig } from '../scenarios/_base';

function simulate(config: DefaultConfig) {
    let particles = config.particleGenerator.generate();
    for (let t = 0; t < config.maxTime; t += config.dt)
        particles = config.engine.evolve(particles, config.dt);
    return particles;
}
describe('countToπ', () => {
    it('precision = 1', () => {
        // arrange
        const config = configs.precision4;

        // act
        debugger;
        simulate(config);

        // assert
        const count = config.collisionDetector.count;
        assert(count == 50);
    });
});

