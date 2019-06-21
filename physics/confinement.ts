import { IConfine } from "../physics.base";
import { ParticleProps, Particle } from "../particle";
import Extensions from "../extensions";
import { Transformations, State1D, TransformationPair } from "./transformations";
import { Transform } from "stream";
import { assert } from "../jbsnorro";

interface t {
    _r: number;
    _dr: number;
    _v: number;
    _L: number;
}


export class Confiner implements IConfine<ParticleProps> {
    constructor(public readonly width: number, public readonly height: number) { }
    confine(trivialProjection: ParticleProps, previousState: ParticleProps | undefined): ParticleProps | undefined {
        const projection = trivialProjection;
        if (projection.size > this.width || projection.size > this.height) {
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
            return undefined;
        }
        else if (this.isPartiallyOutside(projection)) {
            if (this.isMovingOutOfBox(projection)) {
                return this.bounce(previousState, projection);
            }
        }

        return projection;
    }

    private isCompletelyOutside(p: ParticleProps) {
        return p.x + p.size < 0
            || p.x - p.size > this.width
            || p.y + p.size < 0
            || p.y - p.size > this.height;
    }
    private isPartiallyOutside(p: ParticleProps) {
        return p.x - p.size < 0
            || p.x + p.size > this.width
            || p.y - p.size < 0
            || p.y + p.size > this.height;
    }

    private reverseVelocityInwards(p: Readonly<ParticleProps>): ParticleProps {
        const result = Object.assign<{}, ParticleProps>({}, p);
        if (p.x - p.size < 0)
            result.vx = Math.abs(p.vx);
        if (p.x + p.size > this.width)
            result.vx = -Math.abs(p.vx);

        if (p.y - p.size < 0)
            result.vy = Math.abs(p.vy);
        if (p.y + p.size > this.height)
            result.vy = -Math.abs(p.vy);
        return result;
    }
    private bounce(previousState: ParticleProps, p: ParticleProps): ParticleProps {
        const bounce1 = function (r: number, r_prev: number, v: number, L: number, size: number): State1D {

            let transformation: TransformationPair<State1D, State1D> | undefined = undefined;
            let newPrevR = r_prev;
            let newL = L;

            const dr = r - r_prev;
            if (size != 0) {
                transformation = Transformations.translation1(size);
                newPrevR = transformation.transformation({ coordinate: r_prev, velocity: 0 }).coordinate;
                // 2 because size represents radius and affects length doubly
                newL = Transformations.translation1(2 * size).transformation({ coordinate: L, velocity: 0 }).coordinate;
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
               return  { coordinate: -r, velocity: -v };
            }
            else {
                return { coordinate: r, velocity: v };
            }

            // let transformation = ({ _r, _dr, _v, _L }: t) => ({ _r: _r - size, _dr: _dr, _v: _v, _L: _L - 2 * size });
            // let inverse = ({ _r, _dr, _v, _L }: t) => ({ _r: _r + size, _dr: _dr, _v: _v, _L: _L + 2 * size });

            // if (r < 0 || r + dr < 0) {
            //     const _transformation = ({ _r, _dr, _v, _L }: t) => ({ _r: L - _r, _dr: -_dr, _v: -_v, _L: _L });
            //     const _inverse = _transformation;
            //     transformation = Extensions.compose(transformation, _transformation);
            //     inverse = Extensions.compose(_inverse, inverse);
            // }
            // if (dr < 0) {
            //     const _transformation = ({ _r, _dr, _v, _L }: t) => ({ _r: -_r, _dr: -_dr, _v: -_v, _L: _L });
            //     const _inverse = _transformation;
            //     transformation = Extensions.compose(transformation, _transformation);
            //     inverse = Extensions.compose(_inverse, inverse);
            // }

            // if (L < r + dr) {
            //     const distanceTraveledInWall = r + dr - L;
            //     const newR = L - distanceTraveledInWall;
            //     const newV = -Math.abs(v);
            //     const result = inverse({ _r: newR, _dr: dr, _v: newV, _L: L });
            //     return { r: result._r, v: result._v };
            // }

            // return { r, v };
        }

        const xResult = bounce1(p.x, previousState.x, p.vx, this.width, p.size);
        const yResult = bounce1(p.y, previousState.y, p.vy, this.height, p.size);

        return {
            x: xResult.coordinate,
            vx: xResult.velocity,
            y: yResult.coordinate,
            vy: yResult.velocity,
            size: p.size,
            m: p.m
        };
    }
    private isMovingOutOfBox(p: ParticleProps): boolean {
        if (p.x - p.size < 0 && p.vx < 0)
            return true;
        if (p.x + p.size > this.width && p.vx > 0)
            return true;
        if (p.y - p.size < 0 && p.vy < 0)
            return true;
        if (p.y + p.size > this.height && p.vy > 0)
            return true;
        return false;
    }
}