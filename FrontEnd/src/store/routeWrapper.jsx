import { BrowserRouter } from 'react-router-dom'

export default function RouteWrapper ({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}
