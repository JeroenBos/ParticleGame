import 'mocha';
import { CollisionHandler } from '../physics/collisionHandler';
import { ParticleProps } from "../particle";
import { assert } from "../jbsnorro";
import { Invariants } from "../invariants/.invariants";
import { Confiner } from '../physics/confinement';

describe('Confiner', () => {
    const confiner = new Confiner(10, 10);
    it('Confinement without far x-axis', () => {
        // arrange
        const particle: ParticleProps = {
            x: 9,
            y: 5,
            vx: 1,
            vy: 0,
            m: 1,
            size: 1
        };
        // trivial means 'disregarding collisions and confinement'
        const trivialProjection: ParticleProps = { ...particle, x: particle.x + particle.vx, y: particle.y + particle.vy };

        // act
        debugger;
        const result = confiner.confine(trivialProjection, particle);

        // assert
        if (result == null) throw new Error();
        assert(result.x == 8);
        assert(result.vx == -1);
    });
});

