# Motion System Documentation

## Philosophy
"Quiet confidence — stillness after one load moment; motion only answers user action"

## Page Load Choreography
**Target: <900ms total**

1. **PlatformMap Draw-in** (0-900ms)
   - 6 layers fade in top-to-bottom
   - Each layer: 400ms duration + staggered 150ms delay
   - Total: ~900ms (6 × 150ms = 900ms)
   - Respects `prefers-reduced-motion` (instant render)

## Interactive Motion

### Hover States
- All interactive elements: `transition: transform/opacity/color`
- Duration: 120ms (`--dur-fast`)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`)

### Mobile Tab Bar
- Hide/show on scroll: `transform: translateY()` + `opacity`
- Duration: 180ms (`--dur-base`)
- Press feedback: `scale(0.96)` on `:active`

### Collapsible Disclosures (Experience section)
- ChevronDown icon: `rotate(180deg)`
- Duration: 180ms (`--dur-base`)

## Looping Animations (Minimal)
All looping animations respect `prefers-reduced-motion`:

1. **Spinner** (loading states)
   - `animation: spin 1s linear infinite`
   - Reduced motion: `animation: none`

2. **Typing indicator** (AI chat)
   - `animation: bounce 1s ease-in-out infinite`
   - Reduced motion: `animation: none`, static `opacity: 0.6`

## Animation Rules
1. ✅ **Only animate `transform` and `opacity`** (no layout thrashing)
2. ✅ **No animations block content visibility**
3. ✅ **Single load moment** (PlatformMap), then stillness
4. ✅ **Motion responds to user action** (hover, click, scroll)
5. ✅ **Respects `prefers-reduced-motion` everywhere**
6. ✅ **No Framer Motion dependency** (saves ~88KB)

## Performance
- Target: 60fps on mid-range Android
- Use `will-change` sparingly (not implemented - animations are simple enough)
- Pause animations when tab hidden (handled by browser for CSS animations)
