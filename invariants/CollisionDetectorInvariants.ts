import { ICollisionDetector, Collision } from "../physics/_physics.base";

type P = any;

export class CollectionDetectorInvariantsFactory {
    isForTypeOf(obj: ICollisionDetector<P>): boolean {
        return 'detect' in obj;
    }
    create(obj: ICollisionDetector<P>): ICollisionDetector<P> {
        return new CollectionDetectorInvariants(obj);
    }
}
class CollectionDetectorInvariants implements ICollisionDetector<P> {
    get count() { return this.obj.count; }
    getTimeToCollision(a: P, b: P) { return this.obj.getTimeToCollision(a, b); }
    constructor(private readonly obj: ICollisionDetector<P>) { }
    detect(particles: P[]): {
        collisions: Collision[];
        freeParticles: P[];
    } {
        const result = this.obj.detect(particles);
        const { collisions, freeParticles } = result;

        const collidedParticleIndices = new Set(collisions.map(collision => [collision.i, collision.j]).reduce((a, b) => a.concat(b), []));
        const freeParticleIndices = freeParticles.map(p => particles.indexOf(p));
        for (const freeParticleIndex of freeParticleIndices) {
            if (freeParticleIndex == -1) {
                throw new Error('invariant failed: free particles returned from the collision detector must be chosen from the initial particles collection');
            }
        }

        const returnedParticleIndices = new Set(freeParticleIndices.concat(Array.from(collidedParticleIndices)));
        if (returnedParticleIndices.size != particles.length) {
            if (returnedParticleIndices.size > particles.length)
                throw new Error('Invariant failed: nonexistent particles were returned');
            throw new Error(`Invariant failed: Not all particles either collided or didn't collide`);
        }



        return result;
    }
}