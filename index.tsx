import * as React from "react";
import * as ReactDOM from "react-dom";

import { Container } from "./Container";
import ParticleGenerator from "./particleGenerator";
import Engine from "./physics/engine";
import { CollisionDetector } from "./physics/collisionDetector";
import { CollisionHandler } from "./physics/collisionHandler";
import { ForceComputer } from "./physics/forceComputer";
import { Confiner } from "./physics/confinement";

debugger;
const width = 500;
const height = 500;
const collisionDetector = new CollisionDetector();
const collisionHandler = new CollisionHandler();
const forceComputer = new ForceComputer();
const confiner = new Confiner(width, height);
const engine = new Engine(collisionDetector, collisionHandler, forceComputer, confiner);
ReactDOM.render(
    <Container particleGenerator={new ParticleGenerator()} width={width} height={height} engine={engine} />,
    document.getElementById("example")
);