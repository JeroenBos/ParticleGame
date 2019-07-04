import { Particle } from ".";
import { deltaP } from "./confinement";

export interface IEngine<TParticle, TForce> {
    readonly collisionDetector: ICollisionDetector<TParticle>;
    readonly collisionHandler: ICollisionHandler<TParticle>;
    readonly forceComputer: IComputeForce<TParticle, TForce>;
    readonly confiner: IConfine<TParticle>;
    evolve(particles: TParticle[], dt: number): TParticle[];
    resolveInitialCollisions(initialParticles: TParticle[]): TParticle[];
}
export interface ICollisionDetector<TParticle> {
    /** Gets the number of recorded collisions. */
    readonly count: number;
    /**
     * @param {boolean} [real] Indicates whether the counter property is updated upon detection of a collision. Default is true. 
     */
    detect(particles: TParticle[]): { collisions: Collision[], freeParticles: TParticle[] };
    detect(particles: TParticle[], real: false): { collisions: Collision[], freeParticles: TParticle[] };
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
    projectAll(particle: TParticle[], dt: number): (TParticle | undefined)[];
}
export interface IConfine<TParticle> {
    /**
     * @param {ParticleProps} trivialProjection Trivial here means disregarding collisions and confinement.
     */
    confine(projection: TParticle, previousState: TParticle | undefined): TParticle | undefined;
    resetImpartedMomentum(): void;
    readonly bounces: number;
    readonly impartedMomentum: deltaP;
}

export interface IParticleGenerator<TParticle> {
    generate(): TParticle[];
}

