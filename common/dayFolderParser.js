module.exports = getDay = (dir) => {
  const dirParts = dir.split("/");
  return parseInt(dirParts[dirParts.length - 1]);
};
