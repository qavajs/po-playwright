const path = require('path');
const { remote } = require('webdriverio');
const po = require('../src/PO');
const samplePO = require('./samplePO');

beforeAll(async () => {
    const driver = await remote({
        logLevel: 'warn',
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless']
            }
        }
    });

    po.init(driver, { timeout: 5000 });
    po.register(samplePO);
    const fileName = path.resolve('./tests/test_page.html');
    await driver.url('file://' + fileName);
});

test('get single element', async () => {
    const element = await po.getElement('Single Element');
    expect(await element.getText()).toBe('text of single element');
});

test('get collection', async () => {
    const collection = await po.getElement('List');
    expect(collection.length).toBe(6);
});

test('get element from collection by index', async () => {
    const element = await po.getElement('#2 of List');
    expect(await element.getText()).toBe('Second');
});

test('get element from collection by parial text', async () => {
    const element = await po.getElement('#Thi in List');
    expect(await element.getText()).toBe('Third');
});

test('get element from collection by exact text', async () => {
    const element = await po.getElement('@Third in List');
    expect(await element.getText()).toBe('Third');
});

test('get element from component', async () => {
    const element = await po.getElement('Single Component > Child Item');
    expect(await element.getText()).toBe('text of first child item');
});

test('get element from multiple component item by index', async () => {
    const element = await po.getElement('#2 of Multiple Components > ChildItem');
    expect(await element.getText()).toBe('second inner');
});

test('get element from multiple component item by partials text', async () => {
    const element = await po.getElement('#second in Multiple Components > Child Item');
    expect(await element.getText()).toBe('second inner');
});

test('get element from multiple component item by exact text', async () => {
    const element = await po.getElement('@third inner in Multiple Components > Child Item');
    expect(await element.getText()).toBe('third inner');
});

test('get child item of each element of collection', async () => {
    const collection = await po.getElement('Multiple Components > Child Item');
    expect(collection.length).toBe(3);
    expect(await collection[0].getText()).toBe('first inner');
});

test('get element from collection by parial text containing in', async () => {
    const element = await po.getElement('#Contain in in List');
    expect(await element.getText()).toBe('Contain in word');
});

test('get element that not exist in collection by text', async () => {
    const element = await po.getElement('#notexist in List');
    expect(await element.isExisting()).toBe(false);
    expect(await element.isDisplayed()).toBe(false);
});

test('get element that not exist in collection by index', async () => {
    const element = await po.getElement('#42 of List');
    expect(await element.isExisting()).toBe(false);
    expect(await element.isDisplayed()).toBe(false);
});

test('get element from async collection', async () => {
    const element = await po.getElement('Async Component > #2 of Child Items');
    expect(await element.getText()).toBe('async 2');
});

test('get collection from collection', async () => {
    const elements = await po.getElement('Level 1 Elements > Level 2 Elements > List Items');
    const text7 = await elements[6].getText();
    expect(text7).toBe('x31');
    expect(elements.length).toBe(9);
});

test('get collection element from collection', async () => {
    const elements = await po.getElement('Level 1 Elements > Level 2 Elements > #2 of List Items');
    const text12 = await elements[0].getText();
    const text22 = await elements[1].getText();
    const text32 = await elements[2].getText();
    expect(text12).toBe('x12');
    expect(text22).toBe('x22');
    expect(text32).toBe('x32');
    expect(elements.length).toBe(3);
});

test('get child from not existing element', async () => {
    const shouldThrow = async () => await po.getElement('Not Existing Component > Item');
    await expect(shouldThrow).rejects.toThrow();
});

test('get collection from not existing element', async () => {
    const shouldThrow = async () => await po.getElement('Not Existing Component > Items');
    await expect(shouldThrow).rejects.toThrow();
});

test('get collection from not existing element by index', async () => {
    const shouldThrow = async () => await po.getElement('Not Existing Component > #1 of Items');
    await expect(shouldThrow).rejects.toThrow();
});

test('get collection from not existing element by text', async () => {
    const shouldThrow = async () => await po.getElement('Not Existing Component > #text in Items');
    await expect(shouldThrow).rejects.toThrow();
});

test('alias is added to returned element', async () => {
    const element = await po.getElement('Single Element');
    expect(element.alias).toBe('Single Element');
});

afterAll(async () => {
    await po.driver.deleteSession();
})
