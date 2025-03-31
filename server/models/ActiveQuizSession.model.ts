import mongoose, { Document, Schema } from 'mongoose';

export interface IActiveQuizSession extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  lastActivity: Date;
}

const activeQuizSessionSchema = new Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Assignment'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Create indices for better query performance
activeQuizSessionSchema.index({ quizId: 1, userId: 1 }, { unique: true });
activeQuizSessionSchema.index({ lastActivity: 1 });

const ActiveQuizSession = mongoose.model<IActiveQuizSession>('ActiveQuizSession', activeQuizSessionSchema);

export default ActiveQuizSession;