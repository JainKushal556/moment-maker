export const templates = [
    { 
        id: 'romantic-proposal', 
        title: "Romantic Proposal", 
        category: "proposal", 
        rating: 5.0, 
        isPremium: true, 
        img: "https://images.unsplash.com/photo-1518199266791-5375a83191b7?w=800&q=80", 
        desc: "A beautiful, interactive, step-by-step romantic proposal experience.", 
        url: "/templates/proposal/index.html",
        schema: [
            {
                id: 'moments_gallery',
                type: 'image-gallery',
                label: 'Memory Gallery',
                description: 'Upload 4 photos that will appear in the interactive gallery.',
                maxCount: 4,
                stateKey: 'images'
            },
            {
                id: 'personal_message',
                type: 'textarea',
                label: 'Personal Letter',
                placeholder: 'Pour your heart out here... Tell them what they mean to you.',
                stateKey: 'letterContent'
            }
        ],
        defaults: {
            images: [null, null, null, null],
            letterContent: `From the moment you came into my life, everything started to change.\nYou brought colors to my ordinary days, warmth to my silence, and a happiness I didn't even know I was missing.\n\nEvery sunrise feels brighter because of you.\nEvery dream feels possible because you inspire me.\nEvery challenge feels easier because I imagine you by my side.\n\nYou are not just my friend, you're the most special part of my life.\nYou make me smile, you make my heart race, and you make me want to be a better version of myself.\n\nI don't know what the future holds, but I know one thing for sure.\nI want that future with you.`
        }
    },
];
