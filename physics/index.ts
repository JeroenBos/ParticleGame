export interface P {
    m: number,
    vx: number,
    vy: number
}

export interface Q {
    x: number,
    y: number
}

export interface Dv {
    dvx: number,
    dvy: number
}

export interface Particle {
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

export interface M {
    m: number
}
export type QMS = QM & S;
export type QM = Qed & M;