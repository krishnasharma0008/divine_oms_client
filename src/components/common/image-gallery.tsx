import React, { useState, useEffect } from "react";

interface Image {
  url: string;
  thumbnailUrl: string;
  title: string;
  uid: string;
}

const ImageGallery: React.FC<{ msg?: string; images: Image[] }> = ({
  msg = "",
  images,
}) => {
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
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:max-h-[480px] md:w-20 md:flex-col md:overflow-y-auto md:overflow-x-visible md:pb-0">
        {filteredImages.map((image: Image, index: number) => (
          <button
            type="button"
            key={image.uid}
            onClick={() => handleImageClick(index)}
            className={`shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 p-0.5 transition ${
              selectedImage === index
                ? "border-gray-900"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            {image.title.startsWith("Image") ? (
              /* eslint-disable-next-line @next/next/no-img-element */
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex min-h-[180px] flex-1 items-center justify-center rounded-xl bg-gray-50 p-2 sm:min-h-[240px] sm:p-4 md:min-h-[420px]">
        {selectedImage !== null && (
          <div className="relative h-full w-full">
            {filteredImages[selectedImage].title.startsWith("Image") ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].title}
                className="mx-auto max-h-[200px] w-full object-contain sm:max-h-[280px] md:max-h-[440px]"
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
            {msg !== "" && (
              <div className="absolute left-0 top-0 rounded-br-lg bg-[#A9C5C6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-900">
                {msg === "This is multi size - solitaire product"
                  ? "Multi size solitaire"
                  : msg === "This is multi - solitaire product"
                    ? "Multi solitaire"
                    : msg}
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
