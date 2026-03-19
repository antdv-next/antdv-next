/**
 * @file useTouchScroll.ts
 * @author lostElk
 * @license MIT
 *
 * @description
 * High-performance mobile touch scrolling engine (specifically adapted for desktop Table components)
 *
 * Business Background:
 * When using desktop Table components directly on mobile devices, native scrolling often suffers from
 * poor responsiveness, lack of inertial feedback, and synchronized header "tearing" issues.
 * This directive aims to provide a "native-grade" scrolling experience through precise touch stream
 * hijacking and physics engine simulation.
 *
 * Core Problems Solved:
 * 1. Synchronized Header Lag: Ensures table body and header render in the same frame through
 *    synchronized event dispatching, eliminating scrolling misalignment.
 * 2. Inconsistent Inertial Damping: Eliminates sliding speed differences caused by different screen
 *    refresh rates (60/120Hz), providing a unified physical damping feel.
 * 3. Touch Conflicts & Interference: Solves gesture mis-triggers and disconnections in complex
 *    nested lists through multi-finger ID tracking and edge detection.
 * 4. Mobile Compatibility: Grants desktop tables that lack touch-scroll support a smooth, native App-like interaction.
 *
 * Core Technical Features:
 * - Axis Locking: Automatically determines gesture intent and filters diagonal jitter to ensure pure scroll direction.
 * - Intelligent Edge Sensing: Detects scroll boundaries and smoothly hands control back to the browser at ends, supporting iOS slide-to-back.
 * - Physics Simulation Engine: Uses "Historical Trajectory Queue" to calculate inertia, solving scrolling anomalies caused by sampling jitter.
 * - Zero Redundancy Overhead: Built-in dirty value checking ensures rendering only triggers on position changes, maintaining fluidity.
 */

import type { ComputedRef, ShallowRef } from 'vue'
import { onBeforeUnmount, watch } from 'vue'

/**
 * Configuration options for the touch scroll
 */
export interface TableTouchScrollConfig {
  /**
   * Friction/decay rate. Higher = smoother (slower decay), lower = sharper stop.
   * Recommended range: 0.8 - 0.99
   * @default 0.95
   */
  friction?: number
  /**
   * Displacement threshold (px) before locking scroll direction, to distinguish tap vs intentional drag.
   * @default 5
   */
  dragThreshold?: number
  /**
   * Disable inertial scrolling. If true, stops immediately on finger release.
   * @default false
   */
  disableInertia?: boolean
  /**
   * Velocity threshold (px/ms) for blocking clicks after brake. Higher = looser, lower = stricter.
   * Recommended range: 0.3 - 1.0
   * @default 0.5
   */
  clickBlockThreshold?: number
  /**
   * Callback when scroll starts (after displacement exceeds dragThreshold and direction is locked).
   */
  onScrollStart?: () => void
  /**
   * Callback when scroll ends (after inertia animation fully stops).
   */
  onScrollEnd?: () => void
}

/**
 * Internal scroll engine context state.
 * Stored via WeakMap to ensure automatic garbage collection when the DOM is destroyed.
 */
interface ScrollContext {
  /** The DOM element where scrolling is performed */
  scrollEl: HTMLElement
  /** Controller: used to remove all bound event listeners at once */
  abortController: AbortController
  /** Original styles backup: used to restore initial state on unmount */
  originalStyles: Map<string, string>

  // Gesture tracking
  touchStartX: number
  touchStartY: number
  lastTouchX: number
  lastTouchY: number
  lastTouchTime: number

  // Animation and physical state
  lastFrameTime: number
  gestureDirection: 'horizontal' | 'vertical' | null
  lockedDirection: 'horizontal' | 'vertical' | null
  velocity: number // Pixels per millisecond (px/ms)
  rafId: number | null
  friction: number // Friction decay rate
  disableInertia: boolean // Whether to disable inertia
  clickBlockThreshold: number // Velocity threshold for click blocking
  dragThreshold: number // Touch move threshold

  activeTouchId: number | null // Currently tracked finger ID to prevent multi-touch coordinate jumps
  touchTracker: { time: number, x: number, y: number }[] // History trajectory queue for precise inertia calculation

