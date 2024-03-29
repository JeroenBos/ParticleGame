import * as React from "react";
import * as ReactDOM from "react-dom";
import { Invariants } from "../invariants/.invariants";

Invariants.isDevelopment = false;

import { Container } from "./Container";
import config, { initial_τ_per_s } from './config';

ReactDOM.render(
    <Container
        particleGenerator={config.particleGenerator}
        width={config.width}
        height={config.height}
        engine={config.engine}
        renderInterval_ms={config.updateInterval_ms}
        τ_max={config.τ_max}
        initial_τ_per_s={initial_τ_per_s} />,
    document.getElementById("root")
);
