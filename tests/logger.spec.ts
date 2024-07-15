import {test, beforeAll, afterAll, describe, expect, beforeEach} from 'vitest';
import {Browser, chromium} from 'playwright';
import {resolve} from 'path';
import poLogger from '../src/PO';
import samplePO from './samplePO';

let browser: Browser;

describe('logger', () => {
    const logger: { logs: string[], log: (value: string) => void, clean: () => void } = {
        logs: [],
        log(value: string) {
            this.logs.push(value);
        },
        clean() {
            this.logs = [];
        }
    };

    beforeAll(async () => {
        browser = await chromium.launch();
        const context = await browser.newContext();
        const driver = await context.newPage();

        logger.clean();
        poLogger.init(driver, {timeout: 5000, logger});
        poLogger.register(samplePO);
        const fileName = resolve('./tests/test_page.html');
        await driver.goto('file://' + fileName);
    });

    beforeEach(() => {
        logger.clean();
    });

    test('get single element', async () => {
        const element = await poLogger.getElement('Single Element');
        expect(logger.logs).toEqual(['SingleElement -> .single-element']);
    });

    test('get child element', async () => {
        const element = await poLogger.getElement('Single Component > Child Item');
        expect(logger.logs).toEqual(['SingleComponent -> .container', 'ChildItem -> .child-item']);
    });

    test('get Selector element', async () => {
        const element = await poLogger.getElement('Async Component By Selector (#async-list-components)');
        expect(logger.logs).toEqual(['AsyncComponentBySelector -> #async-list-components']);
    });

    afterAll(async () => {
        await browser.close();
    });

});

