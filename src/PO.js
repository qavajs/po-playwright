const parseTokens = require('./parseTokens');
const TICK_INTERVAL = 500;

class PO {

    init(driver, options = { timeout: 2000 }) {
        /**
         * @type { import('webdriverio').BrowserBase }
         */
        this.driver = driver;
        this.config = {};
        this.config.timeout = options.timeout;
    }

    /**
     * Get element from page object
     * @public
     * @param {string} path
     * @returns { import('webdriverio').ElementCommandsType|import('webdriverio').ElementArray }
     */
    async getElement(path) {
        if (!this.driver) throw new Error('Driver is not attached. Call po.init(driver)')
        const tokens = parseTokens(path);
        let element = this.driver;
        let po = this;
        while (tokens.length > 0) {
            const token = tokens.shift();
            [element, po] = await this.getEl(element, po, token);
        }
        return element
    }

    register(obj) {
        for (const prop in obj) {
            this[prop] = obj[prop]
        }
    };

    /**
     * @private
     * @param {*} element
     * @param {*} po
     * @param {*} token
     * @returns
     */
    async getEl(element, po, token) {
        const currentElement = await element;
        const newPo = po[token.elementName.replace(/\s/g, '')];
        if (!newPo) throw new Error(`${token.elementName} is not found`);
        if (!newPo.isCollection && token.suffix) throw new Error(`Unsupported operation. ${token.elementName} is not collection`);

        if (Array.isArray(currentElement)) {
            if (!newPo.isCollection) return [
                await this.getChildrenOfCollectionElements(currentElement, newPo),
                newPo
            ];
            if (newPo.isCollection && !token.suffix) return [
                await this.getCollectionOfCollection(currentElement, newPo),
                newPo
            ];
            if (newPo.isCollection && token.suffix === 'in') return [
                await this.getElementByTextFromCollection(currentElement, newPo, token),
                newPo
            ];
            if (newPo.isCollection && token.suffix === 'of') return [
                await this.getElementByIndexFromCollection(currentElement, newPo, token),
                newPo
            ];
        } else {
            if (newPo.isCollection && token.suffix === 'in') return [
                await this.getElementByText(currentElement, newPo, token),
                newPo
            ];
            if (newPo.isCollection && token.suffix === 'of') return [
                await this.getElementByIndex(currentElement, newPo, token),
                newPo
            ];
            if (newPo.isCollection && !token.suffix) return [
                await this.getCollection(currentElement, newPo.selector),
                newPo
            ];
            return [await this.getSingleElement(currentElement, newPo.selector), newPo]
        }
    }

    /**
     * @private
     * @param {*} element
     * @param {*} po
     * @param {*} token
     * @returns
     */
    async getElementByText(element, po, token) {
        let condition;
        if (token.prefix === '#') {
            condition = (text) => text.includes(token.value);
        }
        if (token.prefix === '@') {
            condition = (text) => text === token.value;
        }
        return new Promise((resolve, reject) => {
            let timer = 0;
            const waitInterval = setInterval(async () => {
                timer += TICK_INTERVAL;
                if (timer > this.config.timeout) {
                    clearInterval(waitInterval);
                    return resolve(this.getChildNotFound(element, token));
                }
                try {
                    const collection = await this.getCollection(element, po.selector);
                    for (const el of collection) {
                        let text = await el.getText();
                        if (text === undefined) text = await this.driver.execute(e => e.textContent, el);
                        if (condition(text)) {
                            clearInterval(waitInterval);
                            return resolve(el);
                        }
                    }
                } catch (err) {
                    clearInterval(waitInterval);
                    return reject(err);
                }
            }, TICK_INTERVAL);
        });
    }

    /**
     * Get element by text for each element in collection
     * @param collection
     * @param po
     * @param token
     * @returns {Promise<Awaited<unknown>[]>}
     */
    getElementByTextFromCollection(collection, po, token) {
        return Promise.all(collection.map(element => this.getElementByText(element, po, token)))
    }

    getElementByIndexFromCollection(collection, po, token) {
        return Promise.all(collection.map(element => this.getElementByIndex(element, po, token)))
    }

    /**
     * @private
     * @param {*} element
     * @param {*} po
     * @param {*} token
     * @returns
     */
    async getElementByIndex(element, po, token) {
        const index = parseInt(token.value) - 1;
        return new Promise((resolve, reject) => {
            let timer = 0;
            const waitInterval = setInterval(async () => {
                timer += TICK_INTERVAL;
                if (timer > this.config.timeout) {
                    clearInterval(waitInterval);
                    return resolve(this.getChildNotFound(element, token));
                }
                try {
                    const collection = await this.getCollection(element, po.selector);
                    if (collection.length > index) {
                        clearInterval(waitInterval);
                        return resolve(collection[index]);
                    }
                } catch (err) {
                    clearInterval(waitInterval);
                    return reject(err);
                }
            }, TICK_INTERVAL);
        });
    }

    async getCollection(element, selector) {
        return element.$$(selector);
    }

    async getSingleElement(element, selector) {
        return element.$(selector);
    }

    /**
     * @private
     * @param {*} collection
     * @param {*} po
     * @returns
     */
    async getChildrenOfCollectionElements(collection, po) {
        return Promise.all(collection.map(async element => element.$(po.selector)))
    }

    async getCollectionOfCollection(collection, po) {
        const subCollection = await Promise.all(collection.map(async element => element.$$(po.selector)));
        return await Promise.all(subCollection.reduce((flat, elements) => [...flat, ...elements], []));
    }

    async getChildNotFound(parentElement, {value, suffix, elementName}) {
        return parentElement.$(`ElementNotExist-${value}-${suffix}-${elementName}`.replace(/[\W]/g, ''))
    }

}

module.exports = new PO();
