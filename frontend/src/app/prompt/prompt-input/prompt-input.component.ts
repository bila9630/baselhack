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
import {
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  take,
  tap,
} from "rxjs";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ChatGptService } from "../../chat-gpt/chat-gpt.service";
import { BubbleService } from "../../bubble/bubble.service";
import { UserDataService } from "../../user-data/user-data.service";

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

  bubbleService = inject(BubbleService);

  chatGptService = inject(ChatGptService);

  userDataService = inject(UserDataService);

  voiceRecognitionService = inject(VoiceRecognitionService);

  speechApiExists: boolean = false;

  recordingStarted = false;

  question: string = "";

  ngOnInit() {
    this.speechApiExists =
      this.voiceRecognitionService.speechRecognitionApiInBrowser();
    console.log(this.bubbleService._bubble$.value);

    this.voiceRecognitionService.lastSpeech
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((speech: string) => {
          this.question = speech.charAt(0).toUpperCase() + speech.slice(1);
          this.promptService.addNewPromptToChat(this.question, "user", []);
        }),
        exhaustMap(() =>
          this.chatGptService.askQuestion(
            this.question,
            this.chatGptService.temporalId,
          ),
        ),
      )
      .subscribe((response) => {
        this.promptService.addNewPromptToChat(
          response.additionalData.recommendedQuestion ||
            response.recommendedQuestion,
          "chaton",
          response.additionalData.question_explanation,
        );

        this.addKnownData(response.knownUserInfo);

        this.recordingStarted = !this.recordingStarted;
      });
  }

  addPrompt() {
    this.promptService.addNewPromptToChat(this.userInput, "user", []);

    this.chatGptService
      .askQuestion(this.userInput, this.chatGptService.temporalId)
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response);

        this.addKnownData(response.knownUserInfo);
        const newChatonPromptId = this.promptService.addNewPromptToChat(
          response.additionalData.recommendedQuestion ||
            response.recommendedQuestion,
          "chaton",
          response.additionalData.question_explanation,
        );

        const mockedResponse = ["test question 1", "test question 2"];
        for (let q of mockedResponse) {
          this.bubbleService.addNewBubble(this.question, newChatonPromptId);
          console.log(q);
          console.log(this.bubbleService._bubble$.value);
        }
      });

    this.userInput = "";
  }

  addKnownData(data: object) {
    const mappedData = Object.entries(data).map(([key, value]) => ({
      key,
      value,
    }));

    this.userDataService.setUserData(mappedData);
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
