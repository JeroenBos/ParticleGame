import { IParticleGenerator } from "../physics/_physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { BoxGeometry } from "../physics/geometry";

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
    dτ = 0.1;
}
const result = new config() as config & {
    readonly geometry: BoxGeometry;
};
export default result;