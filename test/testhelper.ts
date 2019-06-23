import { assert } from "../jbsnorro";
import { CollisionHandler } from "../physics/collisionHandler";
import { ParticleProps } from "../particle";
import { Confiner } from "../physics/confinement";

const δ = 0.001;
export function assertTotalConservations(before: Readonly<ParticleProps>[], after: Readonly<ParticleProps>[], confiner?: Confiner) {

    const impartedMomentum = confiner === undefined ? { m: 0, vx: 0, vy: 0 } : { m: 1, vx: confiner.impartedMomentum.px, vy: confiner.impartedMomentum.py };
    const pomBefore = CollisionHandler.pom(...before.map(p => ({ vx: p.vx, vy: p.vy, m: p.m })));
    const pomAfter = CollisionHandler.pom(...after.map(p => ({ vx: p.vx, vy: p.vy, m: p.m })), impartedMomentum);

    if (impartedMomentum.vx != 0) {
        console.log('');
    }
    assert(Math.abs(pomAfter.px - pomBefore.px) < δ);
    assert(Math.abs(pomAfter.py - pomBefore.py) < δ);

    // these constraints do not work because the com may change when bouncing off of the wall
    // const comBefore = CollisionHandler.com(...before.map(p => ({ q: { x: p.x, y: p.y }, m: p.m })));
    // const comAfter = CollisionHandler.com(...after.map(p => ({ q: { x: p.x, y: p.y }, m: p.m })));
    // assert(Math.abs(comAfter.q.x - pomBefore.vx - comBefore.q.x) < δ);
    // assert(Math.abs(comAfter.q.y - pomBefore.vy - comBefore.q.y) < δ);
}