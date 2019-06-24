import { IParticleGenerator } from "../physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";

const precision: number = 2;
class ParticleGenerator implements IParticleGenerator<Particle> {
    public generate(): Particle[] {
        return [
            { x: 100, y: 50, vx: 0, vy: 0, radius: 10, m: 1 },
            { x: 400, y: 50, vx: -10, vy: 0, radius: 10, m: 10 ** precision }
        ].map(Particle.create);
    }
}

class Config extends DefaultConfig {
    createGenerator() {
        return new ParticleGenerator();
    }

    get dt() {
        return 1 / (10 ** precision);
    }

    get updateInterval() {
        if (precision == 1) {
            return 100;
        }
        return 10;
    }
    get stepsPerTimeInterval() {
        if (precision == 1) {
            return 1;
        }
        return 10 ** (precision - 1);
    }
}

export default new Config();