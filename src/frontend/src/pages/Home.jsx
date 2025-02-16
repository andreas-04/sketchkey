import { useState } from 'react'
import Canvas from '../components/canvas/canvas'
import theme from '../themes/themes'

function Home({themes, themeToggle}) {

  return (
    <>
      <div className='top-div flex items-center justify-center'>
        <div>
          <div className='max-w[1000px] mx-auto'>
            <Canvas theme = {themes, themeToggle}> </Canvas>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home
