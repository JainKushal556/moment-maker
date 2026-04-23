import { useState, useEffect, useRef, useCallback } from 'react';
import { useCustomization } from '../context/CustomizationContext.jsx';
import Swal from 'sweetalert2';

/* ─── Sticker images ──────────────────────────────────────────────── */
const STICKERS = [
  'https://media.tenor.com/4Ijycn6xFzUAAAAj/mochi-blue-roses.gif',
  'https://feeldreams.github.io/bunga.gif',
  'https://feeldreams.github.io/pandacoklat.gif',
  'https://media.tenor.com/snFoLI-S9CQAAAAj/milk-and-mocha.gif',
  'https://feeldreams.github.io/emawh.gif',
  'https://feeldreams.github.io/pandacoklat.gif',
];
const REJECT_STICKER = 'https://feeldreams.github.io/weee.gif';

/* ─── Messages ────────────────────────────────────────────────────── */
const MSG_INIT = 'Happy Birthday, gorgeous! Today is all about celebrating you.';
const MSG_1    = 'Tap here for your birthday surprise! 🎉';
const MSG_2    = 'You shine brighter every year! ✨';
const MSG_3    = 'Do you know what makes today extra special?';
const MSG_4    = "It's your birthday!";
const MSG_5    = 'Today, I wish you a year filled with laughter, love, and unforgettable moments.';
const MSG_6    = 'Remember, you deserve every happiness in the world. Celebrate big and enjoy every moment!';

/* ─── Particle spawner ────────────────────────────────────────────── */
const EMOJIS = ['🎉','🎊','💖','🎈','✨','🌸','🍰','🎂'];

function spawnParticles(setParticles) {
  const batch = Array.from({ length: 14 }, (_, i) => ({
    id: Date.now() + i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    left: Math.random() * 100,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 1.5,
  }));
  setParticles(p => [...p, ...batch]);
  setTimeout(() => setParticles(p => p.filter(x => !batch.find(b => b.id === x.id))), 6500);
}

/* ─── Swal mixin shorthands ───────────────────────────────────────── */
const swalAuto = Swal.mixin({
  timer: 2300,
  allowOutsideClick: false,
  showConfirmButton: false,
  timerProgressBar: true,
  imageHeight: 90,
});
const swalPrompt = Swal.mixin({
  allowOutsideClick: false,
  cancelButtonColor: '#FF0040',
  imageHeight: 80,
});

