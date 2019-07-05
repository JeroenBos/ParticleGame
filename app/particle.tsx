import * as React from "react";

export type ParticleTypes = 'black';
type properties = { color: string, m: number, radius: number };
type explicitlyUsedProperties = Pick<properties, 'color'>;

export interface ParticleProps {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    m: number;
    type?: ParticleTypes;
}
export interface ParticleState {
}

function _getParticleProperties(type: ParticleTypes): properties | undefined {
    switch (type) {
        case 'black':
            return { color: 'black', m: 1, radius: 3 };
        default:
            return undefined;
    }
}

export function getParticleProperties(type: ParticleTypes): { color: string, m: number, radius: number } {
    const result = _getParticleProperties(type);
    if (result === undefined) throw new Error('The specified type does not exist');
    return result;
}

const defaultProperties: explicitlyUsedProperties = {
    color: 'red'
};

export class Particle extends React.Component<ParticleProps, ParticleState> {

    constructor(props: Readonly<ParticleProps>) {
        super(props);
        if (props.x === undefined || isNaN(props.x)) {
            debugger;
        }
        this.state = {};
    }
    render() {
        const properties: explicitlyUsedProperties = (this.props.type === undefined ? undefined : _getParticleProperties(this.props.type)) || defaultProperties;
        return (
            <circle cx={this.props.x} cy={this.props.y} r={this.props.radius} stroke="black" strokeWidth="1" fill={properties.color} />
        );
    }
}