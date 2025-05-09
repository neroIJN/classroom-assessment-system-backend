"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationMiddleware = void 0;
class ViolationMiddleware {
    constructor() {
        this.validateViolationPayload = (req, res, next) => {
            try {
                const { studentId, quizId, violation } = req.body;
                if (!studentId || !quizId || !violation) {
                    res.status(400).json({
                        success: false,
                        message: 'Missing required fields'
                    });
                    return;
                }
                const validViolationTypes = [
                    'Tab Switch',
                    'Window Switch',
                    'Mouse Exit',
                    'Keyboard Shortcut',
                    'Copy Paste',
                    'Right Click',
                    'Fullscreen Exit'
                ];
                if (!validViolationTypes.includes(violation.type)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid violation type'
                    });
                    return;
                }
                if (!violation.timestamp || isNaN(Date.parse(violation.timestamp))) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid timestamp'
                    });
                    return;
                }
                next();
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Middleware validation error',
                    error: error.message
                });
            }
        };
    }
}
exports.ViolationMiddleware = ViolationMiddleware;
