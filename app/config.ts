
import Engine from "../physics/engine";
import { CollisionDetector } from "../physics/collisionDetector";
import { CollisionHandler } from "../physics/collisionHandler";
import { ForceComputer } from "../physics/forceComputer";
import { Confiner } from "../physics/confinement";
import ParticleGenerator from "./particleGenerator";

export const width = 500;
export const height = 500;
export const collisionDetector = new CollisionDetector();
export const collisionHandler = new CollisionHandler();
export const forceComputer = new ForceComputer();
export const confiner = new Confiner(width, height);
export const engine = new Engine(collisionDetector, collisionHandler, forceComputer, confiner);
export const updateInterval = 100;
export const particleGenerator = new ParticleGenerator();

