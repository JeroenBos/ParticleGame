import * as React from "react";
import * as ReactDOM from "react-dom";

import { Container } from "../Container";
import { width, height, engine, updateInterval, particleGenerator } from './config';

ReactDOM.render(
    <Container
        particleGenerator={particleGenerator}
        width={width}
        height={height}
        engine={engine}
        updateInterval={updateInterval} />,
    document.getElementById("root")
);
