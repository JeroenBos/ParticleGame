import 'mocha';
import { assert } from "../jbsnorro";
import { BoxGeometry } from '../physics/geometry';
import { Particle } from '../physics';
import configs from '../scenarios/countToπ';
import { DefaultConfig } from '../scenarios/_base';

describe('countToπ', () => {
    it('m=16', () => {
        // arrange
        const config = configs.precision_m16();
        config.dτ = 0.1;
        config.τ_max = 100;
        const originalParticles = config.particleGenerator.generate();

        // act
        debugger;
        config.engine.evolve(originalParticles, config.τ_max);

        // assert
        const count = config.collisionDetector.count + config.geometry.bounces;
        assert(count == 12);
    });
    it('m=64', () => {
        // arrange
        const config = configs.precision_m64();
        config.dτ = 0.01;
        config.τ_max = 600;
        const originalParticles = config.particleGenerator.generate();

        // act
        debugger;
        config.engine.evolve(originalParticles, config.τ_max);

        // assert
        const count = config.collisionDetector.count + config.geometry.bounces;
        assert(count == 25);
    });
    it('m=1', () => {
        // arrange
        const config = configs.precision0();
        config.dτ = 0.1;
        config.τ_max = 200;
        const originalParticles = config.particleGenerator.generate();

        // act
        debugger;
        config.engine.evolve(originalParticles, config.τ_max);

        // assert
        const count = config.collisionDetector.count + config.geometry.bounces;
        assert(count == 3);
    });

});

