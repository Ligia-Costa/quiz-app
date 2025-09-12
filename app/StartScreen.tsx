import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type StartScreenProps = {
  onStart: () => void;
};

const logoImage = require('../assets/logo.png');

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <LinearGradient colors={['#77b5ec', '#4a90e2']} style={styles.container}>
      <Text style={styles.title}>PortuPlay</Text>

      <Image source={logoImage} style={styles.logo} />

      <Text style={styles.subtitulo}>
        Teste os seus <Text style={styles.bold}>conhecimentos</Text> em Língua Portuguesa✍🏻
      </Text>

      <TouchableOpacity style={styles.button} onPress={onStart} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Praticar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 20,
    color: '#f0f0f0',
    marginBottom: 40,
    textAlign: 'center',
    width: '80%',
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#031663',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // sombra no Android
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#031663',
  },
});