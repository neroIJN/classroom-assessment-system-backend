import { Request, Response } from 'express';
import {
  startQuizSession,
  markSessionAsActive,
  completeQuizSession,
  getQuizSessionStats
} from '../services/QuizTrackng.service';

export const startQuizSessionController = async (req: Request, res: Response) => {
  try {
    const { quizId, studentId } = req.body;

    if (!quizId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID and Student ID are required'
      });
    }

    const session = await startQuizSession(quizId, studentId);
    
    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error starting quiz session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz session'
    });
  }
};

export const heartbeatController = async (req: Request, res: Response) => {
  try {
    const { quizId, studentId } = req.body;

    if (!quizId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID and Student ID are required'
      });
    }

    await markSessionAsActive(quizId, studentId);
    
    res.status(200).json({
      success: true,
      message: 'Session activity updated'
    });
  } catch (error) {
    console.error('Error updating session activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session activity'
    });
  }
};

export const completeQuizSessionController = async (req: Request, res: Response) => {
  try {
    const { quizId, studentId } = req.body;

    if (!quizId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID and Student ID are required'
      });
    }

    await completeQuizSession(quizId, studentId);
    
    res.status(200).json({
      success: true,
      message: 'Quiz session completed'
    });
  } catch (error) {
    console.error('Error completing quiz session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete quiz session'
    });
  }
};

export const getQuizStatsController = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    //console.log("Stats request received for quizId:", quizId);

    if (!quizId) {
      console.log("No quizId provided");
      return res.status(400).json({
        success: false,
        message: 'Quiz ID is required'
      });
    }

    const stats = await getQuizSessionStats(quizId);
    //console.log("Stats retrieved:", stats);
    
    res.status(200).json({
      success: true,
      activeCount: stats.activeCount,
      completedCount: stats.completedCount
    });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz stats'
    });
  }
};