import { useState } from 'react'
import MainSlider from './components/MainSlider/MainSlider.jsx';
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainSlider></MainSlider>
    </>
  )
}

export default App
