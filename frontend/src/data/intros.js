import Intro_GlassCard from '../../intro/glass-card/Intro_GlassCard';
import Intro_SlidingCurtains from '../../intro/sliding-curtains/Intro_SlidingCurtains';
import Intro_BubbleBurst from '../../intro/bubble-burst/Intro_BubbleBurst';
import Intro_MagicEnvelope from '../../intro/magic-envelope/Intro_MagicEnvelope';
import Intro_ScratchCard from '../../intro/scratch-card/Intro_ScratchCard';

import Intro_GlassCard2 from '../../intro/glass-card/Intro_GlassCard2';
import Intro_SlidingCurtains2 from '../../intro/sliding-curtains/Intro_SlidingCurtains2';
import Intro_BubbleBurst2 from '../../intro/bubble-burst/Intro_BubbleBurst2';
import Intro_MagicEnvelope2 from '../../intro/magic-envelope/Intro_MagicEnvelope2';
import Intro_ScratchCard2 from '../../intro/scratch-card/Intro_ScratchCard2';

// Import local thumbnails
import thumbGlassCard from '../../intro/glass-card/glass-card.png';
import thumbSlidingCurtains from '../../intro/sliding-curtains/sliding-curtains.png';
import thumbBubbleBurst from '../../intro/bubble-burst/bubble-burst.png';
import thumbMagicEnvelope from '../../intro/magic-envelope/magic-envelope.png';
import thumbScratchCard from '../../intro/scratch-card/scratch-card.png';

export const intros = [
    {
        id: 'glass-card',
        title: 'Glass Card',
        component: Intro_GlassCard,
        description: 'A elegant semi-transparent card with a typing effect.',
        thumbnail: thumbGlassCard
    },
    {
        id: 'sliding-curtains',
        title: 'Sliding Curtains',
        component: Intro_SlidingCurtains,
        description: 'Stage curtains that open to reveal your special message.',
        thumbnail: thumbSlidingCurtains
    },
    {
        id: 'bubble-burst',
        title: 'Bubble Burst',
        component: Intro_BubbleBurst,
        description: 'Playful floating bubbles that pop to reveal the content.',
        thumbnail: thumbBubbleBurst
    },
    {
        id: 'magic-envelope',
        title: 'Magic Envelope',
        component: Intro_MagicEnvelope,
        description: 'A virtual envelope that opens to show a heartfelt letter.',
        thumbnail: thumbMagicEnvelope
    },
    {
        id: 'scratch-card',
        title: 'Scratch Card',
        component: Intro_ScratchCard,
        description: 'Interactive scratch-off surface for a fun surprise.',
        thumbnail: thumbScratchCard
    },
    {
        id: 'glass-card-2.0',
        title: 'Glass Card 2.0',
        component: Intro_GlassCard2,
        description: 'A elegant semi-transparent card with a typing effect (Version 2.0).',
        thumbnail: thumbGlassCard
    },
    {
        id: 'sliding-curtains-2.0',
        title: 'Sliding Curtains 2.0',
        component: Intro_SlidingCurtains2,
        description: 'Stage curtains that open to reveal your special message (Version 2.0).',
        thumbnail: thumbSlidingCurtains
    },
    {
        id: 'bubble-burst-2.0',
        title: 'Bubble Burst 2.0',
        component: Intro_BubbleBurst2,
        description: 'Playful floating bubbles that pop to reveal the content (Version 2.0).',
        thumbnail: thumbBubbleBurst
    },
    {
        id: 'magic-envelope-2.0',
        title: 'Magic Envelope 2.0',
        component: Intro_MagicEnvelope2,
        description: 'A virtual envelope that opens to show a heartfelt letter (Version 2.0).',
        thumbnail: thumbMagicEnvelope
    },
    {
        id: 'scratch-card-2.0',
        title: 'Scratch Card 2.0',
        component: Intro_ScratchCard2,
        description: 'Interactive scratch-off surface for a fun surprise (Version 2.0).',
        thumbnail: thumbScratchCard
    }
];

export const getIntroById = (id) => intros.find(i => i.id === id);
