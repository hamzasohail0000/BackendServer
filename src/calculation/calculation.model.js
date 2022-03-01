import mongoose from 'mongoose';
const calcutionSchema = new mongoose.Schema(
    {
        ipAddress: String,
        input: String,
        output: String,
    },
    { timestamps: true },
);

// eslint-disable-next-line import/prefer-default-export
export default mongoose.model('calculations', calcutionSchema);
