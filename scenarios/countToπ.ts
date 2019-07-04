import { IParticleGenerator } from "../physics/_physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { Confiner } from "../physics/confinement";

class ParticleGenerator implements IParticleGenerator<Particle> {
    constructor(private readonly precision: number) { }
    public generate(): Particle[] {
        return [
            { x: 100, y: 50, vx: 0, vy: 0, radius: 10, m: 1 },
            { x: 200, y: 50, vx: -100, vy: 0, radius: 10, m: 10 ** this.precision }
        ].map(Particle.create);
    }
}

const tradeoff = 0; // the higher the more precise, but takes more computation power
class Config extends DefaultConfig {
    constructor(private readonly precision: number) {
        super()
    }
    createGenerator() {
        return new ParticleGenerator(this.precision);
    }
    createConfinement() {
        return new Confiner(Infinity, this.height);
    }

    get dt() {
        return 10 ** (-tradeoff - this.precision);
    }

    get updateInterval() {
        return 10;
    }
    get stepsPerTimeInterval() {
        return Math.max(1, 10 ** (this.precision - 2 + tradeoff));
    }
}

export default {
    precision1: new Config(1),
    precision2: new Config(2),
    precision3: new Config(3),
    precision4: new Config(4),
    precision5: new Config(5),
    precision6: new Config(6),
    precision7: new Config(7),
};