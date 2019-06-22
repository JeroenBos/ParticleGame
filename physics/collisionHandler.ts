import { ICollectionHandler } from "../physics.base";
import { Transformations, TransformationPair } from "./transformations";
import { Q, Red, M, QMS, QM, Particle, P, PQR, Qed } from ".";
import { assert } from "../jbsnorro";
import { isNumber } from "util";

export class CollisionHandler implements ICollectionHandler<Particle> {
    collide(a: Particle, b: Particle): Particle[] {
        return this.placeAdjacent(a, b);
    }


    private placeAdjacent(a: Particle, b: Particle): Particle[] {
        const com = CollisionHandler.com(a, b);
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
            const ρ = (a.m * a_ρ + b.m * b_ρ + sign * a.m * a.radius + sign * a.m * b.radius) / (a.m + b.m);
            return ({ σ: coordinate.σ, ρ });
        }
        const [pNew_a, pNew_b] = CollisionHandler.glue2(a.p, b.p);

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
    public static pom(...particles: Readonly<P>[]): P {
        const result = { m: 0, vx: 0, vy: 0 };
        for (const particle of particles) {
            result.m += particle.m;
            result.vx += particle.vx * particle.m;
            result.vy += particle.vy * particle.m;
        }

        result.vx /= result.m;
        result.vy /= result.m;
        return result;
    }
    private static glue2(a: P, b: P): [P, P] {
        return this.glue(a, b) as [P, P];
    }
    private static glue(...particles: Readonly<P>[]): P[] {
        const p_com = this.pom(...particles);

        const result = particles.map((particle, i) => ({ m: particle.m, vx: p_com.vx, vy: p_com.vy }) as P);
        return result;
    }
}
