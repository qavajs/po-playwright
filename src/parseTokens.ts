const SPLIT_TOKENS_REGEXP = /\s*>\s*/;
const PARSE_TOKEN_REGEXP = /^(?<prefix>[#@/])(?<value>.+)\s(?<suffix>of|in)\s(?<elementName>.+)$/;

export class Token {
    elementName: string;
    value?: string;
    prefix?: string;
    suffix?: string;
    param?: string[];

    constructor({ elementName, value, prefix, suffix }: { elementName: string, value?: string, prefix?: string, suffix?: string}) {
        this.elementName = elementName;
        this.value = value;
        this.prefix = prefix;
        this.suffix = suffix;
        if (prefix === '/' && value && value[value.length - 1] === '/') {
            this.value = value.slice(0, value.length - 1);
        }
        if (elementName.includes('(')) {
            const [name, param] = elementName.replace(')', '').split(/\s+\(/);
            this.elementName = name;
            this.param = param.replace(/([()]|^\s)/g, '').split(/\s*,\s*/);
        }
    }
}

export default function parseTokens(path: string): Array<Token> {
    const tokens = path.split(SPLIT_TOKENS_REGEXP);
    return tokens.map(token)
}

function token(value: string): Token {
    if (PARSE_TOKEN_REGEXP.test(value)) {
        const { groups } = PARSE_TOKEN_REGEXP.exec(value) as { groups: Object };
        return new Token(groups as { elementName: string, value?: string, prefix?: string, suffix?: string})
    }
    return new Token({ elementName: value })
}
