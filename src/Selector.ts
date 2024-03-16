import { Locator, Page } from 'playwright';

export function NativeSelector(selectorFunction: (page: Page, parent: Locator) => Locator) {
    return {
        isNativeSelector: true,
        selectorFunction
    }
}

export function Selector(selectorFunction: (arg: string) => string | Object) {
    return {
        isSelectorFunction: true,
        selectorFunction
    }
}
