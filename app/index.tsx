import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizScreen from '../components/QuizScreen';
import ResultScreen from '../components/ResultScreen';
import StartScreen from './StartScreen';
import originalQuestions from '../questions.json';

// Função para embaralhar um array
const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function HomePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const [shuffledQuestions, setShuffledQuestions] = useState(shuffleArray([...originalQuestions]));
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [incorrectSound, setIncorrectSound] = useState<Audio.Sound | null>(null);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const loadAssets = async () => {
      const { sound: correct } = await Audio.Sound.createAsync(require('../assets/correto.mp3'));
      setCorrectSound(correct);
      const { sound: incorrect } = await Audio.Sound.createAsync(require('../assets/incorreto.mp3'));
      setIncorrectSound(incorrect);

      try {
        const storedHighScore = await AsyncStorage.getItem('highScore');
        if (storedHighScore !== null) {
          setHighScore(parseInt(storedHighScore));
        }
      } catch (e) {
        console.error("Falha ao carregar o recorde", e);
      }
    };
    loadAssets();

    return () => {
      correctSound?.unloadAsync();
      incorrectSound?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !isOptionsDisabled) {
      handleNextQuestion();
    }
    if (!isOptionsDisabled && !isQuizFinished) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, isOptionsDisabled, isQuizFinished]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleOptionPress = async (option: string) => {
    setIsOptionsDisabled(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
      await correctSound?.replayAsync();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await incorrectSound?.replayAsync();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) {
      setSelectedOption('timedOut');
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsOptionsDisabled(false);
      setTimeLeft(30);
    } else {
      setIsQuizFinished(true);
      if (score > highScore) {
        setHighScore(score);
        AsyncStorage.setItem('highScore', score.toString());
      }
    }
  };

  const handlePlayAgain = () => {
    setIsQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsOptionsDisabled(false);
    setScore(0);
    setTimeLeft(30);
    setShuffledQuestions(shuffleArray([...originalQuestions]));
  };

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  // --- aqui calculamos o progresso como FRAÇÃO (0..1)
  const TOTAL_QUESTIONS = originalQuestions.length; // deve ser 30
  const progress = Math.min(1, (currentQuestionIndex + 1) / TOTAL_QUESTIONS);

  if (!isQuizStarted) {
    return <StartScreen onStart={handleStartQuiz} />;
  }

  return isQuizFinished ? (
    <ResultScreen
      score={score}
      totalQuestions={originalQuestions.length}
      highScore={highScore}
      onPlayAgain={handlePlayAgain}
    />
  ) : (
    <QuizScreen
      currentQuestion={currentQuestion}
      selectedOption={selectedOption}
      isOptionsDisabled={isOptionsDisabled}
      onOptionPress={handleOptionPress}
      onNextQuestion={handleNextQuestion}
      timeLeft={timeLeft}
      progress={progress} // FRAÇÃO entre 0 e 1
    />
  );
}