import 'mocha';
import { engine, particleGenerator, collisionHandler, collisionDetector } from '../app/config';
import { assert } from "../jbsnorro";
import { ParticleProps } from "../particle";
import { TestEngine } from '../physics/engine';


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
            particles = engine.evolve(particles);
            if (collisionDetector.count > 2) {
                console.log(JSON.stringify(particlesBefore));
                debugger;
            }
        }

        // assert
        assert(particles.length == 2);
    });


});
