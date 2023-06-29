import { Locator } from 'playwright';
declare function $(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare function $$(selector: string|Object, options?: { ignoreHierarchy: boolean }): Object;
declare type PageObject = {
    init(driver, options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement(path: string): Locator
}
declare let po: PageObject;
declare class Component {
    constructor(selector?: any)
}
declare function Selector(selectorFunction: Function): any
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component, Selector }
}
