import { Locator, Page } from 'playwright';
declare type SelectorOptions = {
    ignoreHierarchy?: boolean
}
declare interface Logger {
    log(value: any): void;
}
declare function $(selector: string | Object, options?: SelectorOptions): Object;
declare function $$(selector: string | Object, options?: SelectorOptions): Object;
declare type PageObject = {
    driver: Page;
    init(driver, options: { timeout?: number, logger?: Logger }): void;
    register(pageObject: Object): void;
    getElement(path: string): Locator;
    setDriver(page: Page): void;
}
declare let po: PageObject;
declare class Component {
    constructor(selector?: any)
}
declare function Selector(selectorFunction: (arg: string) => string | Object): any
declare function NativeSelector(selectorFunction: (page: Page, parent: Locator) => Locator): any
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component, Selector, NativeSelector }
}
