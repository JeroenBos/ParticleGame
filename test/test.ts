import { Container } from "../Container";
import ParticleGenerator from "../particleGenerator";
import Engine from "../physics/engine";
import { CollisionDetector } from "../physics/collisionDetector";
import { CollisionHandler } from "../physics/collisionHandler";
import { ForceComputer } from "../physics/forceComputer";
import { Confiner } from "../physics/confinement";
import 'mocha';
import { width, height, engine, particleGenerator } from '../app/config';
import { assert } from "../jbsnorro";


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
            particles = engine.evolve(particles);
        }

        // assert
        assert(particles.length == 2);
    });
});
