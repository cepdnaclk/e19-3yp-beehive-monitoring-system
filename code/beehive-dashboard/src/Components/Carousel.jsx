import React, { useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import "../Styles/Components/Carousel.scss";
import { Carousel } from 'react-responsive-carousel';

const ImageCarousel = ({ imageUrls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="carousel_container">
      <Carousel
        selectedItem={selectedImageIndex}
        onChange={handleImageChange}
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        infiniteLoop={true}
      >
        {imageUrls.map((imageUrl, index) => (
          <div key={index}>
            <img src={imageUrl} alt={`Image ${index}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;