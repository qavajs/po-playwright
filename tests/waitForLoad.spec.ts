import {test, describe, expect, vi} from 'vitest';
import po from '../src/PO';
import {Page} from 'playwright';

describe('wait for load state', () => {

    test('wait for load state', async () => {
        const driver = {
            waitForLoadState: vi.fn()
        } as unknown as Page;
        //@ts-ignore
        po.getEl = vi.fn(() => [{}, {}]);
        po.init(driver, { waitForLoadState: true });
        po.register({});
        await po.getElement('X');
        expect(driver.waitForLoadState).toBeCalled();
    });

});

