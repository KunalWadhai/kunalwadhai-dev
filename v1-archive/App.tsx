import PortfolioPage from './features/portfolio/PortfolioPage'
import { LoadingOverlay } from './components/ui/LoadingOverlay'

export default function App() {
  return (
    <>
      <LoadingOverlay />
      <PortfolioPage />
    </>
  )
}
