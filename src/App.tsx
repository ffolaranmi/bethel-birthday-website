import { FormEvent, useState } from "react";

const DISCO_IMAGE =
  "https://images.unsplash.com/photo-1676149039492-67a5ed572717?auto=format&fit=crop&w=1200&q=85";
const SEQUIN_IMAGE =
  "https://images.unsplash.com/photo-1779398646559-d59e0959e4c7?auto=format&fit=crop&w=1200&q=85";

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 0c1.8 16.7 7.3 22.2 24 24-16.7 1.8-22.2 7.3-24 24C22.2 31.3 16.7 25.8 0 24 16.7 22.2 22.2 16.7 24 0Z"
        fill="currentColor"
      />
    </svg>
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
  const [submittedSong, setSubmittedSong] = useState("");

  function suggestSong(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const suggestion = song.trim();
    if (!suggestion) return;
    setSubmittedSong(suggestion);
    setSong("");
  }

  return (
    <main>
      <div className="glitter" aria-hidden="true" />

      <header className="hero">
        <nav aria-label="Main navigation">
          <a className="logo" href="#top" aria-label="Bethel's twenty-first birthday">
            B<span>21</span>
          </a>
          <a className="nav-rsvp" href="#rsvp">
            RSVP
          </a>
        </nav>

        <div className="hero-stars" aria-hidden="true">
          <Sparkle className="star star-one" />
          <Sparkle className="star star-two" />
          <Sparkle className="star star-three" />
        </div>

        <div className="hero-content" id="top">
          <p className="eyebrow">you&apos;re invited to</p>
          <h1>
  <span>Bethel&apos;s</span>
  <strong>
    <img src="/21.png" alt="21" />
    <sup>st</sup>
  </strong>
  <em>birthday</em>
</h1>
          <p className="hero-tagline">Glitter on. Volume up. It&apos;s time to celebrate.</p>
          <a className="primary-button" href="#rsvp">
            save your spot <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="chrome-pill pill-left">main character energy</div>
        <div className="chrome-pill pill-right">twenty one forever</div>
      </header>

      <section className="details-section" aria-labelledby="details-title">
        <SectionTitle kicker="the details">save the date</SectionTitle>
        <div className="detail-grid" id="details-title">
          <article className="detail-card pink">
            <span className="card-number">01</span>
            <p>when</p>
            <h3>
              Date &amp; time
              <br />
              coming soon
            </h3>
          </article>
          <article className="detail-card aqua">
            <span className="card-number">02</span>
            <p>where</p>
            <h3>
              Location
              <br />
              coming soon
            </h3>
          </article>
          <article className="detail-card violet">
            <span className="card-number">03</span>
            <p>dress code</p>
            <h3>
              Glitter, glam
              <br />
              &amp; jewel tones
            </h3>
          </article>
        </div>
      </section>

      <section className="expect-section">
        <div className="expect-copy">
          <SectionTitle kicker="the rundown">what to expect</SectionTitle>
          <p className="big-copy">
            A night made for dancing, dressing up and making the camera roll work overtime.
          </p>
          <ul className="expect-list">
            <li>
              <span>01</span> a dance floor worth dressing for
            </li>
            <li>
              <span>02</span> sweet treats &amp; birthday drinks
            </li>
            <li>
              <span>03</span> flash photos all night long
            </li>
          </ul>
        </div>
        <div className="photo-frame">
          <img
            src={DISCO_IMAGE}
            alt="A guest posing with a disco ball in a glittering party setting"
          />
          <div className="photo-sticker">
            party
            <br />
            girl
          </div>
          <Sparkle className="photo-star" />
        </div>
      </section>

      <section className="dress-section" aria-labelledby="dress-title">
        <div className="dress-photo">
          <img src={SEQUIN_IMAGE} alt="Woman in a sequinned party look surrounded by disco balls" />
        </div>
        <div className="dress-copy">
          <SectionTitle kicker="dress to impress">the moodboard</SectionTitle>
          <h3 id="dress-title">Y2K glam meets jewel-box sparkle.</h3>
          <div className="swatches" aria-label="Dress code colours">
            <span className="swatch fuchsia" title="Fuchsia" />
            <span className="swatch emerald" title="Emerald" />
            <span className="swatch aqua-swatch" title="Aquamarine" />
            <span className="swatch purple" title="Purple" />
            <span className="swatch gold" title="Gold" />
          </div>
          <p>
            Think rhinestones, satin, metallics, mini bags and your best going-out look. More is
            more.
          </p>
          <a
            className="text-link"
            href="https://www.pinterest.com/search/pins/?q=y2k%20party%20outfit%20glitter"
            target="_blank"
            rel="noreferrer"
          >
            dress code inspo <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="info-strip">
        <article>
          <p>parking</p>
          <h3>Parking details will be shared before the party.</h3>
        </article>
        <article>
          <p>vibes to bring</p>
          <h3>Big energy, camera-ready looks &amp; your best dance moves.</h3>
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
          <button type="submit">add my song</button>
        </form>
        <p className="song-response" aria-live="polite">
          {submittedSong ? `Added to your picks: ${submittedSong}` : "No skips allowed."}
        </p>
      </section>

      <section className="rsvp-section" id="rsvp">
        <Sparkle className="rsvp-star one" />
        <Sparkle className="rsvp-star two" />
        <p>don&apos;t miss it</p>
        <h2>
          Be there
          <br />
          <em>or be square.</em>
        </h2>
        <div className="rsvp-actions">
          <a className="primary-button dark" href="mailto:?subject=RSVP%20for%20Bethel%27s%2021st">
            RSVP for Bethel&apos;s 21st
          </a>
          <a className="secondary-button" href="#wishlist">
            view wishlist
          </a>
        </div>
        <p className="fine-print" id="wishlist">
          Wishlist link coming soon
        </p>
      </section>

      <footer>
        <a className="logo" href="#top">
          B<span>21</span>
        </a>
        <p>made for Bethel&apos;s birthday era</p>
        <p>twenty one &amp; just begun</p>
      </footer>
    </main>
  );
}