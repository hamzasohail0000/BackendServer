import mongoose from 'mongoose';

const imagesSchema = new mongoose.Schema(
  {
    fileName: String,
    fileSize: Number,
    createdBy: String,
  },
  { timestamps: true }
);
// eslint-disable-next-line import/prefer-default-export
export const Images = mongoose.model('images', imagesSchema);
