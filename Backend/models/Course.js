// backend/models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 1000 },
    duration: { type: String, required: [true, 'Duration is required'], trim: true, maxlength: 40 },
    instructor: { type: String, trim: true, default: 'ACADEXA Faculty' },
  },
  { timestamps: true }
);

courseSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Course', courseSchema);
