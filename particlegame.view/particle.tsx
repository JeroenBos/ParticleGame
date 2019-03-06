import * as React from "react";

export interface ParticleProps {
    x: number;
    y: number;
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
            <svg height="100" width="100">
                <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
            </svg>
        );
    }
}