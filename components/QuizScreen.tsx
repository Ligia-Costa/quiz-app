import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated } from 'react-native';

// Definindo o formato de um objeto de pergunta
type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizScreenProps = {
  currentQuestion: Question;
  selectedOption: string | null;
  isOptionsDisabled: boolean;
  onOptionPress: (option: string) => void;
  onNextQuestion: () => void;
  timeLeft: number;
  progress: number; // FRAÇÃO entre 0 e 1
};

export default function QuizScreen({
  currentQuestion,
  selectedOption,
  isOptionsDisabled,
  onOptionPress,
  onNextQuestion,
  timeLeft,
  progress,
}: QuizScreenProps) {
  // Animated value para largura da barra
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.max(0, Math.min(1, progress)),
      duration: 400,
      useNativeDriver: false, // não podemos animar width com native driver
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const getOptionStyle = (option: string) => {
    if (selectedOption) {
      const isCorrect = option === currentQuestion.correctAnswer;
      if (isCorrect) {
        return styles.correctOption;
      }
      if (option === selectedOption && !isCorrect) {
        return styles.incorrectOption;
      }
    }
    return {};
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de progresso personalizada */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, getOptionStyle(option)]}
            onPress={() => onOptionPress(option)}
            disabled={isOptionsDisabled}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedOption && (
        <TouchableOpacity style={styles.nextButton} onPress={onNextQuestion}>
          <Text style={styles.nextButtonText}>Próxima Pergunta</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#77b5ecff',
    paddingVertical: 80,
    paddingHorizontal: 15,
  },
  progressContainer: {
    height: 12,
    width: '90%',
    backgroundColor: '#d1e7ff',
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#031663',
  },
  timerContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#031663ff',
  },
  questionContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  option: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#031663ff',
  },
  optionText: {
    fontSize: 15,
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#D4EDDA',
    borderWidth: 2,
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: '#F8D7DA',
    borderWidth: 2,
  },
  nextButton: {
    backgroundColor: '#007BFF',
    padding: 18,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});