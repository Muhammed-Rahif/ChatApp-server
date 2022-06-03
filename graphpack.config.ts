import app from "./src";

// graphpack.config.js
export const server = {
  introspection: false,
  playground: false,
  applyMiddleware: { app }, // app is from an existing (Express/Hapi,...) app
};
