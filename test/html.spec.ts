import 'mocha';
import config from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../app/particle";
import { assertTotalConservations } from './testhelper';
import { Particle } from '../physics';

const { engine, collisionHandler, collisionDetector, geometry, particleGenerator } = config;
const τ_max = Math.min(config.τ_max, 100000 * engine.dτ);

describe('HTML', () => {
    it('The same as diplayed in the html', () => {
        // arrange
        const stepCount = τ_max / engine.dτ;
        const generatedParticles = particleGenerator.generate();
        const initialParticles = engine.resolveInitialCollisions(generatedParticles);

        // act
        debugger;
        let particles = initialParticles;
        for (let i = 0; i < stepCount; i++) {
            const particlesBefore = particles;
            particles = engine.evolve(particles, engine.dτ);
            // console.log(`${i}. p1: {${particles[0].x}, ${particles[0].vx}}. p1: {${particles[1].x}, ${particles[1].vy}}, imparted: ${geometry.impartedMomentum.px}, collisions: ${collisionDetector.count}`);

            assertTotalConservations(particlesBefore, particles, geometry);

            geometry.resetImpartedMomentum();
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
            particles = engine.evolve(particles, engine.dτ);

            // assert
            assertTotalConservations(particlesBefore, particles, geometry);
            geometry.resetImpartedMomentum();
        }
    });
});