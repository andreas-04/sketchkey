import { useState } from 'react'
import Pagination from '@mui/material/Pagination';


function Home() {

  return (
    <>
      <div className='top-div flex items-center justify-center'>
        <div>
          <div className='max-w[1000px] mx-auto'>
            
          </div>
        </div>
        <Pagination count={10} />
        <Pagination count={10} color="primary" />
        <Pagination count={10} color="secondary" />
        <Pagination count={10} disabled />
      </div>

    </>
  )
}

export default Home
