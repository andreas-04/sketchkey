import React, { useState } from 'react';
import { Button, Pagination, Typography } from '@mui/material';

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC733']; // Example colors
const allImages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  color: colors[i % colors.length],
  url: `https://via.placeholder.com/150/${colors[i % colors.length].substring(1)}/fff?text=Image+${i + 1}`
}));

const Gallery = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorPageMap, setColorPageMap] = useState({});
  const itemsPerPage = 9;

  const handleColorChange = (color) => {
    setSelectedColor(color === selectedColor ? null : color);
  };

  const handlePageChange = (event, value) => {
    setColorPageMap((prev) => ({ ...prev, [selectedColor || 'all']: value }));
  };

  const currentPage = colorPageMap[selectedColor || 'all'] || 1;
  
  const filteredImages =allImages;
  // = selectedColor
  //   ? allImages.filter((img) => img.color === selectedColor)
  //   : allImages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="top-div flex flex-col items-center pt-6 min-h-screen p-4">
      {/* Color Picker */}
      <div className="max-w-[1000px] mx-auto mb-4">
        <Typography variant="h4" className="text-center mb-2">Gallery</Typography>
        {/* <div className="flex justify-center gap-2">
          {colors.map((color) => (
            <Button
              key={color}
              style={{
                backgroundColor: color,
                width: '35px',
                height: '35px',
                minWidth: '35px',
                borderRadius: '50%',
                border: selectedColor === color ? '2px solid #000' : 'none'
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div> */}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-[900px] mx-auto">
        {paginatedImages.length > 0 ? (
          paginatedImages.map((image) => (
            <div key={image.id} className="flex items-center justify-center border p-2 rounded-lg shadow-md">
              <img src={image.url} alt={`Gallery ${image.id}`} className="rounded-md w-full" />
            </div>
          ))
        ) : (
          <Typography variant="h5" className="text-center col-span-3">No images found.</Typography>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredImages.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        className="mt-6"
      />
    </div>
  );
};

export default Gallery;
