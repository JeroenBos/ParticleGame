import { ICollectionDetector, Collision } from "../physics.base";

type P = any;

export class CollectionDetectorInvariantsFactory {
    isForTypeOf(obj: ICollectionDetector<P>): boolean {
        return 'detect' in obj;
    }
    create(obj: ICollectionDetector<P>): ICollectionDetector<P> {
        return new CollectionDetectorInvariants(obj);
    }
}
class CollectionDetectorInvariants implements ICollectionDetector<P> {
    count = 0;
    constructor(private readonly obj: ICollectionDetector<P>) { }
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