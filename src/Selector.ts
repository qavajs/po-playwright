import { Locator, Page } from 'playwright';

export function NativeSelector(selectorFunction: (page: Page) => Locator) {
    return {
        isNativeSelector: true,
        selectorFunction
    }
}

export function Selector(selectorFunction: Function) {
    return {
        isSelectorFunction: true,
        selectorFunction
    }
}
