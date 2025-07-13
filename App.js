import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Configuration ---
// This object centralizes all configurable text content for easy customization.
const appConfig = {
  hero: {
    title: "Intezaar Qabool Hai...",
    subtext: "Ek wada, 5 saal ka. Mohabbat se, rooh se.",
  },
  countdown: {
    title: "Tere lautne tak...",
    phrases: {
      years: "saal,",
      days: "yaadon se bhare din,",
      hours: "tanha raaton ke ghante,",
      minutes: "khwabon ke lamhe,",
      seconds: "be-saansein saans baaki hain...",
    },
  },
  shayari: {
    title: "Dil Ki Awaaz...",
    lines: [
      "Waqt badalta raha... par ek chehra tha jo ruk gaya.",
      "Kabhi tu yaad aaye, toh lagta hai waqt ruk gaya ho.",
      "Main nahi badla, bas din badal gaye... naam ab bhi tera hi hai.",
      "Har saans mein tera naam hai, har dhadkan mein tera ehsaas.",
      "Intezaar ki hadd nahi, bas teri aahat ka intezaar hai.",
      "Teri yaadon mein khoya rehta hoon, jaise koi gehra raaz ho.",
      "Yeh dil aaj bhi wahi hai, jahan tune chhod diya tha.",
      "Har pal tera intezaar, har lamha teri talaash.",
      "Mohabbat ki gehraiyon mein, sirf tera hi aks hai.",
      "Meri zindagi ki kitaab mein, har panna tere naam ka hai."
    ],
  },
  visualTransition: {
    text: "Agar tu laut ke aaye... toh main wahi milunga, waisa hi milunga.",
  },
  commitmentPledge: {
    quote: "Na koi aur hoga, na kabhi tha.\nBas tu hi thi, tu hi hai, tu hi rahegi.",
    signature: "— Uska intezaar jo har saans mein tujhe jeeta hai.",
  },
  footer: {
    updateText: "Updated every second. Kyunki intezaar band nahi hota.",
    credit: "Built with ❤️ by Skylord",
  },
  audio: {
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    consoleMessage: "Tujhe yaad karne ka waqt nahi guzarta...",
  },
};

// --- Custom Hooks ---

/**
 * useCountdown: Manages the live countdown logic.
 * @param {React.MutableRefObject<Date>} targetDateRef - A ref to the target Date object for the countdown.
 * @returns {Object} An object containing the remaining years, days, hours, minutes, and seconds.
 */
const useCountdown = (targetDateRef) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDateRef.current.getTime() - new Date().getTime();
      let remaining = {};

      if (difference > 0) {
        remaining = {
          years: Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25)),
          days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 365.25),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        remaining = { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [targetDateRef]);

  return timeLeft;
};

/**
 * useShayariRotation: Manages the rotation of shayari lines.
 * @param {string[]} lines - An array of shayari lines to rotate.
 * @param {number} [interval=7000] - The interval in milliseconds between shayari changes.
 * @returns {Object} An object containing the current shayari index and the current shayari line.
 */
const useShayariRotation = (lines, interval = 7000) => {
  const [currentShayariIndex, setCurrentShayariIndex] = useState(0);

  useEffect(() => {
    const shayariTimer = setInterval(() => {
      setCurrentShayariIndex((prevIndex) => (prevIndex + 1) % lines.length);
    }, interval);

    // Cleanup interval on component unmount
    return () => clearInterval(shayariTimer);
  }, [lines.length, interval]);

  return { currentShayariIndex, currentShayari: lines[currentShayariIndex] };
};

/**
 * useAudioPlayer: Handles audio playback and toggle functionality.
 * @param {string} src - The URL of the audio file.
 * @param {string} [consoleMessage] - An optional message to log to the console on mount.
 * @returns {Object} An object containing the audio ref, playing state, and toggle function.
 */
const useAudioPlayer = (src, consoleMessage) => {
  const audioRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (consoleMessage) {
      console.log(consoleMessage);
    }
  }, [consoleMessage]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        // Attempt to play audio, catch and log any errors (e.g., user gesture requirement)
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  return { audioRef, isPlayingAudio, toggleAudio };
};

/**
 * useMouseParallax: Creates a subtle parallax effect based on mouse movement.
 * @param {number} [strength=10] - The strength of the parallax effect (how much elements move).
 * @returns {Object} An object containing x and y offset values.
 */
const useMouseParallax = (strength = 10) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate offset relative to the center of the screen
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;

      const offsetX = (clientX - centerX) / centerX * strength;
      const offsetY = (clientY - centerY) / centerY * strength;

      setOffset({ x: offsetX, y: offsetY });
    };

    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength]);

  return offset;
};

// --- Components ---

/**
 * AudioPlayer Component: Handles the background audio and its toggle button.
 */
