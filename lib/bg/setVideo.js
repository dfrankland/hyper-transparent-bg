const updateVideo = require('./updateVideo');

module.exports = ({
  screen,
  video: {
    id,
    style,
    backgroundColor,
  },
}) => `
  (doneSettingVideo) => {
    const container = document.createElement('div');
    const video = document.createElement('video');
    video.id = '${id}';
    video.autoplay = true;

    const styleElement = (style, element) => {
      Object.keys(style).forEach(
        property => element.style[property] = style[property]
      );
    };

    styleElement(${
      JSON.stringify(
        Object.assign(
          {
            position: 'absolute',
            zIndex: -1,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            overflow: 'hidden',
          },
          style
        )
      )
    }, container);

    styleElement({
      display: 'none',
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'top, left ease-in-out 100ms',
    }, video);

    container.appendChild(video);
    document.body.appendChild(container);

    const videoStreamStarted = () => {
      video.style.display = 'block';
      document.body.style.backgroundColor = '${backgroundColor}';
      if (doneSettingVideo) doneSettingVideo();
    };

    (${updateVideo({ screen, video: { id } })})(videoStreamStarted);
  }
`;
