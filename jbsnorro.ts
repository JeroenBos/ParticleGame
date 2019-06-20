// TODO: everything from this file should be imported rather than copied into the project

export function assert(expr: boolean, message = 'Assertion failed') {
    if (!expr) {
        debugger;
        throw new Error(message);
    }
}