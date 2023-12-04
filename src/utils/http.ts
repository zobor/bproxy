export const createHttpHeader = (line, headers) => {
  return (
    Object.keys(headers)
      .reduce(
        function (head, key) {
          const value = headers[key];

          if (!Array.isArray(value)) {
            head.push(key + ': ' + value);
            return head;
          }

          for (let i = 0; i < value.length; i++) {
            head.push(key + ': ' + value[i]);
          }
          return head;
        },
        [line],
      )
      .join('\r\n') + '\r\n\r\n'
  );
};
