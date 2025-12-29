const INITIAL_PATH_PROP = "__initial_path_";
export const randomId = () => {
  const number = Math.random() * 100000;
  const [id] = number.toString().split(".");
  return id;
};

export const getDataUrl = file => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    try {
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    } catch {
      reject("FAILED_TO_CONVERT_DATA_URL");
    }
  });
};

export const addPaths = (value, currentPath = "root") => {
  // exclude new configs from path labeling
  if (currentPath.includes(".new")) return value;

  // If it's an array, map over items
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      addPaths(item, `${currentPath}[${index}]`)
    );
  }

  // If it's a plain object
  if (value !== null && typeof value === "object") {
    const result = { __path: currentPath };

    for (const [key, val] of Object.entries(value)) {
      if (Array.isArray(val)) {
        result[`${INITIAL_PATH_PROP}${key}`] = `${currentPath}.${key}`;
      }

      result[key] = addPaths(val, `${currentPath}.${key}`);
    }

    return result;
  }

  // Primitive values stay as-is
  return value;
};

const updater = path =>
  new Function("state", "value", `state.${path} = value; return state;`);

export const updateAtPath = (state, path, value) => {
  return updater(path.replace("root.", ""))(state, value);
};

const pushUpdater = path =>
  new Function("state", "value", `state.${path}.push(value); return state;`);

export const pushUpdateAtPath = (state, path, value) => {
  return pushUpdater(path.replace("root.", ""))(state, value);
};

const getStateValue = path =>
  new Function("state", "value", `return state.${path}`);

export const getDynamicState = (state, path) => {
  return getStateValue(path.replace("root.", ""))(state);
};

export const handleUnit = value => {
  if (isNaN(value)) return value;
  return `${value}px`;
};

export const getAddNewBasePath = (parentObject, key) => {
  const {
    [`${INITIAL_PATH_PROP}${key}`]: initialPath,
    [key]: items
  } = parentObject;

  return { newPath: `${initialPath}[${items.length}]`, initialPath };
};
