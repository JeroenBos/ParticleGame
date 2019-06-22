import { assert } from "../jbsnorro";
import { CollisionHandler } from "../physics/collisionHandler";
import { ParticleProps } from "../particle";

const δ = 0.001;
export function assertTotalConservations(before: Readonly<ParticleProps>[], after: Readonly<ParticleProps>[]) {

    const comBefore = CollisionHandler.com(...before.map(p => ({ q: { x: p.x, y: p.y }, m: p.m })));
    const comAfter = CollisionHandler.com(...after.map(p => ({ q: { x: p.x, y: p.y }, m: p.m })));
    const pomBefore = CollisionHandler.pom(...before.map(p => ({ vx: p.vx, vy: p.vy, m: p.m })));
    const pomAfter = CollisionHandler.pom(...before.map(p => ({ vx: p.vx, vy: p.vy, m: p.m })));

    assert(Math.abs(pomAfter.vx - pomBefore.vx) < δ);
    assert(Math.abs(pomAfter.vy - pomBefore.vy) < δ);

    assert(Math.abs(comAfter.q.x - pomBefore.vx - comBefore.q.x) < δ);
    assert(Math.abs(comAfter.q.y - pomBefore.vy - comBefore.q.y) < δ);
}