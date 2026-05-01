export const templates = [

    { 
        id: 'birthday-mosaic', 
        title: "Birthday Mosaic", 
        category: "birthday", 
        rating: 4.9, 
        isPremium: false, 
        img: "/assets/templates-thumbnails/birthday-mosaic.png", 
        desc: "A stunning 3D photo mosaic carousel for the perfect birthday surprise.", 
        url: "/templates/birthday/birthday-mosaic/main.html",
        schema: [
            {
                id: 'recipient_name',
                type: 'text',
                label: 'Birthday Person Name',
                placeholder: 'e.g. Rashmii',
                stateKey: 'recipientName'
            },
            {
                id: 'birthday_message',
                type: 'textarea',
                label: 'Birthday Wish',
                placeholder: 'Enter your heartfelt message here...',
                stateKey: 'personalMessage'
            },
            {
                id: 'mosaic_photos',
                type: 'image-gallery',
                label: 'Mosaic Photos',
                description: 'Upload 5 photos for the 3D mosaic carousel.',
                maxCount: 5,
                stateKey: 'images'
            }
        ],
        defaults: {
            recipientName: 'Rashmii',
            personalMessage: 'Remember, you deserve every happiness in the world. Celebrate big and enjoy every moment!',
            images: [
                '/templates/birthday/birthday-mosaic/images/r1.png',
                '/templates/birthday/birthday-mosaic/images/r2.png',
                '/templates/birthday/birthday-mosaic/images/r3.png',
                '/templates/birthday/birthday-mosaic/images/r4.png',
                '/templates/birthday/birthday-mosaic/images/r5.jpg'
            ]
        }
    },
    { 
        id: 'chic-complement', 
        title: "Chic Complement", 
        category: "special", 
        rating: 5.0, 
        isPremium: false, 
        img: "/assets/templates-thumbnails/chic-complement.png", 
        desc: "A beautiful, premium template for someone special.", 
        url: "/templates/special/chic-complement/main.html",
        schema: [
            {
                id: 'font_set',
                type: 'select',
                label: 'Font Theme',
                options: [
                    { label: 'Elegant & Modern', value: 'set1' },
                    { label: 'Playful & Soft', value: 'set2' },
                    { label: 'Classic & Hand-drawn', value: 'set3' }
                ],
                stateKey: 'selectedFontSet'
            },
            {
                id: 'gift_photos',
                type: 'image-gallery',
                label: 'Gift Photos',
                description: 'Upload 4 photos for the gift boxes.',
                maxCount: 4,
                stateKey: 'images'
            },
            {
                id: 'letter_header',
                type: 'text',
                label: 'Letter Header',
                placeholder: 'e.g. To My Cutest Girl,',
                stateKey: 'letterHeader'
            },
            {
                id: 'letter_body',
                type: 'textarea',
                label: 'Letter Body',
                placeholder: 'Type your message...',
                stateKey: 'letterBody'
            }
        ],
        defaults: {
            selectedFontSet: 'set1',
            letterHeader: 'To My Cutest Girl,',
            letterBody: "I just want to say this… you look really beautiful 💖 Your smile is honestly my favorite thing 😊 There’s something so cute and soft about you that I can’t explain 🌸 The way you smile, the way you look… it just stays in my mind ✨ You make everything feel a little better just by being you 💫 I don’t say this enough, but you’re really special to me ❤️",
            images: [
                '/templates/special/chic-complement/images/gifts/gift1.jpg',
                '/templates/special/chic-complement/images/gifts/gift2.jpg',
                '/templates/special/chic-complement/images/gifts/gift3.jpg',
                '/templates/special/chic-complement/images/gifts/gift4.jpg'
            ]
        }
    },
    { 
        id: 'pearl-glow-birthday', 
        title: "Pearl Glow Birthday", 
        category: "birthday", 
        rating: 4.8, 
        isPremium: false, 
        img: "/assets/templates-thumbnails/pearl-glow-birthday.png", 
        desc: "A premium birthday template with interactive tree and holograhic photo stack.", 
        url: "/templates/birthday/pearl-glow-birthday/main.html",
        schema: [
            {
                id: 'font_set',
                type: 'select',
                label: 'Font Theme',
                options: [
                    { label: 'Playful & Sweet', value: 'set1' },
                    { label: 'Modern Premium', value: 'set2' },
                    { label: 'Romantic Classic', value: 'set3' },
                    { label: 'Fun & Energetic', value: 'set4' }
                ],
                stateKey: 'selectedFontSet'
            },
            {
                id: 'looks_photos',
                type: 'image-gallery',
                label: 'Ur Look Photos',
                description: 'Upload 4 photos for the holographic parallax stack.',
                maxCount: 4,
                stateKey: 'images'
            },
            {
                id: 'letter_header',
                type: 'text',
                label: 'Letter Header',
                placeholder: 'e.g. To My Queen...',
                stateKey: 'letterHeader'
            },
            {
                id: 'letter_body',
                type: 'textarea',
                label: 'Letter Body',
                placeholder: 'Type your message...',
                stateKey: 'letterBody'
            }
        ],
        defaults: {
            selectedFontSet: 'set1',
            letterHeader: 'To My Queen...',
            letterBody: "Just like this tree blossomed from a small heart, your love has grown into something more beautiful than I ever imagined.\n\nEvery leaf on this tree represents a sweet memory we've shared. You are my greatest adventure.",
            images: [
                '/templates/birthday/pearl-glow-birthday/images/1.jpg',
                '/templates/birthday/pearl-glow-birthday/images/2.jpg',
                '/templates/birthday/pearl-glow-birthday/images/3.jpg',
                '/templates/birthday/pearl-glow-birthday/images/4.jpg'
            ]
        }
    },
    { 
        id: 'charming-proposal', 
        title: "Charming Proposal", 
        category: "proposal", 
        rating: 5.0, 
        isPremium: false, 
        img: "/assets/templates-thumbnails/charming-proposal.png", 
        desc: "A stunning, multi-stage proposal experience with a personalized letter and memory gallery.", 
        url: "/templates/proposal/charming-proposal/main.html",
        schema: [
            {
                id: 'font_set',
                type: 'select',
                label: 'Font Theme',
                options: [
                    { label: 'Classic Elegance', value: 'set1' },
                    { label: 'Modern Romance', value: 'set2' },
                    { label: 'Sweet & Whimsical', value: 'set3' },
                    { label: 'Vintage Royalty', value: 'set4' }
                ],
                stateKey: 'selectedFontSet'
            },
            {
                id: 'proposal_photos',
                type: 'image-gallery',
                label: 'Memory Photos',
                description: 'Upload 4 photos for the memory gallery.',
                maxCount: 4,
                stateKey: 'images'
            },
            {
                id: 'letter_body',
                type: 'textarea',
                label: 'Letter Body',
                placeholder: 'Type your message...',
                stateKey: 'letterBody',
                maxLength: 340
            },
            {
                id: 'location_name',
                type: 'text',
                label: 'Location of Date',
                placeholder: 'e.g. Taj Hotel',
                stateKey: 'locationName'
            }
        ],
        defaults: {
            selectedFontSet: 'set1',
            letterBody: "In your smile, I find my home. You are the first thing I think of when I wake up and the last before I fall asleep. You are my peace, my joy, and the soul I always searched for.\n\nEvery moment with you is a gift I promise to never take for granted. Thank you for being my safe place and the best part of my world. I will cherish you, always.",
            locationName: 'Taj Hotel',
            images: [
                '/templates/proposal/charming-proposal/images/memory1.png',
                '/templates/proposal/charming-proposal/images/memory2.png',
                '/templates/proposal/charming-proposal/images/memory3.png',
                '/templates/proposal/charming-proposal/images/memory4.png'
            ]
        }
    },
];
