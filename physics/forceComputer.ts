import { IComputeForce } from "../physics.base";
import { ParticleProps } from "../particle";
import { Dv } from "./engine";
import { Particle } from ".";

export class ForceComputer implements IComputeForce<Particle, Dv>{
    computeForceOn(receiver: Particle, actor: Particle): Dv {
        return { dvx: 0, dvy: 0 };
    }

    project(particle: Particle, otherParticles: Iterable<Particle>): Particle | undefined {
        const dv: Dv = { dvx: 0, dvy: 0 };
        for (const p of otherParticles) {
            const dv_p = this.computeForceOn(particle, p);
            dv.dvx += dv_p.dvx;
            dv.dvy += dv_p.dvy;
        }

        const projection = Particle.create({
            x: particle.q.x + particle.p.vx,
            y: particle.q.y + particle.p.vy,
            vx: particle.p.vx + dv.dvx,
            vy: particle.p.vy + dv.dvy,
            radius: particle.radius,
            m: particle.m
        });

        return projection;
    }
    projectAll(particles: Particle[]): (Particle | undefined)[] {
        return particles.map((_, i) => {
            const particle = particles[i];
            const otherParticles = particles.slice(0); otherParticles.splice(i);
            const freeProjection = this.project(particle, otherParticles);
            return freeProjection;
        });
    }

}