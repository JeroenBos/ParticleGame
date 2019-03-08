import { IComputeForce } from "../physics.base";
import { ParticleProps } from "../particle";
import { Dv } from "./engine";

export class ForceComputer implements IComputeForce<ParticleProps, Dv>{
    computeForceOn(receiver: ParticleProps, actor: ParticleProps): Dv {
        return { dvx: 0, dvy: 0 };
    }
}