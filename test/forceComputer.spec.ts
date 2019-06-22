import 'mocha';
import { CollisionHandler } from '../physics/collisionHandler';
import { ParticleProps } from "../particle";
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import Engine from '../physics/engine';
import { CollisionDetector } from '../physics/collisionDetector';
import { ForceComputer } from '../physics/forceComputer';
import { Confiner } from '../physics/confinement';
import { forceComputer } from '../app/config';

function createEngine(width: number = 100, height: number = 100) {
    return new Engine(new CollisionDetector(), new CollisionHandler(), new ForceComputer(), new Confiner(width, height));
}
describe('Force', () => {
    it('No force', () => {
        // arrange
        const particles = [{ x: 50, y: 50, vx: 10, vy: 0, radius: 30, m: 2 }, { x: 60, y: 50, vx: 10, vy: 0, radius: 20, m: 1 }];

        // act
        debugger;
        const projections = forceComputer.projectAll(particles) as ParticleProps[];

        // assert
        assert(projections[0].vx == 10);
        assert(projections[1].vx == 10);
        assert(projections[0].vy == 0);
        assert(projections[1].vy == 0);

    });
});

