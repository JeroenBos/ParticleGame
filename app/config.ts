
import Engine from "../physics/engine";
import { CollisionDetector } from "../physics/collisionDetector";
import { GlueCollisionHandler, ElasticCollisionHandler } from "../physics/collisionHandler";
import { ForceComputer } from "../physics/forceComputer";
import { Confiner } from "../physics/confinement";
import ParticleGenerator from "./particleGenerator";

export const width = 500;
export const height = 500;
export const collisionDetector = new CollisionDetector();
export const collisionHandler = new ElasticCollisionHandler();
export const forceComputer = new ForceComputer();
export const confiner = new Confiner(width, height);
export const engine = new Engine(collisionDetector, collisionHandler, forceComputer, confiner);
export const updateInterval = 10;
export const particleGenerator = new ParticleGenerator();
export const maxTime = 100;
export const dt = 0.1;

