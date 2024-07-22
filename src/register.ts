export interface DefinitionOptions {
    ignoreHierarchy: boolean
}
export interface Definition {
    selector: any;
    isCollection: boolean;
    ignoreHierarchy: boolean;
    isSelectorFunction?: boolean;
    isNativeSelector?: boolean;
    selectorFunction?: Function;
    resolvedSelector?: any;
}

/**
 * Register element in page object
 * @param {string|object} definition
 * @param {boolean} isCollection
 * @param {DefinitionOptions} options
 * @returns {{ definition, isCollection, ignoreHierarchy }}
 */
export function register(
    definition: string | Object,
    isCollection: boolean,
    options: DefinitionOptions = { ignoreHierarchy: false }): Definition
{
    if (!definition) throw new Error('Selector or component should be passed!');
    if (typeof definition === 'object' && !((definition as any).isSelectorFunction)) {
        return {
            ...definition,
            isCollection,
            ...options
        } as Definition
    }
    return {
        selector: definition,
        isCollection,
        ...options
    }
}

/**
 * Define element or component
 * @param {string | Object} definition - selector
 * @param {DefinitionOptions} options - additional options
 * @example
 * class App {
 *     Element = $('#element');
 *     Panel = $(new Panel('#panel'));
 * }
 */
export function $(definition: string | Object, options?: DefinitionOptions): Definition {
    return register(definition, false, options)
}
/**
 * Define collection
 * @param {string | Object} definition - selector
 * @param {DefinitionOptions} options - additional options
 * @example
 * class App {
 *     Collection = $$('#collection');
 *     Panels = $$(new Panel('#panel'));
 * }
 */
export function $$(definition: string | Object, options?: DefinitionOptions): Definition {
    return register(definition, true, options)
}
