function isMarkLogic() {
  try {
    return xdmp && cts;
  } catch(e) {
    return false;
  }
}

module.exports = isMarkLogic();
