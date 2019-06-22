import 'mocha';
import { CollisionDetector } from "../physics/collisionDetector";
import { ParticleProps } from "../particle";
import { assert, assertSequenceEquals } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import { Collision } from '../physics.base';
import { Particle } from '../physics';

const collisionDetector = Invariants.For(new CollisionDetector());

describe('CollisionDetector', () => {
    it('Single particle remains free', () => {
        // arrange
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

        // act
        // debugger;
        const { collisions, freeParticles } = collisionDetector.detect([p]);

        // assert
        assert(collisions.length == 0);
        assert(freeParticles.length == 1);
        assert(freeParticles[0] == p);
    });

    it('Two overlapping particles collide', () => {
        // arrange
        const p = Particle.create( {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create( {
            x: 1,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

        // act
        // debugger;
        const { collisions, freeParticles } = collisionDetector.detect([p, q]);

        // assert
        assert(freeParticles.length == 0);
        assert(collisions.length == 1);
        assert(collisions[0].i == 0);
        assert(collisions[0].j == 1);
    });

    it(`Two non-overlapping particles don't collide`, () => {
        // arrange
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 1,
            y: 5,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

        // act
        // debugger;
        const { collisions, freeParticles } = collisionDetector.detect([p, q]);

        // assert
        assert(collisions.length == 0);
        assert(freeParticles.length == 2);
        assert(freeParticles[0] == p);
        assert(freeParticles[1] == q);
    });

    it(`Two touching particles don't collide`, () => {
        // arrange
        const p = Particle.create( {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 2,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

        // act
        // debugger;
        const { collisions, freeParticles } = collisionDetector.detect([p, q]);

        // assert
        assert(collisions.length == 0);
        assert(freeParticles.length == 2);
        assert(freeParticles[0] == p);
        assert(freeParticles[1] == q);
    });
});
