const electron = require('electron');
const { app } = electron;
const uuid = require('uuid');
const executeJavaScript = require('./lib/executeJavaScript');
const bg = require('./lib/bg');

const id = uuid.v4();

// Default background effects
let transparentBgConfig = {
  WebkitFilter: 'blur(5px)',
  opacity: '0.3',
};

// Default backgroun color, just in case it's not set
let backgroundColor = '#000';

// This throws an error for some reason... Letting that error die a silent death...
try {
  // Enable capturing of the screen to set as the background
  app.commandLine.appendSwitch('enable-blink-features', 'GetUserMedia');
  app.commandLine.appendSwitch('enable-usermedia-screen-capturing');
  app.commandLine.appendSwitch('max-gum-fps', '60');
} catch (iDontKnowWhyThisIsAnError) {}

exports.decorateConfig = config => {
  if (config.backgroundColor) backgroundColor = config.backgroundColor;
  if (config.transparentBg) {
    transparentBgConfig = Object.assign(transparentBgConfig, config.transparentBg);
  }

  // Set background to be transparent to show video
  const newConfig = Object.assign({}, config);
  newConfig.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  return newConfig;
};

exports.onWindow = win => {

  // Don't capture the console as part of the background
  win.setContentProtection(true);

  let screen;
  const getScreen = location => electron.screen.getDisplayNearestPoint(location);

  const update = event => {
    const location = event.sender.getBounds();
    const newScreen = getScreen(location);
    if (screen.id !== newScreen.id) {
      screen = newScreen;
      executeJavaScript(event.sender, bg.video.update({ screen, video: { id } }));
    }

    bg.video.update({ screen, video: { id } });
    executeJavaScript(event.sender, bg.position({ id, screen, location }));
  };

  win.webContents.on('dom-ready', () => {
    const location = win.getBounds();
    screen = getScreen(location);
    executeJavaScript(
      win,
      bg.video.set({ screen, video: { id, style: transparentBgConfig, backgroundColor } }),
      bg.position({ id, screen, location })
    );
    win.on('move', update);
    win.on('resize', update);
  });

};
