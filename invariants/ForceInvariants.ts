import { IComputeForce } from "../physics/_physics.base";
import { Particle } from "../physics";

type P = any;
type F = any;

export class ForceComputerInvariantsFactory {
    isForTypeOf(obj: IComputeForce<P, F>): boolean {
        return 'computeForceOn' in obj;
    }
    create(obj: IComputeForce<P, F>): IComputeForce<P, F> {
        return new ForceInvariants(obj);
    }
}
class ForceInvariants implements IComputeForce<Particle, F> {
    constructor(private readonly obj: IComputeForce<Particle, F>) { }
    computeForceOn(receiver: P, actor: P): F {
        const result = this.obj.computeForceOn(receiver, actor);
        return result;
    }
    /** Computes the projected state of the particle after an infinitesimal amount of time, ignoring collisions and confinement. */
    project(particle: P, otherParticles: Iterable<P>, dt: number): P | undefined {
        const result = this.obj.project(particle, otherParticles, dt);
        if (result !== undefined) {
            if (isNaN(result.x) || isNaN(result.vx)) {
                throw new Error('force computer returned NaN');
            }
        }
        return result;
    }
    projectAll(particles: P[], dt: number): (P | undefined)[] {
        const result = this.obj.projectAll(particles, dt);
        return result;
    }
}