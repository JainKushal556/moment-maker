import { useEffect, useRef } from 'react'
import '../../styles/socialProof.css'

// 100+ messages with emoji, text, rating
const proofs = [
  { emoji: "🥺", text: "Made my mom cry happy tears!", rating: 5 },
  { emoji: "🔥", text: "Best surprise ever!", rating: 5 },
  { emoji: "💖", text: "Beautiful experience.", rating: 4 },
  { emoji: "🎂", text: "Best birthday memory.", rating: 5 },
  { emoji: "✨", text: "Pure magic.", rating: 5 },
  { emoji: "🚀", text: "Next level idea.", rating: 5 },
  { emoji: "😭", text: "So emotional!", rating: 5 },
  { emoji: "💌", text: "Better than a letter.", rating: 4 },
  { emoji: "🎉", text: "Everyone loved it!", rating: 5 },
  { emoji: "🥳", text: "So fun to send!", rating: 4 },
  { emoji: "❤️", text: "My girlfriend adored it.", rating: 5 },
  { emoji: "🌟", text: "Feels really special.", rating: 5 },
  { emoji: "😢", text: "My sister cried for 10 minutes. Thank you!", rating: 5 },
  { emoji: "🍰", text: "The birthday wish arrived exactly at midnight. Chills!", rating: 5 },
  { emoji: "🎈", text: "We used it for our anniversary – both of us were in tears.", rating: 5 },
  { emoji: "📸", text: "Took screenshots and shared with the whole family. Perfect.", rating: 5 },
  { emoji: "🐶", text: "Even my dog seemed happy! 😂", rating: 4 },
  { emoji: "🌮", text: "Made a taco-themed wish, my friend lost it!", rating: 5 },
  { emoji: "🏆", text: "Best website ever. I'm coming back for every occasion.", rating: 5 },
  { emoji: "🎓", text: "Graduation wish – he said it was better than the diploma.", rating: 5 },
  { emoji: "👵", text: "My grandma called me crying (happy) for an hour.", rating: 5 },
  { emoji: "💍", text: "I surprised my fiancée with this. She said YES (again).", rating: 5 },
  { emoji: "👶", text: "New parents loved the baby wish. So creative.", rating: 4 },
  { emoji: "🎁", text: "Better than any physical gift. Really personal.", rating: 5 },
  { emoji: "🕯️", text: "Simple, beautiful, heartfelt. Exactly what I needed.", rating: 5 },
  { emoji: "🌹", text: "Sent to my wife while I was away – she felt so close.", rating: 5 },
  { emoji: "☕", text: "Morning surprise for my best friend. She cried into her coffee.", rating: 5 },
  { emoji: "🍕", text: "Pizza-themed birthday wish – hilarious and touching.", rating: 4 },
  { emoji: "🎮", text: "My gamer boyfriend loved the pixel style. So cool.", rating: 5 },
  { emoji: "📚", text: "For a book lover – perfect quotes inside.", rating: 4 },
  { emoji: "✈️", text: "Long distance relationship saver. Feels like we're together.", rating: 5 },
  { emoji: "⏳", text: "Memories that will last forever. Thank you.", rating: 5 },
  { emoji: "💫", text: "Short but so meaningful. Five stars.", rating: 5 },
  { emoji: "🎼", text: "Added a song – she listened 20 times in a row.", rating: 5 },
  { emoji: "🎨", text: "Handmade feel but digital. I'm not crafty, so this is perfect.", rating: 4 },
  { emoji: "🍀", text: "Good luck wish before her exam – she aced it!", rating: 5 },
  { emoji: "🏡", text: "Sent to my parents who live far away. They printed it out.", rating: 5 },
  { emoji: "🐱", text: "My cat-loving friend said it was the best gift ever.", rating: 5 },
  { emoji: "🍁", text: "Autumn-themed wish for Thanksgiving. Stunning.", rating: 4 },
  { emoji: "🎄", text: "Christmas morning surprise. Whole family loved it.", rating: 5 },
  { emoji: "🥂", text: "New year wish – we all watched it at midnight.", rating: 5 },
  { emoji: "💕", text: "Crush got emotional. Now we're dating! :)", rating: 5 },
  { emoji: "👯", text: "Sent to my bestie – she immediately called me.", rating: 5 },
  { emoji: "🧁", text: "Sweet and cute, just like my friend. She adored it.", rating: 4 },
  { emoji: "🍩", text: "Donut-themed inside jokes – we died laughing.", rating: 5 },
  { emoji: "🏅", text: "For my marathon runner brother – motivational and touching.", rating: 5 },
  { emoji: "🎯", text: "Exactly what I wanted to say but couldn't put into words.", rating: 5 },
  { emoji: "🔮", text: "Magical experience. My daughter believed in fairies again.", rating: 5 },
  { emoji: "🌊", text: "Beach vibe for a summer birthday. Made her miss the ocean less.", rating: 4 },
  { emoji: "🏔️", text: "Mountain-themed wish for the adventurer. So fitting.", rating: 5 },
  { emoji: "🍂", text: "Autumn lover here – the design was perfect.", rating: 5 },
  { emoji: "🌺", text: "Tropical surprise – felt like a vacation.", rating: 4 },
  { emoji: "🍉", text: "Fun summer wish, very refreshing!", rating: 4 },
  { emoji: "🥑", text: "Avocado themed because she's obsessed. She screamed.", rating: 5 },
  { emoji: "🧸", text: "Childhood memories – made us both nostalgic.", rating: 5 },
  { emoji: "🎠", text: "Fairytale vibe, my daughter wants one every day now.", rating: 5 },
  { emoji: "🦄", text: "Unicorn magic! So colorful and happy.", rating: 5 },
  { emoji: "🐉", text: "For the fantasy lover – epic.", rating: 4 },
  { emoji: "🤖", text: "Robot theme for tech geek – he loved the details.", rating: 5 },
  { emoji: "👽", text: "Alien themed – out of this world!", rating: 5 },
  { emoji: "🕸️", text: "Halloween wish – spooky and sweet.", rating: 4 },
  { emoji: "🧛", text: "Vampire diary style – she laughed so hard.", rating: 5 },
  { emoji: "🎃", text: "Halloween bday – perfect vibe.", rating: 5 },
  { emoji: "🍬", text: "Candy theme – sweet tooth approved.", rating: 4 },
  { emoji: "🍭", text: "Lollipop dreams – super cute.", rating: 5 },
  { emoji: "🍫", text: "Chocolate lover's dream. Yum.", rating: 4 },
  { emoji: "🧁", text: "Cupcake surprise – adorable.", rating: 5 },
  { emoji: "🍦", text: "Ice cream themed – made her smile.", rating: 5 },
  { emoji: "☀️", text: "Bright and sunny – just like her.", rating: 5 },
  { emoji: "🌧️", text: "Rainy day wish – poetic and beautiful.", rating: 5 },
  { emoji: "⛄", text: "Winter wonderland – magical.", rating: 5 },
  { emoji: "❄️", text: "Snowflake delicate – she teared up.", rating: 5 },
  { emoji: "🌸", text: "Cherry blossom – elegant.", rating: 5 },
  { emoji: "🌿", text: "Green nature theme – calming.", rating: 4 },
  { emoji: "🍃", text: "Fresh and simple – very zen.", rating: 4 },
  { emoji: "🌻", text: "Sunflower happy – she planted it in her heart.", rating: 5 },
  { emoji: "🌵", text: "Desert vibes – unique and cool.", rating: 4 },
  { emoji: "🌴", text: "Tropical paradise – felt like a trip.", rating: 5 },
  { emoji: "🍋", text: "Lemon themed – sour then sweet.", rating: 4 },
  { emoji: "🍊", text: "Orange you glad I sent this? He laughed.", rating: 5 },
  { emoji: "🍇", text: "Wine country theme – classy.", rating: 5 },
  { emoji: "🍓", text: "Strawberry fields forever.", rating: 5 },
  { emoji: "🍒", text: "Cherry on top – wonderful.", rating: 5 },
  { emoji: "🥝", text: "Kiwi fun – unexpected.", rating: 4 },
  { emoji: "🥥", text: "Coconut vibe – tropical.", rating: 4 },
  { emoji: "🍍", text: "Pineapple under the sea – spongebob fan loved it.", rating: 5 },
  { emoji: "🍑", text: "Peach perfect – she blushed.", rating: 5 },
  { emoji: "🍐", text: "Pear shaped love – quirky.", rating: 4 },
  { emoji: "🍎", text: "Apple of my eye – teacher loved it.", rating: 5 },
  { emoji: "📖", text: "Storybook style – he reads it every night.", rating: 5 },
  { emoji: "🎥", text: "Movie themed – popcorn included!", rating: 5 },
  { emoji: "📺", text: "TV show reference – she got it immediately.", rating: 5 },
  { emoji: "📻", text: "Old radio style – nostalgic.", rating: 4 },
  { emoji: "💿", text: "CD case design – 90s kid cried.", rating: 5 },
  { emoji: "📼", text: "VHS tape – retro perfection.", rating: 5 },
  { emoji: "🎮", text: "Gameboy style – he played it (emotionally).", rating: 5 },
  { emoji: "🕹️", text: "Arcade theme – high score for romance.", rating: 5 },
  { emoji: "🧩", text: "Puzzle piece – completed our friendship.", rating: 5 },
  { emoji: "♟️", text: "Chess themed – strategic love.", rating: 4 },
  { emoji: "🎲", text: "Dice and games – fun night in.", rating: 4 },
  { emoji: "🏀", text: "Basketball hoop – he shot and scored.", rating: 5 },
  { emoji: "⚽", text: "Soccer fever – goal!", rating: 5 },
  { emoji: "🏈", text: "Football themed – touchdown!", rating: 5 },
  { emoji: "⚾", text: "Baseball wish – home run.", rating: 5 },
  { emoji: "🎾", text: "Tennis love – 40-love.", rating: 4 },
  { emoji: "🏐", text: "Volleyball spike – awesome.", rating: 4 },
  { emoji: "🏉", text: "Rugby rough – but sweet.", rating: 5 },
]

