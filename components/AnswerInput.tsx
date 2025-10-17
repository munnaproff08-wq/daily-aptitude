import React, { useState } from 'react';
import { Spinner } from './Icons';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, isLoading }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !isLoading) {
      onSubmit(answer);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer..."
          disabled={isLoading}
          className="flex-grow w-full px-4 py-3 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-slate-600 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !answer.trim()}
          className="flex items-center justify-center px-6 py-3 font-semibold rounded-md text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default AnswerInput;