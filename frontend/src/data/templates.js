export const templates = [

    { 
        id: 'birthday-mosaic', 
        title: "Birthday Mosaic", 
        category: "birthday", 
        img: "/assets/templates-thumbnails/birthday-mosaic.png", 
        desc: "A stunning 3D photo mosaic carousel for the perfect birthday surprise.", 
        url: "/templates/birthday/birthday-mosaic/index.html",
        features: [
            { emoji: "✨", text: "Stunning 3D photo mosaic carousel" },
            { emoji: "🎁", text: "Perfect for big birthday surprises" },
            { emoji: "📸", text: "Display 5 of your favorite photos" }
        ],
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
        id: 'chic-compliment', 
        title: "Chic Compliment", 
        category: "compliment", 
        img: "/assets/templates-thumbnails/chic-compliment.png", 
        desc: "A beautiful, premium template for someone special.", 
        url: "/templates/compliment/chic-compliment/index.html",
        features: [
            { emoji: "🌸", text: "Elegant and soft aesthetic design" },
            { emoji: "💌", text: "Personalized letter for someone special" },
            { emoji: "🎁", text: "Interactive gift box photo reveal" }
        ],
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
                '/templates/compliment/chic-compliment/images/gifts/gift1.jpg',
                '/templates/compliment/chic-compliment/images/gifts/gift2.jpg',
                '/templates/compliment/chic-compliment/images/gifts/gift3.jpg',
                '/templates/compliment/chic-compliment/images/gifts/gift4.jpg'
            ]
        }
    },
    { 
        id: 'pearl-glow-birthday', 
        title: "Pearl Glow Birthday", 
        category: "birthday", 
        img: "/assets/templates-thumbnails/pearl-glow-birthday.png", 
        desc: "A premium birthday template with interactive tree and holograhic photo stack.", 
        url: "/templates/birthday/pearl-glow-birthday/index.html",
        features: [
            { emoji: "🌳", text: "Interactive memory tree animation" },
            { emoji: "💎", text: "Holographic parallax photo stack" },
            { emoji: "✨", text: "Premium and modern birthday experience" }
        ],
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
        img: "/assets/templates-thumbnails/charming-proposal.png", 
        desc: "A stunning, multi-stage proposal experience with a personalized letter and memory gallery.", 
        url: "/templates/proposal/charming-proposal/index.html",
        features: [
            { emoji: "💍", text: "Multi-stage romantic proposal journey" },
            { emoji: "📖", text: "Personalized memory gallery with letter" },
            { emoji: "✨", text: "Cinematic storytelling experience" }
        ],
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
    { 
        id: 'cherry-blossom-proposal', 
        title: "Cherry Blossom Proposal", 
        category: "proposal", 
        img: "/assets/templates-thumbnails/cherry-blossom-proposal.png", 
        desc: "A breathtaking, interactive cherry blossom proposal featuring emotional transitions and a personalized cinematic letter.", 
        url: "/templates/proposal/cherry-blossom-proposal/index.html",
        features: [
            { emoji: "🌸", text: "Interactive cherry blossom romance theme" },
            { emoji: "📖", text: "Fully customizable transitions and letter" },
            { emoji: "📸", text: "Floating memory polaroids with captions" }
        ],
        schema: [
            {
                id: 'font_set',
                type: 'select',
                label: 'Font Theme',
                options: [
                    { label: 'Cinematic Premium (Cormorant & Allura)', value: 'set1' },
                    { label: 'Dreamy Luxury (Playfair & Great Vibes)', value: 'set2' },
                    { label: 'Soft Ghibli (DM Serif & Parisienne)', value: 'set3' }
                ],
                stateKey: 'selectedFontSet'
            },
            {
                id: 'transition_texts',
                type: 'text-list',
                label: 'Transition Texts',
                description: 'Customize the 5 romantic buildup lines before the letter.',
                count: 5,
                stateKey: 'transitionTexts'
            },
            {
                id: 'letter_header',
                type: 'text',
                label: 'Letter Header',
                placeholder: 'e.g. FROM YASH✨',
                stateKey: 'letterHeader'
            },
            {
                id: 'letter_body',
                type: 'textarea',
                label: 'Letter Body',
                placeholder: 'Type your romantic message...',
                stateKey: 'letterBody'
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
                id: 'photo_captions',
                type: 'text-list',
                label: 'Photo Captions',
                description: 'Add a beautiful caption for each of the 4 photos.',
                count: 4,
                stateKey: 'captions'
            }
        ],
        defaults: {
            selectedFontSet: 'set1',
            transitionTexts: [
                "I never meant to fall this hard.",
                "you became my favorite thought.",
                "you’ve been living in my mind rent free.",
                "my heart already chose you. 💞",
                "there’s something I need to tell you. 🌸"
            ],
            letterHeader: "FROM YASH✨",
            letterBody: "Somewhere between our random conversations,\nthe little shared smiles, and the moments\nI kept replaying in my head...\n\nYou quietly became my favorite person.\nI didn't plan for it, but I’m so glad it happened.\nEvery day with you feels like a beautiful dream\nI never want to wake up from.\n\nI've kept these words inside for so long,\nwaiting for the right moment to tell you.\nBut then I realized, there's no perfect time—\nonly the time we have right now.",
            images: [
                '/templates/proposal/cherry-blossom-proposal/memory1.png',
                '/templates/proposal/cherry-blossom-proposal/memory2.png',
                '/templates/proposal/cherry-blossom-proposal/memory3.png',
                '/templates/proposal/cherry-blossom-proposal/memory4.png'
            ],
            captions: [
                "this smile >>> 🌸",
                "fav moment. 💞",
                "blurry but i love it ✨",
                "my comfort person 💖"
            ]
        }
    },
    { 
        id: 'imperial-friendship', 
        title: "Imperial Friendship", 
        category: "friendship", 
        img: "/assets/templates-thumbnails/imperial-friendship.png", 
        desc: "A premium friendship template with a personalized letter and memory gallery.", 
        url: "/templates/friendship/imperial-friendship/index.html",
        features: [
            { emoji: "🤝", text: "Celebrate your bond with a unique letter" },
            { emoji: "📸", text: "Interactive memory album with captions" },
            { emoji: "✨", text: "Clean and modern typography" }
        ],
        schema: [
            {
                id: 'font_set',
                type: 'select',
                label: 'Font Theme',
                options: [
                    { label: 'Modern & Clean', value: 'set1' },
                    { label: 'Elegant & Classic (Serif)', value: 'set2' },
                    { label: 'Playful & Personal (Script)', value: 'set3' },
                    { label: 'Compact & Tech (Space Mono)', value: 'set4' }
                ],
                stateKey: 'selectedFontSet'
            },
            {
                id: 'letter_header',
                type: 'text',
                label: 'Letter Header',
                placeholder: 'e.g. Dear Friend,',
                stateKey: 'letterHeader'
            },
            {
                id: 'letter_body',
                type: 'textarea',
                label: 'Letter Body',
                placeholder: 'Type your message...',
                stateKey: 'letterBody',
                maxLength: 400
            },
            {
                id: 'nickname',
                type: 'text',
                label: 'Your Nickname',
                placeholder: 'e.g. Sid',
                stateKey: 'nickname'
            },
            {
                id: 'friendship_photos',
                type: 'image-gallery',
                label: 'Memory Photos',
                description: 'Upload 4 photos for the memory gallery.',
                maxCount: 4,
                stateKey: 'images'
            },
            {
                id: 'photo_captions',
                type: 'text-list',
                label: 'Photo Captions',
                description: 'Add a caption for each of the 4 photos.',
                count: 4,
                stateKey: 'captions'
            },
            {
                id: 'memory_words',
                type: 'text',
                label: 'Memory Words',
                placeholder: 'e.g. Still one of my favorite moments with you.',
                stateKey: 'memoryWords'
            }
        ],
        defaults: {
            selectedFontSet: 'set1',
            letterHeader: 'Dear Friend,',
            letterBody: "I still have no idea how I've survived your terrible jokes and endless drama.\n\nFrom our stupid fights to roasting each other relentlessly, it's been pure chaos.\n\nBut honestly? You're the most annoying person I know, yet somehow, my absolute favorite.\n\nSo here's a little trip down memory lane to remind you of the beautiful mess we've made together.",
            nickname: 'Sid',
            captions: [
                "Summer Nights & Laughter ♡",
                "Best Friends Forever ♡",
                "Memories We Made ♡",
                "Always By My Side ♡"
            ],
            memoryWords: '“Still one of my favorite moments with you.”',
            images: [
                '/templates/friendship/imperial-friendship/images/1.jpg',
                '/templates/friendship/imperial-friendship/images/2.jpg',
                '/templates/friendship/imperial-friendship/images/3.jpg',
                '/templates/friendship/imperial-friendship/images/4.jpg'
            ]
        }
    },
    { 
        id: 'missing-motif', 
        title: "Missing Motif", 
        category: "miss-you", 
        img: "/assets/templates-thumbnails/missing-motif.png", 
        desc: "A moody, emotional template with interactive fog-wiping and polaroid memories.", 
        url: "/templates/miss-you/missing-motif/index.html",
        features: [
            { emoji: "🌧️", text: "Moody and emotional rainy window theme" },
            { emoji: "🪟", text: "Interactive fog-wipe memory reveal" },
            { emoji: "🎞️", text: "Polaroid-style nostalgia gallery" }
        ],
        schema: [
            {
                id: 'memory_photos',
                type: 'image-gallery',
                label: 'Memory Photos',
                description: 'Upload 4 photos for the memory gallery.',
                maxCount: 4,
                stateKey: 'images'
            },
            {
                id: 'photo_captions',
                type: 'text-list',
                label: 'Photo Captions',
                description: 'Add a caption for each of the 4 photos.',
                count: 4,
                stateKey: 'captions'
            },
            {
                id: 'letter_header',
                type: 'text',
                label: 'Letter Header',
                placeholder: 'e.g. Dear my love,',
                stateKey: 'letterHeader'
            },
            {
                id: 'letter_body',
                type: 'textarea',
                label: 'Letter Body',
                placeholder: 'Type your message...',
                stateKey: 'letterBody'
            },
            {
                id: 'outro_line1',
                type: 'text',
                label: 'Outro Line 1',
                placeholder: 'e.g. I miss you every day.',
                stateKey: 'outroLine1'
            },
            {
                id: 'outro_line2',
                type: 'text',
                label: 'Outro Line 2',
                placeholder: 'e.g. I want to see you soon.',
                stateKey: 'outroLine2'
            },
            {
                id: 'outro_final',
                type: 'text',
                label: 'Final Outro',
                placeholder: 'e.g. I love you so much.',
                stateKey: 'outroFinal'
            },
            {
                id: 'sender_name',
                type: 'text',
                label: 'Complimentary Close',
                placeholder: 'e.g. — Yours forever',
                stateKey: 'senderName'
            }
        ],
        defaults: {
            recipientName: "Hey... are you there?",
            images: [
                '/templates/miss-you/missing-motif/images/memory1.png',
                '/templates/miss-you/missing-motif/images/memory2.png',
                '/templates/miss-you/missing-motif/images/memory3.png',
                '/templates/miss-you/missing-motif/images/memory4.png',
            ],
            captions: [
                "I remember this day so well.",
                "I miss your beautiful smile.",
                "I wish we were together right now.",
                "Every memory of you makes me happy.",
            ],
            letterHeader: "Dear my love,",
            letterBody: "I am sitting here alone and thinking about you. I really wish you were here with me right now. I miss everything about you—your voice, your smile, and how you hold my hand. \n\nBeing away from you is very hard. The days feel so long and quiet without you. I am just waiting for the day when we can meet again.\n\nI just wanted to tell you that I think about you all the time. No matter how far we are, you are the only one in my heart. I miss you so much.\n\nI love you.",
            outroLine1: "I miss you every day.",
            outroLine2: "I want to see you soon.",
            outroFinal: "I love you so much.",
            senderName: "— Yours forever"
        }
    },
    { 
        id: 'heartfelt-remembrance', 
        title: "Heartfelt Remembrance", 
        category: "anniversary", 
        img: "/assets/templates-thumbnails/heartfelt-remembrance.png", 
        desc: "A beautiful, cinematic anniversary memory website crafted with love.", 
        url: "/templates/anniversary/heartfelt-remembrance/index.html",
        features: [
            { emoji: "💖", text: "Cinematic romantic memory timeline" },
            { emoji: "🎡", text: "Interactive Spin-the-Wheel activity picker" },
            { emoji: "💌", text: "Heartfelt typing letters and memories" }
        ],
        schema: [
            {
                id: 'font_set',
                type: 'select',
                label: 'Font Theme',
                options: [
                    { label: 'Romantic & Playful (Cormorant & Dancing)', value: 'set1' },
                    { label: 'Luxury & Romance (Playfair & Great Vibes)', value: 'set2' },
                    { label: 'Soft & Whimsical (EB Garamond & Alex Brush)', value: 'set3' },
                    { label: 'Vintage Poet (Baskerville & Petit Script)', value: 'set4' }
                ],
                stateKey: 'selectedFontSet'
            },
            {
                id: 'partner_name',
                type: 'text',
                label: 'Partner Name',
                placeholder: 'e.g. My Love',
                stateKey: 'partnerName'
            },
            {
                id: 'anniversary_date',
                type: 'text',
                label: 'Anniversary Date',
                placeholder: 'e.g. May 14, 2025',
                stateKey: 'anniversaryDate'
            },
            {
                id: 'moments_count',
                type: 'text',
                label: 'Total Moments Count',
                placeholder: 'e.g. 1432',
                stateKey: 'moments'
            },
            {
                id: 'timeline_photos',
                type: 'image-gallery',
                label: 'Timeline Photos',
                description: 'Upload 3 photos for the memory timeline.',
                maxCount: 3,
                stateKey: 'timelineImages'
            },
            {
                id: 'mem_dates',
                type: 'text-list',
                label: 'Memory Dates',
                description: 'Enter dates for the 3 memories.',
                count: 3,
                stateKey: 'memDates'
            },
            {
                id: 'mem_headlines',
                type: 'text-list',
                label: 'Memory Headlines',
                description: 'Enter headlines for the 3 memories.',
                count: 3,
                stateKey: 'memHeadlines'
            },
            {
                id: 'mem_subtexts',
                type: 'text-list',
                label: 'Memory Subtexts',
                description: 'Enter subtexts for the 3 memories.',
                count: 3,
                stateKey: 'memSubtexts'
            },
            {
                id: 'mem_bottom_texts',
                type: 'text-list',
                label: 'Memory Bottom Texts',
                description: 'Enter bottom texts for the 3 memories.',
                count: 3,
                stateKey: 'memBottomTexts'
            },
            {
                id: 'final_letter',
                type: 'text-list',
                label: 'Final Typing Letter',
                description: 'Enter the 7 typing lines.',
                count: 7,
                stateKey: 'finalLetter'
            }
        ],
        defaults: {
            selectedFontSet: 'set1',
            partnerName: 'My Love',
            anniversaryDate: 'May 14, 2025',
            moments: '1432',
            timelineImages: [
                '/templates/anniversary/heartfelt-remembrance/memory1.png',
                '/templates/anniversary/heartfelt-remembrance/memory2.png',
                '/templates/anniversary/heartfelt-remembrance/memory3.png'
            ],
            memDates: [
                '17 JULY 2024',
                '15 AUGUST 2024',
                '23 SEPTEMBER 2024'
            ],
            memHeadlines: [
                'We were strangers here.',
                'A beautiful moment.',
                'You laughed.'
            ],
            memSubtexts: [
                'Neither of us knew\nthis would become home.',
                'Time stood still when we\nwere together.',
                'And suddenly,\neverything felt lighter.'
            ],
            memBottomTexts: [
                'Little did we know,\nit was the beginning of everything 🤍',
                'A day to remember forever 🤍',
                'The beginning of my favorite place.'
            ],
            finalLetter: [
                'Thank you',
                'for turning ordinary time',
                'into something I never wanted to lose.',
                'For every small moment.',
                'For every difficult one too.',
                "I'd choose this story again.",
                'Every single time.'
            ]
        }
    }
];
