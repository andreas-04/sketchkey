import { useState } from 'react'
import Pagination from '@mui/material/Pagination';


function Gallery({themes, themeToggle}) {

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

export default Gallery
