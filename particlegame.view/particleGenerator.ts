import { ParticleProps } from "./particle";

export default class ParticleGenerator {
    public generate(): ParticleProps{
        return { x: 50, y: 50 };
    }
}