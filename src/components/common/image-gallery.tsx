import React, { useState, useEffect } from "react";

interface Image {
  url: string;
  thumbnailUrl: string;
  title: string;
  uid: string;
}

const ImageGallery: React.FC<{ images: Image[] }> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(0);
  const [availableVideos, setAvailableVideos] = useState<Set<number>>(
    new Set()
  );
  const [videoLoading, setVideoLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkVideoAvailability = async () => {
      const videoPromises = images.map((image, index) => {
        if (image.title.startsWith("Video")) {
          return new Promise<void>((resolve) => {
            const videoElement = document.createElement("video");
            videoElement.src = image.url;
            videoElement.oncanplaythrough = () => {
              setAvailableVideos((prev) => new Set(prev).add(index));
              resolve();
            };
            videoElement.onerror = () => resolve();
          });
        }
        return Promise.resolve();
      });

      await Promise.all(videoPromises);
    };

    checkVideoAvailability();

    return () => setAvailableVideos(new Set());
  }, [images]);

  const handleImageClick = (index: number) => {
    if (selectedImage !== index) {
      setSelectedImage(index);
      setVideoLoading(true);
    }
  };

  const handleVideoLoaded = () => setVideoLoading(false);
  const handleVideoError = () => setVideoLoading(false);

  const filteredImages = images.filter(
    (image, index) =>
      image.title.startsWith("Image") || availableVideos.has(index)
  );

  if (filteredImages.length === 0) {
    return <div>No images or available videos</div>;
  }

  return (
    <div className="flex">
      {/* Thumbnail Section */}
      <div className="flex flex-col space-y-3 mr-4 ">
        {filteredImages.map((image: Image, index: number) => (
          <div
            key={image.uid}
            onClick={() => handleImageClick(index)}
            className={`cursor-pointer p-1 ${
              selectedImage === index
                ? "border border-gray-400"
                : "border border-gray-200"
            } rounded-lg`}
          >
            {image.title.startsWith("Image") ? (
              <img
                src={image.thumbnailUrl}
                alt={image.title}
                height={50}
                width={50}
                className="w-16 h-16 object-contain rounded-lg"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = "/jewellery/NoImageBig.jpg";
                }}
              />
            ) : (
              <div className="relative w-16 h-16">
                <video
                  src={image.thumbnailUrl}
                  height={50}
                  width={50}
                  className="object-cover w-full h-full rounded-lg"
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="p-1 flex items-center justify-center">
                    <img
                      src="/jewellery/play.png"
                      alt="play button"
                      height={12}
                      width={12}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Image/Video Display */}
      <div className="flex-1">
        {selectedImage !== null && (
          <div
            className="relative w-full h-full"
            //style={{ height: `${mainImageHeight}px` }} // Set the height to match 4 thumbnails
          >
            {filteredImages[selectedImage].title.startsWith("Image") ? (
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].title}
                className="center md:w-auto w-60 max-h-full md:max-h-auto md:h-full m-auto object-contain rounded-lg shadow-md  "
                style={{
                  height: "100%", // Ensure the image takes up the full height of the container
                  objectFit: "contain", // Maintain aspect ratio while filling the container
                  borderTop: "1px solid rgb(0 0 0 / 0.1)", // Add a top border to the main image container
                }}
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = "/jewellery/NoImageBig.jpg";
                }}
              />
            ) : (
              <div className="relative w-full h-full">
                {videoLoading && (
                  <div className="spinner absolute inset-0 flex items-center justify-center">
                    <p>Loading video...</p>
                  </div>
                )}
                <video
                  src={filteredImages[selectedImage].url}
                  autoPlay
                  loop
                  className="object-contain w-full h-full rounded-lg shadow-lg"
                  onCanPlayThrough={handleVideoLoaded}
                  onError={handleVideoError}
                />
              </div>
            )}
            {filteredImages[selectedImage].url === "/vtdia/carousel_3.png" && (
              <div className="absolute md:right-[35%] md:top-[59%] right-[25%] top-[47%] text-[#303030] font-semibold text-lg md:text-xl md:ml-4 mt-4 md:mt-0">
                {filteredImages[selectedImage].uid}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
