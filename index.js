const po = require('./lib/PO').default;
const { $, $$ } = require('./lib/register');
const { Component } = require('./lib/Component');
const { Selector, NativeSelector } = require('./lib/Selector');

module.exports = {
    po,
    $,
    $$,
    Component,
    Selector,
    NativeSelector
}
