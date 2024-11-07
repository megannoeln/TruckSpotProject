import { useState } from 'react'

import SeachBox from './components/SearchBox/SeachBox'
import Navbar from './components/Navbar/Navbar'
import BigCard from './components/Cards/BigCard'
import MediumCard from './components/Cards/MediumCard'
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <nav><Navbar/></nav>
    </>
  )
}

export default App
