import { test, beforeAll, afterAll, expect } from 'vitest';
import { Browser, chromium } from 'playwright';
import { resolve } from 'path';
import po from '../src/PO';
import samplePO from './samplePO';
import { $ } from '../src/register';

let browser: Browser;
beforeAll(async () => {
    browser = await chromium.launch();
    const context = await browser.newContext();
    const driver = await context.newPage();

    po.init(driver, { timeout: 5000 });
    po.register(samplePO);
    const fileName = resolve('./tests/test_page.html');
    await driver.goto('file://' + fileName);
});

test('get single element', async () => {
    const element = await po.getElement('Single Element');
    expect(await element.innerText()).toBe('text of single element');
});

test('get collection', async () => {
    const collection = await po.getElement('List');
    expect(await collection.count()).toBe(6);
});

test('get element from collection by index', async () => {
    const element = await po.getElement('#2 of List');
    expect(await element.innerText()).toBe('Second');
});

test('get element from collection by partial text', async () => {
    const element = await po.getElement('#Thi in List');
    expect(await element.innerText()).toBe('Third');
});

test('get element from collection by exact text', async () => {
    const element = await po.getElement('@Third in List');
    expect(await element.innerText()).toBe('Third');
});

test('get element from collection by regexp text', async () => {
    const element = await po.getElement('/Thi/ in List');
    expect(await element.innerText()).toBe('Third');
});

test('get element from component', async () => {
    const element = await po.getElement('Single Component > Child Item');
    expect(await element.innerText()).toBe('text of first child item');
});

test('get element from multiple component item by index', async () => {
    const element = await po.getElement('#2 of Multiple Components > ChildItem');
    expect(await element.innerText()).toBe('second inner');
});

test('get element from multiple component item by partials text', async () => {
    const element = await po.getElement('#second in Multiple Components > Child Item');
    expect(await element.innerText()).toBe('second inner');
});

test('get element from multiple component item by exact text', async () => {
    const element = await po.getElement('@third inner in Multiple Components > Child Item');
    expect(await element.innerText()).toBe('third inner');
});

test('get child item of each element of collection', async () => {
    const collection = await po.getElement('Multiple Components > Child Item');
    expect(await collection.count()).toBe(3);
    expect(await collection.nth(0).innerText()).toBe('first inner');
});

test('get element from collection by partial text containing in', async () => {
    const element = await po.getElement('#Contain in in List');
    expect(await element.innerText()).toBe('Contain in word');
});

test('get element that not exist in collection by text', async () => {
    const element = await po.getElement('#notexist in List');
    expect(await element.isVisible()).toBe(false);
});

test('get element that not exist in collection by index', async () => {
    const element = await po.getElement('#42 of List');
    expect(await element.isVisible()).toBe(false);
});

test('get element from async collection', async () => {
    const element = await po.getElement('Async Component > #2 of Child Items');
    expect(await element.innerText()).toBe('async 2');
});

test('get collection from collection', async () => {
    const elements = await po.getElement('Level 1 Elements > Level 2 Elements > List Items');
    const text7 = await elements.nth(6).innerText();
    expect(text7).toBe('x31');
    expect(await elements.count()).toBe(9);
});

//TODO not supported currently
test.skip('get collection element from collection', async () => {
    const elements = await po.getElement('Level 1 Elements > Level 2 Elements > #2 of List Items');
    const text12 = await elements.nth(0).innerText();
    const text22 = await elements.nth(0).innerText();
    const text32 = await elements.nth(0).innerText();
    expect(text12).toBe('x12');
    expect(text22).toBe('x22');
    expect(text32).toBe('x32');
    expect(await elements.count()).toBe(3);
});

test('alias is added to returned element', async () => {
    const element = await po.getElement('Single Element');
    expect(element.alias).toBe('Single Element');
});

test('ignore hierarchy flag', async () => {
    const element = await po.getElement('Single Component > Ignore Hierarchy Item');
    expect(await element.innerText()).toBe('first inner');
});

test('get not existing element', async () => {
    const shouldThrow = async () => await po.getElement('Not Existing Element');
    await expect(shouldThrow).rejects.toThrow('Not Existing Element is not found');
});

test('throw error if params are not passed into register function', () => {
    // @ts-ignore
    const shouldThrow = () => $();
    expect(shouldThrow).toThrow('Selector or component should be passed!');
});

test('get element from component without selector', async () => {
    const element = await po.getElement('Component Without Selector > Single Element');
    const text = await element.innerText();
    expect(text).toEqual('text of single element');
});

test('get element from collection from component without selector', async () => {
    const element = await po.getElement('Component Without Selector > #2 of List');
    expect(await element.innerText()).toEqual('Second');
});

test('throw an error if component without selector registered as collection', async () => {
    const shouldThrow = async () => await po.getElement('#1 of Components Without Selector > #2 of List');
    await expect(shouldThrow).rejects.toThrow('Unsupported operation. Components Without Selector selector property is required as it is collection');
});

test('get element by parametrised selector', async () => {
    const element = await po.getElement('Async Component > Child Item By Index (2)');
    expect(await element.innerText()).toEqual('async 2');
});

test('get component by parametrised selector', async () => {
    const element = await po.getElement('Async Component By Selector (#async-list-components) > #2 of Child Items');
    expect(await element.innerText()).toEqual('async 2');
});

test('get collection by parametrised selector', async () => {
    const element = await po.getElement('Parametrized List (odd)');
    expect(await element.count()).toEqual(3);
});

test('get native single element', async () => {
    const element = await po.getElement('Native Selector Single Element');
    expect(await element.innerText()).toBe('text of single element');
});

test('get native collection', async () => {
    const collection = await po.getElement('Native Selector List');
    expect(await collection.count()).toBe(6);
});

test('native element from parent', async () => {
    const element = await po.getElement('Iframe Container > Iframe Element');
    expect(await element.innerText()).toBe('I am in iframe');
});

afterAll(async () => {
    await browser.close();
});
