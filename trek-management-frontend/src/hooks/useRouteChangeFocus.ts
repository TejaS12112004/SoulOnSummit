import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useRouteChangeFocus() {
  const { pathname } = useLocation()

  useEffect(() => {
    // When route changes, focus the main content area for accessibility
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus({ preventScroll: true })
    }
  }, [pathname])
}
