import { $, $$ } from '../src/register';
import { Component } from '../src/Component';
import { Selector } from '../src/Selector';

class MultipleComponent extends Component {
    ChildItem = $('div');
}

class SingleComponent {
    selector = '.container';

    ChildItem = $('.child-item');
    IgnoreHierarchyItem = $('.list-components > li:first-child', { ignoreHierarchy: true });
}

class AsyncComponent extends Component {
    ChildItems = $$('li');
    ChildItemByIndex = $(Selector(index => `li:nth-child(${index})`))
}

class Level2Elements {
    selector = 'ul.level2';

    ListItems = $$('li > span');
}

class Level1Elements {
    selector = 'ul.level1';

    Level2Elements = $$(new Level2Elements());
}

class NotExistingComponent {
    selector = 'not-exist';

    Item = $('div');
    Items = $$('li > span');
}

class ComponentWithoutSelector {
    SingleElement = $('.single-element');
    List = $$('.list li');
}

class App {
    SingleElement = $('.single-element');
    List = $$('.list li');
    ParametrizedList = $$(Selector(index => `.list li:nth-child(${index})`));
    SingleComponent = $(new SingleComponent());
    MultipleComponents = $$(new MultipleComponent('.list-components li'));
    AsyncComponent = $(new AsyncComponent('#async-list-components'));
    AsyncComponentBySelector = $(new AsyncComponent(Selector(selector => selector)));
    Level1Elements = $(new Level1Elements());
    NotExistingComponent = $(new NotExistingComponent());
    ComponentWithoutSelector = $(new ComponentWithoutSelector());
    ComponentsWithoutSelector = $$(new ComponentWithoutSelector());
}

export default new App();
