import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import * as Permissions from 'expo-permissions'; // Import Expo Permissions module
import Voice from '@react-native-community/voice';
import axios from 'axios';

const API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key
const WHISPER_API_URL = 'https://api.openai.com/v1/whisper/asr'; // Replace with your actual Whisper ASR API URL

const App = () => {
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Request microphone permission when the component mounts
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status !== 'granted') {
        console.log('Permission to access microphone denied!');
      }
    })();
  }, []);

  useEffect(() => {
    // Initialize the Voice module when the component mounts
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    return () => {
      // Clean up the Voice module when the component unmounts
      Voice.removeAllListeners();
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('Speech started');
  };

  const onSpeechEndHandler = (e) => {
    console.log('Speech ended');
  };

  const onSpeechResultsHandler = (e) => {
    console.log('Speech results:', e.value);
  };

  const onSpeechErrorHandler = (e) => {
    console.error('Speech error:', e);
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start('en-US'); // or your desired language code
    } catch (e) {
      console.error('Error starting recording:', e);
      setIsRecording(false); // Reset recording state on error
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await Voice.stop();
      const audioData = await Voice.stopCapturing(); // Get the recorded audio data
      await sendAudioToWhisperAPI(audioData); // Call the function to send audio to Whisper API
    } catch (e) {
      console.error('Error stopping recording:', e);
    }
  };

  const sendAudioToWhisperAPI = async (audioData) => {
    try {
      const response = await axios.post(WHISPER_API_URL, audioData, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'audio/wav',
        },
      });

      console.log('Whisper API response:', response.data); // Log Whisper API response
    } catch (error) {
      console.error('Error sending audio to Whisper:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.status}>{isRecording ? 'Recording...' : 'Not Recording'}</Text>
      <TouchableOpacity style={styles.button} onPress={isRecording ? stopRecording : startRecording}>
        <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
