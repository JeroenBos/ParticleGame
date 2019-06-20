import { vector } from "./collisionHandler";

export class Transformations {
    /** Rotates the specified vector to a 1D representation with respect to the specified origin (i.e. the line that intersects them). */
    public static rotate(r: vector, origin?: vector): {
        D: number,
        transformation: (arg: vector) => number,
        inverseTransformation: (x: number) => vector
    } {
        const O /* O for origin */: vector = origin || { x: 0, y: 0 };

        function transformation(arg: vector) {
            const arg0: vector = {
                x: arg.x - O.x,
                y: arg.y - O.y
            };
            const sign = arg0.x == 0 ? arg0.y < 0 ? -1 : 1 : arg0.x < 0 ? -1 : 1; // the part `arg0.y < 0 ? -1 : 1` depends on/defines the direction of the rotation
            return sign * Math.sqrt(arg0.x * arg0.x + arg0.y * arg0.y);
        }

        const { sinTheta, cosTheta } = this.computeThetas(r.x - O.x, r.y - O.y);
        const D = transformation(r);

        return {
            D,
            transformation,
            inverseTransformation: (arg: number) => {
                return {
                    x: arg * cosTheta + O.x,
                    y: arg * sinTheta + O.y
                };
            }
        };
    }

    private static computeThetas(x: number, y: number): {
        sinTheta: number,
        cosTheta: number,
        sign: number
    } {
        if (x == 0)
            return { sinTheta: 1, cosTheta: 0, sign: y < 0 ? -1 : 1 };

        const sign = y < 0 ? -1 : 1;
        const tanTheta = y / x;
        const sinTheta = sign * tanTheta / Math.sqrt(1 + tanTheta * tanTheta);
        const cosTheta = sign / Math.sqrt(1 + tanTheta * tanTheta);


        return { sinTheta, cosTheta, sign };
    }

    public static rotate2(r: vector, s: vector, origin?: vector): {
        D: [number, number],
        inverseTransformation: (x: number) => vector
    } {
        const result = this.rotate(r, origin);
        const secondD = result.transformation(s);
        return { D: [result.D, secondD], inverseTransformation: result.inverseTransformation };
    }
}