import { IParticleGenerator } from "../physics/_physics.base";
import { Particle } from "../physics";
import { DefaultConfig } from "./_base";
import { BoxGeometry } from "../physics/geometry";
import { TorusGeometry } from "../physics/torus.geometry";
import { Gravity } from "../physics/forces/gravity";

class ParticleGenerator implements IParticleGenerator<Particle> {
    public generate(): Particle[] {
        return [
            { x: 55, y: 50, vx: 0, vy: 0, radius: 2, m: 1 },
            { x: 45, y: 50, vx: 0, vy: 0, radius: 2, m: 1 }
        ].map(Particle.create);
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
        return new Gravity(this.geometry, 9);
    }
}
export default new config();