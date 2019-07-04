import 'mocha';
import { assert } from "../jbsnorro";
import { Confiner } from '../physics/confinement';
import { Particle } from '../physics';
import configs from '../scenarios/countToπ';
import { DefaultConfig } from '../scenarios/_base';

function simulate(config: DefaultConfig) {
    let particles = config.particleGenerator.generate();
    for (let t = 0; t < config.maxTime_ms; t += config.dt_ms)
        particles = config.engine.evolve(particles, config.dt_ms / config.precision);
    return particles;
}
describe('countToπ', () => {
    it('m=16', () => {
        // arrange
        const config = configs.precision_m16;
        config.maxTime_ms = 10000;

        // act
        debugger;
        simulate(config);

        // assert
        const count = config.collisionDetector.count + config.confiner.bounces;
        assert(count == 12);
    });
});

