import parseTokens, { Token } from './parseTokens';
import { Page, Locator } from 'playwright';
import { Definition } from './register';

interface PageObject {
    selector?: string;
}

interface ExtendedLocator extends Locator {
    alias: string;
}

type Locatable = Page | Locator;

interface Logger {
    log(value?: string): void;
}

const defaultLogger: Logger = {
    log() {}
};

class PO {

    private driver: Page | null = null;
    private config: { timeout?: number } = {};
    private logger: Logger = defaultLogger;

    public init(driver: Page, options: { timeout: number, logger?: Logger } = { timeout: 2000 }) {
        this.driver = driver;
        this.config.timeout = options.timeout;
        this.logger = options.logger ?? defaultLogger;
    }

    /**
     * Get element from page object
     * @public
     * @param {string} alias
     * @returns { Locator }
     */
    public async getElement(alias: string): Promise<ExtendedLocator> {
        if (!this.driver) throw new Error('Driver is not attached. Call po.init(driver)')
        const tokens: Array<Token> = parseTokens(alias);
        let element: Locatable = this.driver;
        let po: PO | PageObject = this;
        if (this.driver.waitForLoadState) {
            await this.driver.waitForLoadState();
        }
        while (tokens.length > 0) {
            const token = tokens.shift() as Token;
            [element, po] = await this.getEl(element, po, token);
        }
        const extendedElement = element as ExtendedLocator;
        extendedElement.alias = alias;
        return extendedElement
    }

    public register(obj: Object) {
        for (const prop in obj) {
            // @ts-ignore
            this[prop] = obj[prop]
        }
    };

    /**
     * Get element by provided page object and token
     * @private
     * @param {Page | Locator} element
     * @param {Object} po
     * @param {Token} token
     * @returns
     */
    private async getEl(element: Page | Locator, po: Object, token: Token): Promise<[Locatable, Object] | undefined> {
        const elementName: string = token.elementName.replace(/\s/g, '');
        // @ts-ignore
        const newPo: Definition = po[elementName];
        if (!newPo) throw new Error(`${token.elementName} is not found`);
        this.logger.log(`${elementName} -> ${newPo.selector}`);
        const currentElement = (newPo.ignoreHierarchy ? await this.driver : await element) as Locatable;
        if (!newPo.isCollection && token.suffix) throw new Error(`Unsupported operation. ${token.elementName} is not collection`);
        if (newPo.isCollection && !newPo.selector) throw new Error(`Unsupported operation. ${token.elementName} selector property is required as it is collection`);
        if (!newPo.selector) return [currentElement, newPo];

        if (newPo.isCollection && token.suffix === 'in') return [
            await this.getElementByText(currentElement, newPo, token),
            newPo
        ];
        if (newPo.isCollection && token.suffix === 'of') return [
            await this.getElementByIndex(currentElement, newPo, token),
            newPo
        ];
        return [await this.getSingleElement(currentElement, newPo.selector, token.param), newPo]
    }

    /**
     * @private
     * @param {Locatable} element - element to get
     * @param {Definition} po - page object
     * @param {Token} token - token
     * @returns
     */
    private async getElementByText(element: Locatable, po: Definition, token: Token): Promise<Locator> {
        const tokenValue = token.value as string;
        if (token.prefix === '#') {
            return element.locator(this.resolveSelector(po.selector, token.param), { hasText: tokenValue }).nth(0);
        }
        if (token.prefix === '@') {
            return element.locator(this.resolveSelector(po.selector, token.param), { hasText: new RegExp(`^${tokenValue}$`) }).nth(0);
        }
        if (token.prefix === '/') {
            return element.locator(this.resolveSelector(po.selector, token.param), { hasText: new RegExp(tokenValue) }).nth(0);
        }
        throw new Error(`${token.prefix} is not supported`)
    }

    /**
     * @private
     * @param {Locatable} element - element to get
     * @param {Definition} po - page object
     * @param {Token} token - token
     * @returns
     */
    private async getElementByIndex(element: Locatable, po: Definition, token: Token): Promise<Locator> {
        const index = parseInt(token.value as string) - 1;
        return element.locator(this.resolveSelector(po.selector, token.param)).nth(index);
    }

    /**
     * @private
     * @param {Locatable} element - element to get
     * @param {string} selector - selector
     * @param {string[]} param - params for dynamic selector
     * @returns
     */
    private async getSingleElement(element: Locatable, selector: string, param?: string[]) {
        return element.locator(this.resolveSelector(selector, param));
    }

    private resolveSelector(selector: any, param?: string[]) {
        return selector.isSelectorFunction ? selector.selectorFunction(...param as string[]) : selector
    }


}

export default new PO();
