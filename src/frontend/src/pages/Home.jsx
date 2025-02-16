import { useState } from 'react'
import Canvas from '../components/canvas/canvas'

function Home() {

  return (
    <>
      <div className='top-div flex items-center justify-center'>
        <div>
          <div className='max-w[1000px] mx-auto'>
            <Canvas></Canvas>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home
