import { Q } from "./physics";

export default class Extensions {
    public static * exceptAt<T>(sequence: Iterable<T>, index: number): Iterable<T> {
        let i = 0;
        for (const element of sequence) {
            if (i !== index)
                yield element;
            i++;
        }
    }
    private static * _removeUndefineds<T>(sequence: Iterable<T | undefined>): Iterable<T> {
        for (const element of sequence) {
            if (element !== undefined)
                yield element;
        }
    }
    public static removeUndefineds<T>(sequence: Array<T | undefined>): T[] {
        const result = Array.from<T>(this._removeUndefineds(sequence));
        return result;
    }
    public static notUndefined<T>(sequence: Array<T | undefined>): T[] {
        for (const element of sequence) {
            if (element === undefined)
                throw new Error('undefined encountered');
        }
        return sequence as T[];
    }

    public static compose<T>(f: (_: T) => T, g: (_: T) => T): (_: T) => T {
        return (t: T) => g(f(t));
    }

    // see https://stackoverflow.com/a/1555236/308451
    public static * spiral(X: number, Y: number): Iterable<Q> {
        let x = 0;
        let y = 0;
        let dx = 0;
        let dy = -1;
        let t = Math.max(X, Y);
        let maxI = t * t;
        for (let i = 0; i < maxI; i++) {
            if ((-X / 2 <= x) && (x <= X / 2) && (-Y / 2 <= y) && (y <= Y / 2)) {
                yield { x, y };
            }
            if ((x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1 - y))) {
                t = dx;
                dx = -dy;
                dy = t;
            }
            x += dx;
            y += dy;
        }
    }
}