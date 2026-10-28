const mediaUpload = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file); 

  try {
    const token = localStorage.getItem("token");

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const response = await fetch(`${backendUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Image upload failed");
    }

    return data.imageUrl;
  } catch (error) {
    console.error("AWS S3 Upload Error:", error);
    throw error;
  }
};

export default mediaUpload;
