
import { AppProvider } from './context'
import QueryClientWrapper from './queryClient'
import RouteWrapper from './routeWrapper'

export default function Providers ({ children }) {
  return (
    <QueryClientWrapper>
      <RouteWrapper>
        <AppProvider>
          {children}
        </AppProvider>
      </RouteWrapper>
    </QueryClientWrapper>
  )
}
