import { ICollectionHandler } from "../physics.base";
import { ParticleProps } from "../particle";
import { Transformations } from "./transformations";

export class CollisionHandler implements ICollectionHandler<ParticleProps> {
    collide(p: Readonly<ParticleProps>, q: Readonly<ParticleProps>): ParticleProps[] {
        return this.placeAdjacent(p, q);
    }

    private placeAdjacent(p: Readonly<ParticleProps>, q: Readonly<ParticleProps>): ParticleProps[] {
        const p_m = 1;
        const q_m = 1;

        const p_rm = { r: p, m: p_m, size: p.size };
        const q_rm = { r: q, m: q_m, size: q.size };

        const com = this.com(p_rm, q_rm);
        const { D: [xp, xq], inverseTransformation } = Transformations.rotate2(p_rm.r, q_rm.r, com.r);

        const xPrime_p = position1D(xp, xq, 1);
        const xPrime_q = position1D(xq, xp, -1);

        function position1D(xp: number, xq: number, sign: number): number {
            return (p_m * xp + q_m * xq + sign * p_m * p.size + sign * p_m * q.size) / (p_m + q_m);
        }

        const rNew_p = inverseTransformation(xPrime_p);
        const rNew_q = inverseTransformation(xPrime_q);

        const p_new = { ...p, ...rNew_p };
        const q_new = { ...q, ...rNew_q };
        return [p_new, q_new];
    }

    private com(p: Readonly<rm>, q: Readonly<rm>): rm {
        const sum_of_masses = p.m + q.m;

        const center_x = (p.r.x * p.m + q.r.x * q.m) / sum_of_masses;
        const center_y = (p.r.y * p.m + q.r.y * q.m) / sum_of_masses;

        return { m: sum_of_masses, r: { x: center_x, y: center_y } };
    }
    private distance(p: Readonly<vector>, q: Readonly<vector>): vector {
        return { x: q.x - p.x, y: q.y - p.y };
    }
    private position(p: Readonly<rms>, q: Readonly<rms>, sign: number): vector {
        if (sign != 1 && sign != -1)
            throw new Error();

        function position1D(xp: number, xq: number): number {
            return p.m * xp + q.m * xq + sign * p.m * p.size + sign * p.m * q.size;
        }

        const x = position1D(p.r.x, q.r.x);
        const y = position1D(p.r.y, q.r.y);

        return { x, y };
    }
}

export interface vector {
    x: number,
    y: number
}
interface rm {
    r: vector,
    m: number
}
interface rms extends rm {
    size: number
}