import 'mocha';
import { assert } from "../jbsnorro";
import config from '../scenarios/test';
import Extensions from '../extensions';
import { Particle } from '../physics';

const { forceComputer } = config;
describe('Force', () => {
    it('No force', () => {
        // arrange
        const particles = [{ x: 50, y: 50, vx: 10, vy: 0, radius: 30, m: 2 }, { x: 60, y: 50, vx: 10, vy: 0, radius: 20, m: 1 }].map(Particle.create);

        // act
        // debugger;
        const projections = Extensions.notUndefined(forceComputer.projectAll(particles, 1));

        // assert
        assert(projections[0].vx == 10);
        assert(projections[1].vx == 10);
        assert(projections[0].vy == 0);
        assert(projections[1].vy == 0);

    });
});

