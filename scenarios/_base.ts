import Engine from "../physics/engine";
import { CollisionDetector } from "../physics/collisionDetector";
import { GlueCollisionHandler, ElasticCollisionHandler } from "../physics/collisionHandler";
import { ForceComputer, F as _F, F } from "../physics/forceComputer";
import { Confiner } from "../physics/confinement";
import { IComputeForce, ICollisionDetector, ICollisionHandler, IConfine, IParticleGenerator, IEngine } from '../physics/_physics.base';
import { Particle } from "../physics";

export abstract class BaseConfig<TParticle, F> {
    public get width(): number { return 500; }
    public get height(): number { return 500; }
    public get updateInterval(): number { return 10; }
    public get maxTime(): number { return 100; }
    public get dt(): number { return 0.1; }
    public get collisionPrecision(): number { return 0.001; }
    public get stepsPerTimeInterval(): number { return 1; }

    public readonly collisionDetector: ICollisionDetector<TParticle>;
    public readonly collisionHandler: ICollisionHandler<TParticle>;
    public readonly forceComputer: IComputeForce<TParticle, F>;
    public readonly confiner: IConfine<TParticle>;
    public readonly engine: IEngine<TParticle, F>;
    public readonly particleGenerator: IParticleGenerator<TParticle>;

    protected abstract createCollisionDetector(): ICollisionDetector<TParticle>;
    protected abstract createCollisionHandler(): ICollisionHandler<TParticle>;
    protected abstract createForceComputer(): IComputeForce<TParticle, F>;
    protected abstract createConfinement(): IConfine<TParticle>;
    protected abstract createEngine(): IEngine<TParticle, F>;
    protected abstract createGenerator(): IParticleGenerator<TParticle>;

    constructor() {
        this.collisionDetector = this.createCollisionDetector();
        this.collisionHandler = this.createCollisionHandler();
        this.forceComputer = this.createForceComputer();
        this.confiner = this.createConfinement();
        this.engine = this.createEngine();
        this.particleGenerator = this.createGenerator();
    }
}

export abstract class DefaultConfig extends BaseConfig<Particle, F> {
    protected createCollisionDetector(): ICollisionDetector<Particle> {
        return new CollisionDetector(this.collisionPrecision);
    }
    protected createCollisionHandler(): ICollisionHandler<Particle> {
        return new ElasticCollisionHandler(this.collisionDetector);
    }
    protected createForceComputer(): IComputeForce<Particle, F> {
        return new ForceComputer();
    }
    protected createConfinement(): IConfine<Particle> {
        return new Confiner(this.width, this.height) as IConfine<Particle>;
    }
    protected createEngine(): IEngine<Particle, F> {
        return new Engine(this.collisionDetector, this.collisionHandler, this.forceComputer, this.confiner);
    }
}