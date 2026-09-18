const Module = require('module');
const path = require('path');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(request) {
  if (request.startsWith('@/')) {
    request = path.join(__dirname, '..', 'src', request.substring(2));
  }
  return originalRequire.call(this, request);
};
