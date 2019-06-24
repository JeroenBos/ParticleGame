import { ParticleProps } from "./particle";
import { Particle } from "./physics";

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
    detect(particles: TParticle[]): { collisions: Collision[], freeParticles: TParticle[] };
}
export interface Collision {
    i: number,
    j: number
}
export interface ICollisionHandler<TParticle> {
    collide(p: TParticle, q: TParticle): TParticle[];
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
}

export interface IParticleGenerator<TParticle> {
    generate(): TParticle[];
}


