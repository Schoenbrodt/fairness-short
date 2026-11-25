import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/Layout'
import Introduction from './pages/Introduction'
import TwoPopulations from './pages/TwoPopulations'
import FairThresholds from './pages/FairThresholds'
import About from './pages/About'
import { DEFAULT_LANG, initialLang, isLang } from './lang'

function LangHome() {
  const { lang } = useParams()
  return <Navigate to={`/${isLang(lang) ? lang : DEFAULT_LANG}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${initialLang()}`} replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Introduction />} />
        <Route path="groups" element={<TwoPopulations />} />
        <Route path="thresholds" element={<FairThresholds />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<LangHome />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${initialLang()}`} replace />} />
    </Routes>
  )
}
