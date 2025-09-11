export const uploadImage = (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path, // Cloudinary hosted URL
  });
};
