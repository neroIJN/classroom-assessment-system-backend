// src/models/violation.model.ts
import { Schema, model } from 'mongoose';
import { IViolation } from '../utils/violation.types';

const violationSchema = new Schema<IViolation>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  violation: {
    type: {
      type: String,
      required: true,
      enum: ['Tab Switch', 'Window Switch', 'Mouse Exit', 'Keyboard Shortcut', 'Right Click', 'Fullscreen Exit']
    },
    timestamp: {
      type: Date,
      required: true
    },
    count: Number,
    key: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ViolationModel = model<IViolation>('Violation', violationSchema);