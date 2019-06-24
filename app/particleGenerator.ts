import { ParticleProps } from "../particle";
import { Particle } from "../physics";

export default class ParticleGenerator {
    public generate(): Particle[] {
        return [
            { x: 150, y: 50, vx: -10, vy: 0, radius: 9, m: 1 },
            { x: 50, y: 58, vx: 10, vy: 0, radius: 9, m: 1 }
        ].map(Particle.create);
    }
}