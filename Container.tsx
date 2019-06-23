import * as React from "react";
import ParticleGenerator from './app/particleGenerator';
import { Particle, ParticleProps } from "./particle";
import { IEngine } from "./physics.base";
import { Particle as IParticle } from './physics';
import { F } from "./physics/forceComputer";

export interface ContainerProps {
    particleGenerator: ParticleGenerator;
    width: number;
    height: number;
    engine: IEngine<IParticle, F>,
    updateInterval: number,
    maxTime: number,
    dt: number
}

export interface ContainerState {
    particles: ParticleProps[];
    t: number;
}

export class Container extends React.Component<ContainerProps, ContainerState> {
    private readonly interval: NodeJS.Timer;
    constructor(props: Readonly<ContainerProps>) {
        super(props);
        const initialParticles = props.particleGenerator.generate();
        const particles = this.props.engine.resolveInitialCollisions(initialParticles);
        this.state = { particles, t: 0 };

        this.interval = setInterval(() => this.doTimestep(), props.updateInterval);
    }
    render() {
        const particles = this.state.particles.map((p, i) => <Particle key={i} {...p}></Particle>);
        return (
            <div>
                <div>t: {this.state.t}</div>
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
        } else {
            this.setState(state => {
                const particles = this.props.engine.evolve(state.particles.map(IParticle.create), this.props.dt).map(Container.toProps);
                return { particles, t: state.t + this.props.dt };
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