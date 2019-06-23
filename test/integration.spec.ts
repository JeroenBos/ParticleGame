import 'mocha';
import { engine, particleGenerator, collisionHandler, collisionDetector, confiner } from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../particle";
import { CollisionHandler } from '../physics/collisionHandler';
import { assertTotalConservations } from './testhelper';

type TestEngine = { projectAll(particles: Readonly<ParticleProps>[]): Readonly<ParticleProps>[] };

describe('Integration tests', () => {
    it('The same as diplayed in the html', () => {
        // arrange
        const stepCount = 100;
        const generatedParticles = particleGenerator.generate();
        const initialParticles = engine.resolveInitialCollisions(generatedParticles);

        // act
        // debugger;
        let particles = initialParticles;
        for (let i = 0; i < stepCount; i++) {
            particles = engine.evolve(particles);
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
            particles = engine.evolve(particles);

            // assert
            assertTotalConservations(particlesBefore, particles, confiner);
            confiner.resetImpartedMomentum();
        }
    });
});
