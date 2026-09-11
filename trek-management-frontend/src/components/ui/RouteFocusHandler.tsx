import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteFocusHandler() {
  const { pathname } = useLocation()

  useEffect(() => {
    // When route changes, focus the main content area for accessibility
    // Use requestAnimationFrame to ensure the new page has rendered before focusing
    requestAnimationFrame(() => {
      window.scrollTo(0, 0); // Scroll to top
      const mainContent = document.getElementById('main-content')
      if (mainContent) {
        mainContent.focus({ preventScroll: true })
      }
    })
  }, [pathname])

  return null
}
