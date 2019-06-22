import { ICollectionDetector, Collision } from "../physics.base";
import { ParticleProps } from "../particle";
import { Particle } from ".";

export class CollisionDetector implements ICollectionDetector<Particle> {
    private _count = 0;
    get count() {
        return this._count;
    }
    detect(particles: Particle[]): { collisions: Collision[], freeParticles: Particle[] } {
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
                    this._count++;
                    collided[pi] = true;
                    collided[qi] = true;
                }
            }
        };

        const freeParticles: Particle[] = [];
        for (let i = 0; i < particles.length; i++) {
            if (!collided[i])
                freeParticles.push(particles[i]);
        }
        return { collisions, freeParticles };
    }

    private collideQ(p: Particle, q: Particle): boolean {
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