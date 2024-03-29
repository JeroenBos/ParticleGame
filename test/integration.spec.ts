import 'mocha'; 
import config from '../scenarios/test';
import { assert } from "../jbsnorro";
import { Particle } from '../physics';
import stardustConfig from '../scenarios/stardust';

const { engine, collisionHandler, collisionDetector, geometry, τ_max, particleGenerator } = config;

describe('Integration tests', () => {
    it('expected only 1 collision in specific case', () => {
        const originalCount = engine.collisionDetector.count;
        const particles = [
            { x: 51.7, y: 50, m: 1, radius: 2, vx: -1, vy: 0 },
            { x: 48.3, y: 52, m: 1, radius: 2, vx: 1, vy: 0 }
        ].map(Particle.create);

        debugger;
        engine.evolve(particles, engine.dτ);

        assert(engine.collisionDetector.count == 1 + originalCount);
    });

    it('near miss collided only once', () => {
        const originalCount = collisionDetector.count;
        // arrange
        let particles = [
            { x: 52, y: 50, vx: -1, vy: 0, radius: 2, m: 1 },
            { x: 50.1, y: 53.99, vx: 1, vy: 0, radius: 2, m: 1 }
        ].map(Particle.create);


        // act
        debugger;
        for (let i = 0; i < 10; i++) {
            particles = engine.evolve(particles, engine.dτ);
        }

        // assert
        assert(particles[0].x < 52);
        assert(particles[1].x > 50.1);
        assert(collisionDetector.count == 1 + originalCount);
    });

    it('color remains', () => {
        // arrange
        const initialParticles = stardustConfig.particleGenerator.generate();

        // act
        debugger;
        const particles = stardustConfig.engine.evolve(initialParticles, stardustConfig.dτ);

        // assert
        assert(initialParticles[0].type == 'black');
        assert(particles[0].type == 'black');
    });
});
