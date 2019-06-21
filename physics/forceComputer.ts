import { IComputeForce } from "../physics.base";
import { ParticleProps } from "../particle";
import { Dv } from "./engine";

export class ForceComputer implements IComputeForce<ParticleProps, Dv>{
    computeForceOn(receiver: ParticleProps, actor: ParticleProps): Dv {
        return { dvx: 0, dvy: 0 };
    }

    project(particle: Readonly<ParticleProps>, otherParticles: Iterable<Readonly<ParticleProps>>): ParticleProps | undefined {
        const dv: Dv = { dvx: 0, dvy: 0 };
        for (const p of otherParticles) {
            const dv_p = this.computeForceOn(particle, p);
            dv.dvx += dv_p.dvx;
            dv.dvy += dv_p.dvy;
        }

        const projection = {
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx + dv.dvx,
            vy: particle.vy + dv.dvy,
            size: particle.size,
            m: particle.m
        };

        return projection;
    }
}