import 'mocha';
import { CollisionDetector } from "../physics/collisionDetector";
import { ParticleProps } from "../particle";
import { assert, assertSequenceEquals } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import { Collision } from '../physics.base';
import { Particle } from '../physics';

const collisionDetector = Invariants.For(new CollisionDetector(0.001));

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
        const p = Particle.create({
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

describe('Time to collision', () => {
    it('simple case', () => {
        const a = Particle.create({ radius: 0, x: 1, y: 0, vx: -2, vy: 0, m: 0 });
        const b = Particle.create({ radius: 0, x: 0, y: 0, vx: 0, vy: 0, m: 0 });

        // act
        // debugger;
        const t = collisionDetector.getTimeToCollision(a, b);

        assert(t == 0.5);
    });
    it('simple miss case', () => {
        const a = Particle.create({ radius: 0, x: 1, y: 0, vx: -2, vy: 0, m: 0 });
        const b = Particle.create({ radius: 0, x: 0, y: 1, vx: 0, vy: 0, m: 0 });

        // act
        // debugger;
        const t = collisionDetector.getTimeToCollision(a, b);

        assert(Number.isNaN(t));
    });
    it('simple case with r=1', () => {
        const a = Particle.create({ radius: 1, x: 4, y: 0, vx: -2, vy: 0, m: 0 });
        const b = Particle.create({ radius: 1, x: 0, y: 0, vx: 0, vy: 0, m: 0 });

        // act
        // debugger;
        const t = collisionDetector.getTimeToCollision(a, b);

        assert(t == 1);
    });

    it('simple case along y-axis with r=1', () => {
        const a = Particle.create({ radius: 1, x: 0, y: 4, vx: 0, vy: -2, m: 0 });
        const b = Particle.create({ radius: 1, x: 0, y: 0, vx: 0, vy: 0, m: 0 });

        // act
        // debugger;
        const t = collisionDetector.getTimeToCollision(a, b);

        assert(t == 1);
        assert(t == collisionDetector.getTimeToCollision(b, a), 'getTimeToCollision must be symmetric');
    });

    it('diagonal case with r=1', () => {
        const a = Particle.create({ radius: 1, x: 3, y: 1, vx: -2, vy: 0, m: 0 });
        const b = Particle.create({ radius: 1, x: 0, y: 0, vx: 0, vy: 0, m: 0 });

        // act
        debugger;
        const t = collisionDetector.getTimeToCollision(a, b);

        assert(0.5 < t && t < 0.7);
        assert(t == collisionDetector.getTimeToCollision(b, a), 'getTimeToCollision must be symmetric');
    });
});