const AudioPlayer = () => {
  const { audioRef, isPlayingAudio, toggleAudio } = useAudioPlayer(appConfig.audio.src, appConfig.audio.consoleMessage);

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={appConfig.audio.src} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <motion.button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-pink-600 text-white shadow-lg hover:bg-pink-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        aria-label={isPlayingAudio ? "Pause background music" : "Play background music"}
      >
        {isPlayingAudio ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V9a1 1 0 011-1h1.586l4.707-4.707C10.923 3.647 11.5 4.013 11.5 4.707v14.586c0 .694-.577 1.06-1.207.672L5.586 15z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1V9a1 1 0 011-1h1.586l4.707-4.707C10.923 3.647 11.5 4.013 11.5 4.707v14.586c0 .694-.577 1.06-1.207.672L5.586 15zm6.414 0a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h7.586a1 1 0 011 1v6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9l-6 6M18 15l-6-6" />
          </svg>
        )}
      </motion.button>
    </>
  );
};

/**
 * BackgroundParticles Component: Renders the glowing background particles.
 */
const BackgroundParticles = () => {
  return (
    <>
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <div className="particle particle-6"></div>
      <div className="particle particle-7"></div>
      <div className="particle particle-8"></div>
    </>
  );
};

/**
 * HeroSection Component: Displays the main title and subtext with typewriter effect.
 */
