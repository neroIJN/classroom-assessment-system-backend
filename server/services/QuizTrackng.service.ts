import mongoose from 'mongoose';
import ActiveQuizSession from './../models/ActiveQuizSession.model';

export const startQuizSession = async (quizId: string, userId: string): Promise<any> => {
  try {
    // Check if there's already an active session for this user and quiz
    const existingSession = await ActiveQuizSession.findOne({ 
      quizId: new mongoose.Types.ObjectId(quizId), 
      userId: new mongoose.Types.ObjectId(userId),
      completed: false
    });

    if (existingSession) {
      // Update the existing session's lastActivity timestamp
      existingSession.lastActivity = new Date();
      await existingSession.save();
      return existingSession;
    }

    // Create a new session
    const newSession = new ActiveQuizSession({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(userId),
      startTime: new Date(),
      lastActivity: new Date()
    });

    await newSession.save();
    return newSession;
  } catch (error) {
    console.error('Error starting quiz session:', error);
    throw error;
  }
};

export const markSessionAsActive = async (quizId: string, userId: string): Promise<void> => {
  try {
    await ActiveQuizSession.updateOne(
      { 
        quizId: new mongoose.Types.ObjectId(quizId), 
        userId: new mongoose.Types.ObjectId(userId),
        completed: false
      },
      { $set: { lastActivity: new Date() } }
    );
  } catch (error) {
    console.error('Error updating session activity:', error);
    throw error;
  }
};

export const completeQuizSession = async (quizId: string, userId: string): Promise<void> => {
  try {
    await ActiveQuizSession.updateOne(
      { 
        quizId: new mongoose.Types.ObjectId(quizId), 
        userId: new mongoose.Types.ObjectId(userId),
        completed: false
      },
      { 
        $set: { 
          completed: true,
          endTime: new Date()
        } 
      }
    );
  } catch (error) {
    console.error('Error completing quiz session:', error);
    throw error;
  }
};

export const getQuizSessionStats = async (quizId: string): Promise<{ activeCount: number, completedCount: number }> => {
  try {
    // Find all sessions that have had activity in the last 5 minutes and aren't completed
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const activeCount = await ActiveQuizSession.countDocuments({
      quizId: new mongoose.Types.ObjectId(quizId),
      completed: false,
      lastActivity: { $gte: fiveMinutesAgo }
    });

    const completedCount = await ActiveQuizSession.countDocuments({
      quizId: new mongoose.Types.ObjectId(quizId),
      completed: true
    });

    return { activeCount, completedCount };
  } catch (error) {
    console.error('Error getting quiz session stats:', error);
    throw error;
  }
};

// Function to clean up inactive sessions (can be run via a scheduled job)
export const cleanupInactiveSessions = async (): Promise<void> => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Mark sessions as completed if they've been inactive for 30+ minutes
    await ActiveQuizSession.updateMany(
      { 
        completed: false,
        lastActivity: { $lt: thirtyMinutesAgo }
      },
      { 
        $set: { 
          completed: true,
          endTime: new Date()
        } 
      }
    );
  } catch (error) {
    console.error('Error cleaning up inactive sessions:', error);
    throw error;
  }
};

