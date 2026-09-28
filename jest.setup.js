try {
  require("@testing-library/jest-dom");
} catch (e) {
  // @testing-library/jest-dom is only needed for jsdom environments with DOM testing
  if (e.code !== "MODULE_NOT_FOUND") {
    throw e;
  }
}

