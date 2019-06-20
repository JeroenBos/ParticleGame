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
}
export interface IConfine<TParticle> {
    confine(projection: TParticle, previousState: TParticle | undefined): TParticle | undefined;
}




