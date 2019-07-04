import { ParticleProps } from "../app/particle";

export interface P {
    readonly m: number,
    readonly vx: number,
    readonly vy: number
}

export interface V {
}
export interface Q {
    readonly x: number,
    readonly y: number
}

export interface Dv {
    readonly dvx: number,
    readonly dvy: number
}

export interface IParticle {
    readonly radius: number,
    readonly q: Q,
    readonly p: P
}

export interface Red {
    readonly radius: number
}
export interface Qed {
    readonly q: Q
}

export interface Ped {
    readonly p: P
}

export interface M {
    readonly m: number
}
export type PQR = Qed & Ped & Red & M;
export type QMS = QM & Red;
export type QM = Qed & M;


export class Particle implements QMS, PQR, Q, P {
    public static create(p: ParticleProps): Particle {
        return new Particle(p);
    }
    private constructor(private readonly particle: ParticleProps) {
    }

    get x(): number {
        return this.particle.x;
    }
    get y(): number {
        return this.particle.y;
    }
    get vx(): number {
        return this.particle.vx;
    }
    get vy(): number {
        return this.particle.vy;
    }
    get q(): Q {
        return { x: this.x, y: this.y };
    };
    get p(): P {
        return { vx: this.vx, vy: this.vy, m: this.m };
    };
    get m(): number {
        return this.particle.m;
    };
    get radius(): number {
        return this.particle.radius;
    };

    public withQ(q: Q): Particle {
        return Particle.create({ x: q.x, y: q.y, vx: this.vx, vy: this.vy, m: this.m, radius: this.radius });
    }

    public withP(p: { vx: number, vy: number }): Particle {
        return Particle.create({ vx: p.vx, vy: p.vy, x: this.x, y: this.y, m: this.m, radius: this.radius });
    }
}