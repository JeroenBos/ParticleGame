import { ICollectionHandler } from "../physics.base";
import { ParticleProps } from "../particle";
import { Transformations, TransformationPair } from "./transformations";
import { Q, S, M, QMS, QM, Particle, P, PQS, Qed } from ".";
import { assert } from "../jbsnorro";

export class CollisionHandler implements ICollectionHandler<ParticleProps> {
    collide(a: Readonly<ParticleProps>, b: Readonly<ParticleProps>): ParticleProps[] {
        return this.placeAdjacent(Particle.create(a), Particle.create(b));
    }


    private placeAdjacent(a: Readonly<PQS>, b: Readonly<PQS>): ParticleProps[] {
        const com = CollisionHandler.com(a, b);
        const physicalTransformations = Transformations.translationAndRotation(com.q, a.q);
        const transformations = Transformations.Property<QMS, 'q', number>('q', physicalTransformations);

        const [{ q: qNew_a }, { q: qNew_b }] = Transformations.perform2(operation, transformations, a, b);

        function operation(coordinate: QMS & { ρ: number }, otherCoordinates: (QMS & { ρ: number })[]): QMS & { ρ: number } {
            assert(otherCoordinates.length == 1);

            const a = coordinate;
            const b = otherCoordinates[0];
            const sign = Math.sign(a.ρ);
            const ρ = (a.m * a.ρ + b.m * b.ρ + sign * a.m * a.radius + sign * a.m * b.radius) / (a.m + b.m);
            return ({ ...coordinate, ρ });
        }
        const [pNew_a, pNew_b] = CollisionHandler.glue2(a.p, b.p);

        const a_new = toProps(a, qNew_a, pNew_a);
        const b_new = toProps(b, qNew_b, pNew_b);

        return [a_new, b_new];

        function toProps(particle: Readonly<QMS>, q: Q, p: P): ParticleProps {
            return { x: q.x, y: q.y, m: particle.m, radius: particle.radius, vx: p.vx, vy: p.vy };
        }
    }


    private static com(...particles: Readonly<Qed & M>[]): QM {
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

    private static p_com(...particles: Readonly<P>[]): P {
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
        const p_com = this.p_com(...particles);

        const result = particles.map((particle, i) => ({ m: particle.m, vx: p_com.vx, vy: p_com.vy }) as P);
        return result;
    }
}
