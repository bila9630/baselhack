import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RealtimeClient } from '@openai/realtime-api-beta';

@Component({
  selector: 'app-speech-ai',
  templateUrl: './speech-ai.component.html',
  styleUrls: ['./speech-ai.component.scss'],
  standalone: true,
  imports: [MatButtonModule]
})
export class SpeechAiComponent implements OnInit, OnDestroy {
  public recognition: any;
  private client!: RealtimeClient;
  isListening = false;

  constructor() {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        // If we're still supposed to be listening but recognition stopped
        if (this.isListening) {
          this.recognition.start();
        }
      };

      this.recognition.onresult = (event: any) => {
        console.log('Got speech result:', event);
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        
        console.log('Transcript:', transcript);
        
        if (event.results[0].isFinal) {
          this.sendMessage(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        this.isListening = false;
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    // Initialize OpenAI Realtime client
    try {
      this.client = new RealtimeClient({
        apiKey: "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",
        dangerouslyAllowAPIKeyInBrowser: true
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
    }
  }

  async ngOnInit() {
    // Set up OpenAI client configuration
    this.client.updateSession({
      instructions: 'You are a helpful and friendly AI assistant.',
      voice: 'alloy',
      turn_detection: { type: 'server_vad' },
      input_audio_transcription: { model: 'whisper-1' }
    });

    // Handle conversation updates
    this.client.on('conversation.updated', (event:any) => {
      const { item, delta } = event;
      console.log('Response:', item);
      // Here you can handle the AI's response
      // You might want to use text-to-speech to speak the response
    });

    // Connect to OpenAI
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to OpenAI:', error);
    }
  }

  ngOnDestroy() {
    // Clean up
    this.client?.disconnect();
  }

  async toggleListening() {
    console.log('Toggle listening clicked. Current state:', this.isListening);
    try {
      if (this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      } else {
        await this.recognition.start();
        this.isListening = true;
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      this.isListening = false;
    }
  }

  private async sendMessage(transcript: string) {
    try {
      await this.client.sendUserMessageContent([
        { type: 'input_text', text: transcript }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  isRecognitionAvailable(): boolean {
    return !!this.recognition;
  }
}