  // Lifecycle callbacks
  onScrollStart?: () => void
  onScrollEnd?: () => void

  // Status flags
  isTouching: boolean
  targetScrollLeft: number
  targetScrollTop: number
  isMoved: boolean

  /**
   * Native scroll take-over flag.
   * When true, the current gesture is ignored by JS, allowing native browser behavior (e.g., swipe back or outer scroll).
   */
  isNativeScroll: boolean

  /**
   * Click interception flag.
   * When true, subsequent 'click' events will be intercepted to prevent accidental triggers during an "emergency stop".
   */
  shouldBlockClick: boolean
}

/** Physics engine default configuration */
const DEFAULT_FRICTION = 0.95 // Default friction/decay rate (lower value = higher friction)
const MIN_VELOCITY = 0.05 // Velocity threshold to stop animation
const MAX_DT = 32 // Max frame interval limit to prevent jumpy movement after frame drops
const DEFAULT_DRAG_THRESHOLD = 5 // Default drag determination threshold
const INERTIA_STOP_DELAY = 80 // Inertia protection delay: if finger pauses > 80ms, no inertia
const SAFE_CLICK_VELOCITY = 0.5 // Safe click velocity threshold for "braking"
const STYLE_PROPS = ['overflow', 'willChange', 'touchAction'] as const // List of CSS properties to hijack and restore

/**
 * Terminates animation and triggers lifecycle hooks
 * Interrupts animation and determines if click should be blocked based on velocity
 * @param ctx - Scroll context
 */
function stopAnimation(ctx: ScrollContext) {
  const hadAnimation = ctx.rafId !== null

  if (ctx.rafId) {
    cancelAnimationFrame(ctx.rafId)
    ctx.rafId = null
  }

  // Clean up internal state first
  ctx.velocity = 0
  ctx.lastFrameTime = 0

  // Trigger callback after state is "stopped"
  if (hadAnimation && ctx.onScrollEnd) {
    ctx.onScrollEnd()
  }
}

/**
 * Main animation loop: handles manual tracking phase and post-release physics simulation phase
 * Handles dual-phase state:
 * 1. Manual Tracking: position follows finger movement
 * 2. Inertial Simulation: physical damping after release
 * @param ctx - Scroll context
 */
function animationStep(ctx: ScrollContext) {
  if (!ctx.scrollEl || !ctx.lockedDirection)
    return

  const el = ctx.scrollEl
  const now = performance.now()
  // Normalize based on Delta Time to solve speed differences across refresh rates
  const rawDt = ctx.lastFrameTime ? now - ctx.lastFrameTime : 16.67
  const dt = Math.min(rawDt, MAX_DT)
  ctx.lastFrameTime = now

  let shouldContinue = false

  // Record pre-frame position for dirty checking
  const prevX = el.scrollLeft
  const prevY = el.scrollTop

  if (ctx.isTouching) {
    // Phase 1: Manual follow
    if (ctx.lockedDirection === 'horizontal')
      el.scrollLeft = ctx.targetScrollLeft
    else el.scrollTop = ctx.targetScrollTop
    shouldContinue = true
  }
  else {
    // Phase 2: Inertial simulation
    const adjustedDecay = ctx.friction ** (dt / 16.67)
    ctx.velocity *= adjustedDecay
    const delta = ctx.velocity * dt

    if (Math.abs(ctx.velocity) > MIN_VELOCITY) {
      if (ctx.lockedDirection === 'horizontal') {
        el.scrollLeft += delta
        // Continue only if position actually changed
        if (Math.abs(el.scrollLeft - prevX) > 0.1)
          shouldContinue = true
      }
      else {
        el.scrollTop += delta
        if (Math.abs(el.scrollTop - prevY) > 0.1)
          shouldContinue = true
      }
    }
  }

  // Manually dispatch scroll event to force immediate sync for external components (e.g. headers)
  // Combined with dirty checking, this fixes sync lag without excessive performance cost
  if (el.scrollLeft !== prevX || el.scrollTop !== prevY) {
    ctx.scrollEl.dispatchEvent(new Event('scroll'))
  }

  if (shouldContinue) {
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  }
  else {
    stopAnimation(ctx)
  }
}

