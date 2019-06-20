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

    private static com(a: Readonly<QMS>, b: Readonly<QMS>): QM {
        const sum_of_masses = a.m + b.m;

        const center_x = (a.q.x * a.m + b.q.x * b.m) / sum_of_masses;
        const center_y = (a.q.y * a.m + b.q.y * b.m) / sum_of_masses;

        return { m: sum_of_masses, q: { x: center_x, y: center_y } };
    }

    private distance(a: Readonly<Q>, b: Readonly<Q>): Q {
        return { x: b.x - a.x, y: b.y - a.y };
    }
    private position(a: Readonly<QMS>, b: Readonly<QMS>, sign: number): Q {
        if (sign != 1 && sign != -1)
            throw new Error();

        function position1D(xp: number, xq: number): number {
            return a.m * xp + b.m * xq + sign * a.m * a.size + sign * a.m * b.size;
        }

        const x = position1D(a.q.x, b.q.x);
        const y = position1D(a.q.y, b.q.y);

        return { x, y };
    }
}
