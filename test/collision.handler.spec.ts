import 'mocha';
import { GlueCollisionHandler as CollisionHandler, ElasticCollisionHandler } from '../physics/collisionHandler';
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import { ForceComputer } from '../physics/forceComputer';
import { assertTotalConservations } from './testhelper';
import { Particle } from '../physics';
import Extensions from '../extensions';

const collisionHandler = Invariants.For(new CollisionHandler());

describe('CollisionHandler', () => {
    it('Stationary overlapping particles are placed adjacent', () => {
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
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 0,
            y: 1,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

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
        const p = Particle.create({
            x: 0,
            y: 1,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

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
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 10,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 1,
            m: 1
        });

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
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 1,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 0,
            y: 1,
            vx: 1,
            vy: 0,
            radius: 1,
            m: 1
        });

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
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: 4,
            radius: 1,
            m: 1
        });

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
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 1,
            m: 1
        });
        const q = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: -4,
            radius: 1,
            m: 1
        });

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
        const p = Particle.create({
            x: 0,
            y: 0,
            vx: 4,
            vy: 0,
            radius: 1,
            m: 3
        });
        const q = Particle.create({
            x: 0,
            y: 0,
            vx: 0,
            vy: -4,
            radius: 1,
            m: 1
        });

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
            Particle.create({ x: 5, y: 10, vx: 2, vy: 0, radius: 0, m: 1 }),
            Particle.create({ x: 6, y: 10, vx: -2, vy: 0, radius: 0, m: 1 })
        ]
        const projectedParticles = Extensions.notUndefined(new ForceComputer().projectAll(particles, 1));

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
        ].map(Particle.create);

        const projectedParticles = Extensions.notUndefined(new ForceComputer().projectAll(particles, 1));

        // act
        // debugger;
        const resultants = collisionHandler.collide(projectedParticles[0], projectedParticles[1]);

        // assert
        assert(resultants.length == 2);
        assert(resultants[0].x == resultants[1].x);
        assert(resultants[0].vx == resultants[1].vx);
        assertTotalConservations(particles, resultants);
    });

    it('momentum is conserved after bouncing and colliding in one step', () => {
        // arrange
        const projectedParticles = [
            { x: 470, y: 50, vx: -10, vy: 0, radius: 20, m: 1 },
            { x: 440, y: 50, vx: 10, vy: 0, radius: 30, m: 2 }
        ].map(Particle.create);


        // act
        // debugger;
        const resultants = collisionHandler.collide(projectedParticles[0], projectedParticles[1]);

        // assert
        assert(resultants.length == 2);
        assertTotalConservations(projectedParticles, resultants);
    });

    it('momentum is conserved with elastic scattering', () => {
        const elasticCollisionHandler = new ElasticCollisionHandler();
        // arrange
        const projectedParticles = [
            { x: 370, y: 50, vx: -10, vy: 0, radius: 20, m: 1 },
            { x: 340, y: 50, vx: 10, vy: 0, radius: 30, m: 2 }
        ].map(Particle.create);

        // act
        debugger;
        const resultants = elasticCollisionHandler.collide(projectedParticles[0], projectedParticles[1]);

        // assert
        assertTotalConservations(projectedParticles, resultants);
        assert(resultants[0].vx > 0);
        assert(resultants[1].vx < 0);
    });

    it('collision under 45° becomes perfectly transverse', () => {
        const elasticCollisionHandler = new ElasticCollisionHandler();
        // arrange
        const projectedParticles = [
            { x: 51, y: 50, vx: -1, vy: 0, radius: 2, m: 1 },
            { x: 49, y: 52, vx: 1, vy: 0, radius: 2, m: 1 }
        ].map(Particle.create);


        // act
        debugger;
        const [p0, p1] = elasticCollisionHandler.getMomenta(projectedParticles[0], projectedParticles[1]);

        // assert
        assert(p0.vx == 0);
        assert(p1.vx == 0);
        assert(p0.vy == -p1.vy);

        // redo test wrapped:
        const resultants = elasticCollisionHandler.collide(projectedParticles[0], projectedParticles[1]);

        // assert
        assertTotalConservations(projectedParticles, resultants);
        assert(resultants[0].vx == 0);
        assert(resultants[1].vx == 0);
        assert(resultants[0].vy == -resultants[1].vy);
    });
});
