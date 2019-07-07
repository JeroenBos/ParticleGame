import 'mocha';
import { GlueCollisionHandler as CollisionHandler } from '../physics/collisionHandler';
import { ParticleProps } from "../app/particle";
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import Engine from '../physics/engine';
import { CollisionDetector } from '../physics/collisionDetector';
import { ForceComputer, ZeroForce } from '../physics/forceComputer';
import { BoxGeometry } from '../physics/geometry';
import { Particle } from '../physics';

function createEngine(width: number = 100, height: number = 100) {
    return new Engine(new CollisionDetector(0.001), new CollisionHandler(false), new ZeroForce(), new BoxGeometry(width, height), 1/*huge*/, false);
}
describe('Engine', () => {
    it('Free propagation along x-axis', () => {
        // arrange
        const engine = createEngine();
        const t0 = Particle.create({
            x: 0,
            y: 0,
            vx: 1,
            vy: 0,
            m: 1,
            radius: 1,
        });
        // act
        debugger;
        const [t1] = engine.evolve([t0], 1) as [Particle];

        // assert
        assert(t1.m == 1);
        assert(t1.radius == 1);
        assert(t1.x == 1);
        assert(t1.y == 0);
        assert(t1.vx == 1);
        assert(t1.vy == 0);


        const [t2] = engine.evolve([t1], 1) as [Particle];

        assert(t2.x == 2);
        assert(t2.vx == 1);
        assert(t2.vy == 0);
    });
    it('Bounce at end of x-axis', () => {
        // arrange
        const engine = createEngine(10);
        const t0 = Particle.create({
            x: 9,
            y: 0,
            vx: 1,
            vy: 0,
            m: 1,
            radius: 1,
        });
        // act
        debugger;
        const [t1] = engine.evolve([t0], 1) as [Particle];

        // assert
        assert(t1.x == 8);
        assert(t1.vx == -1);

        const [t2] = engine.evolve([t1], 1) as [Particle];

        assert(t2.x == 7);
        assert(t2.vx == -1);
    });

    it('Large ball bounce at end of x-axis', () => {
        // arrange
        const engine = createEngine(10);
        const t0 = Particle.create({
            x: 5,
            y: 0,
            vx: 3,
            vy: 0,
            m: 1,
            radius: 4,
        });
        // act
        // debugger;
        const [t1] = engine.evolve([t0], 1) as [Particle];

        // assert
        assert(t1.x == 4);
        assert(t1.vx == -3);

        const [t2] = engine.evolve([t1], 1) as [Particle];

        // even though 7 is technically not correct because there's a double bounce, which is because dt is not sufficiently small 
        // it should be 5, because it bounces at 6
        assert(t2.x == 7);
        assert(t2.vx == 3);

        const [t3] = engine.evolve([t2], 1) as [Particle];

        // again, because of a double bounce this should have been 6. but just checking of the error due to the previous double bounce is correcting
        assert(t3.x == 2);
        assert(t3.vx == -3);
    });

    it('bug fix: collisions resolved but still not by 1e-07', () => {
        // arrange
        const engine = createEngine(10);
        const dt = 1;
        const particles = [
            { x: 109, y: 50, m: 1, radius: 9, vx: -10, vy: 0 },
            { x: 91, y: 53, m: 1, radius: 9, vx: 10, vy: 0 }
        ].map(Particle.create);

        // act
        // debugger;
        engine.evolve(particles, dt);

        // assert??
    });
});

