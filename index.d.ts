import * as WebdriverIO from 'webdriverio';
export declare type Element = WebdriverIO.Element<'async'>;
export declare type ElementArray = WebdriverIO.ElementArray;
declare function $(selector: string|Object): Object;
declare function $$(selector: string|Object): Object;
declare type PageObject = {
    init(driver, options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement(path: string): Element | ElementArray
}
declare let po: PageObject;
declare class Component {
    constructor(selector: string | object)
}
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component }
}
