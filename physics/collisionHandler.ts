import { ICollectionHandler } from "../physics.base";
import { Transformations, TransformationPair } from "./transformations";
import { Q, Red, M, QMS, QM, Particle, P, PQR, Qed } from ".";
import { assert } from "../jbsnorro";
import { isNumber } from "util";
import { assertTotalConservations } from "../test/testhelper";

abstract class BaseCollisionHandler implements ICollectionHandler<Particle> {
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
        const [pNew_a, pNew_b] = BaseCollisionHandler.glue2(a.p, b.p);

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
    public static pom(...particles: Readonly<P>[]): { px: number, py: number } & P {
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

    protected static glue2(a: P, b: P): [P, P] {
        return this.glue(a, b) as [P, P];
    }
    protected static glue(...particles: P[]): P[] {
        const p_com = this.pom(...particles);

        const result = particles.map((particle, i) => ({ m: particle.m, vx: p_com.vx, vy: p_com.vy }) as P);
        assertTotalConservations(particles, result);
        return result;
    }
    protected static elastic(a: P, b: P): [P, P] {
        const newA_p = { m: a.m, vx: compute1D(a.m, b.m, a.vx, b.vx), vy: compute1D(a.m, b.m, a.vy, b.vy) };
        const newB_p = { m: b.m, vx: compute1D(b.m, a.m, b.vx, a.vx), vy: compute1D(b.m, a.m, b.vy, a.vy) };

        return [newA_p, newB_p];

        function compute1D(a_m: number, b_m: number, a_v: number, b_v: number) {
            const M = a_m + b_m;
            return (a_m - b_m) / M * a_v + 2 * b_m / M * b_v;
        }
    }
}


export class GlueCollisionHandler extends BaseCollisionHandler {
    public getMomenta(...p: [P, P]): [P, P] {
        return BaseCollisionHandler.glue2(p[0], p[1])
    }
}
export class ElasticCollisionHandler extends BaseCollisionHandler {
    public getMomenta(...p: [P, P]): [P, P] {
        return BaseCollisionHandler.elastic(p[0], p[1])
    }
}