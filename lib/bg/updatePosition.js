module.exports = ({
  id,
  screen: {
    bounds: { x: offsetX, y: offsetY },
  },
  location: { x, y },
}) => `
  (doneSettingPosition) => {
    const video = document.getElementById('${id}');
    video.style.top = '${(y - offsetY) * -1}px';
    video.style.left = '${(x - offsetX) * -1}px';
    if (doneSettingPosition) doneSettingPosition();
  }
`;
