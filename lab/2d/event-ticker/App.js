import Ticker from './vendor/pixi/src/core/ticker/Ticker';
import EventEmitter from './vendor/eventemiiter3/EventEmitter';

export default class App {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log('EventEmitter & Ticker');
    this.testEventEmitter();
    this.testTicker();
  }

  testEventEmitter() {
    const event = new EventEmitter();

    const test0 = this.test0.bind(this);
    const test1 = this.test1.bind(this);
    const test2 = this.test2.bind(this);
    const test3 = this.test3.bind(this);

    event.on('test', test0);
    event.on('test', test1);
    event.on('test', test2);
    event.on('test', test3);

    // event.off('test', test2);
    // event.off('test', test0);
    // event.off('test', test1);
    // event.off('test', test3);

    event.removeAllListeners('test');

    event.emit('test');
  }

  testTicker() {
    var ticker = new Ticker();
    ticker.start();
    console.log('ticker', ticker);

    const test0 = this.test0.bind(this);
    const test1 = this.test1.bind(this);
    const test2 = this.test2.bind(this);
    const test3 = this.test3.bind(this);

    ticker.add(test0);
    ticker.add(test1);
    //ticker.add(test2);
    //ticker.add(test3);
  }

  test0() {
    console.log('test0');
  }

  test1() {
    console.log('test1');
  }

  test2() {
    console.log('test2');
  }

  test3() {
    console.log('test3');
  }

}