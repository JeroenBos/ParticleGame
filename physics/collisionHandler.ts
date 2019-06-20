import { ICollectionHandler } from "../physics.base";
import { ParticleProps } from "../particle";
import { Transformations } from "./transformations";
import { Q, S, M, QMS, QM } from ".";

export class Particle implements QMS {
    public constructor(private readonly p: ParticleProps) {
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
export class CollisionHandler implements ICollectionHandler<ParticleProps> {
    collide(a: Readonly<ParticleProps>, b: Readonly<ParticleProps>): ParticleProps[] {
        return this.placeAdjacent(new Particle(a), new Particle(b));
    }

    private placeAdjacent(a: Readonly<Particle>, b: Readonly<Particle>): ParticleProps[] {
        const com = this.com(a, b);
        const { D: [xp, xq], inverseTransformation } = Transformations.rotate2(a.q, b.q, com.q);

        const xPrime_a = position1D(xp, xq, Math.sign(xq));
        const xPrime_b = position1D(xq, xp, -Math.sign(xq));

        function position1D(xa: number, xb: number, sign: number): number {
            return (a.m * xa + b.m * xb + sign * a.m * a.size + sign * a.m * b.size) / (a.m + b.m);
        }

        const qNew_a = inverseTransformation(xPrime_a);
        const qNew_b = inverseTransformation(xPrime_b);

        const vx = 0; // TODO: calculate
        const vy = 0;

        const p_new = toProps(a, qNew_a, vx, vy);
        const q_new = toProps(b, qNew_b, vx, vy);

        return [p_new, q_new];

        function toProps(particle: Readonly<Particle>, q: Q, vx: number, vy: number): ParticleProps {
            return { m: particle.m, size: particle.size, vx: vx, vy: vy, x: q.x, y: q.y, };
        }
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
