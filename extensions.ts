
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

    public static compose<T>(f: (_: T) => T, g: (_: T) => T): (_: T) => T {
        return (t: T) => g(f(t));
    }
}