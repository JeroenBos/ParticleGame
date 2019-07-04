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
    updateInterval: number,
    maxTime: number,
    dt: number,
    stepsPerTimeInterval: number
}

export interface ContainerState {
    particles: ParticleProps[];
    t: number;
}

export class Container extends React.Component<ContainerProps, ContainerState> {
    private readonly interval: NodeJS.Timer;
    constructor(props: Readonly<ContainerProps>) {
        super(props);
        assert(props.stepsPerTimeInterval > 0, 'stepsPerTimeInterval <= 0');
        const initialParticles = props.particleGenerator.generate();
        const particles = this.props.engine.resolveInitialCollisions(initialParticles);
        this.state = { particles, t: 0 };


        this.interval = setInterval(() => this.doTimestep(), props.updateInterval);
    }
    render() {
        const particles = this.state.particles.map((p, i) => <Particle key={i} {...p}></Particle>);
        const collisions = this.props.engine.collisionDetector.count;
        const bounces = this.props.engine.confiner.bounces;

        return (
            <div>
                <div>t: {this.state.t.toFixed(1)}, collisions: {collisions}, +bounces: {collisions + bounces}</div>
                <svg width={this.props.width} height={this.props.height} >
                    {particles}
                    <rect x="0" y="0" width={this.props.width} height={this.props.height} fill="none" stroke="black"></rect>
                </svg>
            </div>
        );
    }

    doTimestep(): void {
        if (this.props.maxTime <= this.state.t) {
            try { clearInterval(this.interval); } catch { }
            console.log('maxTime reached');
        } else {
            this.setState(state => {
                let particles = state.particles;
                for (let i = 0; i < this.props.stepsPerTimeInterval; i++) {
                    particles = this.props.engine.evolve(particles.map(IParticle.create), this.props.dt).map(Container.toProps);
                }
                return { particles, t: state.t + this.props.dt * this.props.stepsPerTimeInterval };
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