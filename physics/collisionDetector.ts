import { ICollisionDetector, Collision } from "../physics.base";
import { ParticleProps } from "../particle";
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
    detect(particles: Particle[]): { collisions: Collision[], freeParticles: Particle[] } {
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
                    const distance = Math.sqrt(Math.abs(this.distanceSquared(p, q)));
                    collisions.push({ i: qi, j: pi });
                    this._count++;
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
        const distanceSquared = this.distanceSquared(p, q);
        return distanceSquared < -this.precision;
    }
    private distanceSquared(p: Particle, q: Particle): number {
        return (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y) - (p.radius + q.radius) * (p.radius + q.radius);
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
        // return the (smallest) positive solution:
        const numbers = [(- dsdv - D) / dv2, (- dsdv + D) / dv2];
        const solutions = numbers.filter(solution => solution > -this.precision).sort();
        if (solutions.length == 0)
            return NaN;
        return solutions[0];

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