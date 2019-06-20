import { ICollectionHandler } from "../physics.base";
import { ParticleProps } from "../particle";
import { Transformations } from "./transformations";
import { Q, S, M, QMS, QM } from ".";

export class CollisionHandler implements ICollectionHandler<ParticleProps> {
    collide(p: Readonly<ParticleProps>, q: Readonly<ParticleProps>): ParticleProps[] {
        return this.placeAdjacent(p, q);
    }

    private placeAdjacent(a: Readonly<ParticleProps>, b: Readonly<ParticleProps>): ParticleProps[] {
        const a_qm: QMS = { q: a, m: a.m, size: a.size };
        const b_qm: QMS = { q: b, m: b.m, size: b.size };

        const com = this.com(a_qm, b_qm);
        const { D: [xp, xq], inverseTransformation } = Transformations.rotate2(a_qm.q, b_qm.q, com.q);

        const xPrime_a = position1D(xp, xq, Math.sign(xq));
        const xPrime_b = position1D(xq, xp, -Math.sign(xq));

        function position1D(xa: number, xb: number, sign: number): number {
            return (a.m * xa + b.m * xb + sign * a.m * a.size + sign * a.m * b.size) / (a.m + b.m);
        }

        const rNew_p = inverseTransformation(xPrime_a);
        const rNew_q = inverseTransformation(xPrime_b);

        const p_new = { ...a, ...rNew_p };
        const q_new = { ...b, ...rNew_q };
        return [p_new, q_new];
    }

    private com(a: Readonly<QMS>, b: Readonly<QMS>): QM {
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
