import { ICollisionHandler, ICollisionDetector } from "./_physics.base";
import { Transformations, TransformationPair } from "./transformations";
import { Q, Red, M, QMS, QM, Particle, P, PQR, Qed } from ".";
import { assert } from "../jbsnorro";
import { isNumber } from "util";
import { assertTotalConservations } from "../test/testhelper";
import { CollisionDetector } from "./collisionDetector";

abstract class BaseCollisionHandler implements ICollisionHandler<Particle> {

    constructor(private readonly collisionDetector: ICollisionDetector<Particle>) { }
    public abstract getMomenta(projectedParticles: [Particle, Particle], dt: number): [P, P];
    public abstract getCoordinates(projectedParticles: [Particle, Particle], pNew: [P, P], dt: number): [Q, Q];

    public collide(projection1: Particle, projection2: Particle, dt: number): Particle[] {
        return this._collide(projection1, projection2, dt, this.getCoordinates.bind(this), this.getMomenta.bind(this));
    }
    protected _collide(
        a: Particle,
        b: Particle,
        dt: number,
        getNewCoordinates: (projectedParticles: [Particle, Particle], pNew: [P, P], dt: number) => [Q, Q],
        getNewMomenta: (projectedParticles: [Particle, Particle], dt: number) => [P, P]
    ) {
        const [pNew_a, pNew_b] = getNewMomenta([a, b], dt);
        const [qNew_a, qNew_b] = getNewCoordinates([a, b], [pNew_a, pNew_b], dt);

        const a_new = toProps(a, qNew_a, pNew_a);
        const b_new = toProps(b, qNew_b, pNew_b);

        return [a_new, b_new];

        function toProps(particle: Readonly<QMS>, q: Q, p: P) {
            return Particle.create({ x: q.x, y: q.y, vx: p.vx, vy: p.vy, m: particle.m, radius: particle.radius });
        }
    }


    protected placeAdjacent(a: Particle, b: Particle): [Q, Q] {
        const com = BaseCollisionHandler.com(a, b);
        const physicalTransformations = Transformations.translationAndRotation(com.q, a.q);
        const transformations = Transformations.Property<Particle, 'q', number>('q', physicalTransformations, (particle, newQ) => particle.withQ(newQ));

        const [{ q: qNew_a }, { q: qNew_b }] = Transformations.perform2(operation, transformations, a, b);

        function operation(coordinate: { σ: Particle, ρ: number }, otherCoordinates: { σ: Particle, ρ: number }[]): { σ: Particle, ρ: number } {
            assert(otherCoordinates.length == 1);

            const a = coordinate.σ;
            const b = otherCoordinates[0].σ;
            const a_ρ = coordinate.ρ;
            const b_ρ = otherCoordinates[0].ρ;
            const sign = Math.sign(a_ρ);
            const ρ = (a.m * a_ρ + b.m * b_ρ + sign * b.m * b.radius + sign * b.m * a.radius) / (a.m + b.m);
            const result = ({ σ: coordinate.σ, ρ });
            return result;
        }

        return [qNew_a, qNew_b];
    }

    protected linearBeforeAndAfterCollision(projected_a: Particle, projected_b: Particle, pNew_a: P, pNew_b: P, dt: number): [Q, Q] {
        assert(dt > 0);

        const previousState_a = unproject(projected_a);
        const previousState_b = unproject(projected_b);
        assert(this.collisionDetector.detect([projected_a, projected_b], false).collisions.length != 0);

        const t = this.collisionDetector.getTimeToCollision(previousState_a, previousState_b);
        if (t === undefined) throw new Error('miss');
        // assert(-0.01 * dt < t && t < dt * 1.01);

        function getNewQ(oldP: Particle, newP: P): Q {
            if (t === undefined) throw new Error('miss');
            const t2 = dt - t;
            return {
                x: oldP.x + oldP.vx * t + newP.vx * t2,
                y: oldP.y + oldP.vy * t + newP.vy * t2,
            };
        }
        const qNew_a = getNewQ(previousState_a, pNew_a);
        const qNew_b = getNewQ(previousState_b, pNew_b);

        return [qNew_a, qNew_b];
        function unproject(a: Particle) {
            const x = a.x - dt * a.vx;
            const y = a.y - dt * a.vy;
            return Particle.create({ x, y, vy: a.vy, vx: a.vx, m: a.m, radius: a.radius });
        }
    }

