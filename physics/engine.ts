import { ParticleProps } from "../particle";
import { IEngine, ICollisionDetector, IComputeForce, ICollisionHandler, IConfine } from "../physics.base";
import Extensions from "../extensions";
import { Invariants } from '../invariants/.invariants';
import { Particle } from ".";
import { F } from "./forceComputer";

export default class Engine implements IEngine<Particle, F> {
    private readonly numberOfAllowedNonDecreasingCollisionCount = 1;
    public readonly collisionDetector: ICollisionDetector<Particle>;
    constructor(
        collisionDetector: ICollisionDetector<Particle>,
        public readonly collisionHandler: ICollisionHandler<Particle>,
        public readonly forceComputer: IComputeForce<Particle, F>,
        public readonly confiner: IConfine<Particle>
    ) {
        console.log('engine created');
        this.collisionDetector = Invariants.For(collisionDetector);
    }

    public evolve(particles: Particle[], dt: number): Particle[] {
        const projections = this.projectAll(particles, dt);
        const resultantParticles = this.resolveCollisions(projections);
        return resultantParticles;

    }
    public resolveInitialCollisions(initialParticles: Particle[]) {
        const confinedParticles = Extensions.removeUndefineds(initialParticles.map(p => this.confiner.confine(p, undefined)));
        const result = this.resolveCollisions(confinedParticles);
        this.confiner.resetImpartedMomentum();
        return result;
    }
    private resolveCollisions(
        projectedParticles: Particle[],
        debug: { previousNumberOfCollisions: number; consecutiveNondecreaseCount: number } = { previousNumberOfCollisions: 0, consecutiveNondecreaseCount: 0 }
    ): Particle[] {
        const { freeParticles, collisions } = this.collisionDetector.detect(projectedParticles);
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

        const collidedParticles = collisions.map(collision => this.collisionHandler.collide(projectedParticles[collision.i], projectedParticles[collision.j])).reduce((a, b) => a.concat(b));
        const particles = freeParticles.concat(collidedParticles);
        // this function is recursive, because the resulting particles may still be in collision (with a third e.g.)
        return this.resolveCollisions(particles, { previousNumberOfCollisions, consecutiveNondecreaseCount });
    }

    private projectAll(particles: Particle[], dt: number): Particle[] {
        const freeProjections = this.forceComputer.projectAll(particles, dt);
        const confinedProjections = freeProjections.map((projection, i) => {
            if (projection == undefined)
                return undefined;
            const particle = particles[i];
            return this.confiner.confine(projection, particle);
        });

        const result = Extensions.removeUndefineds(confinedProjections);
        return result;
    }
}


export interface Dv {
    dvx: number,
    dvy: number
}
