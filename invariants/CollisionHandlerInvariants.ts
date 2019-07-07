import { Collision, ICollisionHandler } from "../physics/_physics.base";
import { Particle } from "../physics";

type P = any;

export class CollectionHandlerInvariantsFactory {
    isForTypeOf(obj: ICollisionHandler<P>): boolean {
        return 'detect' in obj;
    }
    create(obj: ICollisionHandler<P>): ICollisionHandler<P> {
        return new CollectionHandlerInvariants(obj);
    }
}
class CollectionHandlerInvariants implements ICollisionHandler<Particle> {

    constructor(private readonly obj: ICollisionHandler<Particle>) { }
    collide(projection1: Particle, projection2: Particle, dt: number): Particle[] {
        const result = this.obj.collide(projection1, projection2, dt);
        for (const p of result) {
            if (isNaN(p.x) || isNaN(p.y) || isNaN(p.vx) || isNaN(p.vy))
                throw new Error('Coordinates after a collision may not be NaN');
        }

        return result;
    }
}