// TODO: make this stuff inputs.

// this should probably be controlled by the user, sort of, maybe "learn" it somehow by penalizing titles differently and allowing almost matches.
// I don't like ignoring title, but StackOverflow plays games with it.
const IGNORED_ATTRIBUTES = ['style', 'title'];
const COSTS = {
  TAG: 5,
  ATTRIBUTE: 2,
  VALUE: 1,
  INDEX: 0,
};

module.exports = {
  IGNORED_ATTRIBUTES,
  COSTS,
};
