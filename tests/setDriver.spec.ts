import {test, describe, expect} from 'vitest';
import po from '../src/PO';
import {Page} from 'playwright';

describe('setDriver', () => {

    test('set driver', async () => {
        const driver = {} as Page;
        po.setDriver(driver);
        expect(po.driver).toEqual(driver);
    });

});

