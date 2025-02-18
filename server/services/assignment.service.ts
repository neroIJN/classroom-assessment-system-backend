import { IAssignment } from '../models/mcq.model';
import AssignmentModel from '../models/mcq.model';
import QuizSubmissionModel, { IQuizSubmission } from '../models/QuizSubmissionModel';
import mongoose from 'mongoose';
import userModel from '../models/user.model';

export const createAssignment = async (assignmentData: IAssignment): Promise<IAssignment> => {
  const assignment = new AssignmentModel(assignmentData);
  return await assignment.save();
};

export const getAssignmentById = async (id: string): Promise<IAssignment | null> => {
  return await AssignmentModel.findById(id);
};

export const updateAssignment = async (id: string, assignmentData: Partial<IAssignment>): Promise<IAssignment | null> => {
  return await AssignmentModel.findByIdAndUpdate(
    id,
    { $set: assignmentData },
    { new: true, runValidators: true }
  );
};

export const deleteAssignment = async (id: string): Promise<void> => {
  await AssignmentModel.findByIdAndDelete(id);
};

export const getAllAssignments = async (teacherId: string): Promise<IAssignment[]> => {
  return await AssignmentModel.find({ teacherId });
};

// interface QuizSubmission {
//   assignmentId: string;
//   userId: string;
//   answers: { questionId: string; selectedOption: string }[];
//   startTime: Date;
// }

export interface QuizSubmission {
  assignmentId: string;
  userId: string;
  answers: {
    questionId: string;
    selectedOption: string;
  }[];
  startTime: Date;
}

export const startQuiz = async (assignmentId: string, userId: string): Promise<{ assignment: IAssignment; startTime: Date, score: number }> => {
  const assignment = await AssignmentModel.findById(assignmentId);
  if (!assignment) {
    throw new Error('Assignment not found');
  }

  

  const startTime = new Date();
  const score = 0;
  // Here you might want to store the start time in a database or cache
  // For simplicity, we're just returning it

  return { assignment, startTime ,score};
};


//update score in real time
export const updateScore = (assignment: IAssignment, answers: { questionId: string; selectedOption: string }[]): number => {
  
  let score = 0;

  answers.forEach(answer => {
    const question = assignment.questions.find(q => q._id && q._id.toString() === answer.questionId);
    if (question) {
      const correctOption = question.options.find(option => option.isCorrect);
      if (correctOption && correctOption._id && correctOption._id.toString() === answer.selectedOption) {
        score++;
      }
    }
  });

  return score;
};


// export const submitQuiz = async (submission: QuizSubmission): Promise<IQuizSubmission> => {
//   const assignment = await AssignmentModel.findById(submission.assignmentId);
//   if (!assignment) {
//     throw new Error('Assignment not found');
//   }

// //  Fetch user details to get the registration number
//   const user = await userModel.findById(submission.userId);
//   if (!user) {
//     throw new Error('User not found');
//   }
//   const registrationNumber = user.registrationNumber; // Retrieve the registration number from the user

//   const endTime = new Date();
//   const timeTaken = (endTime.getTime() - submission.startTime.getTime()) / 60000; // in minutes

//   // console.log('Start Time:', submission.startTime);
//   // console.log('End Time:', endTime);
//   // console.log('Time Taken (minutes):', timeTaken);
//   // console.log('Allowed Time (minutes):', assignment.timeLimit);

//   // if (timeTaken > assignment.timeLimit) {
//   //   throw new Error('Time limit exceeded');
//   // }

//   // Calculate score
//   let score = 0;
//   submission.answers.forEach(answer => {
//     const question = assignment.questions.find(q => q._id && q._id.toString() === answer.questionId);
//     if (question) {
//       const correctOption = question.options.find(option => option.isCorrect);
//       if (correctOption && correctOption._id && correctOption._id.toString() === answer.selectedOption) {
//         score++;
//       }
//     }
//   });

//   // Create and save the quiz submission
//   const quizSubmission = new QuizSubmissionModel({
//     assignmentId: new mongoose.Types.ObjectId(submission.assignmentId),
//     userId: new mongoose.Types.ObjectId(submission.userId),
//     registrationNumber,
//     answers: submission.answers.map(answer => ({
//       questionId: new mongoose.Types.ObjectId(answer.questionId),
//       selectedOption: new mongoose.Types.ObjectId(answer.selectedOption)
//     })),
//     score,
//     timeTaken,
//     submittedAt: endTime
//   });

//   await quizSubmission.save();

//   return quizSubmission;
// };

export const submitQuiz = async (submission: QuizSubmission): Promise<IQuizSubmission> => {
  // Fetch the complete assignment and log its structure
  const assignment = await AssignmentModel.findById(submission.assignmentId);
  if (!assignment) {
    throw new Error('Assignment not found');
  }
  
  console.log('Assignment structure:', JSON.stringify(assignment, null, 2));

  const user = await userModel.findById(submission.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const registrationNumber = user.registrationNumber;
  const endTime = new Date();
  const timeTaken = (endTime.getTime() - submission.startTime.getTime()) / 60000;

  let score = 0;
  const enrichedAnswers = submission.answers.map(answer => {
    // Find the question and log its structure
    const question = assignment.questions.find(
      q => q._id.toString() === answer.questionId
    );
    
    console.log('Question found:', JSON.stringify(question, null, 2));
    
    if (!question) {
      throw new Error(`Question ${answer.questionId} not found`);
    }

    // Try different possible locations of the question text
    const questionText = question.question || question.questionText || question.text;
    if (!questionText) {
      console.log('Question object structure:', question);
      throw new Error(`Question text not found in structure for question ${answer.questionId}`);
    }

    const selectedOption = question.options.find(
      opt => opt._id.toString() === answer.selectedOption
    );

    if (!selectedOption) {
      throw new Error(`Option ${answer.selectedOption} not found for question ${answer.questionId}`);
    }

    // Try different possible locations of the option text
    const optionText = selectedOption.option || selectedOption.optionText || selectedOption.text;
    if (!optionText) {
      console.log('Option object structure:', selectedOption);
      throw new Error(`Option text not found in structure for option ${answer.selectedOption}`);
    }

    if (selectedOption.isCorrect) {
      score++;
    }

    return {
      questionId: new mongoose.Types.ObjectId(answer.questionId),
      questionText: questionText,
      selectedOption: new mongoose.Types.ObjectId(answer.selectedOption),
      selectedOptionText: optionText
    };
  });

  const quizSubmission = new QuizSubmissionModel({
    assignmentId: new mongoose.Types.ObjectId(submission.assignmentId),
    userId: new mongoose.Types.ObjectId(submission.userId),
    registrationNumber,
    answers: enrichedAnswers,
    score,
    timeTaken,
    submittedAt: endTime
  });

  await quizSubmission.save();
  return quizSubmission;
};


export const getQuizSubmission = async (submissionId: string): Promise<IQuizSubmission | null> => {
  return await QuizSubmissionModel.findById(submissionId);
};

export const getQuizSubmissionsByUser = async (userId: string): Promise<IQuizSubmission[]> => {
  return await QuizSubmissionModel.find({ userId });
};

export const getQuizSubmissionsByAssignment = async (assignmentId: string): Promise<IQuizSubmission[]> => {
  return await QuizSubmissionModel.find({ assignmentId });
};