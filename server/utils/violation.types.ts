// src/types/violation.types.ts
import { Types } from 'mongoose';

export type ViolationType = 
  | 'Tab Switch'
  | 'Window Switch'
  | 'Mouse Exit'
  | 'Keyboard Shortcut'
  | 'Right Click'
  | 'Fullscreen Exit';

export interface IViolation {
  studentId: Types.ObjectId;
  quizId: Types.ObjectId;
  violation: {
    type: ViolationType;
    timestamp: Date;
    count?: number;
    key?: string;
  };
  createdAt: Date;
}

export interface ICreateViolationDto {
  studentId: string;
  quizId: string;
  violation: {
    type: ViolationType;
    timestamp: string;
    count?: number;
    key?: string;
  };
}