/* ═══════════════════════════════════════════════════════════════════ */
export default function BirthdayLanding({ onComplete }) {
  const { recipientName, personalMessage } = useCustomization();
  const audioRef = useRef(null);

  /* ── UI Phase ─────────────────────────────────────────────────── */
  // 'gift' | 'hello' | 'chat'
  const [phase, setPhase]               = useState('gift');

  /* ── Background ───────────────────────────────────────────────── */
  const [wallScale, setWallScale]       = useState(2);
  const [overlayOp, setOverlayOp]       = useState(0);

  /* ── Gift ─────────────────────────────────────────────────────── */
  const [giftGone, setGiftGone]         = useState(false);

  /* ── Sticker ──────────────────────────────────────────────────── */
  const [stickerIdx, setStickerIdx]     = useState(0);

  /* ── Hello typewriter ─────────────────────────────────────────── */
  const [haloText, setHaloText]         = useState('');
  const [haloTyping, setHaloTyping]     = useState(false);

  /* ── Message card ─────────────────────────────────────────────── */
  const [cardVisible, setCardVisible]   = useState(false);
  const [cardText, setCardText]         = useState('');
  const [typing, setTyping]             = useState(false);
  const [opsVisible, setOpsVisible]     = useState(false);
  const [opsClickable, setOpsClickable] = useState(false);
  const [msgStep, setMsgStep]           = useState(0);

  /* ── Emojis ───────────────────────────────────────────────────── */
  const [showEmojis, setShowEmojis]     = useState(false);
  const [emojiDone, setEmojiDone]       = useState({ lv1:false,lv2:false,lv3:false,lv4:false });
  const emojiCount                      = useRef(0);

  /* ── Next button + particles ──────────────────────────────────── */
  const [showNext, setShowNext]         = useState(false);
  const [particles, setParticles]       = useState([]);

  /* ── TypeIt-style helper ──────────────────────────────────────── */
  const typeIt = useCallback((setter, text, speed = 25, cb) => {
    setTyping(true);
    setter('');
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setter(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setTyping(false);
        cb?.();
      }
    }, speed);
    return () => clearInterval(iv);
  }, []);

  const typeHalo = useCallback((text, cb) => {
    setHaloTyping(true);
    setHaloText('');
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setHaloText(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setHaloTyping(false); cb?.(); }
    }, 40);
    return () => clearInterval(iv);
  }, []);

  /* ── Card step sequencer ──────────────────────────────────────── */
  const startStep0 = useCallback(() => {
    setCardVisible(true);
    setTimeout(() => {
      typeIt(setCardText, MSG_INIT, 20, () => {
        setOpsVisible(true);
        setOpsClickable(true);
        setMsgStep(1);
      });
    }, 400);
  }, [typeIt]);

  const doStep3 = useCallback(() => {
    setWallScale(1.5);
    setShowEmojis(false);
    typeIt(setCardText, MSG_2, 30, () => {
      setTimeout(() => {
        typeIt(setCardText, MSG_3, 30, () => {
          setTimeout(doStep4, 700);
        });
      }, 400);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeIt]);

  const doStep4 = useCallback(() => {
    setWallScale(1);
    setStickerIdx(2);
    spawnParticles(setParticles);
    typeIt(setCardText, MSG_4, 52, () => {
      setMsgStep(5);
      setOpsVisible(true);
      setOpsClickable(true);
    });
    setMsgStep(4);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeIt]);

  const doStep5 = useCallback(() => {
    setWallScale(1.5);
    setStickerIdx(3);
    typeIt(setCardText, MSG_5, 52, () => {
      setMsgStep(6);
      setOpsVisible(true);
      setOpsClickable(true);
    });
    setMsgStep(5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeIt]);

  const doStep6 = useCallback(() => {
    setWallScale(1);
    setStickerIdx(4);
    typeIt(setCardText, personalMessage || MSG_6, 52, () => {
      setShowNext(true);
      setMsgStep(7);
    });
    setMsgStep(6);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeIt, personalMessage]);

  /* ── Card click ───────────────────────────────────────────────── */
  const handleCardTap = useCallback(() => {
    if (!opsClickable || typing) return;
    setOpsVisible(false);
    setOpsClickable(false);

    if (msgStep === 1) {
      setCardText(MSG_1);
      setShowEmojis(true);
    } else if (msgStep === 3) { doStep3(); }
    else if (msgStep === 5)   { doStep5(); }
    else if (msgStep === 6)   { doStep6(); }
  }, [opsClickable, typing, msgStep, doStep3, doStep5, doStep6]);

  /* ── Emoji clicks ─────────────────────────────────────────────── */
  const handleEmoji = useCallback((key) => {
    if (emojiDone[key]) return;
    setEmojiDone(p => ({ ...p, [key]: true }));
    emojiCount.current += 1;
    if (emojiCount.current === 4) {
      setStickerIdx(1);
      setTimeout(() => { setMsgStep(3); setOpsVisible(true); setOpsClickable(true); }, 300);
    }
  }, [emojiDone]);

  /* ── Gift click ───────────────────────────────────────────────── */
  const handleGift = useCallback(async () => {
    if (phase !== 'gift') return;

    // play audio
    audioRef.current?.play().catch(() => {});

    // animate gift away
    setGiftGone(true);
    setOverlayOp(0.7);
    setWallScale(1.5);

    await new Promise(r => setTimeout(r, 500));

    const name = recipientName || 'Rashmii';
    setPhase('hello');
    setOverlayOp(0);
    setWallScale(1);

    setTimeout(() => {
      typeHalo(`Happy Birthday, ${name}!`, () => {
        setTimeout(startStep0, 200);
      });
    }, 300);
  }, [phase, typeHalo, startStep0, recipientName]);

  /* ── Next button → question ───────────────────────────────────── */
  const handleNext = useCallback(async () => {
    const name = recipientName || 'Rashmii';
    const { isConfirmed } = await swalPrompt.fire({
      title: `${name}, How about we celebrate your birthday in style?`,
      text: 'Your choice is:',
      imageUrl: STICKERS[5],
      showCancelButton: true,
      confirmButtonText: "Absolutely, let's celebrate! 🎉",
      cancelButtonText: 'Maybe another time',
    });

    if (!isConfirmed) {
      await swalAuto.fire({ title: "Oops! You can't skip this birthday magic.", imageUrl: REJECT_STICKER });
    }

    await Swal.fire({ title: 'Yay!', text: 'And here comes another birthday surprise for you!', icon: 'success' });
    onComplete(name);
  }, [recipientName, onComplete]);

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="birthday-root">
      {/* Audio */}
      <audio ref={audioRef} src="./y2mate.mp3" className="hidden-audio" loop />

      {/* Floating particles */}
      {particles.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            top: '-5vh',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >{p.emoji}</span>
      ))}

      {/* Background */}
      <div className="bg-wallpaper" style={{ transform: `scale(${wallScale})` }} />
      <div className="bg-overlay"   style={{ opacity: overlayOp }} />

      <div className="content">
        {/* Gift box */}
        {!giftGone && (
          <div className="gift-container" onClick={handleGift}>
            <img className="gift-image" src="./Valentine-Surprise.png" alt="Open Gift Button" />
            <p className="gift-label">Open the gift, cutie :)</p>
          </div>
        )}

        {/* Sticker */}
        {phase !== 'gift' && (
          <div className="sticker-container">
            <img className="sticker-img" src={STICKERS[stickerIdx]} alt="Sticker" key={stickerIdx} />
          </div>
        )}

        {/* Hello text */}
        {phase !== 'gift' && (
          <p className="halo-text">
            {haloText}
            {haloTyping && <span className="typing-cursor" />}
          </p>
        )}

        {/* Message card */}
        {cardVisible && (
          <div
            className="message-card"
            onClick={handleCardTap}
            style={{ cursor: opsClickable && !typing ? 'pointer' : 'default' }}
          >
            <p>
              {cardText}
              {typing && <span className="typing-cursor" />}
            </p>

            {showEmojis && (
              <div className="emoji-row">
                {[['lv1','🎂'],['lv2','🎁'],['lv3','🥳'],['lv4','💖']].map(([k,e]) => (
                  <span
                    key={k}
                    className={`emoji-item${emojiDone[k] ? ' clicked' : ''}`}
                    onClick={ev => { ev.stopPropagation(); handleEmoji(k); }}
                  >{e}</span>
                ))}
              </div>
            )}

            <p className={`ops-label${opsVisible ? ' visible' : ''}`}>
              Tap to continue the celebration!
            </p>
          </div>
        )}

        {/* Next button */}
        {showNext && (
          <div style={{ marginTop: '10px' }}>
            <button className="next-btn" onClick={handleNext}>💌 Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
