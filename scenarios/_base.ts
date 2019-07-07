import Engine from "../physics/engine";
import { CollisionDetector } from "../physics/collisionDetector";
import { GlueCollisionHandler, ElasticCollisionHandler } from "../physics/collisionHandler";
import { F as _F, F, ZeroForce } from "../physics/forceComputer";
import { BoxGeometry } from "../physics/geometry";
import { IComputeForce, ICollisionDetector, ICollisionHandler, IGeometry, IParticleGenerator, IEngine } from '../physics/_physics.base';
import { Particle } from "../physics";
import { Invariants } from "../invariants/.invariants";
import * as seedrandom from "seedrandom";
import { prng } from "seedrandom";

export abstract class BaseConfig<TParticle, F> {
    public get width(): number { return 500; }
    public get height(): number { return 500; }
    /** The number of ms between renders. */
    public get updateInterval_ms(): number { return 10; }
    /** The maximum simulation time. */
    public τ_max = Infinity;
    /** The smallest time step in which computations are performed. */
    public dτ = 0.01;
    public get collisionPrecision(): number { return 0.001; }
    public onErrorResumeNext = false;
    public seed = 'seed';

    private _rng: prng | undefined;
    private _collisionDetector: ICollisionDetector<TParticle> | undefined;
    private _collisionHandler: ICollisionHandler<TParticle> | undefined;
    private _forceComputer: IComputeForce<TParticle, F> | undefined;
    private _geometry: IGeometry<TParticle> | undefined;
    private _engine: IEngine<TParticle, F> | undefined;
    private _particleGenerator: IParticleGenerator<TParticle> | undefined;

    public get rng(): prng {
        if (this._rng === undefined) {
            this._rng = seedrandom(this.seed);
        }
        return this._rng;
    }
    public get collisionDetector(): ICollisionDetector<TParticle> {
        if (this._collisionDetector === undefined) {
            this._collisionDetector = Invariants.For(this.createCollisionDetector());
        }
        return this._collisionDetector;
    }
    public get collisionHandler(): ICollisionHandler<TParticle> {
        if (this._collisionHandler === undefined) {
            this._collisionHandler = Invariants.For(this.createCollisionHandler());
        }
        return this._collisionHandler;
    }
    public get forceComputer(): IComputeForce<TParticle, F> {
        if (this._forceComputer === undefined) {
            this._forceComputer = Invariants.For(this.createForceComputer());
        }
        return this._forceComputer;
    }
    public get geometry(): IGeometry<TParticle> {
        if (this._geometry === undefined) {
            this._geometry = Invariants.For(this.createGeometry());
        }
        return this._geometry;
    }
    public get engine(): IEngine<TParticle, F> {
        if (this._engine === undefined) {
            this._engine = Invariants.For(this.createEngine());
        }
        return this._engine;
    }
    public get particleGenerator(): IParticleGenerator<TParticle> {
        if (this._particleGenerator === undefined) {
            this._particleGenerator = Invariants.For(this.createGenerator());
        }
        return this._particleGenerator;
    }

    protected abstract createCollisionDetector(): ICollisionDetector<TParticle>;
    protected abstract createCollisionHandler(): ICollisionHandler<TParticle>;
    protected abstract createForceComputer(): IComputeForce<TParticle, F>;
    protected abstract createGeometry(): IGeometry<TParticle>;
    protected abstract createEngine(): IEngine<TParticle, F>;
    protected abstract createGenerator(): IParticleGenerator<TParticle>;

    initialize() {
        // triggers all getters:
        const _getAll = [this.collisionDetector, this.collisionHandler, this.forceComputer, this.geometry, this.engine, this.particleGenerator];
    }
}

export abstract class DefaultConfig extends BaseConfig<Particle, F> {
    protected createCollisionDetector(): ICollisionDetector<Particle> {
        return new CollisionDetector(this.collisionPrecision);
    }
    protected createCollisionHandler(): ICollisionHandler<Particle> {
        return new ElasticCollisionHandler(this.collisionDetector, this.onErrorResumeNext);
    }
    protected createForceComputer(): IComputeForce<Particle, F> {
        return new ZeroForce();
    }
    protected createGeometry(): IGeometry<Particle> {
        return new BoxGeometry(this.width, this.height) as IGeometry<Particle>;
    }
    protected createEngine(): IEngine<Particle, F> {
        return new Engine(this.collisionDetector, this.collisionHandler, this.forceComputer, this.geometry, this.dτ, this.onErrorResumeNext);
    }
}