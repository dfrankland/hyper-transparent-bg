const setVideo = require('./setVideo');
const updateVideo = require('./updateVideo');
const updatePosition = require('./updatePosition');

module.exports = {
  video: {
    set: setVideo,
    update: updateVideo,
  },
  position: updatePosition,
};