    /** Computes the location of the center of mass of the specified particles. */
    public static com(...particles: Readonly<Qed & M>[]): QM {
        const result = { m: 0, q: { x: 0, y: 0 } };
        for (const particle of particles) {
            result.m += particle.m;
            result.q.x += particle.q.x * particle.m;
            result.q.y += particle.q.y * particle.m;
        }

        result.q.x /= result.m;
        result.q.y /= result.m;

        return result;
    }

    /** Computes the momentum of the center of mass of the specified particles. */
    public static pom(...particles: P[]): { px: number, py: number } & P {
        const result = { m: 0, px: 0, py: 0, vx: 0, vy: 0 };
        for (const particle of particles) {
            result.m += particle.m;
            result.px += particle.vx * particle.m;
            result.py += particle.vy * particle.m;
        }

        result.vx = result.px / result.m;
        result.vy = result.py / result.m;

        return result;
    }

    public static glue2(a: P, b: P): [P, P] {
        return this.glue(a, b) as [P, P];
    }
    protected static glue(...particles: P[]): P[] {
        const p_com = this.pom(...particles);

        const result = particles.map((particle, i) => ({ m: particle.m, vx: p_com.vx, vy: p_com.vy }) as P);
        assertTotalConservations(particles, result);
        return result;
    }
    public static elastic(a: Particle, b: Particle): [P, P] {

        // formula
        function computeAttempt2(a: Particle, other: Particle): P {
            const b = other;

            const upperInnerProduct = inProduct(diff(toVector(a.p), toVector(b.p)), diff(a.q, b.q));
            const norm = inProduct(diff(b.q, a.q), diff(b.q, a.q));
            const factor = 2 * b.m / (a.m + b.m) * upperInnerProduct / norm;

            const newVx = a.vx - factor * (a.x - b.x);
            const newVy = a.vy - factor * (a.y - b.y);
            return { m: a.m, vx: newVx, vy: newVy };
        }

        const result = [computeAttempt2(a, b), computeAttempt2(b, a)] as [P, P];
        assertTotalConservations([a, b], result);
        return result;
    }
}
export function toVector(p: P): { x: number, y: number } {
    return { x: p.vx, y: p.vy };
}
export function diff(v: { x: number, y: number }, u: { x: number, y: number }): { x: number, y: number } {
    return {
        x: v.x - u.x,
        y: v.y - u.y,
    };
}
export function inProduct(r: Q, s: Q): number {
    return r.x * s.x + r.y * s.y;
}

export class GlueCollisionHandler extends BaseCollisionHandler {
    constructor() {
        super(undefined as any);
    }
    public collide(a: Particle, b: Particle) {
        return super.collide(a, b, undefined as any);
    }
    public getMomenta(projectedParticles: [Particle, Particle], dt: number): [P, P] {
        return BaseCollisionHandler.glue2(...projectedParticles)
    }
    public getCoordinates(projectedParticles: [Particle, Particle], pNew: [P, P], dt: number): [Q, Q] {
        return this.placeAdjacent(...projectedParticles);
    }
}
export class ElasticCollisionHandler extends BaseCollisionHandler {
    public getMomenta(projectedParticles: [Particle, Particle], dt?: number): [P, P] {
        return BaseCollisionHandler.elastic(...projectedParticles)
    }

    public getCoordinates(projectedParticles: [Particle, Particle], pNew: [P, P], dt: number): [Q, Q] {
        return this.linearBeforeAndAfterCollision(projectedParticles[0], projectedParticles[1], pNew[0], pNew[1], dt);
    }
}