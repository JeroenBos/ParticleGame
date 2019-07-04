import { ParticleProps } from "../app/particle";
import { IEngine, ICollisionDetector, IComputeForce, ICollisionHandler, IGeometry } from "./_physics.base";
import Extensions from "../extensions";
import { Invariants } from '../invariants/.invariants';
import { Particle } from ".";
import { F } from "./forceComputer";
import { assert } from "../jbsnorro";

export default class Engine implements IEngine<Particle, F> {
    private readonly numberOfAllowedNonDecreasingCollisionCount = 1;
    public readonly collisionDetector: ICollisionDetector<Particle>;
    constructor(
        collisionDetector: ICollisionDetector<Particle>,
        public readonly collisionHandler: ICollisionHandler<Particle>,
        public readonly forceComputer: IComputeForce<Particle, F>,
        public readonly geometry: IGeometry<Particle>,
        public readonly dτ: number
    ) {
        assert(dτ !== undefined);
        assert(dτ > 0);
        this.collisionDetector = Invariants.For(collisionDetector);
    }

    public evolve(particles: Particle[], Δτ: number): Particle[] {
        assert(Δτ >= this.dτ, 'Δτ < dτ');

        let result = particles;
        for (let simulatedτ = 0; simulatedτ < Δτ; simulatedτ += this.dτ) {
            const projections = this.projectAll(result, this.dτ);
            result = this.resolveCollisions(projections, this.dτ);
        }
        return result;
    }
    public resolveInitialCollisions(initialParticles: Particle[]) {
        const confinedParticles = Extensions.removeUndefineds(initialParticles.map(p => this.geometry.confine(p, undefined)));
        const result = this.resolveCollisions(confinedParticles, Number.EPSILON);
        this.geometry.resetImpartedMomentum();
        return result;
    }
    private resolveCollisions(
        projections: Particle[],
        dt: number,
        debug: { previousNumberOfCollisions: number; consecutiveNondecreaseCount: number } = { previousNumberOfCollisions: 0, consecutiveNondecreaseCount: 0 }
    ): Particle[] {
        const { freeParticles, collisions } = this.collisionDetector.detect(projections);
        if (collisions.length == 0)
            return freeParticles;

        let consecutiveNondecreaseCount = 0;
        let previousNumberOfCollisions = Infinity;
        if (collisions.length >= debug.previousNumberOfCollisions) {
            consecutiveNondecreaseCount = debug.consecutiveNondecreaseCount + 1;
            previousNumberOfCollisions = debug.previousNumberOfCollisions;
            if (consecutiveNondecreaseCount > this.numberOfAllowedNonDecreasingCollisionCount)
                throw new Error(`The number of collisions has not decreased after being handled ${consecutiveNondecreaseCount} times by the collision handler`);
        }

        const collidedParticles = collisions.map(collision => this.collisionHandler.collide(projections[collision.i], projections[collision.j], dt)).reduce((a, b) => a.concat(b));
        // this function is recursive, because the resulting particles may still be in collision (with a third e.g.)
        const concatenatedParticles = freeParticles.concat(collidedParticles);
        return this.resolveCollisions(concatenatedParticles, dt, { previousNumberOfCollisions, consecutiveNondecreaseCount });
    }

    private projectAll(particles: Particle[], dt: number): Particle[] {
        const freeProjections = this.forceComputer.projectAll(particles, dt);
        const confinedProjections = freeProjections.map((projection, i) => {
            if (projection == undefined)
                return undefined;
            const particle = particles[i];
            return this.geometry.confine(projection, particle);
        });

        const result = Extensions.removeUndefineds(confinedProjections);
        return result;
    }
}


export interface Dv {
    dvx: number,
    dvy: number
}
