// This function simulates the image upload process
export const uploadImageToServer = async (image: string): Promise<{ url: string }> => {
    // Simulate an API call to upload the image to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const uploadedImageUrl = 'http://localhost:5001/uploads/' + new Date().getTime() + '.jpg';
        resolve({ url: uploadedImageUrl }); // Simulate the response URL
      }, 1000); // Simulate a delay
    });
  };
  