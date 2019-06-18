import { ICollectionDetector, Collision } from "../physics.base";
import { ParticleProps } from "../particle";

export class CollisionDetector implements ICollectionDetector<ParticleProps> {
    detect(particles: ParticleProps[]): { collisions: Collision[], freeParticles: ParticleProps[] } {
        const collisions: Collision[] = [];
        const freeParticles: ParticleProps[] = [];
        particles.forEach((p, pi) => {
            for (let qi = pi; qi < particles.length; qi++) {
                const q = particles[qi];
                if (pi != qi && this.collideQ(p, q)) {
                    collisions.push({ i: pi, j: qi });
                    return;
                }
            }
            freeParticles.push(p);
        });

        return { collisions, freeParticles };
    }

    private collideQ(p: ParticleProps, q: ParticleProps): boolean {
        if (q === undefined) {
            if (q === undefined) {
            }
        }
        //2 means squared
        const distance2 = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y);
        const minDistance2 = (p.size + q.size) * (p.size + q.size);

        return minDistance2 > distance2;
    }
}