/**
 * Handles touch start
 * Resets gesture context and initializes sync coordinates
 * Initializes tracking and active ID
 * @param e - Touch event
 * @param ctx - Scroll context
 */
function onTouchStart(e: TouchEvent, ctx: ScrollContext) {
  if (e.touches.length > 1) {
    // Explicitly prevent native multi-touch scroll
    if (e.cancelable) {
      e.preventDefault()
    }
    return // Ignore multi-finger gestures
  }

  // Intelligent brake: check if scrolling at high speed before stopping; if so, enable click block.
  if (ctx.rafId && Math.abs(ctx.velocity) > ctx.clickBlockThreshold) {
    ctx.shouldBlockClick = true
  }
  else {
    ctx.shouldBlockClick = false
  }

  stopAnimation(ctx)

  ctx.isTouching = true
  ctx.isMoved = false
  ctx.isNativeScroll = false

  const t = e.touches[0] as Touch
  // Record active touch ID to prevent coordinate jumps during finger handover
  ctx.activeTouchId = t.identifier

  ctx.touchStartX = ctx.lastTouchX = t.clientX
  ctx.touchStartY = ctx.lastTouchY = t.clientY

  ctx.targetScrollLeft = ctx.scrollEl.scrollLeft
  ctx.targetScrollTop = ctx.scrollEl.scrollTop

  ctx.lastTouchTime = performance.now()
  ctx.lastFrameTime = 0
  ctx.gestureDirection = null

  // Initialize historical trajectory queue
  ctx.touchTracker = [{ time: ctx.lastTouchTime, x: t.clientX, y: t.clientY }]
}

/**
 * Handles touch move
 * Core Logic:
 * 1. Axis Locking
 * 2. Edge Detection
 * 3. Velocity Calculation via Sampling Window
 * @param e - Touch event
 * @param ctx - Scroll context
 */
function onTouchMove(e: TouchEvent, ctx: ScrollContext) {
  // If native scroll is handled, stay silent
  if (ctx.isNativeScroll || !ctx.isTouching || !e.touches.length)
    return

  // Find original finger, ignore others
  const t = Array.from(e.touches).find(
    touch => touch.identifier === ctx.activeTouchId,
  )
  if (!t)
    return

  const now = performance.now()
  const dx = t.clientX - ctx.touchStartX
  const dy = t.clientY - ctx.touchStartY

  // Initial axis locking determination
  if (!ctx.gestureDirection) {
    const currentThreshold = ctx.dragThreshold
    if (Math.abs(dx) > currentThreshold || Math.abs(dy) > currentThreshold) {
      const isHorizontal = Math.abs(dx) > Math.abs(dy)
      const el = ctx.scrollEl

      // If at boundary and moving outward, hand control back for native browser behavior
      let isAtEdge = false
      if (isHorizontal) {
        const maxScrollLeft = el.scrollWidth - el.clientWidth
        const atLeft = el.scrollLeft <= 1 && dx > 0
        const atRight = el.scrollLeft >= maxScrollLeft - 1 && dx < 0
        const noScrollNeeded = el.scrollWidth <= el.clientWidth
        if (atLeft || atRight || noScrollNeeded)
          isAtEdge = true
      }
      else {
        const maxScrollTop = el.scrollHeight - el.clientHeight
        const atTop = el.scrollTop <= 1 && dy > 0
        const atBottom = el.scrollTop >= maxScrollTop - 1 && dy < 0
        const noScrollNeeded = el.scrollHeight <= el.clientHeight
        if (atTop || atBottom || noScrollNeeded)
          isAtEdge = true
      }

      if (isAtEdge) {
        ctx.isNativeScroll = true
        return
      }

      // Lock direction and take over scrolling
      ctx.gestureDirection = isHorizontal ? 'horizontal' : 'vertical'
      ctx.lockedDirection = ctx.gestureDirection
      ctx.isMoved = true
      ctx.lastFrameTime = performance.now()

      // Call onScrollStart hook
      ctx.onScrollStart?.()

      if (!ctx.rafId) {
        ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
      }
    }
    else {
      return
    }
  }

  // Prevent default page scroll after hijacking
  if (e.cancelable) {
    e.preventDefault()
  }

  const incX = t.clientX - ctx.lastTouchX
  const incY = t.clientY - ctx.lastTouchY

  // Calculate displacement increment (Phase 1: Manual Follow)
  if (ctx.gestureDirection === 'horizontal') {
    const max = ctx.scrollEl.scrollWidth - ctx.scrollEl.clientWidth
    ctx.targetScrollLeft = Math.max(
      0,
      Math.min(max, ctx.targetScrollLeft - incX),
    )
  }
  else {
    const max = ctx.scrollEl.scrollHeight - ctx.scrollEl.clientHeight
    ctx.targetScrollTop = Math.max(0, Math.min(max, ctx.targetScrollTop - incY))
  }

  // Calculate real inertial velocity (Phase 2: Preparing for release)
  ctx.touchTracker.push({ time: now, x: t.clientX, y: t.clientY })
  // Keep points within 50ms to filter jitter and handle varying refresh rates (60/120Hz)
  ctx.touchTracker = ctx.touchTracker.filter(p => now - p.time <= 50)

  if (ctx.touchTracker.length > 1) {
    const oldestPoint = ctx.touchTracker[0] as { time: number, x: number, y: number }
    const historyDt = Math.max(1, now - oldestPoint.time) // Prevent div by zero

    if (ctx.gestureDirection === 'horizontal') {
      ctx.velocity = -(t.clientX - oldestPoint.x) / historyDt
    }
    else {
      ctx.velocity = -(t.clientY - oldestPoint.y) / historyDt
    }
  }

  ctx.lastTouchX = t.clientX
  ctx.lastTouchY = t.clientY
  ctx.lastTouchTime = now
}

