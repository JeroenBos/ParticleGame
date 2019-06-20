import { ParticleProps } from "../particle";
import { IEngine, ICollectionDetector, IComputeForce, ICollectionHandler, IConfine } from "../physics.base";
import Extensions from "../extensions";
import { Invariants } from '../invariants/.invariants';

export default class Engine implements IEngine<ParticleProps, Dv> {
    private readonly numberOfAllowedNonDecreasingCollisionCount = 1;
    public readonly collisionDetector: ICollectionDetector<ParticleProps>;
    constructor(
        collisionDetector: ICollectionDetector<ParticleProps>,
        public readonly collisionHandler: ICollectionHandler<ParticleProps>,
        public readonly forceComputer: IComputeForce<ParticleProps, Dv>,
        public readonly confiner: IConfine<ParticleProps>
    ) {
        this.collisionDetector = Invariants.For(collisionDetector);
    }

    public evolve(particles: ParticleProps[]): ParticleProps[] {

        const projectedParticles: ParticleProps[] = Extensions.removeUndefineds(particles.map((p, i) => this.projectParticle(p, Extensions.exceptAt(particles, i))));
        const resultantParticles = this.resolveCollisions(projectedParticles);
        return resultantParticles;
    }
    public resolveInitialCollisions(initialParticles: ParticleProps[]) {
        const confinedParticles = Extensions.removeUndefineds(initialParticles.map(p => this.confiner.confine(p, undefined)));
        return this.resolveCollisions(confinedParticles);
    }
    private resolveCollisions(
        projectedParticles: ParticleProps[],
        debug: { previousNumberOfCollisions: number; consecutiveNondecreaseCount: number } = { previousNumberOfCollisions: 0, consecutiveNondecreaseCount: 0 }
    ): ParticleProps[] {
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
    private projectParticle(particle: Readonly<ParticleProps>, otherParticles: Iterable<Readonly<ParticleProps>>): ParticleProps | undefined {
        const dv: Dv = { dvx: 0, dvy: 0 };
        for (const p of otherParticles) {
            const dv_p = this.forceComputer.computeForceOn(particle, p);
            dv.dvx += dv_p.dvx;
            dv.dvy += dv_p.dvy;
        }

        const projection = {
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx + dv.dvx,
            vy: particle.vy + dv.dvy,
            size: particle.size,
            m: particle.m
        };

        const confinedProjection = this.confiner.confine(projection, particle);
        return confinedProjection;
    }
}


export interface Dv {
    dvx: number,
    dvy: number
}
