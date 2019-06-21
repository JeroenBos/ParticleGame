import { ICollectionDetector, Collision } from "../physics.base";
import { ParticleProps } from "../particle";

export class CollisionDetector implements ICollectionDetector<ParticleProps> {
    detect(particles: ParticleProps[]): { collisions: Collision[], freeParticles: ParticleProps[] } {
        const collisions: Collision[] = [];

        const collided = new Array<boolean>(particles.length);
        for (let i = 0; i < particles.length; i++) {
            collided[i] = false;
        }
        for (let pi = 0; pi < particles.length; pi++) {
            const p = particles[pi];
            for (let qi = 0; qi < pi; qi++) {
                const q = particles[qi];
                if (this.collideQ(p, q)) {
                    collisions.push({ i: qi, j: pi });
                    collided[pi] = true;
                    collided[qi] = true;
                }
            }
        };

        const freeParticles: ParticleProps[] = [];
        for (let i = 0; i < particles.length; i++) {
            if (!collided[i])
                freeParticles.push(particles[i]);
        }
        return { collisions, freeParticles };
    }

    private collideQ(p: ParticleProps, q: ParticleProps): boolean {
        if (q === undefined) {
            if (q === undefined) {
            }
        }
        //2 means squared
        const distance2 = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y);
        const minDistance2 = (p.radius + q.radius) * (p.radius + q.radius);

        return minDistance2 > distance2;
    }
}