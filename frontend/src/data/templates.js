export const templates = [

    { 
        id: 'birthday-mosaic', 
        title: "Birthday Mosaic", 
        category: "birthday", 
        rating: 4.9, 
        isPremium: false, 
        img: "/assets/templates-thumbnails/birthday-mosaic.png", 
        desc: "A stunning 3D photo mosaic carousel for the perfect birthday surprise.", 
        url: "/templates/birthday/birthday-mosaic/index.html",
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
];
