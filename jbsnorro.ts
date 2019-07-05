// TODO: everything from this file should be imported rather than copied into the project

export function assert(expr: boolean, message = 'Assertion failed') {
    if (!expr) {
        debugger;
        throw new Error(message);
    }
}

export function assertSequenceEquals<T, U>(sequence: T[], expectedSequence: U[], equalityComparer?: (t: T, u: U) => boolean) {
    if (sequence.length != expectedSequence.length) {
        debugger;
        throw new Error('Sequences of unequal length specified');
    }

    equalityComparer = equalityComparer || ((t, u) => t as any == u);

    for (let i = 0; i < sequence.length; i++) {
        const element = sequence[i];
        const expected = expectedSequence[i];
        if (!equalityComparer(element, expected)) {
            debugger;
            throw new Error(`Element at index ${i} are unequal: '${element}', but expected '${expected}'`);
        }
    }
}


export function take<T>(sequence: Iterable<T>, n: number): T[] {
    let i = 0;
    const result = [];
    for (const element of sequence) {
        result.push(element);
        if (++i >= n)
            break;
    }
    return result;
}