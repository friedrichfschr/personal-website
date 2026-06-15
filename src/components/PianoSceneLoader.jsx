export function PianoSceneLoader() {
  return (
    <div className="piano-scene-loader" role="status" aria-live="polite">
      <div className="piano-loader-panel">
        <div className="piano-loader-wordmark">Friedrich</div>
        <div className="piano-loader-keys" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} style={{ '--key-index': index }} />
          ))}
        </div>
        <div className="piano-loader-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>Preparing the piano room</p>
      </div>
    </div>
  );
}
