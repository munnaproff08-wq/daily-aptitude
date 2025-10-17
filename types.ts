
export interface DailyQuestion {
  question: string;
  answer: string;
}

export interface DailyData {
  question: DailyQuestion;
  userAnswer?: string;
  isCorrect?: boolean;
}

export type AppState =
  | 'INITIAL_LOAD'
  | 'UPLOAD'
  | 'GENERATING'
  | 'QUESTION'
  | 'EVALUATING'
  | 'RESULT'
  | 'ERROR';
