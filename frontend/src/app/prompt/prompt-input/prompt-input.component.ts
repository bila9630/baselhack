import { Component, inject, OnInit } from "@angular/core";
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { PromptService } from "../service/prompt.service";
import { VoiceRecognitionService } from "../../voice-recognition/service/voice-recognition.service";
import { debounceTime, distinctUntilChanged, exhaustMap, of, tap } from "rxjs";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: "app-prompt-input",
  standalone: true,
  imports: [
    MatInput,
    MatLabel,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: "./prompt-input.component.html",
  styleUrl: "./prompt-input.component.scss",
})
export class PromptInputComponent implements OnInit {
  userInput: string = "";

  promptService = inject(PromptService);

  voiceRecognitionService = inject(VoiceRecognitionService);

  speechApiExists: boolean = false;

  recordingStarted = false;

  question: string = "";

  ngOnInit() {
    this.speechApiExists =
      this.voiceRecognitionService.speechRecognitionApiInBrowser();

    this.voiceRecognitionService.lastSpeech
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((speech: string) => {
          console.log("brr", speech);
          this.question =
            speech.charAt(0).toUpperCase() + speech.slice(1) + "?";
        }),
        exhaustMap(() => of(this.question)),
      )
      .subscribe((response: string) => {
        this.promptService.addNewPromptToChat(response, "user");
        this.recordingStarted = !this.recordingStarted;
      });
  }

  addPrompt() {
    this.promptService.addNewPromptToChat(this.userInput, "user");
    this.userInput = "";
  }

  toggleRecording(): void {
    this.recordingStarted = !this.recordingStarted;
    if (this.recordingStarted) {
      this.voiceRecognitionService.startVoiceRecognition();
    } else {
      this.voiceRecognitionService.stopVoiceRecognition();
    }
    console.log("recording state changed", this.recordingStarted);
  }
}
