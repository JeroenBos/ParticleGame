import { IParticleGenerator } from "../physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { Confiner } from "../physics/confinement";

const precision: number = 6;
class ParticleGenerator implements IParticleGenerator<Particle> {
    public generate(): Particle[] {
        return [
            { x: 100, y: 50, vx: 0, vy: 0, radius: 10, m: 1 },
            { x: 200, y: 50, vx: -100, vy: 0, radius: 10, m: 10 ** precision }
        ].map(Particle.create);
    }
}

const tradeoff = 0; // the higher the more precise, but takes more computation power
class Config extends DefaultConfig {
    createGenerator() {
        return new ParticleGenerator();
    }
    createConfinement() {
        return new Confiner(Infinity, this.height);
    }

    get dt() {
        return 10 ** (-tradeoff - precision);
    }

    get updateInterval() {
        return 10;
    }
    get stepsPerTimeInterval() {
        return Math.max(1, 10 ** (precision - 2 + tradeoff));
    }
}

export default new Config();