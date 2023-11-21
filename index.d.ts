import { Locator } from 'playwright';
declare interface Logger {
    log(value: any): void;
}
declare function $(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare function $$(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare type PageObject = {
    init(driver, options: { timeout: number, logger?: Logger }): void;
    register(pageObject: Object): void;
    getElement(path: string): Locator
}
declare let po: PageObject;
declare class Component {
    constructor(selector?: any)
}
declare function Selector(selectorFunction: Function): any
declare function NativeSelector(selectorFunction: Function): any
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component, Selector, NativeSelector }
}
