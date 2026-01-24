import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { themeModeStore } from './local-store'

export type ThemeMode = 'system' | 'light' | 'dark'

export function applyThemeToDOM(isDark: boolean) {
  const html = document.documentElement
  const theme = isDark ? 'dark' : 'light'

  html.setAttribute('data-theme', theme)
  html.classList.remove('dark', 'light')
  html.classList.add(theme)
  html.style.colorScheme = theme
}

function disableTransitions() {
  const style = document.createElement('style')
  style.id = 'disable-transitions'
  style.textContent = '*, *::before, *::after { transition: none !important; }'
  document.head.appendChild(style)
}

function enableTransitions() {
  document.getElementById('disable-transitions')?.remove()
}

function removeColorSchemeOverride() {
  document.getElementById('color-scheme-override')?.remove()
}

export function useTheme() {
  const appStore = useAppStore()
  const { darkMode } = storeToRefs(appStore)

  async function executeViewTransition(event: MouseEvent | undefined, updateState: () => void | Promise<void>) {
    const isAppearanceTransition = typeof document.startViewTransition === 'function'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition || !event) {
      await updateState()
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    disableTransitions()

    const transition = document.startViewTransition!(async () => {
      await updateState()
      await nextTick()
    })

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 400,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })

    transition.finished.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          enableTransitions()
          removeColorSchemeOverride()
        })
      })
    })
  }

  function setThemeMode(mode: ThemeMode, event?: MouseEvent) {
    let shouldBeDark: boolean

    themeModeStore.value = mode

    if (mode === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    else {
      shouldBeDark = mode === 'dark'
    }

    if (darkMode.value === shouldBeDark) {
      return
    }

    executeViewTransition(event, () => {
      appStore.toggleDarkMode(shouldBeDark)
      applyThemeToDOM(shouldBeDark)
    })
  }

  function toggleDark(event?: MouseEvent) {
    const shouldBeDark = !darkMode.value
    themeModeStore.value = shouldBeDark ? 'dark' : 'light'
    executeViewTransition(event, () => {
      appStore.toggleDarkMode(shouldBeDark)
      applyThemeToDOM(shouldBeDark)
    })
  }

  return {
    darkMode,
    toggleDark,
    setThemeMode,
  }
}
