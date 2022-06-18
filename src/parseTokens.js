const SPLIT_TOKENS_REGEXP = /\s*>\s*/;
const PARSE_TOKEN_REGEXP = /^(?<prefix>[#@])(?<value>.+)\s(?<suffix>of|in)\s(?<elementName>.+)$/

function parseTokens(path) {
    const tokens = path.split(SPLIT_TOKENS_REGEXP);
    return tokens.map(token)
}

function token(value) {
    if (PARSE_TOKEN_REGEXP.test(value)) {
        return PARSE_TOKEN_REGEXP.exec(value).groups
    }
    return {
        elementName: value
    }
}

module.exports = parseTokens;
