import { Locator, Page } from 'playwright';

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
export function NativeSelector(selectorFunction: (page: Page, parent: Locator) => Locator) {
    return {
        isNativeSelector: true,
        selectorFunction
    }
}

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
export function Selector(selectorFunction: (arg: string) => string | Object) {
    return {
        isSelectorFunction: true,
        selectorFunction
    }
}
