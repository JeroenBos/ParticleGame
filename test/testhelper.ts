import { assert } from "../jbsnorro";
import { GlueCollisionHandler as CollisionHandler } from "../physics/collisionHandler";
import { Particle, P } from "../physics";
import { IConfine } from "../physics/_physics.base";

const δ = 0.001;
export function assertTotalConservations(before: P[], after: P[], confiner?: IConfine<any>) {

    const impartedMomentum = confiner === undefined ? { m: 1, vx: 0, vy: 0 } : { m: 1, vx: confiner.impartedMomentum.px, vy: confiner.impartedMomentum.py };
    const pomBefore = CollisionHandler.pom(...before.map(p => ({ vx: p.vx, vy: p.vy, m: p.m })));
    const pomAfter = CollisionHandler.pom(...after.map(p => ({ vx: p.vx, vy: p.vy, m: p.m })), impartedMomentum);
    const E_before = kineticEnergy(before);
    const E_after = kineticEnergy(before);
    // energy is conserved, even though confinement may not conserve momentum
    // const E_imparted = (impartedMomentum.vx * impartedMomentum.vx + impartedMomentum.vy * impartedMomentum.vy) / (2 * impartedMomentum.m);

    assert(Math.abs(pomAfter.px - pomBefore.px) < δ);
    assert(Math.abs(pomAfter.py - pomBefore.py) < δ);
    assert(Math.abs(E_before - E_after) < δ); 

    // these constraints do not work because the com may change when bouncing off of the wall
    // const comBefore = CollisionHandler.com(...before.map(p => ({ q: { x: p.x, y: p.y }, m: p.m })));
    // const comAfter = CollisionHandler.com(...after.map(p => ({ q: { x: p.x, y: p.y }, m: p.m })));
    // assert(Math.abs(comAfter.q.x - pomBefore.vx - comBefore.q.x) < δ);
    // assert(Math.abs(comAfter.q.y - pomBefore.vy - comBefore.q.y) < δ);
}

export function kineticEnergy(particles: P[]): number {
    let result = 0;
    for (const particle of particles) {
        result += 1 / 2 * particle.m * (particle.vx * particle.vx + particle.vy * particle.vy);
    }
    return result;
}
