import { ICollectionHandler } from "../physics.base";
import { ParticleProps } from "../particle";

export class CollisionHandler implements ICollectionHandler<ParticleProps> {
    collide(p: Readonly<ParticleProps>, q: Readonly<ParticleProps>): ParticleProps[] {
        return this.placeAdjacent(p, q);
    }

    private placeAdjacent(p: Readonly<ParticleProps>, q: Readonly<ParticleProps>): ParticleProps[] {
        const p_mass = 1;
        const q_mass = 1;
        const p_rm = { r: p, m: p_mass };
        const q_rm = { r: q, m: q_mass };

        const d = this.distance(p, q);
        const com = this.com(p_rm, q_rm);
        const r_p = this.position(p_rm, com, d);
        const r_q = this.position(q_rm, com, d);

        const p_new = { ...p, ...r_p };
        const q_new = { ...q, ...r_q };
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
    private position(p: Readonly<rm>, com: Readonly<rm>, d: vector): vector {
        const m1 = p.m;
        const m2 = com.m - m1;
        const w_x = com.m * com.r.x - m2 * d.x;
        const w_y = com.m * com.r.y - m2 * d.y;

        const r = Math.sqrt((w_x * w_x + w_y * w_y) / (m1 + m2));

        const d_abs = Math.sqrt(d.x * d.x + d.y * d.y);
        const r_abs_test = m2 / com.m * d_abs; 
        // const r_abs = Math.sqrt(r.x * r.x + r.y * r.y);

        const x = com.r.x;
        const y = com.r.y;

        const Rsquared = x * x + y * y;
        const R = Math.sqrt(Rsquared);
        const D = Math.sqrt(Rsquared + r * r);

        const thetaplusphi = Math.atan2(y, x);
        const theta = Math.atan2(r, R);
        const ϕ = Math.atan2(y, x) - Math.atan2(r, R);
        const X = D * Math.cos(ϕ);
        const Y = D * Math.sin(ϕ);
        return { x: X, y: Y };
    }
}

interface vector {
    x: number,
    y: number
}
interface rm {
    r: vector,
    m: number
}