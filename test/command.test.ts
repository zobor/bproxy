import command from "../src/proxy/command";

describe('command.ts', () => {
  it('command.test', () => {
    command.test({
      rawArgs: [,,,'https://www.google.com'],
    });
  });
});