const HeroSection = () => {
  const parallaxOffset = useMouseParallax(15); // Adjust parallax strength

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const typewriterVariants = {
    hidden: { width: 0 },
    visible: { width: "100%", transition: { duration: 2, ease: "linear", delay: 0.5 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8">
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-dancing text-pink-300 mb-4 drop-shadow-lg"
        initial="hidden"
        animate="visible"
        variants={textVariants}
        style={{
          x: parallaxOffset.x, // Apply parallax effect
          y: parallaxOffset.y, // Apply parallax effect
        }}
      >
        {appConfig.hero.title}
      </motion.h1>
      <motion.p
        className="text-lg md:text-2xl lg:text-3xl text-gray-300 font-caveat overflow-hidden whitespace-nowrap border-r-4 border-r-pink-500 pr-2 animate-typing"
        initial="hidden"
        animate="visible"
        variants={typewriterVariants}
        style={{ maxWidth: 'fit-content' }}
      >
        {appConfig.hero.subtext}
      </motion.p>
    </section>
  );
};

/**
 * CountdownSection Component: Displays the live countdown.
 * @param {Object} props - Component props.
 * @param {React.MutableRefObject<Date>} props.targetDateRef - A ref to the target Date object for the countdown.
 */
const CountdownSection = ({ targetDateRef }) => {
  const timeLeft = useCountdown(targetDateRef);

  const glowVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const numberVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 bg-gradient-to-tl from-[#0f0c29] to-[#302b63]">
      <motion.div
        className="border-4 border-pink-500 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm bg-white bg-opacity-5"
        variants={glowVariants}
        animate="pulse"
      >
        <h2 className="text-3xl md:text-5xl font-cinzel text-pink-200 mb-6 drop-shadow-md">
          {appConfig.countdown.title}
        </h2>
        <div className="text-xl md:text-3xl lg:text-4xl text-gray-100 font-caveat space-y-4">
          <p>
            sirf{' '}
            <motion.span key={timeLeft.years} variants={numberVariants} initial="initial" animate="animate" className="text-pink-400 text-4xl md:text-6xl font-bold">
              {timeLeft.years || 0}
            </motion.span>{' '}
            {appConfig.countdown.phrases.years}
          </p>
          <p>
            <motion.span key={timeLeft.days} variants={numberVariants} initial="initial" animate="animate" className="text-pink-400 text-4xl md:text-6xl font-bold">
              {timeLeft.days || 0}
            </motion.span>{' '}
            {appConfig.countdown.phrases.days}
          </p>
          <p>
            <motion.span key={timeLeft.hours} variants={numberVariants} initial="initial" animate="animate" className="text-pink-400 text-4xl md:text-6xl font-bold">
              {timeLeft.hours || 0}
            </motion.span>{' '}
            {appConfig.countdown.phrases.hours}
          </p>
          <p>
            <motion.span key={timeLeft.minutes} variants={numberVariants} initial="initial" animate="animate" className="text-pink-400 text-4xl md:text-6xl font-bold">
              {timeLeft.minutes || 0}
            </motion.span>{' '}
            {appConfig.countdown.phrases.minutes}
          </p>
          <p>
            aur{' '}
            <motion.span key={timeLeft.seconds} variants={numberVariants} initial="initial" animate="animate" className="text-pink-400 text-4xl md:text-6xl font-bold">
              {timeLeft.seconds || 0}
            </motion.span>{' '}
            {appConfig.countdown.phrases.seconds}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

/**
 * ShayariCarousel Component: Displays rotating shayari lines.
 */
const ShayariCarousel = () => {
  const { currentShayari } = useShayariRotation(appConfig.shayari.lines);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <h2 className="text-3xl md:text-5xl font-cinzel text-pink-200 mb-10 drop-shadow-md">
        {appConfig.shayari.title}
      </h2>
      <motion.div
        className="w-full max-w-2xl h-32 flex items-center justify-center text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentShayari}
            className="text-2xl md:text-4xl font-dancing text-gray-200 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            "{currentShayari}"
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

/**
 * VisualTransitionSection Component: Handles the moonrise and stars animation.
 */
const VisualTransitionSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#0f0c29] to-[#000000] overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        {/* Moon */}
        <motion.div
          className="moon absolute w-48 h-48 md:w-64 md:h-64 bg-gray-300 rounded-full shadow-lg"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #f0f0f0, #a0a0a0)',
            filter: 'blur(2px)'
          }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
        ></motion.div>
        {/* Stars (simple dots) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              filter: 'blur(0.5px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          ></motion.div>
        ))}
      </motion.div>
      <motion.p
        className="relative z-10 text-3xl md:text-5xl font-dancing text-pink-100 text-center px-4 leading-tight drop-shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        "{appConfig.visualTransition.text}"
      </motion.p>
    </section>
  );
};

/**
 * CommitmentPledgeSection Component: Displays the commitment quote.
 */
const CommitmentPledgeSection = () => {
  const glowVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 bg-gradient-to-tr from-[#0f0c29] to-[#2c3e50]">
      <motion.div
        className="relative p-8 md:p-12 border-4 border-pink-500 rounded-3xl shadow-2xl bg-white bg-opacity-5 max-w-3xl w-full"
        variants={glowVariants}
        animate="pulse"
      >
        <motion.blockquote
          className="text-3xl md:text-5xl font-cinzel text-pink-300 italic mb-6 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {/* Split the quote by newline to render <br> tags */}
          {appConfig.commitmentPledge.quote.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < appConfig.commitmentPledge.quote.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.blockquote>
        <motion.p
          className="text-xl md:text-2xl font-caveat text-gray-400 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {appConfig.commitmentPledge.signature}
        </motion.p>
      </motion.div>
    </section>
  );
};

/**
 * Footer Component: Displays the footer text.
 */
const Footer = () => {
  return (
    <footer className="relative py-8 px-4 text-center bg-black bg-opacity-80 text-gray-500 text-sm md:text-base">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
      >
        {appConfig.footer.updateText}
      </motion.p>
      <p className="mt-2 text-gray-600">
        {appConfig.footer.credit}
      </p>
    </footer>
  );
};

// Main App Component
const App = () => {
  // Set the target date to 5 years from today
  const targetDate = useRef(new Date());
  useEffect(() => {
    targetDate.current.setFullYear(targetDate.current.getFullYear() + 5);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#24243e] to-[#302b63] text-white font-serif overflow-hidden relative">
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />

      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          body { font-family: 'Playfair Display', serif; }
          .font-caveat { font-family: 'Caveat', cursive; }
          .font-dancing { font-family: 'Dancing Script', cursive; }
          .font-cinzel { font-family: 'Cinzel', serif; }

          /* Custom particle animation for background */
          @keyframes glow-pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }

          .particle {
            animation: glow-pulse 5s infinite ease-in-out;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            filter: blur(5px);
            position: absolute;
          }
          .particle-1 { width: 30px; height: 30px; top: 10%; left: 5%; animation-delay: 0s; }
          .particle-2 { width: 40px; height: 40px; top: 20%; right: 15%; animation-delay: 1.5s; }
          .particle-3 { width: 25px; height: 25px; bottom: 15%; left: 20%; animation-delay: 3s; }
          .particle-4 { width: 35px; height: 35px; top: 40%; left: 30%; animation-delay: 0.8s; }
          .particle-5 { width: 50px; height: 50px; bottom: 5%; right: 5%; animation-delay: 2.5s; }
          .particle-6 { width: 20px; height: 20px; top: 60%; right: 40%; animation-delay: 4s; }
          .particle-7 { width: 45px; height: 45px; top: 70%; left: 10%; animation-delay: 0.3s; }
          .particle-8 { width: 30px; height: 30px; bottom: 30%; right: 25%; animation-delay: 1s; }

          /* Custom moonrise effect */
          @keyframes moonrise {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0%); opacity: 1; }
          }
          .moon {
            animation: moonrise 3s ease-out forwards;
          }
        `}
      </style>

      <BackgroundParticles />
      <AudioPlayer />

      <HeroSection />
      <CountdownSection targetDateRef={targetDate} />
      <ShayariCarousel />
      <VisualTransitionSection />
      <CommitmentPledgeSection />
      <Footer />
    </div>
  );
};

export default App;
