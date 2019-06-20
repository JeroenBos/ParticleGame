import { ParticleProps } from "./particle";

export default class ParticleGenerator {
    public generate(): ParticleProps[] {
        return [
            { x: 50, y: 50, vx: 0, vy: 0, size: 30, m: 1 },
            { x: 60, y: 50, vx: 10, vy: 0, size: 20, m: 1 }
        ];
    }
}