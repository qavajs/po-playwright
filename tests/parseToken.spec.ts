import {test, expect} from 'vitest';
import parseToken from '../src/parseTokens';
    [
        {
            query: 'Element',
            tokens: [{
                elementName: 'Element',
                prefix: undefined,
                suffix: undefined,
                value: undefined
            }]
        },
        {
            query: 'Component > Element',
            tokens: [{
                elementName: 'Component',
                prefix: undefined,
                suffix: undefined,
                value: undefined
            }, {
                elementName: 'Element',
                prefix: undefined,
                suffix: undefined,
                value: undefined
            }]
        },
        {
            query: '#1 of Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '#',
                suffix: 'of',
                value: '1'
            }]
        },
        {
            query: '#text in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '#',
                suffix: 'in',
                value: 'text'
            }]
        },
        {
            query: '#text three words in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '#',
                suffix: 'in',
                value: 'text three words'
            }]
        },
        {
            query: '@text three words in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '@',
                suffix: 'in',
                value: 'text three words'
            }]
        },
        {
            query: '/^text$/ in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '/',
                suffix: 'in',
                value: '^text$'
            }]
        },
        {
            query: 'Parameter (22)',
            tokens: [{
                elementName: 'Parameter',
                prefix: undefined,
                suffix: undefined,
                value: undefined,
                param: ['22']
            }]
        },
        {
            query: '#1 of Parameter Collection (22)',
            tokens: [{
                elementName: 'Parameter Collection',
                prefix: '#',
                suffix: 'of',
                value: '1',
                param: ['22']
            }]
        },
    ].forEach(data => {
        test(data.query, () => {
            expect(parseToken(data.query)).to.eql(data.tokens)
        });
    });
