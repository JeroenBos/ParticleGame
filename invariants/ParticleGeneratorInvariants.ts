import { IParticleGenerator } from "../physics/_physics.base";
import { isNumber } from "util";

type TParticle = any;

export class ParticleGeneratorInvariantsFactory {
    isForTypeOf(obj: IParticleGenerator<TParticle>): boolean {
        return 'generate' in obj;
    }
    create(obj: IParticleGenerator<TParticle>): IParticleGenerator<TParticle> {
        return new ParticleGeneratorInvariants(obj);
    }
}
class ParticleGeneratorInvariants implements IParticleGenerator<TParticle> {
    generate(): TParticle[] {
        const result = this.obj.generate();
        for (const particle of result) {
            const properties = ['m', 'vx', 'vy', 'x', 'y', 'radius'];
            for (const prop of properties) {
                if (!(prop in particle)) {
                    throw new Error(`Invalid particle create: property '${prop}' missing`);
                }
                if (!isNumber(particle[prop]) || isNaN(particle[prop])) {
                    throw new Error(`Invalid particle create: property '${prop}' is not a number`);
                }
            }
        }
        return result;
    }
    constructor(private readonly obj: IParticleGenerator<TParticle>) { }


}

