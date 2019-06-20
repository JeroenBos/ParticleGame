import { ICollectionHandler } from "../physics.base";
import { ParticleProps } from "../particle";
import { Transformations, TransformationPair } from "./transformations";
import { Q, S, M, QMS, QM, Particle } from ".";
import { assert } from "../jbsnorro";

export class CollisionHandler implements ICollectionHandler<ParticleProps> {
    collide(a: Readonly<ParticleProps>, b: Readonly<ParticleProps>): ParticleProps[] {
        return this.placeAdjacent(Particle.create(a), Particle.create(b));
    }


    private placeAdjacent(a: Readonly<QMS>, b: Readonly<QMS>): ParticleProps[] {
        const com = CollisionHandler.com(a, b);
        const transformations = Transformations.translationAndRotation(com.q, a.q);
        const [qNew_a, qNew_b] = Transformations.perform2<Q, number>(operation, () => transformations, a.q, b.q);

        function operation(coordinate: number, otherCoordinates: number[]): number {
            assert(otherCoordinates.length == 1);

            const xa = coordinate;
            const xb = otherCoordinates[0];
            const sign = Math.sign(xa);
            const result = (a.m * xa + b.m * xb + sign * a.m * a.size + sign * a.m * b.size) / (a.m + b.m);
            return result;
        }

        const vx = 0; // TODO: calculate
        const vy = 0;

        const p_new = toProps(a, qNew_a, vx, vy);
        const q_new = toProps(b, qNew_b, vx, vy);

        return [p_new, q_new];

        function toProps(particle: Readonly<QMS>, q: Q, vx: number, vy: number): ParticleProps {
            return { x: q.x, y: q.y, m: particle.m, size: particle.size, vx: vx, vy: vy, };
        }
    }

    private static com(...particles: Readonly<QMS>[]): QM {
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
}
