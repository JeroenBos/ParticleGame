import { ParticleProps } from "../particle";
import { IEngine, ICollectionDetector, IComputeForce, ICollectionHandler, IConfine } from "../physics.base";
import Extensions from "../extensions";
import { Invariants } from '../invariants/.invariants';
import { Particle } from ".";

export default class Engine implements IEngine<Particle, Dv> {
    private readonly numberOfAllowedNonDecreasingCollisionCount = 1;
    public readonly collisionDetector: ICollectionDetector<Particle>;
    constructor(
        collisionDetector: ICollectionDetector<Particle>,
        public readonly collisionHandler: ICollectionHandler<Particle>,
        public readonly forceComputer: IComputeForce<Particle, Dv>,
        public readonly confiner: IConfine<Particle>
    ) {
        this.collisionDetector = Invariants.For(collisionDetector);
    }

    public evolve(particles: Particle[]): Particle[] {
        const projections = this.projectAll(particles);
        const resultantParticles = this.resolveCollisions(projections);
        return resultantParticles;

    }
    public resolveInitialCollisions(initialParticles: Particle[]) {
        const confinedParticles = Extensions.removeUndefineds(initialParticles.map(p => this.confiner.confine(p, undefined)));
        return this.resolveCollisions(confinedParticles);
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

    private projectAll(particles: Particle[]): Particle[] {
        const freeProjections = this.forceComputer.projectAll(particles);
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
