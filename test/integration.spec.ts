import 'mocha'; 
import config from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../app/particle";
import { assertTotalConservations } from './testhelper';
import { Particle } from '../physics';

const { engine, collisionHandler, collisionDetector, confiner, dt, maxTime, particleGenerator } = config;

describe('Integration tests', () => {
    it('The same as diplayed in the html', () => {
        // arrange
        const stepCount = maxTime / dt;
        const generatedParticles = particleGenerator.generate();
        const initialParticles = engine.resolveInitialCollisions(generatedParticles);

        // act
        debugger;
        let particles = initialParticles;
        for (let i = 0; i < stepCount; i++) {
            const particlesBefore = particles;
            particles = engine.evolve(particles, dt);
            // console.log(`${i}. p1: {${particles[0].x}, ${particles[0].vx}}. p1: {${particles[1].x}, ${particles[1].vy}}, imparted: ${confiner.impartedMomentum.px}, collisions: ${collisionDetector.count}`);

            assertTotalConservations(particlesBefore, particles, confiner);

            confiner.resetImpartedMomentum();
        }

        // assert
        assert(particles.length == 2);
    });

    it('Center of mass is conserved', () => {
        // arrange
        const stepCount = 100;
        const generatedParticles = particleGenerator.generate();
        const initialParticles = engine.resolveInitialCollisions(generatedParticles);

        // act
        // debugger;
        let particles = initialParticles;
        for (let i = 1; i < stepCount; i++) {
            const particlesBefore = particles;
            particles = engine.evolve(particles, dt);

            // assert
            assertTotalConservations(particlesBefore, particles, confiner);
            confiner.resetImpartedMomentum();
        }
    });

    it('bug fix: collisions resolved but still not by 1e-07', () => {
        const particles = [
            { x: 109, y: 50, m: 1, radius: 9, vx: -10, vy: 0 },
            { x: 91, y: 53, m: 1, radius: 9, vx: 10, vy: 0 }
        ].map(Particle.create);

        // debugger;
        engine.evolve(particles, dt);
    });

    it('expected only 1 collision in specific case', () => {
        const originalCount = engine.collisionDetector.count;
        const particles = [
            { x: 51.7, y: 50, m: 1, radius: 2, vx: -1, vy: 0 },
            { x: 48.3, y: 52, m: 1, radius: 2, vx: 1, vy: 0 }
        ].map(Particle.create);

        debugger;
        engine.evolve(particles, dt);

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
            particles = engine.evolve(particles, dt);
        }

        // assert
        assert(particles[0].x < 52);
        assert(particles[1].x > 50.1);
        assert(collisionDetector.count == 1 + originalCount);
    });
});
