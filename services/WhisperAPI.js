import axios from 'axios';

const API_KEY = 'YOUR_OPENAI_API_KEY';
const WHISPER_API_URL = 'https://api.openai.com/v1/whisper/asr';

const sendAudioToWhisper = async (audioData) => {
  try {
    const response = await axios.post(WHISPER_API_URL, audioData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'audio/wav',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending audio to Whisper:', error);
    throw error;
  }
};

export { sendAudioToWhisper };
