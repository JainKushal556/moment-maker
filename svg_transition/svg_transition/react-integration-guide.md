# React GSAP Full-Screen SVG Transition Integration Guide

এই গাইডটির সাহায্যে আপনি ভ্যানিলা জাভাস্ক্রিপ্ট (Vanilla JS) এ তৈরি করা আমাদের SVG Full-Screen Stroke Animation-টি খুব সহজেই আপনার আগে থেকে তৈরি করা (Pre-built) React প্রোজেক্টে ইন্টিগ্রেট করতে পারবেন।

---

## 🛠 Prerequisites (যা যা লাগবে)

আপনার রিয়্যাক্ট প্রোজেক্টে GSAP প্যাকেজগুলো ইন্সটল করা থাকতে হবে। টার্মিনালে নিচের কমান্ডটি রান করুন:

```bash
npm install gsap @gsap/react
```

---

## 🎨 Step 1: CSS যোগ করা

আপনার রিয়্যাক্ট প্রোজেক্টের গ্লোবাল CSS ফাইলে (যেমন `index.css` বা `App.css`) নিচের স্টাইলগুলো যুক্ত করুন। এটি ওভারলে-টাকে ফিক্সড করে পুরো স্ক্রিন জুড়ে রাখবে।

```css
/* Viewport SVG Overlay Styles */
.viewport-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9000;
  pointer-events: none; /* যাতে পেছনের কোনো এলিমেন্টে ক্লিক করতে সমস্যা না হয় */
  overflow: hidden;
}

.viewport-overlay .overlay-stroke {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(2.5);
  width: 100%;
  height: 100%;
}

.viewport-overlay svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 💻 Step 2: React Component (লজিক এবং রেন্ডার)

আপনার যে ফাইলে ন্যাভবার (Navbar) আছে, সেই ফাইলে নিচের লজিকগুলো অ্যাপ্লাই করুন। এখানে `useRef` দিয়ে পাথগুলো ধরা হয়েছে এবং `@gsap/react` এর `useGSAP` হুক ব্যবহার করা হয়েছে।

```jsx
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// আপনার যদি আলাদা CSS ফাইল থাকে, সেটা ইমপোর্ট করে নেবেন
// import './App.css'; 

const YourPreBuiltNavbarComponent = () => {
  // 1. রিফারেন্স তৈরি করুন
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);

  // 2. GSAP Environment ডিক্লেয়ার করুন
  const { contextSafe } = useGSAP();

  // 3. ট্রানজিশন ফাংশন (contextSafe দিয়ে র‍্যাপ করা)
  const triggerTransition = contextSafe((colors) => {
    const paths = [path1Ref.current, path2Ref.current];
    if (!paths[0] || !paths[1]) return;

    gsap.killTweensOf(paths);

    // Initial SVG Setup
    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      const color = colors[index] || colors[0];
      
      gsap.set(path, { 
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
        stroke: color,
        strokeWidth: 20 // Note: React uses camelCase
      });
    });

    const tl = gsap.timeline();

    // Phase 1: Screen Fill Animation
    paths.forEach((path) => {
      tl.to(path, {
        strokeDashoffset: 0,
        strokeWidth: 650,
        duration: 1.2,
        ease: "power2.out",
      }, 0);
    });

    // Phase 2: Exit Forward Animation
    paths.forEach((path) => {
      const length = path.getTotalLength();
      tl.to(path, {
        strokeDashoffset: -length, 
        strokeWidth: 20,
        duration: 2,
        ease: "power2.inOut",
      }, 1.3); // Starts right after Phase 1 ends
    });
  });

  return (
    <>
      {/* --- আপনার আগে থেকে থাকা ন্যাভবার --- */}
      <nav className="my-navbar">
        {/* জাস্ট আপনার বাটনগুলোতে onClick যুক্ত করে দিন */}
        <button onClick={() => triggerTransition(["#FE5E41", "#d5ababff"])}>
          Home
        </button>
        <button onClick={() => triggerTransition(["#6E44FF", "#d59fdfff"])}>
          About
        </button>
        <button onClick={() => triggerTransition(["#39e6d0", "#88e7d3ff"])}>
          Contact
        </button>
      </nav>

      {/* --- SVG ওভারলে (কম্পোনেন্টের একদম নিচে বসাবেন) --- */}
      <div className="viewport-overlay">
        <div className="overlay-stroke">
          <svg viewBox="0 0 2453 2535" fill="none" preserveAspectRatio="none">
            {/* Path 1 */}
            <path 
              ref={path1Ref} 
              d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Path 2 */}
            <path 
              ref={path2Ref} 
              d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default YourPreBuiltNavbarComponent;
```

---

## 📌 Important Notes (জরুরি কিছু বিষয়)

1. **CamelCase Attributes**: রিয়্যাক্টে HTML অ্যাট্রিবিউটগুলো লেখার সময় `stroke-linecap` এর বদলে `strokeLinecap` এবং `stroke-width` এর বদলে `strokeWidth` লিখতে হবে (CSS-এ আগের মতোই হাইফেন থাকবে)। 
2. **contextSafe**: GSAP-এর ইভেন্ট লিসেনার বা `onClick` ফাংশনের ভেতরে অ্যানিমেশন কল করার সময় সব সময় `contextSafe(...)` হুক ব্যবহার করবেন। এতে কম্পোনেন্ট আনমাউন্ট হওয়ার সময় মেমোরি লিক (Memory leak) বা আনএক্সপেক্টেড বিহেভিয়ার হবে না।
3. **SVG Positioning**: SVG-এর কোডটা আপনার কম্পোনেন্টের রিটার্ন ব্লকে একদম নিচের দিকে রাখবেন (footer বা main content-এর বাইরে), যাতে এটা পুরো ওয়েবসাইটের ওপরে লেয়ার হিসেবে কাজ করে।
