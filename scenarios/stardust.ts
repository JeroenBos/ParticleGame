import { IParticleGenerator } from "../physics/_physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { BoxGeometry } from "../physics/geometry";
import { TorusGeometry } from "../physics/torus.geometry";
import { Gravity } from "../physics/forces/gravity";
import { ParticleTypes } from "../app/particle";

class ParticleGenerator implements IParticleGenerator<Particle> {
    public generate(): Particle[] {
        const result = [
            { x: 55, y: 50, vx: 0, vy: 0, type: 'black' as ParticleTypes },
            { x: 45, y: 50, vx: 0, vy: 0, type: 'black' as ParticleTypes }
        ].map(Particle.createFromType);
        return result;
    }
}
class config extends DefaultConfig {
    createGenerator() {
        return new ParticleGenerator();
    }
    createGeometry() {
        return new TorusGeometry(this.width, this.height);
    }
    createForceComputer() {
        return new Gravity(this.geometry, 1);
    }
}
export default new config();