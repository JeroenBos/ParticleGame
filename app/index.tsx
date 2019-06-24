import * as React from "react";
import * as ReactDOM from "react-dom";

import { Container } from "../Container";
import config from './config';

ReactDOM.render(
    <Container
        particleGenerator={config.particleGenerator}
        width={config.width}
        height={config.height}
        engine={config.engine}
        updateInterval={config.updateInterval}
        maxTime={config.maxTime}
        dt={config.dt}
        stepsPerTimeInterval={config.stepsPerTimeInterval} />,
    document.getElementById("root")
);
