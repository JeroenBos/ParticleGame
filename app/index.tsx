import * as React from "react";
import * as ReactDOM from "react-dom";

import { Container } from "./Container";
import config from './config';

ReactDOM.render(
    <Container
        particleGenerator={config.particleGenerator}
        width={config.width}
        height={config.height}
        engine={config.engine}
        updateInterval_ms={config.updateInterval_ms}
        maxTime_ms={config.maxTime_ms}
        stepsPerInterval={config.stepsPerTimeInterval}
        precision={config.precision}
        initialTimeFactor={1} />,
    document.getElementById("root")
);
