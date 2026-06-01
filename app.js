/*
================================================================
   PEBBLES NFT COLLECTION - CUSTOM GALLERY INTERACTIONS JS
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- Audio Synthesis Engine (Web Audio API) ---
  // Plays tactile sound effects without external audio files
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play a soft, organic "plop" sound for simple interactions
  function playPlopSound(freqStart = 260, freqEnd = 80, duration = 0.15) {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback not fully supported/initialized by browser policy.", e);
    }
  }


  // --- Sticky Navigation Scroll Effect ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // --- Googly Eye-Tracking System ---
  // Tracks mouse cursor and rotates/translates pupils realistically
  const eyeL = document.getElementById('eye-left');
  const eyeR = document.getElementById('eye-right');
  const pupilL = document.getElementById('pupil-left');
  const pupilR = document.getElementById('pupil-right');

  const logoPupilL = document.getElementById('logo-pupil-l');
  const logoPupilR = document.getElementById('logo-pupil-r');

  // Calculates and sets pupil translation
  function trackEye(eye, pupil, mouseX, mouseY, maxDist = 12) {
    if (!eye || !pupil) return;

    // Get the center of the eye boundary rect
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + (eyeRect.width / 2);
    const eyeCenterY = eyeRect.top + (eyeRect.height / 2);

    // Get delta vector from eye center to mouse cursor
    const dx = mouseX - eyeCenterX;
    const dy = mouseY - eyeCenterY;

    // Get angle and distance
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(maxDist, Math.hypot(dx, dy) / 15); // scaled sensitivity

    // Calculate translation coordinates
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    pupil.style.transform = `translate(${tx}px, ${ty}px)`;
  }

  // Handle cursor moves
  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Large Hero Pebble
    trackEye(eyeL, pupilL, mouseX, mouseY, 14);
    trackEye(eyeR, pupilR, mouseX, mouseY, 14);

    // Mini Navigation Logo Pebble (tighter distance constraints)
    trackEye(document.querySelector('.logo-icon'), logoPupilL, mouseX, mouseY, 2);
    trackEye(document.querySelector('.logo-icon'), logoPupilR, mouseX, mouseY, 2);
  });


  // --- Gallery Filtering Engine ---
  const galleryFilterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.pebble-card');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      playPlopSound(250, 180, 0.1);
      
      // Update active filter style
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter gallery elements
      galleryCards.forEach(card => {
        const cardBg = card.getAttribute('data-background');
        if (filterValue === 'all' || cardBg === filterValue) {
          card.style.display = 'block';
          // Force reflow and subtle animated opacity
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Bind audio triggers for header CTA, main buttons, and gallery links
  const clickSoundElements = document.querySelectorAll('.nav-link a, .btn, .opensea-nav-btn');
  clickSoundElements.forEach(el => {
    el.addEventListener('click', () => {
      playPlopSound(300, 150, 0.12);
    });
  });

  // Bind audio contexts trigger on initial page interactions (necessary to unlock Audio Policy)
  const unlockAudioTriggers = ['click', 'touchstart', 'mousedown'];
  unlockAudioTriggers.forEach(evtType => {
    document.body.addEventListener(evtType, () => {
      initAudio();
    }, { once: true });
  });

});
