import { ParticleProps } from "../particle";

export interface P {
    m: number,
    vx: number,
    vy: number
}

export interface V {
}
export interface Q {
    x: number,
    y: number
}

export interface Dv {
    dvx: number,
    dvy: number
}

export interface IParticle {
    size: number,
    q: Q,
    p: P
}

export interface S {
    size: number
}
export interface Qed {
    q: Q
}

export interface Ped {
    p: P
}

export interface M {
    m: number
}
export type PQS = Qed & Ped & S & M;
export type QMS = QM & S;
export type QM = Qed & M;


export class Particle implements QMS {

    public static create(p: ParticleProps): QMS & PQS {
        return {
            m: p.m,
            q: { x: p.x, y: p.y },
            size: p.size,
            p: { m: p.m, vx: p.vx, vy: p.vy }
        };
    }
    private constructor(private readonly p: ParticleProps) {
    }
    get q(): Q {
        return { x: this.p.x, y: this.p.y };
    };
    get m(): number {
        return this.p.m;
    };
    get size(): number {
        return this.p.size;
    };
}