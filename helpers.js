export const handleMultiAssignDatasetValue = ($el, prop, value) => {
  const exValue = [$el.dataset[prop]].filter(val => val);
  $el.dataset[prop] = exValue.concat(value).join(",");
};

export const getInteratorValues = IteratorValue => {
  if (IteratorValue.constructor !== Iterator) throw "Not an Iterator";

  const values = [];
  let value = null;
  while ((value = IteratorValue.next().value)) {
    values.push(value);
  }

  return values;
};
