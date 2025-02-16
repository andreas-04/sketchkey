import Pagination from '@mui/material/Pagination';

function Gallery() {

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
