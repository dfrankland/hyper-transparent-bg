module.exports = ({
  screen: {
    id: screenId,
    bounds: {
      width,
      height,
    },
  },
  video: {
    id: videoId,
  },
}) => `
  (doneUpdatingVideo) => {
    const reportErrors = error => console.error(error);

    const media = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          ${screenId && `chromeMediaSourceId: 'screen:${screenId}',`}
          minFrameRate: 30,
          maxWidth: ${width || 'screen.width'},
          maxHeight: ${height || 'screen.height'},
        },
        optional: [
          { minFrameRate: 60 },
        ],
      },
    };

    const videoElement = document.getElementById('${videoId}');

    const gotUserMedia = stream => {
      videoElement.src = window.URL.createObjectURL(stream);
      stream.onended = () => container.remove();
      if (doneUpdatingVideo) doneUpdatingVideo();
    }

    navigator
      .mediaDevices
      .getUserMedia(media)
      .then(gotUserMedia)
      .catch(reportErrors);
  }
`;
