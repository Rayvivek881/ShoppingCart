const CopyHelper = (mainObj, tempObj) => {
  for (let key in tempObj) {
    if (tempObj.hasOwnProperty(key)) {
      mainObj[key] = tempObj[key];
    }
  }
  return mainObj;
}

const DeleteKeys = (obj, ...keys) => {
  for (let key in keys) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }
  return obj;
};

module.exports = { CopyHelper, DeleteKeys };