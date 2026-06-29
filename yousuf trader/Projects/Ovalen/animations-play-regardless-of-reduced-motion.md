---
name: animations-play-regardless-of-reduced-motion
description: For the ovalen site the user wants animations to play even though their device has Reduced Motion ON
metadata: 
  node_type: memory
  type: feedback
  originSessionId: ea65dff7-0c68-451c-ab6e-60537b83fc42
---

The user develops with **Reduced Motion enabled** on their Windows device, but wants the ovalen site's animations to **play fully anyway** (they repeatedly asked "why don't I see the animation?" and "I need this kind of smooth revealing").

**Why:** It's an animation-showcase landing page (an "award-winning" Dribbble recreation); the animations are the point, and the user previews on a reduced-motion machine.

**How to apply:** For this project, do NOT gate scroll/entrance animations on `prefers-reduced-motion`. The GSAP `[[Copy]]` text reveal already ignores it. The Framer `Reveal`/`MaskReveal` and `SmoothScroll` (Lenis) still fall back to fade/native-scroll under reduced motion — offer to make those play their full effect too so the experience is consistent. If accessibility matters later, revisit, but the user's stated preference is full motion. Related: [[reveal-clip-path-deadlock]].
