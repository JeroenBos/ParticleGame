import 'mocha';
import { assert } from "../jbsnorro";
import config from '../scenarios/test';
import Extensions from '../extensions';
import { Particle } from '../physics';
import configOverBottomImport from '../scenarios/attraction';

const { configOverBottom } = configOverBottomImport;
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

    it('Force extends over bottom boundary', () => {
        // arrange
        const particles = configOverBottom.particleGenerator.generate();

        // act
        debugger;
        const f10 = configOverBottom.forceComputer.computeForceOn(particles[0], particles[1]);
        const f01 = configOverBottom.forceComputer.computeForceOn(particles[1], particles[0]);

        // assert
        assert(-0.03 < f10.fy && f10.fy < -0.02);
        assert(0.02 < f01.fy && f01.fy < 0.03);
    });
});

