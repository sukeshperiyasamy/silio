import type { Lang } from "@/lib/site";

export default function ProjectPreview({ lang }: { lang: Lang }) {
  const hi = lang === "hi";
  return (
    <div
      className="studio-preview"
      aria-label={
        hi
          ? "वेबसाइट और डेटा डैशबोर्ड का उदाहरण"
          : "Illustrative website and data dashboard"
      }
    >
      <div className="preview-orbit" />
      <div className="browser-preview">
        <div className="browser-bar">
          <span className="window-dots">● ● ●</span>
          <span>silio / digital studio</span>
          <span>✧</span>
        </div>
        <div className="preview-body">
          <div className="preview-nav">
            <b>
              silio<span>✳</span>
            </b>
            <span>Ideas. Made real.</span>
          </div>
          <div className="preview-copy">
            <span className="preview-tag">YOUR NEXT CHAPTER</span>
            <h2>
              A small idea.
              <br />A big possibility.
            </h2>
            <span className="preview-button">Let’s make it happen</span>
          </div>
          <div className="preview-shapes">
            <div className="shape-ring" />
            <div className="shape-block" />
            <span>✳</span>
          </div>
          <div className="preview-foot">
            <span>DESIGN WITH PURPOSE</span>
            <span>BUILD FOR PEOPLE</span>
          </div>
        </div>
      </div>
      <div className="data-preview">
        <div className="data-title">
          <span className="data-icon">▥</span>
          <div>
            <b>{hi ? "डेटा, अब सरल।" : "Your data, simplified."}</b>
            <small>{hi ? "डैशबोर्ड का उदाहरण" : "Illustrative dashboard"}</small>
          </div>
        </div>
        <div className="mini-bars">
          {[35, 60, 44, 78, 57, 90, 72, 100, 83].map((h, i) => (
            <span style={{ height: `${h}%` }} key={i} />
          ))}
        </div>
        <div className="data-foot">
          <span>Clarity in every cell.</span>
          <span>✧</span>
        </div>
      </div>
      <div className="build-note">
        <span>✳</span>
        {hi
          ? "आपके लिए, सोच-समझकर बनाया गया।"
          : "Thoughtfully built. Just for you."}
      </div>
    </div>
  );
}
