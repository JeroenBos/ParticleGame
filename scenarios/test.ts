import { IParticleGenerator } from "../physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { Confiner } from "../physics/confinement";

class ParticleGenerator implements IParticleGenerator<Particle> {
    public generate(): Particle[] {
        return [
            { x: 55, y: 50, vx: -1, vy: 0, radius: 2, m: 1 },
            { x: 45, y: 52, vx: 1, vy: 0, radius: 2, m: 1 }
        ].map(Particle.create);
    }
}
class config extends DefaultConfig {
    createGenerator() {
        return new ParticleGenerator();
    }
}
const result = new config() as config & {
    readonly confiner: Confiner;
};
export default result;