// Simple in-memory cache
var cache = {};
var CACHE_TTL = 60000;

function set(key, value) {
  cache[key] = { value: value, timestamp: Date.now() };
}

function get(key) {
  var item = cache[key];
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    delete cache[key];
    return null;
  }
  return item.value;
}

function clear() {
  cache = {};
}

function getAll() {
  return cache;
}

module.exports = { set, get, clear, getAll };
