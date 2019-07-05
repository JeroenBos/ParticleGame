import * as React from "react";

export interface ParticleProps {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    m: number;
}
export interface ParticleState {
}

export class Particle extends React.Component<ParticleProps, ParticleState> {

    constructor(props: Readonly<ParticleProps>) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <circle cx={this.props.x} cy={this.props.y} r={this.props.radius} stroke="black" strokeWidth="1" fill="red" />
        );
    }
}