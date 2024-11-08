import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { CommonModule } from "@angular/common";
import { environment } from "../../environments/environment.development";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-speech-ai",
  templateUrl: "./speech-ai.component.html",
  styleUrls: ["./speech-ai.component.scss"],
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatIcon]
})
export class SpeechAiComponent implements OnInit, OnDestroy {
  public recognition: any;
  private client!: RealtimeClient;
  isListening = false;
  public aiResponseText: string = "";
  private currentAudioContext?: AudioContext;
  private currentSource?: AudioBufferSourceNode;
  private currentItemId?: string;
  private currentSampleCount: number = 0;
  private sampleInterval?: any;
  private lastProcessedItemId?: string;

  constructor() {
    // Initialize speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      // Keeps listening even after getting results
      this.recognition.continuous = true;
      // Provides real-time results as user speaks
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      this.recognition.onend = () => {
        console.log("Speech recognition ended");
        // If we're still supposed to be listening but recognition stopped
        if (this.isListening) {
          this.recognition.start();
        }
      };

      this.recognition.onresult = (event: any) => {
        console.log("Got speech result:", event);
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        console.log("Transcript:", transcript);

        if (event.results[0].isFinal) {
          this.sendMessage(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        this.isListening = false;
      };
    } else {
      console.error("Speech recognition not supported in this browser");
    }

    // Initialize OpenAI Realtime client
    try {
      this.client = new RealtimeClient({
        apiKey: environment.openAiKey,
        dangerouslyAllowAPIKeyInBrowser: true,
      });
    } catch (error) {
      console.error("Failed to initialize OpenAI client:", error);
    }
  }

  async ngOnInit() {
    // Set up OpenAI client configuration
    this.client.updateSession({
      instructions: `You are a friendly AI assistant for Pax, a life insurance company based in Basel, Switzerland. Your role is to help customers purchase insurance and answer questions about Pax and insurance policies.

Required Information to Collect (with explanations):
1. Name - For conversation personalization
2. Gender (Male/Female/Other) - For risk assessment
3. Date of Birth (YYYY-MM-DD) - For policy options
4. Smoking Status - For health risk evaluation
5. Insurance Amount - For coverage planning
6. Insurance Length (years) - For term selection
7. Weight (kg) - For health profile
8. Height (cm) - For health profile
9. Address - For regional policy determination
10. Profession - For risk assessment

Always:
- Keep your responses concise and to the point
- Provide clear explanations for why information is needed
- Assure customers about data privacy when needed
- Answer any questions about Pax or insurance policies
- Make customers feel heard and supported`,
      voice: "alloy",
      turn_detection: { type: "server_vad" },
      input_audio_transcription: { model: "whisper-1" },
    });

    // Handle conversation updates
    this.client.on("conversation.updated", (event: any) => {
      const { item, delta } = event;
      const items = this.client.conversation.getItems();
      console.log("Current item:", item);
      console.log("All items:", items);


      // Skip if we've already processed this item
      if (this.lastProcessedItemId === item.id) {
        return;
      }

      if (item.status === "completed" && item.formatted?.audio) {
        try {
          // Stop any currently playing audio
          this.stopCurrentAudio();

          // Only process if we have valid audio data
          if (item.formatted.audio.length > 0) {
            this.lastProcessedItemId = item.id;
            this.currentItemId = item.id;
            this.currentSampleCount = 0;

            // Create new audio context and source
            this.currentAudioContext = new AudioContext();
            const audioBuffer = this.currentAudioContext.createBuffer(
              1, // number of channels
              item.formatted.audio.length,
              24000, // sample rate
            );
            const channelData = audioBuffer.getChannelData(0);

            // Convert Int16Array to Float32Array for audio playback
            for (let i = 0; i < item.formatted.audio.length; i++) {
              channelData[i] = item.formatted.audio[i] / 32768.0;
            }

            this.currentSource = this.currentAudioContext.createBufferSource();
            this.currentSource.buffer = audioBuffer;
            this.currentSource.connect(this.currentAudioContext.destination);

            // Track sample count during playback
            const startTime = this.currentAudioContext.currentTime;
            this.sampleInterval = setInterval(() => {
              if (this.currentAudioContext) {
                const elapsedTime =
                  this.currentAudioContext.currentTime - startTime;
                this.currentSampleCount = Math.floor(elapsedTime * 24000); // 24000 is sample rate
              }
            }, 100); // Update every 100ms

            // Clean up when playback ends
            this.currentSource.onended = () => {
              this.stopCurrentAudio();
            };

            this.currentSource.start();
          }

          // Comment out text display
          if (item.formatted.transcript) {
            this.aiResponseText = item.formatted.transcript;
          }
        } catch (error) {
          console.error("Error playing audio:", error);
          this.stopCurrentAudio();
        }
      }
    });

    // Connect to OpenAI
    try {
      await this.client.connect();
    } catch (error) {
      console.error("Failed to connect to OpenAI:", error);
    }
  }

  ngOnDestroy() {
    this.stopCurrentAudio();
    this.lastProcessedItemId = undefined;
    this.client?.disconnect();
  }

  async toggleListening() {
    console.log("Toggle listening clicked. Current state:", this.isListening);
    try {
      if (this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      } else {
        await this.recognition.start();
        this.isListening = true;
      }
    } catch (error) {
      console.error("Error toggling speech recognition:", error);
      this.isListening = false;
    }
  }

  private async sendMessage(transcript: string) {
    try {
      await this.client.sendUserMessageContent([
        { type: "input_text", text: transcript },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  isRecognitionAvailable(): boolean {
    return !!this.recognition;
  }

  private stopCurrentAudio() {
    // Cancel the response if we have a current item
    if (this.currentItemId) {
      try {
        this.client.cancelResponse(this.currentItemId, this.currentSampleCount);
      } catch (error) {
        console.error("Error canceling response:", error);
      }
    }

    // Clear the sample tracking interval
    if (this.sampleInterval) {
      clearInterval(this.sampleInterval);
      this.sampleInterval = undefined;
    }

    // Stop and clean up audio
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Ignore errors when stopping already stopped source
      }
      this.currentSource = undefined;
    }

    if (this.currentAudioContext) {
      this.currentAudioContext.close();
      this.currentAudioContext = undefined;
    }

    // Reset tracking variables
    this.currentItemId = undefined;
    this.currentSampleCount = 0;
  }
}