const firstNames = [
  "Alex", "Jordan", "Taylor", "Casey", "Sam", "Morgan", "Riley", "Avery", "Quinn",
  "Emma", "Liam", "Olivia", "Noah", "Sophia", "Jackson", "Mia", "Lucas", "Amelia",
  "Ethan", "Isabella", "James", "Charlotte", "Benjamin", "Mason", "Ella", "Oliver",
]

const locations = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Austin, TX", "Miami, FL",
  "Seattle, WA", "Denver, CO", "Boston, MA", "Portland, OR", "San Francisco, CA",
  "London, UK", "Toronto, CA", "Sydney, AU", "Berlin, DE", "Paris, FR",
  "Tokyo, JP", "Mexico City, MX", "São Paulo, BR", "Cape Town, ZA", "Mumbai, IN",
  "Dublin, IE", "Amsterdam, NL", "Barcelona, ES", "Rome, IT", "Stockholm, SE",
]

const colors = [
  "#fef08a", "#bfdbfe", "#fbcfe8", "#bbf7d0",
  "#fed7aa", "#e0e7ff", "#fae8ff", "#ffe6e6",
]

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createNoteData(data) {
  const name = randomItem(firstNames)
  const location = randomItem(locations)
  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating)
  const emojiSize = 1.8 + Math.random() * 0.6

  const isMobile = window.innerWidth <= 600
  const textLength = data.text.length
  let baseWidth = 190 + Math.floor(Math.random() * 90)
  
  if (isMobile) {
    baseWidth = 110 + Math.floor(Math.random() * 30)
  }

  if (textLength > 40) baseWidth += 20
  else if (textLength > 25) baseWidth += 10
  
  const width = isMobile ? Math.min(150, baseWidth) : Math.min(300, baseWidth)

  const vPadding = 1.0 + Math.random() * 0.6
  const hPadding = 1.2 + Math.random() * 0.8
  
  // Constrain positioning on mobile — bias strongly to the left
  const leftRange = isMobile ? 40 : 88
  const topRange = isMobile ? 70 : 86
  
  const left = isMobile 
    ? (2 + Math.random() * leftRange)   // start from 2% so notes lean left
    : (2 + Math.random() * leftRange)
  const top = 2 + Math.random() * topRange
  const rotation = -12 + Math.random() * 24
  const color = randomItem(colors)
  const fontSize = isMobile
    ? (Math.random() > 0.5 ? '0.85rem' : '0.75rem')
    : (Math.random() > 0.7 ? '1.4rem' : '1.2rem')

  return {
    ...data,
    name,
    location,
    stars,
    emojiSize,
    width,
    vPadding,
    hPadding,
    left,
    top,
    rotation,
    color,
    fontSize,
    id: Math.random().toString(36).slice(2),
  }
}

