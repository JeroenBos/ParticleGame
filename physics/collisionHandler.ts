import { ICollisionHandler } from "../physics.base";
import { Transformations, TransformationPair } from "./transformations";
import { Q, Red, M, QMS, QM, Particle, P, PQR, Qed } from ".";
import { assert } from "../jbsnorro";
import { isNumber } from "util";
import { assertTotalConservations } from "../test/testhelper";

abstract class BaseCollisionHandler implements ICollisionHandler<Particle> {
    collide(a: Particle, b: Particle): Particle[] {
        return this.placeAdjacent(a, b);
    }

    private placeAdjacent(a: Particle, b: Particle): Particle[] {
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
        const [pNew_a, pNew_b] = this.getMomenta(a, b);
        assert(pNew_a.m == a.m);
        assertTotalConservations([a, b], [pNew_a, pNew_b]);

        const a_new = toProps(a, qNew_a, pNew_a);
        const b_new = toProps(b, qNew_b, pNew_b);
        return [a_new, b_new];

        function toProps(particle: Readonly<QMS>, q: Q, p: P) {
            return Particle.create({ x: q.x, y: q.y, vx: p.vx, vy: p.vy, m: particle.m, radius: particle.radius });
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
    public abstract getMomenta(...p: [P, P]): [P, P];

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

        function diff(v: { x: number, y: number }, u: { x: number, y: number }): { x: number, y: number } {
            return {
                x: v.x - u.x,
                y: v.y - u.y,
            };
        }
        function inProduct(r: Q, s: Q): number {
            return r.x * s.x + r.y * s.y;
        }
        function toVector(p: P): { x: number, y: number } {
            return { x: p.vx, y: p.vy };
        }
    }
}


export class GlueCollisionHandler extends BaseCollisionHandler {
    public getMomenta(...p: [Particle, Particle]): [P, P] {
        return BaseCollisionHandler.glue2(p[0], p[1])
    }
}
export class ElasticCollisionHandler extends BaseCollisionHandler {
    public getMomenta(...p: [Particle, Particle]): [P, P] {
        return BaseCollisionHandler.elastic(p[0], p[1])
    }
}