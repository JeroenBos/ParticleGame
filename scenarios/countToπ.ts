import { IParticleGenerator } from "../physics/_physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { BoxGeometry } from "../physics/geometry";

class ParticleGenerator implements IParticleGenerator<Particle> {
    constructor(private readonly mass: number) { }
    public generate(): Particle[] {
        return [
            { x: 100, y: 50, vx: 0, vy: 0, radius: 10, m: 1 },
            { x: 200, y: 50, vx: -100, vy: 0, radius: 10, m: this.mass }
        ].map(Particle.create);
    }
}

class Config extends DefaultConfig {
    constructor(private readonly mass: number) {
        super()
    }
    createGenerator() {
        const m = this.mass;
        return new ParticleGenerator(m);
    }
    createGeometry() {
        return new BoxGeometry(Infinity, this.height);
    }

    // get dt_ms() {
    //     return this.updateInterval_ms / this.stepsPerTimeInterval;
    // }

    // get updateInterval_ms() {
    //     return 10;
    // }
    // get stepsPerTimeInterval() {
    //     return Math.max(1, this.mass * 10 ** tradeoff);
    // }
}

export default {
    precision0: () => new Config(10 ** 0),
    precision1: () => new Config(10 ** 1),
    precision2: () => new Config(10 ** 2),
    precision3: () => new Config(10 ** 3),
    precision4: () => new Config(10 ** 4),
    precision5: () => new Config(10 ** 5),
    precision6: () => new Config(10 ** 6),
    precision7: () => new Config(10 ** 7),
    precision_m16: () => new Config(16),
    precision_m64: () => new Config(64)
};