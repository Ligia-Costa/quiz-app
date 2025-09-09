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

// Estados para as funcionalidades de cronômetro, audio, pontuação
    const [shuffledQuestions, setShuffledQuestions] = useState(shuffleArray([...originalQuestions]));
    const [timeLeft, setTimeLeft] = useState(15);
    const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
    const [incorrectSound, setIncorrectSound] = useState<Audio.Sound | null>(null);
    const [highScore, setHighScore] = useState(0);

// Carrega sons e recorde ao iniciar o jogo
    useEffect(() => {
    const loadAssets = async () => {
    // Carrega os sons
    const { sound: correct } = await Audio.Sound.createAsync(
        require('../assets/correto.mp3')
    );
    setCorrectSound(correct);
    const { sound: incorrect } = await Audio.Sound.createAsync(
        require('../assets/incorreto.mp3')
    );
    setIncorrectSound(incorrect);

// Carrega o recorde salvo
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
    // Descarrega os sons para liberar memória
        correctSound?.unloadAsync();
        incorrectSound?.unloadAsync();
    };
    }, []);

// Configuração do cronômetro
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

// Obtém a pergunta atual 
    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    const handleOptionPress = async (option: string) => {
        setIsOptionsDisabled(true); // Desativa as opções após o clique
        if (option === currentQuestion.correctAnswer) {
            setScore(score + 1);
// Feedback para resposta correta
    await correctSound?.replayAsync();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
} else {
// Feedback para resposta incorreta
    await incorrectSound?.replayAsync();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
    setSelectedOption(option);
    };

    const handleNextQuestion = () => {
    // Se a pergunta não foi respondida, é contada como errada
    if (!selectedOption) {
    setSelectedOption('timedOut');
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
    // Avança para a próxima pergunta
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(null);
    setIsOptionsDisabled(false);
    setTimeLeft(15); // Reinicia o cronômetro
    } else {
    // Se as perguntas acabarem, o jogo chega ao fim
    setIsQuizFinished(true);
    // Salva o recorde, se for o caso
    if (score > highScore) {
        setHighScore(score);
        AsyncStorage.setItem('highScore', score.toString());
        }
    }
};

    const handlePlayAgain = () => {
    // Reseta todos os estados para seus valores iniciais
    setIsQuizFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsOptionsDisabled(false);
    setScore(0);
    setTimeLeft(15);
    // Embaralha as perguntas para uma nova rodada
    setShuffledQuestions(shuffleArray([...originalQuestions]));
    };
    
    const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

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
    />
  );
};