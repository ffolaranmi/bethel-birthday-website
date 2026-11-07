import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";

// Photos live in the project's /public folder.
const PHOTO_ONE = "/b1.jpeg";
const PHOTO_TWO = "/b2.jpeg";

// Links
const RSVP_LINK = "https://partiful.com/e/n0sHmgYtF7WK15wnJrns?c=y46cqg3D";
const WISHLIST_LINK = "https://giftwhale.com/lists/5Yy5JX";
const INSPO_LINK = "https://www.google.com"; // placeholder: swap for your dress code inspo link

// Song suggestions go into a Google Sheet. Paste your Apps Script "web app" URL here
// (setup steps are in Code.gs).
const SONG_SHEET_URL = "https://script.google.com/macros/s/AKfycbx83uO1LgGGeG73fijZEgsGWBZmjda4ZXQbUSNEDnz1H2EfqtoypYtvZPqquwEqt_D1/exec";

// Cassette song (plays through a hidden YouTube player, so everyone hears the full song).
// Paste the YouTube link, then set the start/end of the part you want, in seconds
// (e.g. 1:05 = 65). END_SECONDS 0 means keep playing to the end.
const YOUTUBE_URL = "https://www.youtube.com/watch?v=ul1H_p_FeaA&list=RDul1H_p_FeaA&start_radio=1";
const START_SECONDS = 172;
const END_SECONDS = 233;

// Photo strips use /public/p1 ... /public/p16. The page works out the file type by itself.
const PHOTO_EXTENSIONS = ["jpeg", "jpg", "png", "webp", "JPEG", "JPG", "PNG"];
type StripConfig = { tilt: string; delay: string; photos: string[] };
const stripPhotos = (first: number) => [0, 1, 2, 3].map((i) => `/p${first + i}`);

const LEFT_STRIPS: StripConfig[] = [
  { tilt: "-8deg", delay: "0.2s", photos: stripPhotos(1) },
  { tilt: "5deg", delay: "0.55s", photos: stripPhotos(5) },
];
const RIGHT_STRIPS: StripConfig[] = [
  { tilt: "-5deg", delay: "0.4s", photos: stripPhotos(9) },
  { tilt: "8deg", delay: "0.75s", photos: stripPhotos(13) },
];

