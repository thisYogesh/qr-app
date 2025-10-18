export const handleMultiAssignDatasetValue = ($el, prop, value) => {
  const exValue = [$el.dataset[prop]].filter(val => val);
  $el.dataset[prop] = exValue.concat(value).join(",");
};

export const getInteratorValues = IteratorValue => {
  // if (IteratorValue.constructor !== Iterator) throw "Not an Iterator";

  const values = [];
  let value = null;
  while ((value = IteratorValue.next().value)) {
    values.push(value);
  }

  return values;
};

export const IfElse = (_if, doIf, doElse = null) => {
  const _return = { if: doIf, else: doElse };

  if (_if && typeof doIf === "function") _return.if = doIf();
  if (!_if && typeof doElse === "function") _return.else = doElse();

  return _if ? _return.doIf : _return.doElse;
};
