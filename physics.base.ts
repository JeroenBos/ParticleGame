import { ParticleProps } from "./particle";

export interface IEngine<TParticle, TForce> {
    readonly collisionDetector: ICollectionDetector<TParticle>;
    readonly collisionHandler: ICollectionHandler<TParticle>;
    readonly forceComputer: IComputeForce<TParticle, TForce>;
    readonly confiner: IConfine<TParticle>;
    evolve(particles: Readonly<ParticleProps>[]): Readonly<ParticleProps>[];
    resolveInitialCollisions(initialParticles: ParticleProps[]): ParticleProps[];
}
export interface ICollectionDetector<TParticle> {
    /** Gets the number of recorded collisions. */
    readonly count: number;
    detect(particles: TParticle[]): { collisions: Collision[], freeParticles: TParticle[] };
}
export interface Collision {
    i: number,
    j: number
}
export interface ICollectionHandler<TParticle> {
    collide(p: Readonly<TParticle>, q: Readonly<TParticle>): Readonly<TParticle[]>;
}
export interface IComputeForce<TParticle, TForce> {
    /** Computes the force of particle 'actor' on particle 'receiver'. */
    computeForceOn(receiver: TParticle, actor: TParticle): TForce;
    /** Computes the projected state of the particle after an infinitesimal amount of time, ignoring collisions and confinement. */
    project(particle: Readonly<TParticle>, otherParticles: Iterable<Readonly<TParticle>>): Readonly<TParticle> | undefined;
    projectAll(particle: Readonly<TParticle>[]): (Readonly<TParticle> | undefined)[];
}
export interface IConfine<TParticle> {
    /**
     * @param {ParticleProps} trivialProjection Trivial here means disregarding collisions and confinement.
     */
    confine(projection: TParticle, previousState: TParticle | undefined): TParticle | undefined;
}