export default function SocialProof() {
  const wallRef = useRef(null)
  const notesRef = useRef([])
  const intervalRef = useRef(null)

  function renderNotes() {
    const wall = wallRef.current
    if (!wall) return

    const isMobile = window.innerWidth <= 600
    const wallWidth = wall.clientWidth
    const wallHeight = wall.clientHeight

    wall.innerHTML = ''
    for (const n of notesRef.current) {
      const note = document.createElement('div')
      note.className = 'note'
      note.setAttribute('data-note-id', n.id)
      note.setAttribute('tabindex', '0')
      note.setAttribute('aria-label',
        `${n.rating} star review: ${n.text} by ${n.name} from ${n.location}`)

      note.innerHTML = `
        <div style="font-size: ${n.emojiSize}rem; margin-bottom: 4px;">${n.emoji}</div>
        <div style="font-size: ${n.fontSize};">${n.text}</div>
        <div class="stars">${n.stars}</div>
        <div class="attribution">— ${n.name}, ${n.location}</div>
      `

      note.style.background = n.color
      note.style.padding = `${n.vPadding}rem ${n.hPadding}rem`
      note.style.transform = `rotate(${n.rotation}deg)`

      if (isMobile) {
        // Pixel-safe logic for mobile (guaranteed to stay inside)
        const noteWidth = n.width
        const noteHeight = 160 // Conservative estimate for note height
        
        const rotBuffer = 40 // Extra space for rotated corners
        const maxLeft = Math.max(10, wallWidth - noteWidth - rotBuffer)
        const maxTop = Math.max(10, wallHeight - noteHeight - rotBuffer)
        
        // Use a more balanced distribution
        const safeLeft = 10 + Math.floor(Math.random() * maxLeft)
        const safeTop = 10 + Math.floor(Math.random() * maxTop)
        
        note.style.left = safeLeft + 'px'
        note.style.top = safeTop + 'px'
        note.style.width = noteWidth + 'px'
      } else {
        note.style.left = n.left + '%'
        note.style.top = n.top + '%'
        note.style.width = n.width + 'px'
      }

      wall.appendChild(note)
    }
  }

  useEffect(() => {
    const wall = wallRef.current
    if (!wall) return

    // Create initial notes based on screen size
    const isMobile = window.innerWidth <= 600
    const count = isMobile ? 6 : 12
    const initialNotes = []
    for (let i = 0; i < count; i++) {
      const data = randomItem(proofs)
      const noteData = createNoteData(data)
      initialNotes.push(noteData)
    }
    notesRef.current = initialNotes
    renderNotes()

    // Subtle refresh: replace one note every 3.5s
    intervalRef.current = setInterval(() => {
      const notes = notesRef.current
      if (notes.length === 0) return

      const removeIndex = Math.floor(Math.random() * notes.length)

      // Fade out old
      const oldEl = wall.querySelector(`[data-note-id="${notes[removeIndex].id}"]`)
      if (oldEl) {
        oldEl.style.opacity = '0'
        oldEl.style.transition = 'opacity 0.5s ease'
      }

      setTimeout(() => {
        // Create new array state
        const newData = randomItem(proofs)
        const newNote = createNoteData(newData)
        const updated = [...notesRef.current]
        updated.splice(removeIndex, 1, newNote)
        notesRef.current = updated
        
        // Targeted DOM update to avoid scroll stutter from full re-render
        if (oldEl) oldEl.remove()
        
        const noteEl = document.createElement('div')
        noteEl.className = 'note'
        noteEl.setAttribute('data-note-id', newNote.id)
        noteEl.setAttribute('tabindex', '0')
        noteEl.setAttribute('aria-label', `${newNote.rating} star review: ${newNote.text} by ${newNote.name} from ${newNote.location}`)

        noteEl.innerHTML = `
          <div style="font-size: ${newNote.emojiSize}rem; margin-bottom: 4px;">${newNote.emoji}</div>
          <div style="font-size: ${newNote.fontSize};">${newNote.text}</div>
          <div class="stars">${newNote.stars}</div>
          <div class="attribution">— ${newNote.name}, ${newNote.location}</div>
        `

        noteEl.style.background = newNote.color
        noteEl.style.padding = `${newNote.vPadding}rem ${newNote.hPadding}rem`
        noteEl.style.transform = `rotate(${newNote.rotation}deg)`
        noteEl.style.opacity = '0'

        // Pixel-safe positioning on mobile (all axes)
        const isMobile = window.innerWidth <= 600
        if (isMobile) {
          const wallWidth = wall.clientWidth
          const wallHeight = wall.clientHeight
          const noteWidth = newNote.width
          const noteHeight = 160
          
          const rotBuffer = 40
          const maxLeft = Math.max(10, wallWidth - noteWidth - rotBuffer)
          const maxTop = Math.max(10, wallHeight - noteHeight - rotBuffer)
          
          const safeLeft = 10 + Math.floor(Math.random() * maxLeft)
          const safeTop = 10 + Math.floor(Math.random() * maxTop)
          
          noteEl.style.left = safeLeft + 'px'
          noteEl.style.top = safeTop + 'px'
          noteEl.style.width = noteWidth + 'px'
        } else {
          noteEl.style.left = newNote.left + '%'
          noteEl.style.top = newNote.top + '%'
          noteEl.style.width = newNote.width + 'px'
        }

        wall.appendChild(noteEl)

        // Fade in new
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              noteEl.style.opacity = '1'
            })
        })
      }, 500)
    }, 3500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="social-proof-wrapper">
      <section className="social-proof">
        <h2>Real Reactions From Real Wishes</h2>
        <p>Thousands of people are already creating unforgettable moments.</p>

        <div
          className="wall"
          id="wall"
          ref={wallRef}
          role="region"
          aria-label="Dynamic sticky notes with customer testimonials. Each note shows an emoji, message, star rating, and name with location."
        />


        {/* Hidden list for screen readers */}
        <ul className="sr-only" id="testimonial-list">
          <li>5 stars: Made my mom cry happy tears! — Alex, Chicago</li>
          <li>5 stars: Best surprise ever! — Jordan, London</li>
          <li>4 stars: Beautiful experience. — Taylor, Austin</li>
        </ul>
      </section>
    </div>
  )
}
