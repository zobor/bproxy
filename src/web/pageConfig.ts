const pageConfig = {
  name: null,
  collapsed: 3,
  shouldCollapse: (field) => ['array'].includes(field),
  quotesOnKeys: false,
  theme: ['google', 'monokai'][0],
  displayDataTypes: false,
  displayObjectSize: false,
  collapseStringsAfterLength: 50,
  displayArrayKey: false,
};

export default pageConfig;
