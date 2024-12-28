import { IAssignment } from '../../models/mcq.model';

declare global {
  namespace Express {
    interface Request {
      assignment?: IAssignment;
    }
  }
}