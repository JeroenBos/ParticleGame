import { ParticleProps } from "../particle";
import { Particle } from "../physics";

export default class ParticleGenerator {
    public generate(): Particle[] {
        return [
            { x: 50, y: 50, vx: 10, vy: 0, radius: 30, m: 2 },
            { x: 60, y: 50, vx: 10, vy: 0, radius: 20, m: 1 }
        ].map(Particle.create);
    }
}