const { BaseCommand, SubCommand } = require('../../exports');

class TestSubOneA extends SubCommand {
  constructor() {
    super({
      name: 'subonea',
      description: 'TestSubOneA'
    });
  }
  async execute(ctx) {
    ctx.send('This is `TestSubOneA`');
  }
}

class TestSubOneB extends SubCommand {
  constructor() {
    super({
      name: 'suboneb',
      description: 'TestSubOneB'
    });
  }
  async execute(ctx, arg) {
    ctx.send('This is `TestSubOneB`');
    ctx.send(arg);
  }
}

class TestSubOne extends SubCommand {
  constructor() {
    super({
      name: 'subone',
      description: 'TestSubOne',
    });
  }
}

const testSubOne = new TestSubOne().registerSubCommands(new TestSubOneA(), new TestSubOneB());

class TestSubTwo extends SubCommand {
  constructor() {
    super({
      name: 'subtwo',
      description: 'TestSubTwo',
    });
  }
  async execute(ctx, arg, arg2) {
    ctx.send('This is `TestSubTwo`');
    ctx.send(`Args:\n${arg}\n${arg2}`);
  }
}

const testSubTwo = new TestSubTwo();

class Test extends BaseCommand {
  constructor() {
    super({
      name: 'test',
      description: 'Test command',
    }, 'dev-utils');
  }
}

module.exports = new Test().registerSubCommands(testSubOne, testSubTwo);
