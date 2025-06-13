export const createProperty = (req, res, next) => {
  try {
    const { title, location, price } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    // Save to DB logic here if needed

    return res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: {
        title,
        location,
        price,
        images: imagePaths,
      }
    });
  } catch (err) {
    next(err);
  }
};
