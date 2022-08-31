type F<T> = new () => T;

function inject<T>(Service: F<T>): T {
  const { name } = Service;

  if (!inject[name]) {
    inject[name] = new Service();
  }

  return inject[name];
}

export default inject;
