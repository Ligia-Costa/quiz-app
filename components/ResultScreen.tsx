import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

//usando tipos para a definição das props
type ResultScreenProps = {
    score: number;
    totalQuestions: number;
    highScore: number;
    onPlayAgain: () => void; //função para o botão
};

export default function ResultsScreen({ score, totalQuestions, onPlayAgain, highScore}: ResultScreenProps) {
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Fim do Jogo!</Text>
      <Text style={styles.scoreText}>
        Você acertou {score} de {totalQuestions} perguntas!
      </Text>
      <Text style={styles.highScoreText}>Seu recorde: {highScore} pontos</Text>

      <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
        <Text style={styles.buttonText}>Jogar Novamente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#555',
  },
  highScoreText: {
    fontSize: 20,
    marginBottom: 40,
    color: '#777',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});