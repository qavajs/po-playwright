# Change Log

All notable changes to the "@qavajs/po-playwright" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature
:beetle: - bugfix
:x: - deprecation

## [0.14.0]
- :rocket: added capability to pass parent element to NativeSelector
```javascript
  const { NativeSelector } = require('@qavajs/po-playwright');

  class App {
    Element = $(NativeSelector(((page, parent) => parent.getByText(`some text`))));
  }
```

## [0.13.0]
- :x: disabled auto-split arguments in selector function

## [0.12.0]
- :rocket: added capability to use driver-built selector
```javascript
const { NativeSelector } = require('@qavajs/po-playwright');

class App {
    Element = $(NativeSelector(page => page.getByText(`some text`)));
}
```

## [0.11.3]
- :beetle: fixed logging Selector functions

## [0.11.2]
- :beetle: added logger option to po.init

## [0.11.1]
- :beetle: made call of `this.driver.waitForLoadState` optional (to enable electron support)

## [0.11.0]
- :rocket: added capability to provide logger

## [0.10.0]
- :rocket: added capability to dynamically generate selectors

## [0.0.9]
- :beetle: removed check existence method

## [0.0.8]
- :rocket: added text selector by regexp

## [0.0.7]
- :rocket: made selector property as optional
 
## [0.0.6]
- :beetle: fix imports

## [0.0.5]
- :rocket: added capability to ignore hierarchy
