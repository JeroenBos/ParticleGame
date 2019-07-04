import 'mocha'; 
import config from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../app/particle";
import { assertTotalConservations } from './testhelper';
import { Particle } from '../physics';

const { engine, collisionHandler, collisionDetector, confiner, dt_ms, maxTime_ms, particleGenerator } = config;

describe('HTML', () => {
    it('The same as diplayed in the html', () => {
        // arrange
        const stepCount = maxTime_ms / dt_ms;
        const generatedParticles = particleGenerator.generate();
        const initialParticles = engine.resolveInitialCollisions(generatedParticles);

        // act
        debugger;
        let particles = initialParticles;
        for (let i = 0; i < stepCount; i++) {
            const particlesBefore = particles;
            particles = engine.evolve(particles, dt_ms);
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
            particles = engine.evolve(particles, dt_ms);

            // assert
            assertTotalConservations(particlesBefore, particles, confiner);
            confiner.resetImpartedMomentum();
        }
    });
});