const SPLIT_TOKENS_REGEXP = /\s*>\s*/;
const PARSE_TOKEN_REGEXP = /^(?<prefix>[#@])(?<value>.+)\s(?<suffix>of|in)\s(?<elementName>.+)$/

export interface Token {
    elementName: string;
    value?: string;
    prefix?: string;
    suffix?: string;
}

export default function parseTokens(path: string): Array<Token> {
    const tokens = path.split(SPLIT_TOKENS_REGEXP);
    return tokens.map(token)
}

function token(value: string): Token {
    if (PARSE_TOKEN_REGEXP.test(value)) {
        const { groups } = PARSE_TOKEN_REGEXP.exec(value) as { groups: Object };
        return groups as Token
    }
    return { elementName: value }
}
