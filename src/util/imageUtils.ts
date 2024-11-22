// utils/imageUtils.ts

// Function to generate the formatted images array
export const generateImageData = (
  images: string[]
): { url: string; thumbnailUrl: string; title: string; uid: string }[] => {
  return images
    .map((url) => {
      const regex = /([A-Za-z0-9-]+)-(Y|R|W)(\d+)\.jpg/;
      const match = url.match(regex);

      if (match) {
        const color = match[2];
        const index = match[3];

        const colorName =
          color === "Y" ? "Yellow" : color === "R" ? "Rose" : "White";

        const thumbUrl = url.replace(".jpg", "_thumb.jpg");

        const uid = `${color}${index}`;

        const title = `Image ${colorName} ${uid}`;

        return {
          url,
          thumbnailUrl: thumbUrl,
          title,
          uid,
        };
      }

      return null;
    })
    .filter(
      (
        image
      ): image is {
        url: string;
        thumbnailUrl: string;
        title: string;
        uid: string;
      } => image !== null
    );
};

// Function to filter images based on color
export const filterImagesByColor = (
  images: { url: string; thumbnailUrl: string; title: string; uid: string }[],
  color: "Yellow" | "Rose" | "White"
): { url: string; thumbnailUrl: string; title: string; uid: string }[] => {
  return images.filter((image) => {
    const imageColor =
      image.uid[0] === "Y" ? "Yellow" : image.uid[0] === "R" ? "Rose" : "White";
    return imageColor === color;
  });
};
