export function isUndefined(s) {
  return typeof s === 'undefined';
}

export function isArray(o) {
  return Array.isArray(o);
}

export function isObject(o) {
  return typeof o === 'object';
}

export function each(o, cb) {
  if (isArray(o)) {
    o.forEach(cb);
  } else if (isObject(o)) {
    for (let prop in o) {
      cb(o[prop], prop);
    }
  }
}