import * as React from "react";
import { Particle, ParticleProps } from "./particle";
import { IEngine, IParticleGenerator } from "../physics/_physics.base";
import { Particle as IParticle } from '../physics';
import { F } from "../physics/forceComputer";
import { assert } from "../jbsnorro";

export interface ContainerProps {
    particleGenerator: IParticleGenerator<IParticle>;
    width: number;
    height: number;
    engine: IEngine<IParticle, F>,
    renderInterval_ms: number,
    τ_max: number,
    initial_τ_per_s: number
}

export interface ContainerState {
    particles: ParticleProps[];
    τ: number;
    τ_per_s: number;
}

export class Container extends React.Component<ContainerProps, ContainerState> {
    private readonly interval: NodeJS.Timer;
    constructor(props: Readonly<ContainerProps>) {
        super(props);
        // assert(props.stepsPerInterval > 0, 'stepsPerTimeInterval <= 0');
        const initialParticles = props.particleGenerator.generate();
        const particles = this.props.engine.resolveInitialCollisions(initialParticles);
        this.state = { particles, τ: 0, τ_per_s: this.props.initial_τ_per_s };

        console.log(`updateInterval: ${props.renderInterval_ms}`);
        console.log(`initial_τ_per_s: ${props.initial_τ_per_s}`);
        console.log(`τ_max: ${props.τ_max}`);

        this.interval = setInterval(() => this.doTimestep(), props.renderInterval_ms);
    }
    render() {
        const particles = this.state.particles.map((p, i) => <Particle key={i} {...p}></Particle>);
        const collisionCount = this.props.engine.collisionDetector.count;
        const bounceCount = this.props.engine.geometry.bounces;

        return (
            <div>
                <div>t: {(this.state.τ / this.τ_per_s).toFixed(1)}, collisions: {collisionCount}, +bounces: {collisionCount + bounceCount}</div>
                <svg width={this.props.width} height={this.props.height} >
                    {particles}
                    <rect x="0" y="0" width={this.props.width} height={this.props.height} fill="none" stroke="black"></rect>
                </svg>
            </div>
        );
    }
    get τ_per_s() {
        return this.state.τ_per_s;
    }
    get τ_per_ms() {
        return this.τ_per_s / 1000;
    }
    get Δτ() {
        return this.props.renderInterval_ms * this.τ_per_ms;
    }

    checkInvariant(): void {
        assert(this.props.engine.dτ <= this.Δτ, `we must have that at least always one step is simulated per internal tick`);
    }
    doTimestep(): void {
        if (this.props.τ_max <= this.state.τ) {
            try { clearInterval(this.interval); } catch { }
            console.log('max time reached');
        } else {
            this.setState(state => {
                this.checkInvariant();
                const particles = this.props.engine.evolve(state.particles.map(IParticle.create), this.Δτ).map(Container.toProps);
                console.log(state.τ.toFixed(1) + ' + ' + this.Δτ);
                return { particles, τ: state.τ + this.Δτ };
            });
        }
    }

    private static toProps(particle: IParticle): ParticleProps {
        return {
            m: particle.m,
            radius: particle.radius,
            vx: particle.vx,
            vy: particle.vy,
            x: particle.x,
            y: particle.y
        };
    }
}