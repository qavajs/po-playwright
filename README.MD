## @qavajs/po-playwright

This library provides the ability to create hierarchical page objects and access elements using plain-english selectors.
Works on top of Playwright.

`npm install @qavajs/po-playwright`

## Usage

Lib provides getElement method that resolves plain-english selector and return playwright locator.
```javascript
const { po } = require('@qavajs/po-playwright');

When(/^click '(.+)'$/, async function (alias) {
    const element = await po.getElement(alias);
    await element.click();
});
```

```gherkin
When click '#1 of Multiple Component > Child Item'
```

Lib provides capability to get single element from collection by index (#index of Collection) or inner text (#text in Collection).

## Create page object

Lib provides two methods $ and $$ that allow registering elements and collections.
An element can be defined in form of webdriverIO selector or as an instance of the component class. 

Each not top-level component should have selector element in form of webdriverIO selector.
```javascript
const { $, $$ } = require('@qavajs/po-playwright');

class MultipleComponent {
    selector = '.list-components li';
    ChildItem = $('div');
}

class SingleComponent {
    selector = '.container';
    ChildItem = $('.child-item');
}

class App {
    SingleElement = $('.single-element');
    List = $$('.list li');
    SingleComponent = $(new SingleComponent());
    MultipleComponents = $$(new MultipleComponent());
}

module.exports = new App();
```
## Register PO
Before using po object need to be initiated and hierarchy of elements needs to be registered
The best place to do it is cucumber-js Before hook

```javascript
const { po } = require('@qavajs/po-playwright');
const pos = require('./app.js');
Before(async function() {
    po.init(page, { timeout: 10000 });  // page is an instance of playwright page
    po.register(pos); // pos is page object hierarchy
});
```

## Ignore hierarchy
In case if child element and parent component doesn't have hierarchy dependency
it's possible to pass extra parameter _ignoreHierarchy_ parameter to start traverse from root

```javascript
class ComponentThatDescribesNotWellDesignedDOMTree {
    selector = '.container';
    //ignoreHierarchy will ignore component selector .container and start traverse from root
    ChildItem = $('.child-item', { ignoreHierarchy: true }); 
}
```

## Optional selector property
If selector property is not provided for Component then parent element will be returned

```javascript
class ParentComponent {
    selector = '.container';
    ChildComponent = $(new ChildComponent()); 
}

class ChildComponent {
    //Element will be searched in parent .container element
    Element = $('.someElement');
}
```

## Dynamic selectors
In case you need to generate selector based on some data you can use dynamic selectors

```javascript
const { Selector } = require('@qavajs/po-playwright');

class Component {
    selector = '.container';
    Element = $(Selector((index => `div:nth-child(${index})`))); // function should return valid selector 
}
```

Then you can pass parameter to this function from Gherkin file

```gherkin
When I click 'Component > Element (2)'
```
