import { test, beforeAll, afterAll, describe, expect } from 'vitest';
import { Browser, chromium } from 'playwright';
import { resolve } from 'path';
import poLogger from '../src/PO';
import samplePO from './samplePO';

let browser: Browser;

describe('logger', () => {
	const logger = {
		logs: [],
		log(value) {
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
		poLogger.init(driver, { timeout: 5000, logger });
		poLogger.register(samplePO);
		const fileName = resolve('./tests/test_page.html');
		await driver.goto('file://' + fileName);
	});


	test('get single element', async () => {
		const element = await poLogger.getElement('Single Element');
		expect(logger.logs.pop()).toEqual('SingleElement -> .single-element');
	});

	test('get child element', async () => {
		const element = await poLogger.getElement('Single Component > Child Item');
		expect(logger.logs).toEqual(['SingleComponent -> .container', 'ChildItem -> .child-item']);
	});

	afterAll(async () => {
		await browser.close();
	})

});

