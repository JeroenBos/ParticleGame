import Engine from "../physics/engine";
import { CollisionDetector } from "../physics/collisionDetector";
import { GlueCollisionHandler, ElasticCollisionHandler } from "../physics/collisionHandler";
import { ForceComputer, F as _F, F } from "../physics/forceComputer";
import { Confiner } from "../physics/confinement";
import { IComputeForce, ICollisionDetector, ICollisionHandler, IConfine, IParticleGenerator, IEngine } from '../physics/_physics.base';
import { Particle } from "../physics";
import { Invariants } from "../invariants/.invariants";

export abstract class BaseConfig<TParticle, F> {
    public get width(): number { return 500; }
    public get height(): number { return 500; }
    public get updateInterval(): number { return 10; }
    public get maxTime(): number { return 100; }
    public get dt(): number { return 0.1; }
    public get collisionPrecision(): number { return 0.001; }
    public get stepsPerTimeInterval(): number { return 1; }

    private _collisionDetector: ICollisionDetector<TParticle> | undefined;
    private _collisionHandler: ICollisionHandler<TParticle> | undefined;
    private _forceComputer: IComputeForce<TParticle, F> | undefined;
    private _confiner: IConfine<TParticle> | undefined;
    private _engine: IEngine<TParticle, F> | undefined;
    private _particleGenerator: IParticleGenerator<TParticle> | undefined;

    public get collisionDetector(): ICollisionDetector<TParticle> {
        if (this._collisionDetector === undefined) {
            this._collisionDetector = this.createCollisionDetector();
        }
        return this._collisionDetector;
    }
    public get collisionHandler(): ICollisionHandler<TParticle> {
        if (this._collisionHandler === undefined) {
            this._collisionHandler = this.createCollisionHandler();
        }
        return this._collisionHandler;
    }
    public get forceComputer(): IComputeForce<TParticle, F> {
        if (this._forceComputer === undefined) {
            this._forceComputer = this.createForceComputer();
        }
        return this._forceComputer;
    }
    public get confiner(): IConfine<TParticle> {
        if (this._confiner === undefined) {
            this._confiner = this.createConfinement();
        }
        return this._confiner;
    }
    public get engine(): IEngine<TParticle, F> {
        if (this._engine === undefined) {
            this._engine = this.createEngine();
        }
        return this._engine;
    }
    public get particleGenerator(): IParticleGenerator<TParticle> {
        if (this._particleGenerator === undefined) {
            this._particleGenerator = this.createGenerator();
        }
        return this._particleGenerator;
    }

    protected abstract createCollisionDetector(): ICollisionDetector<TParticle>;
    protected abstract createCollisionHandler(): ICollisionHandler<TParticle>;
    protected abstract createForceComputer(): IComputeForce<TParticle, F>;
    protected abstract createConfinement(): IConfine<TParticle>;
    protected abstract createEngine(): IEngine<TParticle, F>;
    protected abstract createGenerator(): IParticleGenerator<TParticle>;

    initialize() {
        // triggers all getters:
        const _getAll = [this.collisionDetector, this.collisionHandler, this.forceComputer, this.confiner, this.engine, this.particleGenerator];
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