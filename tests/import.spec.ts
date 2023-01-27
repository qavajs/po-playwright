import {test, expect} from '@jest/globals';
import {po, $, $$, Component} from '../index';

test('po', () => {
    expect(po.init).toBeInstanceOf(Function);
    expect(po.getElement).toBeInstanceOf(Function);
});

test('$', () => {
    expect($).toBeInstanceOf(Function);
});

test('$$', () => {
    expect($$).toBeInstanceOf(Function);
});

test('Component', () => {
    expect(Component).toBeInstanceOf(Function);
});
