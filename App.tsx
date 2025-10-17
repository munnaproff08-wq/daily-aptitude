import React, { useState, useCallback, useEffect } from 'react';
import { AppState, DailyData } from './types';
import { fileToBase64, generateQuestionFromPdf, evaluateAnswer } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import FileUpload from './components/FileUpload';
import StreakCounter from './components/StreakCounter';
import AnswerInput from './components/AnswerInput';
import { Spinner, CheckIcon, CrossIcon, ReloadIcon } from './components/Icons';

const AnimatedBackground: React.FC = () => {
  const formulas = [
    'E=mc²', 'H₂O', 'a²+b²=c²', 'Σ', '∫f(x)dx', '√x', 'π', 'y=mx+b', 'F=ma', 'λ'
  ];

  return (
    <ul className="background-shapes">
      {formulas.map((formula, index) => (
        <li key={index}>{formula}</li>
      ))}
    </ul>
  );
};

const App: React.FC = () => {
  const [storedPdf, setStoredPdf] = useLocalStorage<string | null>('storedPdfBase64', null);
  const [appState, setAppState] = useState<AppState>('INITIAL_LOAD');
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [streak, setStreak] = useLocalStorage<number>('dailyStreak', 0);
  const [error, setError] = useState<string | null>(null);

  const generateNewQuestion = useCallback(async (pdfBase64: string) => {
    setAppState('GENERATING');
    setError(null);
    setDailyData(null);
    try {
      const questionData = await generateQuestionFromPdf(pdfBase64);
      setDailyData({ question: questionData });
      setAppState('QUESTION');
    } catch (err) {
      console.error(err);
      setError('Failed to generate a question from the PDF. It might be incompatible or corrupted.');
      setStoredPdf(null); // Clear the corrupted PDF
      setAppState('ERROR');
    }
  }, [setStoredPdf]);

  useEffect(() => {
    // On initial load, check if a PDF is already stored.
    if (storedPdf) {
      generateNewQuestion(storedPdf);
    } else {
      setAppState('UPLOAD');
    }
    // This effect should only run once on component mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setStoredPdf(base64);
      await generateNewQuestion(base64);
    } catch (err) {
      console.error(err);
      setError('Failed to read the selected file. Please ensure it is a valid PDF.');
      setAppState('ERROR');
    }
  }, [generateNewQuestion, setStoredPdf]);

  const handleAnswerSubmit = useCallback(async (userAnswer: string) => {
    if (!dailyData?.question) return;

    setAppState('EVALUATING');
    setError(null);
    setDailyData(prev => prev ? { ...prev, userAnswer } : null);
    try {
      const isCorrect = await evaluateAnswer(dailyData.question.question, dailyData.question.answer, userAnswer);
      setDailyData(prev => prev ? { ...prev, isCorrect } : null);
      if (isCorrect) {
        setStreak(s => s + 1);
      } else {
        setStreak(0);
      }
      setAppState('RESULT');
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate your answer. Please try again.');
      setAppState('ERROR');
    }
  }, [dailyData, setStreak]);

  const handleChangePdf = () => {
    setStoredPdf(null);
    setDailyData(null);
    setError(null);
    setAppState('UPLOAD');
  };

  const handleNextQuestion = () => {
    if (storedPdf) {
      generateNewQuestion(storedPdf);
    } else {
      handleChangePdf();
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'INITIAL_LOAD':
        return (
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto text-cyan-500 animate-spin" />
            <p className="mt-4 text-slate-600">Loading your session...</p>
          </div>
        );
      case 'UPLOAD':
        return <FileUpload onFileSelect={handleFileSelect} isLoading={false} />;
      case 'GENERATING':
        return (
          <div className="text-center">
            <Spinner className="w-12 h-12 mx-auto text-cyan-500 animate-spin" />
            <p className="mt-4 text-slate-600">Generating your daily question...</p>
            <p className="text-slate-500 text-sm">This might take a moment.</p>
          </div>
        );
      case 'QUESTION':
        return (
          dailyData && (
            <div className="relative w-full max-w-lg text-center p-8 bg-slate-800 rounded-lg shadow-xl">
               <button 
                 onClick={handleNextQuestion} 
                 className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                 aria-label="Get a new question"
                >
                <ReloadIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-semibold text-slate-100 mb-6">{dailyData.question.question}</h2>
              <AnswerInput onSubmit={handleAnswerSubmit} isLoading={false} />
            </div>
          )
        );
      case 'EVALUATING':
        return (
          dailyData && (
            <div className="w-full max-w-lg text-center p-8 bg-slate-800 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-100 mb-6">{dailyData.question.question}</h2>
              <p className="text-slate-400 mb-4">Your answer: "{dailyData.userAnswer}"</p>
              <AnswerInput onSubmit={handleAnswerSubmit} isLoading={true} />
            </div>
          )
        );
      case 'RESULT':
        return (
          dailyData && (
            <div className="w-full max-w-lg text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
              <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center animate-pop-in ${dailyData.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {dailyData.isCorrect ? <CheckIcon className="w-10 h-10 text-green-500" /> : <CrossIcon className="w-10 h-10 text-red-500" />}
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${dailyData.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {dailyData.isCorrect ? 'Correct!' : 'Incorrect'}
              </h2>
              <p className="text-slate-600 mb-1">The correct answer was:</p>
              <p className="text-lg font-semibold text-cyan-600 mb-6">{dailyData.question.answer}</p>
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold rounded-md text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  <ReloadIcon className="w-5 h-5" />
                  <span>Next Question</span>
                </button>
                <button
                    onClick={handleChangePdf}
                    className="w-full px-6 py-2 font-medium rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                >
                    Use a Different PDF
                </button>
              </div>
            </div>
          )
        );
      case 'ERROR':
        return (
            <div className="w-full max-w-lg text-center p-8 bg-red-50/80 backdrop-blur-sm rounded-lg border border-red-300">
                <h2 className="text-2xl font-bold text-red-700 mb-4">An Error Occurred</h2>
                <p className="text-slate-700 mb-6">{error}</p>
                <div className="space-y-3">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!storedPdf}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold rounded-md text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <ReloadIcon className="w-5 h-5" />
                        <span>Try Again</span>
                    </button>
                    <button
                        onClick={handleChangePdf}
                        className="w-full px-6 py-2 font-medium rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                    >
                        Start Over with a New PDF
                    </button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative text-slate-900 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-300 selection:text-cyan-900 overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-full">
            <StreakCounter streak={streak} />
            <main className="flex flex-col items-center justify-center w-full">
                <div key={appState} className="animate-fade-in-scale w-full flex justify-center">
                    {renderContent()}
                </div>
            </main>
        </div>
    </div>
  );
};

export default App;