import { IGeometry } from "./_physics.base";
import { ParticleProps } from "../app/particle";
import Extensions from "../extensions";
import { Transformations, State1D, TransformationPair } from "./transformations";
import { Transform } from "stream";
import { assert } from "../jbsnorro";
import { Particle, P, Q } from ".";


export interface deltaP {
    m?: number,
    px: number,
    py: number
}

export class TorusGeometry implements IGeometry<Particle> {
    bounces: number = 0;
    /** Is positive when momentum has flowed out of the system. */
    get impartedMomentum(): deltaP {
        return { m: 0, px: 0, py: 0 };
    }
    resetImpartedMomentum(): void {
    }

    constructor(public readonly width: number, public readonly height: number) { }
    confine(trivialProjection: Particle): Particle | undefined {

        const x = (trivialProjection.x + this.width) % this.width;
        const y = (trivialProjection.y + this.height) % this.height;

        const result = trivialProjection.withQ({ x, y });
        return result
    }

    public * distance(a: Q, b: Q): Iterable<number> {
        for (const gridCoordinate of Extensions.spiral(0, 0)) {
            const b_x = b.x + gridCoordinate.x * this.width;
            const b_y = b.y + gridCoordinate.y * this.height;

            yield Math.sqrt((a.x - b_x) ** 2 + (a.y - b_y) ** 2);
        }
    }
}