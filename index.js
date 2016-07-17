const { app } = require('electron');
const uuid = require('uuid');

const id = uuid.v4();

let transparentBgConfig = {
  WebkitFilter: 'blur(5px)',
  opacity: '0.3',
};

let backgroundColor = '#000';

// This throws an error for some reason... Letting that error die a silent death...
try {
  // Enable capturing of the screen to set as the background
  app.commandLine.appendSwitch('enable-blink-features', 'GetUserMedia');
} catch (iDontKnowWhyThisIsAnError) {}

exports.decorateConfig = config => {
  if (config.backgroundColor) backgroundColor = config.backgroundColor;
  if (config.transparentBg) {
    transparentBgConfig = Object.assign(transparentBgConfig, config.transparentBg);
  }

  // Set background to be transparent to show video
  const newConfig = Object.assign({}, config);
  newConfig.backgroundColor = '#00000000';
  return newConfig;
};

exports.onWindow = win => {

  // Don't capture the console as part of the background
  win.setContentProtection(true);

  const bgSetVideo = `(callback) => {
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
          transparentBgConfig
        )
      )
    }, container);

    styleElement({
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'top, left ease-in-out 100ms',
    }, video);

    const start = stream => {
      video.src = window.URL.createObjectURL(stream);
      container.appendChild(video);
      document.body.appendChild(container);
      document.body.style.backgroundColor = '${backgroundColor}';
      stream.onended = () => container.remove();
      if (callback) callback();
    };

    const reportErrors = error => console.error(error);

    const media = {
      video: {
        mandatory: {
          chromeMediaSource: 'screen',
          minFrameRate: 30,
          maxWidth: screen.width,
          maxHeight: screen.height,
        },
        optional: [
          { minFrameRate: 60 },
        ],
      },
    };

    navigator
      .mediaDevices
      .getUserMedia(media)
      .then(start)
      .catch(reportErrors);
  }`;

  const bgSetPosition = ({ x, y }) =>
    `(callback) => {
      const video = document.getElementById('${id}');
      video.style.top = '${y * -1}px';
      video.style.left = '${x * -1}px';
      if (callback) callback();
    }`;

  const execute = (instance, command, callback) => {
    const js = `(${command})(${callback ? callback : ''})`;
    if (process.env.DEBUG) console.log(js);
    instance.webContents.executeJavaScript(js);
  };

  win.webContents.on('dom-ready', () => {
    execute(
      win,
      bgSetVideo,
      bgSetPosition(win.getBounds())
    );
    win.on('move', event => {
      execute(event.sender, bgSetPosition(event.sender.getBounds()));
    });
    win.on('resize', event => {
      execute(event.sender, bgSetPosition(event.sender.getBounds()));
    });
  });

};
