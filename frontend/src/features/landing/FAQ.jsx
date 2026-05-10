import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../../styles/faq.css'

gsap.registerPlugin(ScrollTrigger)

const faqData = [
  {
    question: "What is Moment Crafter?",
    answer: "Moment Crafter is a platform that lets you create beautiful, interactive, and personalized digital greetings for every occasion—birthdays, holidays, confessions, and more. Each greeting is a unique, shareable web experience."
  },
  {
    question: "Is it free to use?",
    answer: "Yes! You can create and share basic greetings completely free. We also offer premium templates and effects for those who want to go the extra mile with their celebrations."
  }
]

const alsoAskedData = [
  { question: "Can I add my own music?", answer: "Absolutely! You can upload your own audio files or choose from our curated music library to set the perfect mood for your greeting." },
  { question: "How do I share my greeting?", answer: "Once you're happy with your creation, hit 'Share' to get a unique link. You can send it via any messaging app, email, or social media. The recipient simply opens the link in their browser—no app needed." },
  { question: "Can I edit after sharing?", answer: "Yes! Your greeting remains editable. Any changes you make will be reflected in real-time for anyone who opens the link." }
]

export default function FAQ() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return
    const sectionEl = sectionRef.current
    if (!sectionEl) return

    const ctx = gsap.context(() => {


      // FAQ items
      const faqItems = document.querySelectorAll('.faq-item')
      faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question')
        const answer = item.querySelector('.faq-answer')
        if (question) gsap.fromTo(question, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: question, start: 'top 88%', end: 'top 20%', toggleActions: 'play reverse play reverse' } })
        if (answer) gsap.fromTo(answer, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: answer, start: 'top 92%', end: 'top 20%', toggleActions: 'play reverse play reverse' } })
      })

      // Also asked title
      const alsoTitle = document.querySelector('.faq-also-asked-title')
      if (alsoTitle) gsap.fromTo(alsoTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: alsoTitle, start: 'top 90%', end: 'top 20%', toggleActions: 'play reverse play reverse' } })

      // Also asked pills
      const alsoPills = document.querySelectorAll('.faq-also-question')
      alsoPills.forEach((pill) => {
        gsap.fromTo(pill, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: pill, start: 'top 90%', end: 'top 20%', toggleActions: 'play reverse play reverse', onLeave: () => closeAlsoAnswer(pill), onLeaveBack: () => closeAlsoAnswer(pill) } })
      })

      function closeAlsoAnswer(pill) {
        const parent = pill.closest('.faq-also-item')
        if (!parent) return
        const answer = parent.querySelector('.faq-also-answer')
        const wrapper = parent.querySelector('.faq-also-answer-wrapper')
        if (!answer || !wrapper || !answer.classList.contains('is-open')) return
        
        gsap.killTweensOf(answer)
        gsap.killTweensOf(wrapper)
        
        gsap.to(answer, { scale: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut' })
        gsap.to(wrapper, { height: 0, duration: 0.5, ease: 'power3.inOut', onComplete: () => {
            answer.style.display = 'none'
            answer.classList.remove('is-open')
        }})
      }


    }, sectionEl)

    return () => ctx.revert()
  }, [])

  return (
    <section className="faq-section" ref={sectionRef}>
      <div className="faq-heading-block">
        <p className="faq-subtitle">Got questions? We've got answers.</p>
        <h2 className="faq-main-title">FAQ</h2>
      </div>

      <div className="faq-items">
        {faqData.map((item, i) => (
          <div key={i} className="faq-item">
            <div className="faq-question">{item.question}</div>
            <div className="faq-answer">
              {item.answer}
              <div className="faq-answer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-also-asked-section">
        <h3 className="faq-also-asked-title">People also asked</h3>
        <div className="faq-also-asked-list">
          {alsoAskedData.map((item, i) => (
            <div key={i} className="faq-also-item">
              <div 
                className="faq-also-question"
                onClick={(e) => {
                  const parent = e.currentTarget.closest('.faq-also-item')
                  const answer = parent?.querySelector('.faq-also-answer')
                  const wrapper = parent?.querySelector('.faq-also-answer-wrapper')
                  if (!answer || !wrapper) return
                  const isOpen = answer.classList.contains('is-open')
                  if (isOpen) {
                    gsap.to(answer, { scale: 0, opacity: 0, duration: 0.5, ease: 'power3.inOut' })
                    gsap.to(wrapper, { height: 0, duration: 0.5, ease: 'power3.inOut', onComplete: () => { 
                      answer.style.display = 'none'; 
                      answer.classList.remove('is-open') 
                    }})
                  } else {
                    answer.style.display = 'block'; 
                    answer.classList.add('is-open')
                    
                    gsap.set(wrapper, { height: 'auto' })
                    const targetHeight = wrapper.offsetHeight
                    gsap.set(wrapper, { height: 0 })
                    
                    gsap.to(wrapper, { height: targetHeight, duration: 0.5, ease: 'power3.out', onComplete: () => { gsap.set(wrapper, { height: 'auto' }) } })
                    gsap.fromTo(answer, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' })
                  }
                }}
              >
                {item.question}
              </div>
              <div className="faq-also-answer-wrapper" style={{ height: 0, display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className="faq-also-answer">
                  {item.answer}
                  <div className="faq-answer-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
