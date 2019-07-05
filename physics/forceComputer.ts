import { IComputeForce } from "./_physics.base";
import { ParticleProps } from "../app/particle";
import { Dv } from "./engine";
import { Particle } from ".";

export interface F {
    fx: number,
    fy: number
}
export abstract class ForceComputer implements IComputeForce<Particle, F>{
    abstract computeForceOn(receiver: Particle, actor: Particle): F;

    project(particle: Particle, otherParticles: Iterable<Particle>, dt: number): Particle | undefined {
        const dv: Dv = { dvx: 0, dvy: 0 };
        for (const p of otherParticles) {
            const f = this.computeForceOn(particle, p);
            dv.dvx += f.fx * dt / particle.m;
            dv.dvy += f.fy * dt / particle.m;
        }

        const projection = Particle.create({
            x: particle.q.x + particle.p.vx * dt,
            y: particle.q.y + particle.p.vy * dt,
            vx: particle.p.vx + dv.dvx,
            vy: particle.p.vy + dv.dvy,
            radius: particle.radius,
            m: particle.m
        });

        return projection;
    }
    projectAll(particles: Particle[], dt: number): (Particle | undefined)[] {
        return particles.map((_, i) => {
            const particle = particles[i];
            const otherParticles = particles.slice(0); otherParticles.splice(i, 1);
            const freeProjection = this.project(particle, otherParticles, dt);
            return freeProjection;
        });
    }
}

export class ZeroForce extends ForceComputer {
    computeForceOn(receiver: Particle, actor: Particle): F {
        return { fx: 0, fy: 0 };
    }
}