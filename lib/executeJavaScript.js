module.exports = (instance, command, callback) => {
  const js = `(${command})(${callback ? callback : ''})`;
  if (process.env.DEBUG) console.log(js);
  instance.webContents.executeJavaScript(js);
};
