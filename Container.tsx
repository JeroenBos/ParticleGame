import * as React from "react";
import ParticleGenerator from './particleGenerator';
import { Particle, ParticleProps } from "./particle";
import { IEngine } from "./physics.base";
import { Dv } from "./physics/engine";
import Extensions from "./extensions";

export interface ContainerProps {
    particleGenerator: ParticleGenerator;
    width: number;
    height: number;
    engine: IEngine<ParticleProps, Dv>
}

export interface ContainerState {
    particles: ParticleProps[];
}

export class Container extends React.Component<ContainerProps, ContainerState> {

    constructor(props: Readonly<ContainerProps>) {
        super(props);
        const initialParticles = props.particleGenerator.generate();
        const particles = this.props.engine.resolveInitialCollisions(initialParticles);
        this.state = { particles };
    }
    render() {
        const particles = this.state.particles.map((p, i) => <Particle key={i} {...p}></Particle>);
        return (
            <div>
                <svg width={this.props.width} height={this.props.height} >
                    {particles}
                    <rect x="0" y="0" width={this.props.width} height={this.props.height} fill="none" stroke="black"></rect>
                </svg>
            </div>
        );
    }
}