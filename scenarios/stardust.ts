import { IParticleGenerator } from "../physics/_physics.base";
import { Particle, Q } from "../physics";
import { DefaultConfig } from "./_base";
import { TorusGeometry } from "../physics/torus.geometry";
import { Gravity } from "../physics/forces/gravity";
import { ParticleTypes } from "../app/particle";
import { prng } from "seedrandom";

class ParticleGenerator implements IParticleGenerator<Particle> {
    public constructor(private readonly width: number, private readonly height: number, private readonly rng: prng) {
    }
    public generate(): Particle[] {
        const N = 10;
        const dwidth = this.width / (N + 1);
        const dheight = this.height / (N + 1);
        const coordinates: Q[] = [];
        for (let x = dwidth / 2; x < this.width; x += dwidth) {
            for (let y = dheight / 2; y < this.height; y += dheight) {
                const offset_x = this.rng() * dwidth / 10;
                const offset_y = this.rng() * dheight / 10;
                coordinates.push({ x: x + offset_x, y: y + offset_y });
            }
        }
        const result = coordinates
            .map(q => ({ x: q.x, y: q.y, vx: 0, vy: 0, type: 'black' as ParticleTypes }))
            .map(Particle.createFromType);
        return result;
    }
}
class config extends DefaultConfig {
    createGenerator() {
        return new ParticleGenerator(this.width, this.height, this.rng);
    }
    createGeometry() {
        return new TorusGeometry(this.width, this.height);
    }
    createForceComputer() {
        return new Gravity(this.geometry, 1);
    }
    dτ = 0.1;
}
export default new config();