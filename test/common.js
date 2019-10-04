const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const instance = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://thesplinks.com/',
  referrer: 'https://thesplinks.com/',
  contentType: 'text/html',
  userAgent: 'Mellblomenator/9000',
  includeNodeLocations: true,
});

const { window } = instance;
const { document } = instance.window;
global.window = instance.window;
global.document = instance.window.document;
global.navigator = instance.window.navigator;
global.HTMLElement = window.HTMLElement;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

copyProps(window, global);
document.createElement('div');

global.React = require('react');
global.enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

global.enzyme.configure({ adapter: new Adapter() });
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');
global.sinonTestFactory = require('sinon-test');
global.chai = require('chai');
global.chaiEnzyme = require('chai-enzyme');

global.sinonTest = global.sinonTestFactory(global.sinon);
global.Component = global.React.Component;
global.chai.should();
global.chai.use(global.sinonChai);
global.chai.use(global.chaiEnzyme());
global.expect = global.chai.expect;
global.assert = global.chai.assert;
global.mount = enzyme.mount;
global.render = enzyme.render;
global.shallow = enzyme.shallow;
global.simulate = enzyme.simulate;
