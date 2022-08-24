export interface Definition {
    selector: string;
    isCollection: boolean;
}

/**
 * register element in page object
 * @param {string|object} definition
 * @param {boolean} isCollection
 * @returns { definition, isCollection }
 */
export function register(definition: string | Object, isCollection: boolean): Definition {
    if (!definition) throw new Error('selector or component should be passed');
    if (typeof definition === 'object') {
        return {
            ...definition,
            isCollection
        } as Definition
    }
    return {
        selector: definition,
        isCollection
    }
}

export function $(definition: string | Object): Definition {
    return register(definition, false)
}

export function $$(definition: string | Object): Definition {
    return register(definition, true)
}
