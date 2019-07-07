import { IGeometry } from "../_physics.base";
import { Particle } from "..";
import { F, ForceComputer } from "../forceComputer";
import { deltaQ } from "../geometry";
import { take } from "../../jbsnorro";

export class Gravity extends ForceComputer {
    constructor(
        private readonly geometry: IGeometry<Particle>,
        private readonly takeDistancesCount: number,
        private readonly G: number = 50) {
        super();
    }
    /** Computes the force of particle 'actor' on particle 'receiver'. */
    computeForceOn(receiver: Particle, actor: Particle): F {
        const distances = take<deltaQ>(this.geometry.distance(actor.q, receiver.q), this.takeDistancesCount);

        // F_x = -G M m / r^2  in the direction of x, which is the same as F = -G M m / r^3 * r_x
        const G = this.G;
        const m = receiver.m;
        const M = actor.m;

        for (const d of distances) {
            if (d.L == 0) {
                if (receiver === actor) {
                    console.error(`receiver === actor`);
                }
                console.log(`distance of 0 encountered`);
            }
        }

        const contributions = distances.filter(dr => dr.L != 0).map(dr => ({ fx: -G * M * m * dr.dx / (dr.L ** 3), fy: -G * M * m * dr.dy / (dr.L ** 3) }));
        const result = contributions.reduce(reducer, { fx: 0, fy: 0 });
        return result;
        function reducer(total: F, next: F) {
            return { fx: total.fx + next.fx, fy: total.fy + next.fy };
        }
    }
}
