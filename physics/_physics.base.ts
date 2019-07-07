import { deltaP, deltaQ } from "./geometry";
import { Q } from ".";

export interface IEngine<TParticle, TForce> {
    readonly collisionDetector: ICollisionDetector<TParticle>;
    readonly collisionHandler: ICollisionHandler<TParticle>;
    readonly forceComputer: IComputeForce<TParticle, TForce>;
    readonly geometry: IGeometry<TParticle>;
    /** `τ` means it regards game-time rather than real-life time, for which we use `t`. */
    readonly dτ: number;
    evolve(particles: TParticle[], Δτ: number): TParticle[];
    resolveInitialCollisions(initialParticles: TParticle[]): TParticle[];
}
export interface ICollisionDetector<TParticle> {
    /** Gets the number of recorded collisions. */
    readonly count: number;
    /**
     * @param {boolean} [real] Indicates whether the counter property is updated upon detection of a collision. Default/missing is true. 
     */
    detect(particles: TParticle[], real?: boolean): { collisions: Collision[], freeParticles: TParticle[] };
    getTimeToCollision(particle1: TParticle, particl2: TParticle): number | undefined;
}
export interface Collision {
    i: number,
    j: number
}
export interface ICollisionHandler<TParticle> {
    collide(projection1: TParticle, projection2: TParticle, dt: number): TParticle[];
}
export interface IComputeForce<TParticle, TForce> {
    /** Computes the force of particle 'actor' on particle 'receiver'. */
    computeForceOn(receiver: TParticle, actor: TParticle): TForce;
    /** Computes the projected state of the particle after an infinitesimal amount of time, ignoring collisions and confinement. */
    project(particle: Readonly<TParticle>, otherParticles: Iterable<Readonly<TParticle>>, dt: number): Readonly<TParticle> | undefined;
    projectAll(particles: TParticle[], dt: number): (TParticle | undefined)[];
}
export interface IGeometry<TParticle> {
    /**
     * @param {ParticleProps} trivialProjection Trivial here means disregarding collisions and confinement.
     */
    confine(projection: TParticle, previousState: TParticle | undefined): TParticle | undefined;
    resetImpartedMomentum(): void;
    readonly bounces: number;
    readonly impartedMomentum: deltaP;
    distance(x1: Q, x2: Q): Iterable<deltaQ>;
}

export interface IParticleGenerator<TParticle> {
    generate(): TParticle[];
}


