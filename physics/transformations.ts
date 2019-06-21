import { Q } from '.';

export type TransformationPair<T, U> = {
    transformation: (t: T) => U,
    inverseTransformation: (u: U) => T
};
export interface State1D {
    coordinate: number,
    velocity: number
}

export class Transformations {

    /** Performs the specified operation in the transformed space. 
     * @template T The type representing an element of the space before transformation
     * @template U The type representing an element of the space after transformation
     */
    public static perform<T, U>(
        operation: (u: U, others: U[]) => U,
        transformation: (t: T) => U,
        inverseTransformation: (u: U) => T,
        ...input: T[]) {

        const transformed = input.map(transformation);
        const result = transformed.map((u, i) => {
            const others_u = transformed.slice(0);
            others_u.splice(i, 1);
            const result_u = operation(u, others_u);
            const result_t = inverseTransformation(result_u);
            return result_t;
        });
        return result;
    }
    public static combine<T, U, V>(a: TransformationPair<T, U>, b: TransformationPair<U, V>): TransformationPair<T, V> {
        function transformation(t: T): V {
            const intermediate = a.transformation(t);
            const result = b.transformation(intermediate);
            return result;
        }

        function inverseTransformation(v: V): T {
            const intermediate = b.inverseTransformation(v);
            const result = a.inverseTransformation(intermediate);
            return result;
        }

        return { transformation, inverseTransformation };
    }

    /** Performs the specified operation in the transformed space. 
     * @template T The type representing an element of the space before transformation
     * @template U The type representing an element of the space after transformation
     */
    public static perform2<T, U>(
        operation: (u: U, otherCoordinates: U[]) => U,
        transformations: TransformationPair<T, U>,
        ...input: [T, T]): [T, T] {

        const { transformation, inverseTransformation } = transformations;
        return this.perform(operation, transformation, inverseTransformation, ...input) as [T, T];
    }

    /** Creates a translation transformation that has the specified location as origin. */
    public static translation(origin: Q): TransformationPair<Q, Q> {
        function transformation(arg: Q): Q {
            const result = {
                x: arg.x - origin.x,
                y: arg.y - origin.y
            };
            return result;
        }

        function inverseTransformation(arg: Q): Q {
            const result = {
                x: arg.x + origin.x,
                y: arg.y + origin.y
            };
            return result;
        }

        return { transformation, inverseTransformation };
    }

    public static translation1D(coordinate: number): TransformationPair<number, number> {
        function transformation(arg: number) {
            return arg - coordinate;
        }
        function inverseTransformation(arg: number) {
            return arg + coordinate;
        }
        return { transformation, inverseTransformation };
    }
    public static translation1(coordinate: number): TransformationPair<State1D, State1D> {
        function transformation(arg: State1D) {
            return {
                coordinate: arg.coordinate - coordinate,
                velocity: arg.velocity
            };
        }
        function inverseTransformation(arg: State1D) {
            return {
                coordinate: arg.coordinate + coordinate,
                velocity: arg.velocity
            };
        }
        return { transformation, inverseTransformation };
    }

    public static reflection(mirrorCoordinate: number): TransformationPair<number, number> {
        function transformation(arg: number) {
            return mirrorCoordinate - arg;
        }
        function inverseTransformation(arg: number) {
            return mirrorCoordinate - arg;
        }
        return { transformation, inverseTransformation };
    }
    public static reflection1(mirrorCoordinate: number): TransformationPair<State1D, State1D> {
        function transformation(arg: State1D) {
            return {
                coordinate: mirrorCoordinate - arg.coordinate,
                velocity: -arg.velocity
            };
        }
        return { transformation, inverseTransformation: transformation };
    }

    public static identity<T>(): TransformationPair<T, T> {
        function f(arg: T) {
            return arg;
        }
        return { transformation: f, inverseTransformation: f };
    }



    /** Creates a rotation that translation the origin and rotate the specified coordinate onto the positive x-axis. */
    public static translationAndRotation(origin: Q, coordinate: Q): TransformationPair<Q, number> {
        const _translation = this.translation(origin);
        const translatedCoordinate = _translation.transformation(coordinate);
        const _rotation = this.rotation(translatedCoordinate);
        return this.combine(_translation, _rotation);
    }
    /** Creates a rotation transformation that maps the specified coordinate onto the positive x-axis. */
    public static rotation(coordinate: Q): TransformationPair<Q, number> {

        const { sinTheta, cosTheta } = this.computeThetas(coordinate.x, coordinate.y);

        function transformation(arg: Q): number {
            const sign = arg.x == 0 ? arg.y < 0 ? -1 : 1 : arg.x < 0 ? -1 : 1; // the part `arg0.y < 0 ? -1 : 1` depends on/defines the direction of the rotation
            const result = sign * Math.sqrt(arg.x * arg.x + arg.y * arg.y);
            return result;
        }

        function inverseTransformation(arg: number): Q {
            const result = {
                x: arg * cosTheta,
                y: arg * sinTheta
            };
            return result;
        }

        return { transformation, inverseTransformation };
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

}