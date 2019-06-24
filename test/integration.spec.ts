import 'mocha';
import { engine, particleGenerator, collisionHandler, collisionDetector, confiner, dt, maxTime } from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../particle";
import { assertTotalConservations } from './testhelper';
import { Particle } from '../physics';

type TestEngine = { projectAll(particles: Readonly<ParticleProps>[]): Readonly<ParticleProps>[] };

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
            if (i == 410) {
                console.log();
            }
            particles = engine.evolve(particles, dt);
            console.log(`${i}. p1: {${particles[0].x}, ${particles[0].vx}}. p1: {${particles[1].x}, ${particles[1].vy}}, imparted: ${confiner.impartedMomentum.px}, collisions: ${collisionDetector.count}`);

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

        debugger;
        engine.evolve(particles, dt);
    });
});
