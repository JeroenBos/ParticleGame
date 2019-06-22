import 'mocha';
import { CollisionHandler } from '../physics/collisionHandler';
import { ParticleProps } from "../particle";
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import { ForceComputer } from '../physics/forceComputer';
import { assertTotalConservations } from './testhelper';

const collisionHandler = Invariants.For(new CollisionHandler());

describe('CollisionHandler', () => {
    it('Stationary overlapping particles are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 1,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };

        // act
        debugger;
        const resultants = collisionHandler.collide(p, q);

        // assert
        assert(resultants.length == 2);

        assert(resultants[0].x == -0.5);
        assert(resultants[1].x == 1.5);

        // also test the trivial properties:
        assert(resultants[0].vx == 0);
        assert(resultants[0].vy == 0);
        assert(resultants[1].vx == 0);
        assert(resultants[1].vy == 0);
        assert(resultants[0].y == 0);
        assert(resultants[0].y == 0);
        assert(resultants[0].radius == p.radius);
        assert(resultants[1].radius == q.radius);
    });

    it('Stationary overlapping particles along y-axis are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 0,
            y: 1,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

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
        assert(resultants[0].radius == p.radius);
        assert(resultants[1].radius == q.radius);
    });

    it('Stationary overlapping particles mirrored along y-axis are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 1,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

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
        assert(resultants[0].radius == p.radius);
        assert(resultants[1].radius == q.radius);
    });

    it('Non-overlapping particles collision are placed adjacent', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 10,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

        // assert
        assert(resultants.length == 2);

        assert(resultants[0].x == 4);
        assert(resultants[1].x == 6);
    });

    it('Moving overlapping particles are moving in unison', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 1,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 0,
            y: 1,
            vx: 1,
            vy: 0,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

        // assert
        assert(resultants[0].vx == 1);
        assert(resultants[0].vy == 0);
        assert(resultants[1].vx == 1);
        assert(resultants[1].vy == 0);
    });


    it('Moving overlapping particles with diagonal velocity move in unison', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 4,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

        // assert
        assert(resultants[0].vx == 2);
        assert(resultants[0].vy == 2);
        assert(resultants[1].vx == 2);
        assert(resultants[1].vy == 2);
    });

    it('Moving overlapping particles with mirrored diagonal velocity move in unison', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 1,
            m: 1
        };
        const q: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: -4,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

        // assert
        assert(resultants[0].vx == 2);
        assert(resultants[0].vy == -2);
        assert(resultants[1].vx == 2);
        assert(resultants[1].vy == -2);
    });

    it('Moving overlapping different particles with diagonal velocity move in unison awrily', () => {
        // arrange
        const p: ParticleProps = {
            x: 0,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 1,
            m: 3
        };
        const q: ParticleProps = {
            x: 0,
            y: 0,
            vx: 0,
            vy: -4,
            radius: 1,
            m: 1
        };

        // act
        // debugger;
        const resultants = collisionHandler.collide(p, q);

        // assert
        assert(resultants[0].vx == 3);
        assert(resultants[0].vy == -1);
        assert(resultants[1].vx == 3);
        assert(resultants[1].vy == -1);
    });

    it('collision becomes stationary', () => {
        // arrange
        const particles = [
            { x: 5, y: 10, vx: 2, vy: 0, radius: 0, m: 1 },
            { x: 6, y: 10, vx: -2, vy: 0, radius: 0, m: 1 }
        ]
        const projectedParticles = new ForceComputer().projectAll(particles) as ParticleProps[];

        // act
        // debugger;
        const resultants = collisionHandler.collide(projectedParticles[0], projectedParticles[1]);

        // assert
        assert(resultants[0].x == resultants[1].x);
        assert(resultants[0].vx == resultants[1].vx);
        assert(resultants[0].x == 5.5);
        assert(resultants[0].vx == 0);
    });

    it('head on collision moves in unison', () => {
        // arrange
        const particles = [
            { x: 5, y: 10, vx: 1, vy: 0, radius: 0, m: 2 },
            { x: 6, y: 10, vx: -1, vy: 0, radius: 0, m: 1 }
        ]
        const projectedParticles = new ForceComputer().projectAll(particles) as ParticleProps[];

        // act
        // debugger;
        const resultants = collisionHandler.collide(projectedParticles[0], projectedParticles[1]);

        // assert
        assert(resultants.length == 2);
        assert(resultants[0].x == resultants[1].x);
        assert(resultants[0].vx == resultants[1].vx);
        assertTotalConservations(particles, resultants);
    });
});
