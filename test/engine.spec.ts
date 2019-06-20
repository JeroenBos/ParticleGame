import 'mocha';
import { CollisionHandler } from '../physics/collisionHandler';
import { ParticleProps } from "../particle";
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import Engine from '../physics/engine';
import { CollisionDetector } from '../physics/collisionDetector';
import { ForceComputer } from '../physics/forceComputer';
import { Confiner } from '../physics/confinement';

function createEngine(width: number = 100, height: number = 100) {
    return new Engine(new CollisionDetector(), new CollisionHandler(), new ForceComputer(), new Confiner(width, height));
}
describe('Engine', () => {
    it('Free propagation along x-axis', () => {
        // arrange
        const engine = createEngine();
        const t0: ParticleProps = {
            x: 0,
            y: 0,
            vx: 1,
            vy: 0,
            m: 1,
            size: 1,
        };
        // act
        debugger;
        const [t1] = engine.evolve([t0]) as [ParticleProps];

        // assert
        assert(t1.m == 1);
        assert(t1.size == 1);
        assert(t1.x == 1);
        assert(t1.y == 0);
        assert(t1.vx == 1);
        assert(t1.vy == 0);


        const [t2] = engine.evolve([t1]) as [ParticleProps];

        assert(t2.x == 2);
        assert(t2.vx == 1);
        assert(t2.vy == 0);
    });
});

