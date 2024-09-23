import React from 'react'
import Headers from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'

const Home = () => {
  return (
    <div>
      <Headers />
      <SpecialityMenu />
      <TopDoctors />
    </div>
  )
}

export default Home
