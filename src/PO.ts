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

    public driver: Page | null = null;
    private config: { timeout?: number } = {};
    private logger: Logger = defaultLogger;
    private waitForLoadState: boolean = false;

    public init(driver: Page, options: {
        timeout?: number,
        logger?: Logger,
        waitForLoadState?: boolean
    } = { timeout: 2000, waitForLoadState: false }) {
        this.driver = driver;
        this.config.timeout = options.timeout ?? 2000;
        this.logger = options.logger ?? defaultLogger;
        this.waitForLoadState = options.waitForLoadState ?? false;
    }

    /**
     * Get element from page object
     * @public
     * @param {string} alias - element to locate
     * @returns {Locator}
     */
    public async getElement(alias: string): Promise<ExtendedLocator> {
        if (!this.driver) throw new Error('Driver is not attached. Call po.init(driver)')
        const tokens: Array<Token> = parseTokens(alias);
        let element: Locatable = this.driver;
        let po: PO | PageObject = this;
        if (this.waitForLoadState && this.driver.waitForLoadState) {
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

    /**
     * Register page object map
     * @param {Object} pageObject - page object to register
     */
    public register(pageObject: Object) {
        for (const prop in pageObject) {
            // @ts-ignore
            this[prop] = pageObject[prop]
        }
    };

    /**
     * Set page instance
     * @param {Page} page - page
     */
    public setDriver(page: Page) {
        this.driver = page;
    }

    /**
     * Get element by provided page object and token
     * @private
     * @param {Page | Locator} element
     * @param {Object} po
     * @param {Token} token
     * @returns
     */
    private async getEl(element: Locatable, po: {[prop: string]: any}, token: Token): Promise<[Locatable, Object] | undefined> {
        const elementName: string = token.elementName.replace(/\s/g, '');
        const newPo: Definition = po[elementName];
        if (!newPo) throw new Error(`${token.elementName} is not found`);
        const currentElement = (newPo.ignoreHierarchy ? this.driver : element) as Locatable;
        if (newPo.isNativeSelector) return [await (newPo.selectorFunction as Function)(this.driver, currentElement), newPo];
        if (!newPo.isCollection && token.suffix) throw new Error(`Unsupported operation.\n${token.elementName} is not collection`);
        if (newPo.isCollection && !newPo.selector) throw new Error(`Unsupported operation.\n${token.elementName} selector property is required as it is collection`);
        if (!newPo.selector) return [currentElement, newPo];
        newPo.resolvedSelector = this.resolveSelector(newPo.selector, token.param);
        this.logger.log(`${elementName} -> ${newPo.resolvedSelector}`);
        if (newPo.isCollection && token.suffix === 'in') return [
            await this.getElementByText(currentElement, newPo, token),
            newPo
        ];
        if (newPo.isCollection && token.suffix === 'of') return [
            await this.getElementByIndex(currentElement, newPo, token),
            newPo
        ];
        return [await this.getSingleElement(currentElement, newPo.resolvedSelector), newPo]
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
            return element.locator(po.resolvedSelector, { hasText: tokenValue }).nth(0);
        }
        if (token.prefix === '@') {
            return element.locator(po.resolvedSelector, { hasText: new RegExp(`^${tokenValue}$`) }).nth(0);
        }
        if (token.prefix === '/') {
            return element.locator(po.resolvedSelector, { hasText: new RegExp(tokenValue) }).nth(0);
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
        return element.locator(po.resolvedSelector).nth(index);
    }

    /**
     * @private
     * @param {Locatable} element - element to get
     * @param {string} selector - selector
     * @returns
     */
    private async getSingleElement(element: Locatable, selector: string) {
        return element.locator(selector);
    }

    private resolveSelector(selector: any, param?: string[]) {
        return selector.isSelectorFunction ? selector.selectorFunction(...param as string[]) : selector
    }

}

export default new PO();
