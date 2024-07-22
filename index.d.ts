import { Locator, Page } from 'playwright';
declare type SelectorOptions = {
    ignoreHierarchy?: boolean
}
declare interface Logger {
    log(value: any): void;
}
/**
 * Define element or component
 * @param {string | Object} selector - selector
 * @param {SelectorOptions} options - additional options
 * @example
 * class App {
 *     Element = $('#element');
 *     Panel = $(new Panel('#panel'));
 * }
 */
declare function $(selector: string | Object, options?: SelectorOptions): Object;
/**
 * Define collection
 * @param {string | Object} selector - selector
 * @param {SelectorOptions} options - additional options
 * @example
 * class App {
 *     Collection = $$('#element');
 *     Panels = $$(new Panel('#panel'));
 * }
 */
declare function $$(selector: string | Object, options?: SelectorOptions): Object;
declare type PageObject = {
    /**
     * driver instance
     */
    driver: Page;
    /**
     * Init page object instance
     * @param {Page} driver
     * @param {{timeout?: number, logger?: Logger}} options - additional options
     * @example
     * po.init(page, {timeout: 5000, logger: new Logger()});
     */
    init(driver: Page, options: { timeout?: number, logger?: Logger }): void;
    /**
     * Register page object tree
     * @param pageObject
     * @example
     * po.register(new PageObject());
     */
    register(pageObject: Object): void;
    /**
     * Get element
     * @param {string} path - page object select
     * @example
     * const element = await po.getElement('Element');
     * const collection = await po.getElement('Component > Collection');
     */
    getElement(path: string): Promise<Locator>;
    /**
     * Set new driver instance
     * @param {Page} page
     * @example
     * po.setDriver(page);
     */
    setDriver(page: Page): void;
}
/**
 * Instance of page object
 */
declare let po: PageObject;
/**
 * Component class
 * @example
 * class Panel extends Component {
 *     Element = $('#element');
 * }
 * class App {
 *     Panel = $(new Panel('#panel'));
 * }
 */
declare class Component {
    constructor(selector?: any)
}
/**
 * Function to define dynamic selector
 * @param {selectorFunction: (arg: string) => string | Object} selectorFunction
 * @example
 * class App {
 *     DynamicElement = $(Selector(index => `.element:nth(${index})`));
 * }
 *
 * When I click 'Dynamic Element (3)'
 */
declare function Selector(selectorFunction: (arg: string) => string | Object): any
/**
 * Function to obtain element in framework native way
 * @param {selectorFunction: (page: Page, parent: Locator) => Locator} selectorFunction
 * @example
 * class App {
 *     NativeElement = $(NativeSelector(page => page.getByText('some text'));
 * }
 *
 * When I click 'NativeElement'
 */
declare function NativeSelector(selectorFunction: (page: Page, parent: Locator) => Locator): any
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component, Selector, NativeSelector }
}
