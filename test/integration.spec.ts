import 'mocha';
import { engine, particleGenerator, collisionHandler, collisionDetector, confiner, dt } from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../particle";
import { assertTotalConservations } from './testhelper';

type TestEngine = { projectAll(particles: Readonly<ParticleProps>[]): Readonly<ParticleProps>[] };

describe('Integration tests', () => {
    it('The same as diplayed in the html', () => {
        // arrange
        const stepCount = 100;
        const generatedParticles = particleGenerator.generate();
        const initialParticles = engine.resolveInitialCollisions(generatedParticles);

        // act
        debugger;
        let particles = initialParticles;
        for (let i = 0; i < stepCount; i++) {
            const particlesBefore = particles;
            if(i == 41){
                console.log();
            }
            particles = engine.evolve(particles, 1);
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
});
