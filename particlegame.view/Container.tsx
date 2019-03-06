import * as React from "react";
import ParticleGenerator from './particleGenerator';
import { Particle, ParticleProps } from "./particle";

export interface ContainerProps {
    particleCount: number;
    particleGenerator: ParticleGenerator;
}

export interface ContainerState {
    particles: ParticleProps[];
}

export class Container extends React.Component<ContainerProps, ContainerState> {

    constructor(props: Readonly<ContainerProps>) {
        super(props);
        const particles: ParticleProps[] = [];
        for (let i = 0; i < props.particleCount; i++) {
            particles.push(props.particleGenerator.generate());
        }
        this.state = { particles };
    }
    render() {
        const particles = this.state.particles.map((p, i) => <Particle key={i} {...p}></Particle>);
        return (
            <div>{particles}</div>
        );
    }
}