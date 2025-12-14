const getFields = value =>
  [...Object.entries(value)]
    .filter(([_, value]) => typeof value?.["@type"] === "string")
    .map(([title, value]) => ({ title, value }));

const makeField = field => {
  const { title, value } = field;
  if (title.indexOf("_") === 0) return "";

  const fieldMap = extractFields({ title, value });

  return fieldMap;
};

const extractFields = field => {
  const { value } = field;
  const fields = {
    field: value,
    fields: getFields(value).map(field => extractFields(field))
  };
  return fields;
};

export const getSettings = settings => {
  const fields = [];

  settings.forEach(setting => {
    if (setting?.["@type"]) {
      const { ["@title"]: title } = setting;
      fields.push(makeField({ title: title, value: setting }));
    } else {
      fields.push(
        ...getFields(setting).map(({ title, value }) =>
          makeField({ title: title, value })
        )
      );
    }
  });

  return fields;
};
