import { createContext, useContext, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { log } from './eventStore'

const EventStoreContext = createContext(null)

export function EventStoreProvider({ children }) {
  const location = useLocation()
  const logEvent = useCallback(
    (verb, object, value) => log(verb, object, location.pathname, value),
    [location.pathname]
  )
  return (
    <EventStoreContext.Provider value={logEvent}>
      {children}
    </EventStoreContext.Provider>
  )
}

export function useEventLog() {
  return useContext(EventStoreContext)
}
