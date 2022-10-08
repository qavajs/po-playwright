import { Locator } from 'playwright';
declare function $(selector: string|Object): Object;
declare function $$(selector: string|Object): Object;
declare type PageObject = {
    init(driver, options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement(path: string): Locator
}
declare let po: PageObject;
declare class Component {
    constructor(selector: string | object)
}
declare module '@qavajs/po-playwright' {
    export { $, $$, po, Component }
}
