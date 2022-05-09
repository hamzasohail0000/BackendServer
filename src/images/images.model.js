import mongoose from 'mongoose';

const imagesSchema = new mongoose.Schema(
  {
    name: String,
    desc: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);
// eslint-disable-next-line import/prefer-default-export
export const Images = mongoose.model('images', imagesSchema);
