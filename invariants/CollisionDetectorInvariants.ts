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
    constructor(private readonly obj: ICollectionDetector<P>) { }
    detect(particles: P[]): {
        collisions: Collision[];
        freeParticles: P[];
    } {
        const result = this.obj.detect(particles);
        const { collisions, freeParticles } = result;

        const collidedParticleIndices = new Set(collisions.map(collision => [collision.i, collision.j]).reduce((a, b) => a.concat(b)));
        if (collidedParticleIndices.size + freeParticles.length != particles.length)
            throw new Error('invariant failed');

        return result;
    }
}