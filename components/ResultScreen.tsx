import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ResultScreenProps = {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
};

type Player = {
  name: string;
  score: number;
};

export default function ResultsScreen({ score, totalQuestions, onPlayAgain }: ResultScreenProps) {
  const [name, setName] = useState("");
  const [ranking, setRanking] = useState<Player[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadRanking();
  }, []);

  const saveScore = async () => {
    if (!name.trim()) return;

    const newEntry: Player = { name, score };
    const updatedRanking = [...ranking, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setRanking(updatedRanking);
    await AsyncStorage.setItem("ranking", JSON.stringify(updatedRanking));
    setName("");
    setSaved(true); // esconde input e botão
  };

  const loadRanking = async () => {
    const stored = await AsyncStorage.getItem("ranking");
    if (stored) {
      setRanking(JSON.parse(stored));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Fim do Jogo!</Text>
        <Text style={styles.scoreText}>
          Você acertou {score} de {totalQuestions} perguntas!
        </Text>

        {/* Mostra input e botão apenas se ainda não salvou */}
        {!saved && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveScore}>
              <Text style={styles.buttonText}>Salvar Pontuação</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Ranking */}
        <Text style={styles.subtitle}>🏆 Ranking</Text>
        <FlatList
          data={ranking}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Text style={styles.rankingItem}>
              {index + 1}. {item.name} - {item.score} pontos
            </Text>
          )}
        />

        <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain}>
          <Text style={styles.buttonText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginTop: 150,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 20,
    color: "#555",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginBottom: 10,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 100,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  rankingItem: {
    fontSize: 18,
    marginVertical: 4,
    color: "#333",
  },
});