/**
 * register element in page object
 * @param {string|object} definition
 * @param {boolean} isCollection 
 * @returns { definition, isCollection }
 */
function register(definition, isCollection) {
    if (!definition) throw new Error('selector or component should be passed');
    if (typeof definition === 'object') {
        return {
            ...definition,
            isCollection
        }
    }
    return {
        selector: definition,
        isCollection
    }
}

function $(definition) {
    return register(definition, false)
}

function $$(definition) {
    return register(definition, true)
}

module.exports = {
    $,
    $$,
    register
};