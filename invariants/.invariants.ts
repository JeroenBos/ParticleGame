import { CollectionDetectorInvariantsFactory } from './CollisionDetectorInvariants';
import { ParticleGeneratorInvariantsFactory } from './ParticleGeneratorInvariants';

export class Invariants {
    private static invariants: InvariantsFor<any>[] = [
        new CollectionDetectorInvariantsFactory(),
        new ParticleGeneratorInvariantsFactory()
    ];
    public static For<T>(obj: T): T {
        // TODO: if (!development) return obj;
        for (const i of this.invariants) {
            if (i.isForTypeOf(obj)) {
                return i.create(obj);
            }
        }

        return obj;
    }
}

interface InvariantsFor<T> {
    isForTypeOf(obj: T): boolean;
    create(obj: T): T;
}