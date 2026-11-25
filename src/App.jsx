import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import Introduction from './pages/Introduction'
import LoanProfit from './pages/LoanProfit'
import UnderstandingData from './pages/UnderstandingData'
import Dataset from './pages/Dataset'
import StatisticalMeasures from './pages/StatisticalMeasures'
import VariableThreshold from './pages/VariableThreshold'
import TwoPopulations from './pages/TwoPopulations'
import FairThresholds from './pages/FairThresholds'
import Discussion from './pages/Discussion'
import About from './pages/About'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/de" replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Introduction />} />
        <Route path="loan-profit" element={<LoanProfit />} />
        <Route path="data-intro" element={<UnderstandingData />} />
        <Route path="dataset" element={<Dataset />} />
        <Route path="measures" element={<StatisticalMeasures />} />
        <Route path="threshold" element={<VariableThreshold />} />
        <Route path="two-groups" element={<TwoPopulations />} />
        <Route path="fair" element={<FairThresholds />} />
        <Route path="discussion" element={<Discussion />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}
