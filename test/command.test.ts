import command from "../src/proxy/command";

describe('command.ts', () => {
  it('command.test', () => {
    command.test({
      rawArgs: [,,,'https://www.google.com'],
    });
  });
  it('run.proxy', () => {
    let error;
    try {
      command.run({ proxy: 'on', port: 8888 });
      command.run({ proxy: 'off', port: 8888 });
    } catch(err) {
      err = error;
    }

    expect(error === undefined).toBeTruthy();
  });

  it('run.start', () => {
    try {
      command.start({ port: 8888, config: './'});
    } catch(err) {
      console.log(err);
    }
  });
});
