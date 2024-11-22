// Function to generate the formatted images array
export const generateImageData = (
  images: string[]
): { url: string; thumbnailUrl: string; title: string; uid: string }[] => {
  return images
    .map((url) => {
      // Regex to capture the dynamic base (e.g., DBF9801), the color (Y, R, W), and the index (1, 2, etc.)
      const regex = /([A-Za-z0-9-]+)-(Y|R|W)(\d+)\.jpg/;
      const match = url.match(regex);

      if (match) {
        const color = match[2]; // Color (Y, R, W)
        const index = match[3]; // Index (1, 2, 3, etc.)

        // Determine the color name based on the match
        const colorName =
          color === "Y" ? "Yellow" : color === "R" ? "Rose" : "White";

        // Create a thumbnail URL by appending '_thumb' to the base file name
        const thumbUrl = url.replace(".jpg", "_thumb.jpg");

        // Create the unique identifier (e.g., Y1, R2, W3)
        const uid = `${color}${index}`;

        // Create the title for the image
        const title = `Image ${colorName} ${uid}`;

        return {
          url,
          thumbnailUrl: thumbUrl,
          title,
          uid,
        };
      }

      // Return null or empty object if regex doesn't match
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
    ); // Type guard to ensure nulls are excluded
};

// Function to filter images by color
export const filterImagesByColor = (
  images: { url: string; thumbnailUrl: string; title: string; uid: string }[],
  color: "Yellow" | "Rose" | "White"
): { url: string; thumbnailUrl: string; title: string; uid: string }[] => {
  return images.filter((image) => {
    const imageColor = image.uid[0] === "Y" ? "Yellow" : image.uid[0] === "R" ? "Rose" : "White";
    return imageColor === color;
  });
};