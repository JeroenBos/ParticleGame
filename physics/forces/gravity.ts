import { IGeometry } from "../_physics.base";
import { Particle } from "..";
import { F, ForceComputer } from "../forceComputer";
import { deltaQ } from "../geometry";

export class Gravity extends ForceComputer {
    constructor(private readonly geometry: IGeometry<Particle>, private readonly takeDistancesCount: number) {
        super();
    }
    /** Computes the force of particle 'actor' on particle 'receiver'. */
    computeForceOn(receiver: Particle, actor: Particle): F {
        const distances = take<deltaQ>(this.geometry.distance(actor.q, receiver.q), this.takeDistancesCount);

        // F_x = -G M m / r^2  in the direction of x, which is the same as F = -G M m / r^3 * r_x
        const G = 50;
        const m = receiver.m;
        const M = actor.m;

        const contributions = distances.map(dr => ({ fx: -G * M * m * dr.dx / (dr.L ** 3), fy: -G * M * m * dr.dy / (dr.L ** 3) }));
        const result = contributions.reduce(reducer);
        return result;
        function reducer(total: F, next: F) {
            return { fx: total.fx + next.fx, fy: total.fy + next.fy };
        }
    }
}

function take<T>(sequence: Iterable<T>, n: number): T[] {
    let i = 0;
    const result = [];
    for (const element of sequence) {
        result.push(element);
        if (++i >= n)
            break;
    }
    return result;
}