/**
 * Handles touch end
 * Validates gesture; enters inertia phase or stops based on final velocity
 * @param e - Native touch event
 * @param ctx - Scroll context
 */
function onTouchEnd(e: TouchEvent, ctx: ScrollContext) {
  // Check if tracked finger is lifted
  if (ctx.activeTouchId !== null) {
    const isTrackedFingerLifted = Array.from(e.changedTouches).some(
      t => t.identifier === ctx.activeTouchId,
    )
    if (!isTrackedFingerLifted)
      return
  }

  ctx.isTouching = false
  ctx.activeTouchId = null // Release tracking

  if (ctx.isNativeScroll) {
    ctx.isNativeScroll = false
    stopAnimation(ctx)
    return
  }

  const now = performance.now()
  // Inertia protection: if held still > 80ms, clear velocity as no intent to scroll
  if (now - ctx.lastTouchTime > INERTIA_STOP_DELAY) {
    ctx.velocity = 0
  }

  // Determine if inertia conditions are not met
  if (
    ctx.disableInertia
    || Math.abs(ctx.velocity) <= MIN_VELOCITY
    || !ctx.lockedDirection
  ) {
    // Must stop if not entering inertia loop
    stopAnimation(ctx)
    return
  }

  // Start inertial simulation
  if (!ctx.rafId) {
    ctx.lastFrameTime = performance.now()
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  }
}

/**
 * Core initialization: hijacks DOM styles, initializes state, and binds events
 * @param eventEl - Element for event listening
 * @param scrollEl - Element where scrolling is performed
 * @param config - Configuration options
 *
 * 1. Backup native DOM styles
 * 2. Inject style overrides
 * 3. Mount event listeners and context management
 */
