import { useState } from 'react'
import Pagination from '@mui/material/Pagination';

import { useTheme } from '@mui/material/styles'; // Import to access theme

function Gallery({themes, themeToggle}) {

  return (
    <>
      <div className='top-div flex items-center justify-center min-h-screen'>
        <div>
          <div className='max-w[1000px] mx-auto'>
            
          </div>
        </div>
        <Pagination count={10} />
      </div>

    </>
  )
}

export default Gallery
