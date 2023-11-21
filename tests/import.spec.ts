import {test, expect} from 'vitest';
import {po, $, $$, Component, Selector, NativeSelector} from '../index';

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

test('Selector', () => {
    expect(Selector).toBeInstanceOf(Function);
});

test('NativeSelector', () => {
    expect(NativeSelector).toBeInstanceOf(Function);
});
