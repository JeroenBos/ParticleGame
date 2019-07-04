import { ICollisionDetector, Collision } from "./_physics.base";
import { ParticleProps } from "../app/particle";
import { Particle, Q, P } from ".";
import { Transformations, TransformationPair } from "./transformations";
import { assert } from "../jbsnorro";
import { inProduct, diff } from "./collisionHandler";

export class CollisionDetector implements ICollisionDetector<Particle> {

    public constructor(public readonly precision: number) {
    }
    private _count = 0;
    get count() {
        return this._count;
    }
    detect(particles: Particle[], real: boolean = true): { collisions: Collision[], freeParticles: Particle[] } {
        const collisions: Collision[] = [];

        const collided = new Array<boolean>(particles.length);
        for (let i = 0; i < particles.length; i++) {
            collided[i] = false;
        }
        for (let pi = 0; pi < particles.length; pi++) {
            const p = particles[pi];
            for (let qi = 0; qi < pi; qi++) {
                const q = particles[qi];
                if (this.collideQ(p, q)) {
                    const distance = CollisionDetector.distance(p, q);
                    collisions.push({ i: qi, j: pi });
                    if (real) {
                        this._count++;
                    }
                    collided[pi] = true;
                    collided[qi] = true;
                }
            }
        };

        const freeParticles: Particle[] = [];
        for (let i = 0; i < particles.length; i++) {
            if (!collided[i])
                freeParticles.push(particles[i]);
        }
        return { collisions, freeParticles };
    }

    private collideQ(p: Particle, q: Particle): boolean {
        const distanceSquared = CollisionDetector.distanceSquared(p, q);
        return distanceSquared < -this.precision;
    }
    private static distanceSquared(p: Particle, q: Particle): number {
        return (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) - (p.radius + q.radius) * (p.radius + q.radius);
    }
    public static distance(p: Particle, q: Particle) {
        const d = this.distanceSquared(p, q);
        return Math.sign(d) * Math.sqrt(Math.abs(this.distanceSquared(p, q)));
    }
    getTimeToCollision(p: Particle, q: Particle): number {

        // return 0; // Simplification: TODO, implement properly

        const ds = diff(p, q);
        const dv = diff(toQ(p), toQ(q));
        const dsdv = inProduct(ds, dv);
        const dv2 = inProduct(dv, dv);
        const ds2 = inProduct(ds, ds);
        const R = p.radius + q.radius;

        const D = Math.sqrt(dsdv ** 2 - dv2 * (ds2 - R ** 2));
        const numbers = [(- dsdv - D) / dv2, (- dsdv + D) / dv2];

        // ok, there are a few cases:
        // there is no collision: D == NaN. Return NaN
        // there is one collision in the past and one in the future: we're currently colliding: return 0
        // there are only collision in the past: return NaN
        // there are only collisions in the future: one enters the particle, the other one leaves the particle. Returns the first
        const solutions = numbers.filter(n => !Number.isNaN(n)).map(n => 0 < n && n < 10e-10 ? 0 : n).sort();
        // whhhaaat, it appears that assert(4.5474735088646414e-14 < 0.4) throws (if you choose the small number precisely enough)
        if (solutions.length == 0)
            return NaN; // no collision
        if (solutions.length == 1) {
            if (solutions[0] > -this.precision)
                return solutions[0];
            return NaN; // touching (no collision) was in the past
        }


        if (solutions[0] < 0 && solutions[1] > -this.precision) {
            return 0; // currently colliding
        }
        if (solutions[0] > -this.precision) {
            return solutions[0]; // return first collision time
        }
        return NaN; // both collisions were in the past

        // const distance = this.distanceSquared(p, q);

        // inProduct(toQ(p

        // const transformations = Transformations.combine(Transformations.translationPtoQ(), Transformations.translationAndRotation(toQ(p), toQ(q)));
        // const t = Transformations.perform1(op, transformations, q);
        // function op(p_1: number, others: number[]): number {
        //     assert(others.length == 0);
        //     // p_1 is relative head-on collision momentum

        //     return distance / p_1;
        // }
        function toQ(_: P) {
            return { x: _.vx, y: _.vy };
        }

        // return t;
    }
}