const MARQUEE_ITEMS = ["bethel's 21st", "y2k", "don't be late", "party time!"];

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      width?: number;
      height?: number;
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function Cassette() {
  const videoId = YOUTUBE_URL.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)?.[1];
  const wrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!videoId || !wrapRef.current) return;

    let player: YTPlayer | undefined;
    const mount = document.createElement("div");
    wrapRef.current.appendChild(mount);

    function create() {
      player = new window.YT!.Player(mount, {
        width: 200,
        height: 200,
        videoId: videoId!,
        playerVars: { start: START_SECONDS, playsinline: 1, rel: 0 },
        events: {
          onStateChange: (e) => setPlaying(e.data === 1),
        },
      });
      playerRef.current = player;
    }

    if (window.YT?.Player) {
      create();
    } else {
      window.onYouTubeIframeAPIReady = create;
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }
    }

    // Stop at the end point, and rewind to the start point ready for the next click.
    const timer = window.setInterval(() => {
      if (!player || END_SECONDS <= 0 || typeof player.getPlayerState !== "function") return;
      if (player.getPlayerState() === 1 && player.getCurrentTime() >= END_SECONDS) {
        player.pauseVideo();
        player.seekTo(START_SECONDS, true);
      }
    }, 250);

    return () => {
      window.clearInterval(timer);
      player?.destroy?.();
      playerRef.current = null;
      mount.remove();
    };
  }, [videoId]);

  function toggle() {
    const player = playerRef.current;
    if (!player || typeof player.getPlayerState !== "function") return;
    if (player.getPlayerState() === 1) {
      player.pauseVideo();
      return;
    }
    if (!startedRef.current) {
      startedRef.current = true;
      player.seekTo(START_SECONDS, true);
    }
    player.playVideo();
  }

  return (
    <div className="cassette-wrap">
      <button
        type="button"
        className={`cassette${playing ? " playing" : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause the music" : "Play the music"}
      >
        <svg viewBox="0 0 240 156" aria-hidden="true">
          <defs>
            <linearGradient id="tape-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fdfdff" />
              <stop offset="0.35" stopColor="#c9cade" />
              <stop offset="0.6" stopColor="#9a9cb8" />
              <stop offset="1" stopColor="#eceefa" />
            </linearGradient>
            <linearGradient id="tape-label" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff8fd0" />
              <stop offset="1" stopColor="#b5157f" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="232" height="148" rx="14" fill="url(#tape-body)" stroke="#fff" strokeOpacity="0.85" />
          <circle cx="17" cy="17" r="3" fill="#8f91ac" />
          <circle cx="223" cy="17" r="3" fill="#8f91ac" />
          <circle cx="17" cy="139" r="3" fill="#8f91ac" />
          <circle cx="223" cy="139" r="3" fill="#8f91ac" />
          <rect x="24" y="20" width="192" height="70" rx="8" fill="url(#tape-label)" />
          <text x="120" y="48" textAnchor="middle" fontFamily="Felipa, cursive" fontSize="24" fill="#fff">
            bethel · 21
          </text>
          <rect x="38" y="60" width="164" height="21" rx="4" fill="#fff" fillOpacity="0.88" />
          <text x="120" y="75" textAnchor="middle" fontFamily="Felipa, cursive" fontSize="13" fill="#5a1a6e">
            side A · party time
          </text>
          <rect x="62" y="96" width="116" height="34" rx="17" fill="#2a0646" />
          <g transform="translate(88 113)">
            <g className="reel">
              <circle r="12" fill="#eceefa" />
              <path d="M-12 0H12M0 -12V12M-8.5 -8.5L8.5 8.5M-8.5 8.5L8.5 -8.5" stroke="#8f91ac" strokeWidth="1.6" />
              <circle r="4.5" fill="#2a0646" />
            </g>
          </g>
          <g transform="translate(152 113)">
            <g className="reel">
              <circle r="12" fill="#eceefa" />
              <path d="M-12 0H12M0 -12V12M-8.5 -8.5L8.5 8.5M-8.5 8.5L8.5 -8.5" stroke="#8f91ac" strokeWidth="1.6" />
              <circle r="4.5" fill="#2a0646" />
            </g>
          </g>
          <path d="M52 152L68 136H172L188 152Z" fill="#b4b6cd" stroke="#fff" strokeOpacity="0.7" />
          <circle cx="86" cy="144" r="3" fill="#2a0646" />
          <circle cx="154" cy="144" r="3" fill="#2a0646" />
        </svg>
      </button>
      <p className="cassette-hint">
        {!videoId ? "song coming soon" : playing ? "now playing ♡" : "tap to play"}
      </p>
      <div className="music-embed" ref={wrapRef} aria-hidden="true" />
    </div>
  );
}

// Tries each file type in turn until one loads; falls back to the placeholder text.
function FramePhoto({ base }: { base: string }) {
  const [attempt, setAttempt] = useState(0);
  if (attempt >= PHOTO_EXTENSIONS.length) return <span>picture here…</span>;
  return (
    <img
      src={`${base}.${PHOTO_EXTENSIONS[attempt]}`}
      alt=""
      loading="lazy"
      onError={() => setAttempt((a) => a + 1)}
    />
  );
}

function PhotoStrip({ tilt, delay, photos }: StripConfig) {
  return (
    <div
      className="strip-wrap"
      style={{ "--tilt": tilt, "--delay": delay } as CSSProperties}
    >
      <div className="strip">
        {photos.map((base) => (
  <div
    className={`frame ${base === "/p15" ? "p15-frame" : ""}`}
    key={base}
  >
    <FramePhoto base={base} />
  </div>
))}
        <p className="strip-label">bethel · 21</p>
      </div>
    </div>
  );
}

function Marquee() {
  const items = MARQUEE_ITEMS.map((text) => `${text} ♡`);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {items.concat(items).map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="section-heading">
      <span>{kicker}</span>
      <h2>{children}</h2>
    </div>
  );
}

export default function App() {
  const [song, setSong] = useState("");
  const [songStatus, setSongStatus] = useState<"idle" | "sending" | "thanks" | "error">("idle");

  async function suggestSong(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const suggestion = song.trim();
    if (!suggestion || songStatus === "sending") return;

    if (!SONG_SHEET_URL) {
      console.warn("Add your Google Apps Script URL to SONG_SHEET_URL in App.tsx");
      setSongStatus("error");
      return;
    }

    setSongStatus("sending");
    try {
      await fetch(SONG_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({ song: suggestion }),
      });
      setSong("");
      setSongStatus("thanks");
    } catch {
      setSongStatus("error");
    }
  }

  return (
    <main>
      <div className="glitter" aria-hidden="true" />
 <a
  className="creator-credit"
  href="https://instagram.com/folaranmifab"
  target="_blank"
  rel="noopener noreferrer"
>
  created by @folaranmifab
</a>
      <header className="hero">
        <div className="hero-stage">
      
          <div className="strips left" aria-hidden="true">
            {LEFT_STRIPS.map((strip, i) => (
              <PhotoStrip key={i} {...strip} />
            ))}
          </div>

          <div className="hero-content" id="top">
            <p className="eyebrow">you&apos;re invited to</p>
            <h1>
              <span>Bethel&apos;s</span>
              <strong>
                <span className="num">21</span>
                <sup>st</sup>
              </strong>
              <em>Birthday</em>
            </h1>
            <a className="primary-button" href={RSVP_LINK} target="_blank" rel="noreferrer">
              RSVP here <span aria-hidden="true">→</span>
            </a>
            <Cassette />
          </div>

          <div className="strips right" aria-hidden="true">
            {RIGHT_STRIPS.map((strip, i) => (
              <PhotoStrip key={i} {...strip} />
            ))}
          </div>
        </div>
      </header>

      <Marquee />

      <section className="details-section" aria-labelledby="details-title">
        <SectionTitle kicker="the details">save the date</SectionTitle>
        <div className="detail-grid" id="details-title">
          <article className="detail-card pink">
            <span className="card-number">01</span>
            <p>when</p>
            <h3>
              Sat 12th December
              <br />
              2026 @ 7:30pm
            </h3>
          </article>
          <article className="detail-card steel">
            <span className="card-number">02</span>
            <p>where</p>
            <h3>
              <a href={RSVP_LINK} target="_blank" rel="noreferrer">
                Location via
                <br />
                Partiful <span aria-hidden="true">↗</span>
              </a>
            </h3>
          </article>
          <article className="detail-card violet">
            <span className="card-number">03</span>
            <p>dress code</p>
            <h3>
              Y2K
              <br />
              glamour
            </h3>
          </article>
        </div>
      </section>

      <section className="expect-section">
        <div className="expect-copy">
          <SectionTitle kicker="the rundown">what to expect</SectionTitle>
          <p className="big-copy">
            A night made for dancing, dressing up and making the digicam work overtime.
          </p>
          <ul className="expect-list">
            <li>
              <span>01</span> owambe of the year
            </li>
            <li>
              <span>02</span> good food &amp; birthday drinks
            </li>
            <li>
              <span>03</span> flash photos all night long
            </li>
          </ul>
        </div>
        <div className="photo-frame">
          <img src={PHOTO_ONE} alt="Bethel" />
        </div>
      </section>

      <section className="dress-section" aria-labelledby="dress-title">
        <div className="dress-photo">
          <img src={PHOTO_TWO} alt="Bethel" />
        </div>
        <div className="dress-copy">
          <SectionTitle kicker="dress to impress">the moodboard</SectionTitle>
          <h3 id="dress-title">Y2K nostalgia meets glamour.</h3>
          <p>
            Think Y2K, glitter, glamour. More is
            more.
          </p>
          <a className="text-link" href= "https://pin.it/20PwGrblq" target="_blank" rel="noreferrer">
            dress code inspo <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="info-strip">
        <article>
          <p>parking</p>
          <h3>Parking details will be shared via Partiful.</h3>
        </article>
        <article>
          <p>vibes to bring</p>
          <h3>Big energy, camera-ready &amp; your best dance moves.</h3>
        </article>
      </section>

      <section className="songs-section">
        <div>
          <SectionTitle kicker="pass the aux">song suggestions</SectionTitle>
          <p>What song has to make the party playlist?</p>
        </div>
        <form onSubmit={suggestSong}>
          <label className="sr-only" htmlFor="song">
            Song title and artist
          </label>
          <input
            id="song"
            value={song}
            onChange={(event) => setSong(event.target.value)}
            placeholder="song + artist"
            autoComplete="off"
          />
          <button type="submit" disabled={songStatus === "sending"}>
            {songStatus === "sending" ? "adding…" : "add my song"}
          </button>
        </form>
        <p className="song-response" aria-live="polite">
          {songStatus === "thanks" && "Thanks, added to the playlist ♡"}
          {songStatus === "error" && "Couldn't add that one, please try again."}
        </p>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-actions">
          <a className="primary-button" href={RSVP_LINK} target="_blank" rel="noreferrer">
            RSVP for Bethel&apos;s 21st
          </a>
          <a className="secondary-button" href={WISHLIST_LINK} target="_blank" rel="noreferrer">
            view wishlist
          </a>
        </div>
      </section>
    </main>
  );
}