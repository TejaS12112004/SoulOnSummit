import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteFocusHandler() {
  const { pathname } = useLocation()

  useEffect(() => {
    // When route changes, focus the main content area for accessibility
    // Use requestAnimationFrame to ensure the new page has rendered before focusing
    requestAnimationFrame(() => {
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus({ preventScroll: true })
      }
    })
  }, [pathname])

  return null
}
