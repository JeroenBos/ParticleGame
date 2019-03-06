import * as React from "react";

export interface ContainerProps {
}

export interface ContainerState {
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Container extends React.Component<ContainerProps, ContainerState> {
    render() {
        return <div></div>;
    }
}