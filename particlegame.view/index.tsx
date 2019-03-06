import * as React from "react";
import * as ReactDOM from "react-dom";

import { Container } from "./Container";
import ParticleGenerator from "./particleGenerator";

ReactDOM.render(
    <Container particleCount={1} particleGenerator={new ParticleGenerator()} />,
    document.getElementById("example")
);