function initTouchScroll(
  eventEl: HTMLElement,
  scrollEl: HTMLElement,
  config: TableTouchScrollConfig,
): ScrollContext {
  // Backup original styles
  const originalStyles = new Map<string, string>()
  STYLE_PROPS.forEach((prop) => {
    originalStyles.set(prop, (scrollEl.style as any)[prop])
  })

  // Take over styles: disable native scrollbars, enable hardware acceleration
  scrollEl.style.setProperty('overflow', 'hidden', 'important')
  scrollEl.style.willChange = 'scroll-position'

  // Allow native touch-action so edge detection can hand back control smoothly
  if (scrollEl.style.touchAction === 'none') {
    scrollEl.style.touchAction = 'auto'
  }

  const abortController = new AbortController()
  const { signal } = abortController

  const ctx: ScrollContext = {
    scrollEl,
    abortController,
    originalStyles,
    touchStartX: 0,
    touchStartY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    lastTouchTime: 0,
    lastFrameTime: 0,
    gestureDirection: null,
    lockedDirection: null,
    velocity: 0,
    rafId: null,
    friction: config.friction ?? DEFAULT_FRICTION,
    dragThreshold: config.dragThreshold ?? DEFAULT_DRAG_THRESHOLD,
    disableInertia: config.disableInertia ?? false,
    clickBlockThreshold: config.clickBlockThreshold ?? SAFE_CLICK_VELOCITY,
    onScrollStart: config.onScrollStart,
    onScrollEnd: config.onScrollEnd,
    isTouching: false,
    targetScrollLeft: 0,
    targetScrollTop: 0,
    isMoved: false,
    isNativeScroll: false,
    shouldBlockClick: false,
    activeTouchId: null, // Initialize tracking ID
    touchTracker: [], // Initialize history trajectory
  }

  // Event binding: passive must be false to allow preventDefault for hijacking native scroll
  eventEl.addEventListener('touchstart', e => onTouchStart(e, ctx), {
    passive: false,
    signal,
  })
  eventEl.addEventListener('touchmove', e => onTouchMove(e, ctx), {
    passive: false,
    signal,
  })

  eventEl.addEventListener('touchend', e => onTouchEnd(e, ctx), { signal })
  eventEl.addEventListener('touchcancel', e => onTouchEnd(e, ctx), { signal })

  /**
   * Intercept click events in the capture phase.
   * If determined as a drag or triggered by high-speed "braking", block propagation and default behavior.
   */
  eventEl.addEventListener(
    'click',
    (e) => {
      if (ctx.isMoved || ctx.shouldBlockClick) {
        e.stopImmediatePropagation()
        e.preventDefault()

        ctx.isMoved = false
        ctx.shouldBlockClick = false
      }
    },
    { capture: true, signal },
  )

  return ctx
}

/**
 * Restores styles and destroys all animation frames and listeners
 * Restore original styles, stop RAF loop, free memory
 * @param ctx - Scroll context
 */
function cleanupTouchScroll(ctx: ScrollContext) {
  // If scrolling during unmount, trigger onScrollEnd
  const wasScrolling = ctx.rafId !== null

  if (ctx.rafId)
    cancelAnimationFrame(ctx.rafId)
  ctx.abortController.abort() // Cancel all event listeners

  const { scrollEl, originalStyles } = ctx
  originalStyles.forEach((val, prop) => {
    ;(scrollEl.style as any)[prop] = val
  })

  // Trigger callback after cleanup
  if (wasScrolling && ctx.onScrollEnd) {
    ctx.onScrollEnd()
  }
}

/**
 * Binds touch scroll enhancement to the table scroll container
 *
 * @param eventElRef - Event target element (usually the table root container)
 * @param scrollElRef - Actual scroll element (usually .ant-table-body)
 * @param options - Switch & config: true for defaults, object for custom config, false/undefined to disable
 */
export function useTouchScroll(
  eventElRef: ShallowRef<HTMLElement | null>,
  scrollElRef: ShallowRef<HTMLElement | null>,
  options: ComputedRef<boolean | TableTouchScrollConfig | undefined>,
) {
  let ctx: ScrollContext | null = null

  function cleanup() {
    if (ctx) {
      cleanupTouchScroll(ctx)
      ctx = null
    }
  }

  watch(
    [options, eventElRef, scrollElRef],
    () => {
      cleanup()

      const opt = options.value
      if (!opt)
        return

      const eventEl = eventElRef.value
      const scrollEl = scrollElRef.value
      if (!eventEl || !scrollEl)
        return

      const config = typeof opt === 'boolean' ? {} : opt
      ctx = initTouchScroll(eventEl, scrollEl, config)
    },
    { flush: 'post' },
  )

  onBeforeUnmount(cleanup)
}
