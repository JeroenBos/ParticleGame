import { IGeometry } from "./_physics.base";
import { ParticleProps } from "../app/particle";
import Extensions from "../extensions";
import { Transformations, State1D, TransformationPair } from "./transformations";
import { Transform } from "stream";
import { assert } from "../jbsnorro";
import { Particle, P } from ".";

export interface deltaP {
    m?: number,
    px: number,
    py: number
}
interface t {
    _r: number;
    _dr: number;
    _v: number;
    _L: number;
}


export class BoxGeometry implements IGeometry<Particle> {
    bounces: number = 0;
    private _impartedMomentum = { m: 0, px: 0, py: 0 };
    /** Is positive when momentum has flowed out of the system. */
    get impartedMomentum(): deltaP {
        return this._impartedMomentum;
    }
    resetImpartedMomentum(): void {
        this._impartedMomentum = { m: 0, px: 0, py: 0 };
    }
    private addImpartedMomentum(p: deltaP | undefined, factor: number = 1): void {
        if (p === undefined || p.m == 0 && p.px == 0 && p.py == 0)
            return;
        if (p.m !== undefined) {
            this._impartedMomentum.m += p.m * factor;
        }
        this._impartedMomentum.px += p.px * factor;
        this._impartedMomentum.py += p.py * factor;
    }

    constructor(public readonly width: number, public readonly height: number) { }
    confine(trivialProjection: Particle, previousState: Particle | undefined): Particle | undefined {
        const result = this._confine(trivialProjection, previousState);
        const deltaP = this.computeDeltaP(result, previousState);
        this.addImpartedMomentum(deltaP);
        return result;
    }
    private _confine(trivialProjection: Particle, previousState: Particle | undefined): Particle | undefined {
        const projection = trivialProjection;
        if (projection.radius > this.width || projection.radius > this.height) {
            // particle doesn't fit
            return undefined;
        }

        if (previousState === undefined) {
            // particle was newly created
            if (this.isCompletelyOutside(projection)) {
                return undefined;
            }
            else if (this.isPartiallyOutside(projection) && this.isMovingOutOfBox(projection)) {
                return this.reverseVelocityInwards(projection);
            }
            else return projection;
        }
        // else particle already existed

        if (this.isCompletelyOutside(previousState) && this.isCompletelyOutside(projection)) {
            this.bounces++;
            return undefined;
        }
        else if (this.isPartiallyOutside(projection)) {
            if (this.isMovingOutOfBox(projection)) {
                this.bounces++;
                return this.bounce(previousState, projection);
            }
        }

        return projection;
    }
    private computeDeltaP(confinedProjection: Particle | undefined, previousState: Particle | undefined): deltaP | undefined {
        if (confinedProjection !== undefined && previousState !== undefined && confinedProjection.m != previousState.m)
            throw new Error('mass change not handled');
        const b = confinedProjection || { m: 0, vx: 0, vy: 0 };
        const a = previousState || { m: 0, vx: 0, vy: 0 };

        const result = { m: b.m - a.m, px: b.vx * b.m - a.vx * a.m, py: b.vy * b.m - a.vy * a.m };
        result.m *= -1;
        result.px *= -1;
        result.py *= -1;
        return result;
    }


    private isCompletelyOutside(p: ParticleProps) {
        return p.x + p.radius < 0
            || p.x - p.radius > this.width
            || p.y + p.radius < 0
            || p.y - p.radius > this.height;
    }
    private isPartiallyOutside(p: ParticleProps) {
        return p.x - p.radius < 0
            || p.x + p.radius > this.width
            || p.y - p.radius < 0
            || p.y + p.radius > this.height;
    }

    private reverseVelocityInwards(particle: Particle): Particle {
        const newP = { vx: particle.p.vx, vy: particle.p.vy };

        if (particle.x - particle.radius < 0)
            newP.vx = Math.abs(particle.vx);
        if (particle.x + particle.radius > this.width)
            newP.vx = -Math.abs(particle.vx);

        if (particle.y - particle.radius < 0)
            newP.vy = Math.abs(particle.vy);
        if (particle.y + particle.radius > this.height)
            newP.vy = -Math.abs(particle.vy);

        return particle.withP(newP);
    }
    private bounce(previousState: Particle, p: Particle): Particle {
        const bounce1 = function (r: number, r_prev: number, v: number, L: number, radius: number): State1D {

            let transformation: TransformationPair<State1D, State1D> | undefined = undefined;
            let newPrevR = r_prev;
            let newL = L;

            const dr = r - r_prev;
            if (radius != 0) {
                transformation = Transformations.translation1(radius);
                newPrevR = transformation.transformation({ coordinate: r_prev, velocity: 0 }).coordinate;
                // 2 radius and affects length twice
                newL = Transformations.translation1(2 * radius).transformation({ coordinate: L, velocity: 0 }).coordinate;
            }
            else if (L < r + dr) {
                transformation = Transformations.reflection1(L);
                newPrevR = transformation.transformation({ coordinate: r_prev, velocity: 0 }).coordinate;
                newL = transformation.transformation({ coordinate: L, velocity: 0 }).coordinate;
            }

            if (transformation !== undefined) {
                const { coordinate: newR, velocity: newV } = transformation.transformation({ coordinate: r, velocity: v });
                const inverseResult = bounce1(newR, newPrevR, newV, newL, 0);
                const result = transformation.inverseTransformation(inverseResult);
                return result;
            }

            if (r < 0) {
                // this is an operation rather then a transformation, because it is not reversed
                return { coordinate: -r, velocity: -v };
            }
            else {
                return { coordinate: r, velocity: v };
            }
        }

        const xResult = bounce1(p.x, previousState.x, p.vx, this.width, p.radius);
        const yResult = bounce1(p.y, previousState.y, p.vy, this.height, p.radius);

        return Particle.create({
            x: xResult.coordinate,
            vx: xResult.velocity,
            y: yResult.coordinate,
            vy: yResult.velocity,
            radius: p.radius,
            m: p.m
        });
    }
    private isMovingOutOfBox(p: ParticleProps): boolean {
        if (p.x - p.radius < 0 && p.vx < 0)
            return true;
        if (p.x + p.radius > this.width && p.vx > 0)
            return true;
        if (p.y - p.radius < 0 && p.vy < 0)
            return true;
        if (p.y + p.radius > this.height && p.vy > 0)
            return true;
        return false;
    }
}