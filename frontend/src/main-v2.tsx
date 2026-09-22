import './styles/tokens-v2.css'
import './styles/global-v2.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'

export const createRoot = ViteReactSSG({ routes })
