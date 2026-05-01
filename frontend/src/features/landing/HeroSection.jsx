import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../../styles/hero.css'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const heroRef = useRef(null)
  const headerRef = useRef(null)
  const subtitleRef = useRef(null)
  const iconContainerRef = useRef(null)
  const iconsRef = useRef([])
  const clonedIconsRef = useRef([])
  const idleIntervalRef = useRef(null)
  const isScrollAnimatingRef = useRef(false)
  const pillDataRef = useRef([])
  const finalTargetSizeRef = useRef(60)
  const initialIconSizeRef = useRef(100)
  const placeholdersCacheRef = useRef({})

  useLayoutEffect(() => {
    let initPillData = () => {}
    let stopIdleAnimation = () => {}
    let stopBubbles = () => {}
    let heroObs = null

    const removeClonedIcons = () => {
      clonedIconsRef.current.forEach((clone) => clone.remove())
      clonedIconsRef.current = []
    }

    const ctx = gsap.context(() => {
    const heroSection = heroRef.current
    const headerBlock = headerRef.current
    const headlineH2 = headerBlock?.querySelector('h2')
    const subtitle = subtitleRef.current
    const iconContainer = iconContainerRef.current
    let icons = Array.from(iconContainer?.querySelectorAll('.icon') || [])
    const textSegments = Array.from(heroSection?.querySelectorAll('.text-segment') || [])
    const placeholders = Array.from(heroSection?.querySelectorAll('.placeholder') || [])
    const dotGridBg = document.getElementById('dot-grid-bg')

    if (!heroSection || !headerBlock || !subtitle || !iconContainer) return

    // Randomize text segment reveal order
    let randomizedTextOrder = textSegments.map((segment, index) => ({ element: segment, originalIndex: index }))
    randomizedTextOrder.sort(() => Math.random() - 0.5)

    // Responsive scale calc
    const samplePlaceholder = heroSection?.querySelector('.placeholder')

    initPillData = function initPillDataFn() {
      if (samplePlaceholder) {
        finalTargetSizeRef.current = Math.max(35, samplePlaceholder.getBoundingClientRect().width)
      } else {
        finalTargetSizeRef.current = (window.innerWidth <= 1000) ? 35 : 60
      }
      if (icons.length === 0) return
      pillDataRef.current = []
      const currentSize = icons[0].offsetWidth || 100
      initialIconSizeRef.current = currentSize
      const targetScale = finalTargetSizeRef.current / currentSize
      const containerCenterX = window.innerWidth / 2

      const oldTransforms = icons.map(icon => icon.style.transform)
      icons.forEach(icon => icon.style.transform = 'none')

      icons.forEach((icon, i) => {
        const rect = icon.getBoundingClientRect()
        const currentCenterX = rect.left + rect.width / 2
        const targetCenterX = containerCenterX + (i - 2) * finalTargetSizeRef.current * 1.0
        pillDataRef.current.push({ targetX: targetCenterX - currentCenterX, targetScale })
      })

      icons.forEach((icon, i) => icon.style.transform = oldTransforms[i])
    }

    window.addEventListener('resize', initPillData)
    setTimeout(initPillData, 100)

    // Entrance Animations
    const entranceTL = gsap.timeline({ delay: 0.3 })
    entranceTL.to(headerBlock, { opacity: 1, duration: 0.01, ease: 'none' }, 0)
    entranceTL.fromTo(headlineH2, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.15)
    entranceTL.fromTo(subtitle, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.45)
    entranceTL.to(icons, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'back.out(1.7)', onComplete: () => startIdleAnimation() }, 0.5)

    // Idle Animation
    stopIdleAnimation = function stopIdleAnimationFn() {
      if (idleIntervalRef.current) { clearInterval(idleIntervalRef.current); idleIntervalRef.current = null }
    }

    function startIdleAnimation() {
      stopIdleAnimation()
      idleIntervalRef.current = setInterval(() => {
        if (window.scrollY > 10 || isScrollAnimatingRef.current) return
        function groupDelay(index, baseDelay) {
          if (index === 0) return 0
          if (index <= 2) return baseDelay
          return baseDelay * 2
        }
        icons.forEach((icon, index) => {
          gsap.to(icon, { scale: 0, duration: 0.4, delay: groupDelay(index, 0.12), ease: 'power2.inOut', overwrite: 'auto' })
        })
        setTimeout(() => {
          if (window.scrollY > 10 || isScrollAnimatingRef.current) {
            gsap.to(icons, { scale: 1, duration: 0.4, overwrite: 'auto' })
            return
          }
          let elements = Array.from(iconContainer.children)
          for (let i = elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elements[i], elements[j]] = [elements[j], elements[i]]
          }
          elements.forEach(el => iconContainer.appendChild(el))
          icons = Array.from(iconContainer.querySelectorAll('.icon'))
          iconsRef.current = icons
          initPillData()
          icons.forEach((icon, index) => {
            gsap.to(icon, { scale: 1, duration: 0.8, delay: groupDelay(index, 0.25), ease: 'back.out(1.6)', overwrite: 'auto' })
          })
        }, 800)
      }, 4000)
    }

    // Helper
    function getIconSize() {
      return initialIconSizeRef.current
    }

    // Soap Bubbles
    const EMOJIS = ['💕', '🎂', '🎉']
    const MAX_BUBBLES = 5
    let bubbleInterval = null
    window.bubblesActive = true

    function createSoapBubble() {
      if (!window.bubblesActive) return
      const bubble = document.createElement('div')
      bubble.className = 'soap-bubble'
      const size = Math.round(Math.random() * 20 + 36)
      bubble.style.width = size + 'px'
      bubble.style.height = size + 'px'
      bubble.style.fontSize = Math.round(size * 0.45) + 'px'
      bubble.style.left = Math.random() * 80 + 10 + '%'
      bubble.style.top = '100%'
      const dx = Math.round(Math.random() * 360 - 180)
      bubble.style.setProperty('--dx', dx + 'px')
      const duration = (Math.random() * 8 + 12).toFixed(2) + 's'
      bubble.style.animationDuration = duration
      bubble.style.animationDelay = Math.random() * 3 + 's'
      bubble.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      bubble.addEventListener('animationend', () => { if (bubble.parentNode) bubble.parentNode.removeChild(bubble) })
      bubble.addEventListener('click', (e) => {
        e.stopPropagation()
        if (bubble.classList.contains('popping')) return
        bubble.classList.add('popping')
        bubble.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out'
        bubble.style.transform = 'scale(1.15)'
        bubble.style.opacity = '0'
        const rect = bubble.getBoundingClientRect()
        for (let i = 0; i < 10; i++) {
          const p = document.createElement('div')
          p.className = 'bubble-blast-particle'
          p.style.left = rect.left + rect.width / 2 + 'px'
          p.style.top = rect.top + rect.height / 2 + 'px'
          const angle = Math.random() * Math.PI * 2
          const dist = 40 + Math.random() * 60
          const tx = Math.cos(angle) * dist
          const ty = Math.sin(angle) * dist
          heroSection.appendChild(p)
          requestAnimationFrame(() => {
            p.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1), opacity 420ms linear'
            p.style.transform = `translate(${tx}px, ${ty}px) scale(0.2)`
            p.style.opacity = '0'
          })
          setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p) }, 500)
        }
        setTimeout(() => { if (bubble.parentNode) bubble.parentNode.removeChild(bubble) }, 100)
      })
      heroSection.appendChild(bubble)
    }

    function ensureBubbles() {
      if (!window.bubblesActive) return
      const current = heroSection.querySelectorAll('.soap-bubble').length
      const toCreate = Math.max(0, MAX_BUBBLES - current)
      for (let i = 0; i < toCreate; i++) setTimeout(createSoapBubble, i * 600)
    }

    function startBubbles() {
      if (bubbleInterval) return
      for (let i = 0; i < MAX_BUBBLES; i++) setTimeout(createSoapBubble, i * 400)
      bubbleInterval = setInterval(ensureBubbles, 3500)
    }

    stopBubbles = function stopBubblesFn() {
      if (bubbleInterval) { clearInterval(bubbleInterval); bubbleInterval = null }
    }

    heroObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && window.bubblesActive) startBubbles()
        else stopBubbles()
      })
    }, { threshold: 0 })
    heroObs.observe(heroSection)
    startBubbles()

    // Main ScrollTrigger
    let isPastBoundary = false
    const scrollTrigger = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: '+=380%',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onLeave: () => { 
        // Scrub lag means onUpdate might fire after onLeave. 
        // We will remove them and also set a flag so onUpdate doesn't re-create them.
        isPastBoundary = true
        removeClonedIcons()
      },
      onLeaveBack: () => { 
        isPastBoundary = true
        removeClonedIcons()
      },
      onEnter: () => { isPastBoundary = false },
      onEnterBack: () => { isPastBoundary = false },
      onUpdate: (self) => {
        if (isPastBoundary) return // Prevent scrub lag from re-creating icons
        const progress = self.progress
        window.bubblesActive = progress < 0.18



        if (progress > 0.01) {
          stopIdleAnimation()
          icons.forEach(icon => gsap.set(icon, { scale: 1 }))
        } else if (!idleIntervalRef.current) {
          startIdleAnimation()
        }

        function ensureClonesExist() {
          if (clonedIconsRef.current.length === 0) {
            const currentIconSize = getIconSize()
            let centerY = -window.innerHeight / 2 + 7 + currentIconSize / 2
            iconContainer.style.transform = `translateY(${centerY}px) scale(1)`
            if (pillDataRef.current.length === icons.length) {
              icons.forEach((icon, index) => {
                icon.style.transform = `translate(${pillDataRef.current[index].targetX}px, 0px) scale(${pillDataRef.current[index].targetScale})`
              })
            }
            
            // PRE-CACHE PLACEHOLDERS
            placeholders.forEach(p => {
              const rect = p.getBoundingClientRect()
              placeholdersCacheRef.current[p.dataset.target] = { top: rect.top, left: rect.left }
            })
            icons.forEach((icon, index) => {
              let clone = icon.cloneNode(true)
              clone.classList.add('hero-clone')
              const iconRect = icon.getBoundingClientRect()
              const scaledSize = iconRect.width || finalTargetSizeRef.current
              clone.style.position = 'fixed'
              clone.style.width = `${scaledSize}px`
              clone.style.height = `${scaledSize}px`
              clone.style.display = 'flex'
              clone.style.opacity = '1'
              clone.style.transform = 'scale(1)'
              clone.style.zIndex = '50'
              clone.style.top = `${iconRect.top}px`
              clone.style.left = `${iconRect.left}px`
              clone.dataset.startX = `${iconRect.left}`
              clone.dataset.startY = `${iconRect.top}`
              clone.dataset.startSize = `${scaledSize}`
              const parent = heroSection.closest('.relative.z-10') || document.body
              parent.appendChild(clone)
              clonedIconsRef.current.push(clone)
            })
          }
        }

        // PHASE 1: Individual Staggered Rise (0% to 8%)
        if (progress <= 0.08) {
          textSegments.forEach(seg => seg.style.opacity = 0)
          isScrollAnimatingRef.current = progress > 0.01
          let moveProgress = progress / 0.08
          let headerProgress = Math.min(progress / 0.06, 1)
          headerBlock.style.opacity = 1 - headerProgress
          headerBlock.style.transform = `translate(-50%, calc(-140% - ${headerProgress * 30}px))`
          subtitle.style.opacity = 1 - headerProgress
          removeClonedIcons()
          iconContainer.style.opacity = 1
          iconContainer.style.transform = `translateY(0px) scale(1)`
          heroSection.style.backgroundColor = 'transparent'
          if (dotGridBg) dotGridBg.style.opacity = '1'
          const n = icons.length
          icons.forEach((icon, index) => {
            let segStart = index / n; let segEnd = (index + 1) / n
            let iconProgress = Math.max(0, Math.min(1, (moveProgress - segStart) / (segEnd - segStart)))
            icon.style.transform = `translateY(-${iconProgress * 100}px)`
          })
        }
        // PHASE 2: Group Rise to Center (8% to 11%)
        else if (progress > 0.08 && progress <= 0.11) {
          isScrollAnimatingRef.current = true
          let riseProgress = (progress - 0.08) / 0.03
          removeClonedIcons()
          iconContainer.style.opacity = 1
          headerBlock.style.opacity = 0; subtitle.style.opacity = 0
          heroSection.style.backgroundColor = 'transparent'
          if (dotGridBg) dotGridBg.style.opacity = '1'
          let easedRise = 1 - Math.pow(1 - riseProgress, 3)
          const currentIconSize = getIconSize()
          let centerY = -window.innerHeight / 2 + 7 + currentIconSize / 2
          iconContainer.style.transform = `translateY(${centerY * easedRise}px) scale(1)`
          icons.forEach(icon => { icon.style.transform = `translateY(${-100 * (1 - easedRise)}px)` })
        }
        // PHASE 3: Form Pill Shape at Center (11% to 25%)
        else if (progress > 0.11 && progress <= 0.25) {
          textSegments.forEach(seg => seg.style.opacity = 0)
          isScrollAnimatingRef.current = true
          let moveProgress = (progress - 0.11) / 0.14
          removeClonedIcons()
          iconContainer.style.opacity = 1
          headerBlock.style.opacity = 0; subtitle.style.opacity = 0
          if (progress >= 0.20) { heroSection.style.backgroundColor = '#f0f0f0'; if (dotGridBg) dotGridBg.style.opacity = '0' }
          else { heroSection.style.backgroundColor = 'transparent'; if (dotGridBg) dotGridBg.style.opacity = '1' }
          const currentIconSize = getIconSize()
          let centerY = -window.innerHeight / 2 + 7 + currentIconSize / 2
          iconContainer.style.transform = `translateY(${centerY}px) scale(1)`
          if (pillDataRef.current.length === icons.length) {
            icons.forEach((icon, index) => {
              let pData = pillDataRef.current[index]
              icon.style.transform = `translate(${pData.targetX * moveProgress}px, 0px) scale(${1 + (pData.targetScale - 1) * moveProgress})`
            })
          }
        }
        // PHASE 4: Pause in Pill Shape (25% to 35%)
        else if (progress > 0.25 && progress <= 0.35) {
          textSegments.forEach(seg => seg.style.opacity = 0)
          isScrollAnimatingRef.current = true
          removeClonedIcons()
          iconContainer.style.opacity = 1
          headerBlock.style.opacity = 0; subtitle.style.opacity = 0
          heroSection.style.backgroundColor = '#f0f0f0'
          if (dotGridBg) dotGridBg.style.opacity = '0'
          const currentIconSize = getIconSize()
          let centerY = -window.innerHeight / 2 + 7 + currentIconSize / 2
          iconContainer.style.transform = `translateY(${centerY}px) scale(1)`
          if (pillDataRef.current.length === icons.length) {
            icons.forEach((icon, index) => {
              let pData = pillDataRef.current[index]
              icon.style.transform = `translate(${pData.targetX}px, 0px) scale(${pData.targetScale})`
            })
          }
        }
        // PHASE 5: Scatter to Placeholders (35% to 68%)
        else if (progress > 0.35 && progress <= 0.68) {
          isScrollAnimatingRef.current = true
          let scatterProgress = (progress - 0.35) / 0.33
          heroSection.style.backgroundColor = '#f0f0f0'
          if (dotGridBg) dotGridBg.style.opacity = '0'
          iconContainer.style.opacity = 0
          ensureClonesExist()
          let easedScatterProgress = 1 - Math.pow(1 - scatterProgress, 3)
          clonedIconsRef.current.forEach((clone, index) => {
            const targetId = icons[index].dataset.id
            const placeholderRect = placeholdersCacheRef.current[targetId]
            if (!placeholderRect) return
            let originY = parseFloat(clone.dataset.startY)
            let originX = parseFloat(clone.dataset.startX)
            let originSize = parseFloat(clone.dataset.startSize)
            let targetSize = finalTargetSizeRef.current
            clone.style.top = `${originY + (placeholderRect.top - originY) * easedScatterProgress}px`
            clone.style.left = `${originX + (placeholderRect.left - originX) * easedScatterProgress}px`
            clone.style.width = `${originSize + (targetSize - originSize) * easedScatterProgress}px`
            clone.style.height = `${originSize + (targetSize - originSize) * easedScatterProgress}px`
          })
          let staggerOffset = 1 / randomizedTextOrder.length
          randomizedTextOrder.forEach((item, index) => {
            let startWindow = index * staggerOffset
            let endWindow = startWindow + staggerOffset
            item.element.style.opacity = Math.max(0, Math.min(1, (scatterProgress - startWindow) / (endWindow - startWindow)))
          })
        }
        // PHASE 6: Lock & Ensure Text Fully Visible (68% to 100%)
        else if (progress > 0.68) {
          isScrollAnimatingRef.current = true
          heroSection.style.backgroundColor = '#f0f0f0'
          if (dotGridBg) dotGridBg.style.opacity = '0'
          iconContainer.style.opacity = 0
          ensureClonesExist()
          clonedIconsRef.current.forEach((clone, index) => {
            const targetId = icons[index].dataset.id
            const placeholderRect = placeholdersCacheRef.current[targetId]
            if (!placeholderRect) return
            clone.style.top = `${placeholderRect.top}px`
            clone.style.left = `${placeholderRect.left}px`
          })
          randomizedTextOrder.forEach((item) => { item.element.style.opacity = 1 })
        }
      }
    })
    }) // End of gsap.context

    return () => {
      stopIdleAnimation()
      stopBubbles()
      heroObs?.disconnect()
      window.removeEventListener('resize', initPillData)
      ctx.revert()
      removeClonedIcons()
    }
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="header-block" ref={headerRef}>
        <h2 className="hero-logo">
          <span className="moment-text">Moment</span>{' '}
          <span className="crafter-text">Crafter</span>
        </h2>
        <p className="subtitle" ref={subtitleRef}>Craft memories, not just messages.</p>
      </div>

      <div className="icon-container" ref={iconContainerRef}>
        <img className="icon icon-square" src="/icon2.svg" data-id="plane" alt="icon" />
        <img className="icon icon-square" src="/icon5.svg" data-id="envelope" alt="icon" />
        <img className="icon icon-circle" src="/icon3.svg" data-id="gift" alt="icon" />
        <img className="icon icon-square" src="/icon4.svg" data-id="cake" alt="icon" />
        <img className="icon icon-circle" src="/icon1.svg" data-id="music" alt="icon" />
      </div>

      <div className="headline">
        <div className="headline-line">
          <span className="text-segment">Your unforgettable</span>
          <div className="placeholder" data-target="cake"></div>
          <span className="text-segment">moment.</span>
        </div>
        <div className="headline-line">
          <span className="text-segment">That perfectly wrapped</span>
          <div className="placeholder" data-target="gift"></div>
          <span className="text-segment">surprise.</span>
        </div>
        <div className="headline-line">
          <span className="text-segment">Your sincere</span>
          <div className="placeholder" data-target="envelope"></div>
          <span className="text-segment">message written with care.</span>
        </div>
        <div className="headline-line">
          <span className="text-segment">And every</span>
          <div className="placeholder" data-target="music"></div>
          <span className="text-segment">memory you create and</span>
          <div className="placeholder" data-target="plane"></div>
          <span className="text-segment">share.</span>
        </div>
      </div>
    </section>
  )
}
