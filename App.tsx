import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { AppState, DailyData } from './types';
import { generateQuestionFromPdf, evaluateAnswer, fileToBase64 } from './services/geminiService';
import FileUpload from './components/FileUpload';
import StreakCounter from './components/StreakCounter';
import AnswerInput from './components/AnswerInput';
import { Spinner, CheckIcon, CrossIcon, ReloadIcon, FullscreenEnterIcon } from './components/Icons';

const AnimatedBackground = () => (
  <ul className="background-shapes" aria-hidden="true">
    <li>S.I. = (P×R×T)/100</li>
    <li>Speed = Dist/Time</li>
    <li>nCr = n!/r!(n-r)!</li>
    <li>Avg = Sum/Count</li>
    <li>P(A) = n(A)/n(S)</li>
    <li>nPr = n!/(n-r)!</li>
    <li>Work = Rate × Time</li>
    <li>A = P(1+R/100)ⁿ</li>
    <li>(a+b)²</li>
    <li>x% of y</li>
    <li>a²+b²=c²</li>
    <li>A = πr²</li>
    <li>A = ½bh</li>
    <li>(x-y)(x+y)</li>
    <li>V = lwh</li>
  </ul>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('INITIAL_LOAD');
  const [dailyData, setDailyData] = useLocalStorage<DailyData | null>('dailyData', null);
  const [streak, setStreak] = useLocalStorage<number>('streak', 0);
  const [storedPdf, setStoredPdf] = useLocalStorage<string | null>('storedPdf', null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (storedPdf) {
        generateQuestionFromStoredPdf();
      } else {
        setAppState('UPLOAD');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        if (['QUESTION', 'EVALUATING', 'RESULT', 'ERROR'].includes(appState)) {
           if (!dailyData?.isCorrect) {
              setAppState('PROMPT_FULLSCREEN');
           }
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [appState, dailyData]);

  const generateQuestionFromStoredPdf = async () => {
    if (!storedPdf) {
      setAppState('UPLOAD');
      return;
    }
    setAppState('GENERATING');
    setError(null);
    try {
      const questionData = await generateQuestionFromPdf(storedPdf);
      const newDailyData: DailyData = { question: questionData };
      setDailyData(newDailyData);
      setAppState('PROMPT_FULLSCREEN');
    } catch (e) {
      console.error(e);
      setError('Failed to generate a question from the stored PDF. Please try again or upload a new one.');
      setAppState('ERROR');
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a valid PDF file.');
      setAppState('ERROR');
      return;
    }
    setAppState('GENERATING');
    setError(null);
    try {
      const pdfBase64 = await fileToBase64(file);
      setStoredPdf(pdfBase64);
      const questionData = await generateQuestionFromPdf(pdfBase64);
      const newDailyData: DailyData = { question: questionData };
      setDailyData(newDailyData);
      setAppState('PROMPT_FULLSCREEN');
    } catch (e) {
      console.error(e);
      setError('Failed to generate a question from the PDF. Please try again.');
      setAppState('ERROR');
    }
  };

  const handleStartChallenge = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setAppState('QUESTION');
    } catch (err) {
      console.error("Failed to enter fullscreen", err);
      setAppState('QUESTION');
    }
  };
  
  const handleAnswerSubmit = async (userAnswer: string) => {
    if (!dailyData?.question) return;

    setAppState('EVALUATING');
    setError(null);
    try {
      const isCorrect = await evaluateAnswer(dailyData.question.question, dailyData.question.answer, userAnswer);
      
      const updatedDailyData: DailyData = { ...dailyData, userAnswer, isCorrect };
      setDailyData(updatedDailyData);

      if (isCorrect) {
        setStreak(prevStreak => prevStreak + 1);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      // NOTE: Streak is no longer reset on incorrect answer
      setAppState('RESULT');

    } catch (e) {
      console.error(e);
      setError('Failed to evaluate your answer. Please try again.');
      setAppState('ERROR');
    }
  };

  const handleChangePdf = () => {
    setStoredPdf(null);
    setDailyData(null);
    setError(null);
    setAppState('UPLOAD');
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'INITIAL_LOAD':
        return <div className="flex items-center justify-center min-h-screen"><Spinner className="w-12 h-12 animate-spin text-cyan-500" /></div>;
      case 'UPLOAD':
        return <FileUpload onFileSelect={handleFileSelect} isLoading={false} />;
      case 'GENERATING':
        return (
          <div className="text-center p-8 animate-fade-in-scale">
            <Spinner className="w-12 h-12 animate-spin text-cyan-500 mx-auto" />
            <p className="mt-4 text-slate-700 font-semibold">Generating your daily question...</p>
            <p className="text-slate-500">This might take a moment.</p>
          </div>
        );
      case 'PROMPT_FULLSCREEN':
          return (
            <div className="w-full max-w-lg text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg animate-fade-in-scale">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Challenge Ready!</h1>
                <p className="text-slate-600 mb-8">Enter fullscreen for a distraction-free experience.</p>
                <button
                    onClick={handleStartChallenge}
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 font-semibold rounded-md text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                    <FullscreenEnterIcon className="w-6 h-6" />
                    Start Challenge
                </button>
            </div>
          );
      case 'QUESTION':
        return (
          <div className="w-full max-w-2xl text-center p-4 animate-fade-in-scale">
            <p className="text-sm text-slate-500 mb-2">Daily Challenge</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">{dailyData?.question.question}</h2>
            <AnswerInput onSubmit={handleAnswerSubmit} isLoading={false} />
          </div>
        );
      case 'EVALUATING':
        return (
          <div className="text-center p-8 animate-fade-in-scale">
            <Spinner className="w-12 h-12 animate-spin text-cyan-500 mx-auto" />
            <p className="mt-4 text-slate-700 font-semibold">Checking your answer...</p>
          </div>
        );
      case 'RESULT':
        if (!dailyData) return null;
        return (
          <div className="w-full max-w-2xl text-center p-4 animate-fade-in-scale">
            {dailyData.isCorrect ? (
              <>
                <CheckIcon className="w-20 h-20 mx-auto text-green-500 bg-green-100 rounded-full p-2 animate-pop-in" />
                <h2 className="text-3xl font-bold text-slate-800 mt-4">Correct!</h2>
                <p className="text-slate-600 mt-2">Challenge complete! You've extended your streak.</p>
              </>
            ) : (
              <>
                <CrossIcon className="w-20 h-20 mx-auto text-red-500 bg-red-100 rounded-full p-2 animate-pop-in" />
                <h2 className="text-3xl font-bold text-slate-800 mt-4">Incorrect</h2>
                <p className="text-slate-600 mt-2">That wasn't quite right. Your streak is safe, though!</p>
              </>
            )}
             <p className="mt-6 p-4 bg-slate-200 rounded-lg text-slate-700">
                <strong>Correct Answer:</strong> {dailyData.question.answer}
             </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={generateQuestionFromStoredPdf}
                    className="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-md text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                    <ReloadIcon className="w-5 h-5" />
                    Next Question
                </button>
                <button
                    onClick={handleChangePdf}
                    className="px-6 py-3 font-semibold rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
                >
                    Use a Different PDF
                </button>
            </div>
          </div>
        );
      case 'ERROR':
        return (
            <div className="w-full max-w-lg text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg animate-fade-in-scale">
                <CrossIcon className="w-16 h-16 mx-auto text-red-500" />
                <h2 className="text-2xl font-bold text-slate-800 mt-4">An Error Occurred</h2>
                <p className="text-slate-600 mt-2 mb-6">{error}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={storedPdf ? generateQuestionFromStoredPdf : handleChangePdf}
                        className="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-md text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                    >
                        <ReloadIcon className="w-5 h-5" />
                        Try Again
                    </button>
                    <button
                        onClick={handleChangePdf}
                        className="px-6 py-3 font-semibold rounded-md text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
                    >
                        Use a Different PDF
                    </button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const isChallengeActive = !['UPLOAD', 'INITIAL_LOAD', 'PROMPT_FULLSCREEN'].includes(appState);

  return (
    <main className="bg-slate-100 min-h-screen w-full flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {isChallengeActive && <StreakCounter streak={streak} />}
        {renderContent()}
      </div>
    </main>
  );
};

export default App;