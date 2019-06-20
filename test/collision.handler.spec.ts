import 'mocha';
import { CollisionHandler } from '../physics/collisionHandler';
import { ParticleProps } from "../particle";
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import { Collision } from '../physics.base';

const collisionDetector = Invariants.For(new CollisionHandler());

describe('CollisionHandler', () => {
    it('Stationary overlapping particles are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
        };
        const q: ParticleProps = {
            x: 1,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
        };

        // act
        // debugger;
        const resultants = collisionDetector.collide(p, q);

        // assert
        assert(resultants.length == 2);

        assert(resultants[0].x == 1.5);
        assert(resultants[1].x == -0.5);

        // also test the trivial properties:
        assert(resultants[0].vx == 0);
        assert(resultants[0].vy == 0);
        assert(resultants[1].vx == 0);
        assert(resultants[1].vy == 0);
        assert(resultants[0].y == 0);
        assert(resultants[0].y == 0);
        assert(resultants[0].size == p.size);
        assert(resultants[1].size == q.size);
    });

    it('Stationary overlapping particles along y-axis are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
        };
        const q: ParticleProps = {
            x: 0,
            y: 1,
            vx: 0,
            vy: 0,
            size: 1,
        };

        // act
        // debugger;
        const resultants = collisionDetector.collide(p, q);

        // assert
        assert(resultants.length == 2);

        assert(resultants[0].y == 1.5);
        assert(resultants[1].y == -0.5);

        // also test the trivial properties:
        assert(resultants[0].vx == 0);
        assert(resultants[0].vy == 0);
        assert(resultants[1].vx == 0);
        assert(resultants[1].vy == 0);
        assert(resultants[0].x == 0);
        assert(resultants[0].x == 0);
        assert(resultants[0].size == p.size);
        assert(resultants[1].size == q.size);
    });


    it('Stationary overlapping particles mirrored along y-axis are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 1,
            vx: 0,
            vy: 0,
            size: 1,
        };
        const q: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
        };

        // act
        // debugger;
        const resultants = collisionDetector.collide(p, q);

        // assert
        assert(resultants.length == 2);

        assert(resultants[0].y == -0.5);
        assert(resultants[1].y == 1.5);

        // also test the trivial properties:
        assert(resultants[0].vx == 0);
        assert(resultants[0].vy == 0);
        assert(resultants[1].vx == 0);
        assert(resultants[1].vy == 0);
        assert(resultants[0].x == 0);
        assert(resultants[0].x == 0);
        assert(resultants[0].size == p.size);
        assert(resultants[1].size == q.size);
    });

    it('Non-overlapping particles collision are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 10,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
        };
        const q: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 1,
        };

        // act
        // debugger;
        const resultants = collisionDetector.collide(p, q);

        // assert
        assert(resultants.length == 2);

        assert(resultants[0].x == 4);
        assert(resultants[1].x == 6);
    });
});
