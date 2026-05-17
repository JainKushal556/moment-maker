// ═══════════════════════════════════════════════════
//  PERSONALISE YOUR ANNIVERSARY WEBSITE HERE
//  Edit this file with your real dates, names, content
// ═══════════════════════════════════════════════════

export const CONFIG = {

  // ── Anniversary date ───────────────────────────
  anniversaryDate: 'May 14, 2025',   // Change to your real date
  moments: 1432,
  partnerName: 'My Love',            // Change to her name

  // ── Quiz gate ─────────────────────────────────
  quizOptions: ['First Date', 'First Hug', 'Anniversary', 'First Kiss'],
  quizCorrect: 'Anniversary',        // Must match one option exactly

  // ── Memory Timeline ───────────────────────────
  // Add/edit your 3 memories here
  memories: [
    {
      date: '17 JULY 2024',          // Change to your real date
      headline: 'We were strangers here.',
      subtext: 'Neither of us knew\nthis would become home.',
      bottomText: 'Little did we know,\nit was the beginning of everything 🤍',
      hasImage: true,                // Set false if no image for this memory
      imagePath: '/templates/anniversary/heartfelt-remembrance/memory1.png',     // Replaced null with the image
    },
    {
      date: '15 AUGUST 2024',          // Change to your real date
      headline: 'A beautiful moment.',
      subtext: 'Time stood still when we\nwere together.',
      bottomText: 'A day to remember forever 🤍',
      hasImage: true,                // Set false if no image for this memory
      imagePath: '/templates/anniversary/heartfelt-remembrance/memory2.png',
    },
    {
      date: '23 SEPTEMBER 2024',     // Change to your real date
      headline: 'You laughed.',
      subtext: 'And suddenly,\neverything felt lighter.',
      bottomText: 'The beginning of my favorite place.',
      hasImage: true,
      imagePath: '/templates/anniversary/heartfelt-remembrance/memory3.png',     // Replaced with the second image
    },
  ],

  // ── Spin the Wheel ────────────────────────────
  spinSegments: [
    { label: 'Shopping', emoji: '🛍️', content: '' },
    { label: 'Dinner',   emoji: '🥂', content: '' },
    { label: 'Luck',     emoji: '🙈', content: '' },
    { label: 'Movie',    emoji: '🍿', content: '' },
    { label: 'Special',  emoji: '🐎', content: '' },
    { label: 'Gift',     emoji: '🎁', content: '' },
  ],

  // ── Final typing letter ────────────────────────
  // Each string is one line. Empty string = blank line pause.
  finalLetter: [
    'Thank you',
    'for turning ordinary time',
    'into something I never wanted to lose.',
    '',
    'For every small moment.',
    'For every difficult one too.',
    '',
    "I'd choose this story again.",
    'Every single time.',
  ],
};
