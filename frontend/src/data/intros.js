import Intro_GlassCard from '../../intro/glass-card/Intro_GlassCard';
import Intro_SlidingCurtains from '../../intro/sliding-curtains/Intro_SlidingCurtains';
import Intro_BubbleBurst from '../../intro/bubble-burst/Intro_BubbleBurst';
import Intro_MagicEnvelope from '../../intro/magic-envelope/Intro_MagicEnvelope';
import Intro_ScratchCard from '../../intro/scratch-card/Intro_ScratchCard';

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
    }
];

export const getIntroById = (id) => intros.find(i => i.id === id);
