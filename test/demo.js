// const a = `关键词|角色,角色2|属性`;
const a = `关键词|角色|属性`;
// const b = /(\S+\|\S+(,[^,]+)*\|\S+\n*)*/;
const b = /^[^|]+\|[^|]+(,[^,]+)*\|[^|]+\n*$/;

console.log(b.test(a));
console.log(a.match(b));

