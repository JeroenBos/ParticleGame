import { IParticleGenerator } from "../physics.base";
import { Particle } from "../physics";

class ParticleGenerator implements IParticleGenerator<Particle> {
    public generate(): Particle[] {
        return [
            { x: 150, y: 50, vx: -10, vy: 0, radius: 9, m: 1 },
            { x: 50, y: 58, vx: 10, vy: 0, radius: 9, m: 1 }
        ].map(Particle.create);
    }
}