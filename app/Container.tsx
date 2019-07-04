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
    updateInterval_ms: number,
    stepsPerInterval: number,
    maxTime_ms: number,
    initialTimeFactor: number,
    precision: number
}

export interface ContainerState {
    particles: ParticleProps[];
    t_ms: number;
    timeFactor: number;
}

export class Container extends React.Component<ContainerProps, ContainerState> {
    private readonly interval: NodeJS.Timer;
    constructor(props: Readonly<ContainerProps>) {
        super(props);
        assert(props.stepsPerInterval > 0, 'stepsPerTimeInterval <= 0');
        const initialParticles = props.particleGenerator.generate();
        const particles = this.props.engine.resolveInitialCollisions(initialParticles);
        this.state = { particles, t_ms: 0, timeFactor: 1 };


        console.log(`updateInterval: ${props.updateInterval_ms}`);
        console.log(`stepsPerTimeInterval: ${props.stepsPerInterval}`);

        this.interval = setInterval(() => this.doTimestep(), props.updateInterval_ms);
    }
    render() {
        const particles = this.state.particles.map((p, i) => <Particle key={i} {...p}></Particle>);
        const collisionCount = this.props.engine.collisionDetector.count;
        const bounceCount = this.props.engine.confiner.bounces;

        return (
            <div>
                <div>t: {(this.state.t_ms / 1000).toFixed(1)}, collisions: {collisionCount}, +bounces: {collisionCount + bounceCount}</div>
                <svg width={this.props.width} height={this.props.height} >
                    {particles}
                    <rect x="0" y="0" width={this.props.width} height={this.props.height} fill="none" stroke="black"></rect>
                </svg>
            </div>
        );
    }

    doTimestep(): void {
        const dt_ms = this.props.updateInterval_ms / this.props.stepsPerInterval;
        const dt_s = dt_ms / this.props.precision;
        // console.log('dt_gt: ' + dt_gt);
        // dt is in game time (gt) units
        if (this.props.maxTime_ms  <= this.state.t_ms) {
            try { clearInterval(this.interval); } catch { }
            console.log('maxTime reached');
        } else {
            this.setState(state => {
                console.log(state.t_ms);
                let particles = state.particles;
                for (let i = 0; i < this.props.stepsPerInterval; i++) {
                    particles = this.props.engine.evolve(particles.map(IParticle.create), dt_s).map(Container.toProps);
                }
                return { particles, t_ms: state.t_ms + this.props.updateInterval_ms };
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