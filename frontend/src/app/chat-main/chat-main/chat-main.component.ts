import { Component, inject, OnInit } from "@angular/core";
import { ChatHistoryComponent } from "../../chat-history/chat-history.component";
import { ChatonBotComponent } from "../../chaton/chaton-bot/chaton-bot.component";
import { PromptInputComponent } from "../../prompt/prompt-input/prompt-input.component";
import { ChatGptService } from "../../chat-gpt/chat-gpt.service";
import {
  MatDrawerContainer,
  MatSidenavModule,
} from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";
import { MatButton, MatIconButton } from "@angular/material/button";
import { UserDataService } from "../../user-data/user-data.service";
import { AsyncPipe } from "@angular/common";
import { UserPropertiesKeyPipe } from "../../user-properties-key/user-properties-key.pipe";
import { PromptService } from "../../prompt/service/prompt.service";
import { take } from "rxjs";
import { BubbleService } from "../../bubble/bubble.service";

@Component({
  selector: "app-chat-main",
  standalone: true,
  imports: [
    ChatHistoryComponent,
    ChatonBotComponent,
    PromptInputComponent,
    MatDrawerContainer,
    MatSidenavModule,
    MatIcon,
    MatIconButton,
    AsyncPipe,
    UserPropertiesKeyPipe,
    MatButton,
  ],
  templateUrl: "./chat-main.component.html",
  styleUrl: "./chat-main.component.scss",
})
export class ChatMainComponent implements OnInit {
  chatGpt = inject(ChatGptService);

  explanation: string[] = [];

  userDataService = inject(UserDataService);

  promptService = inject(PromptService);

  chatGptService = inject(ChatGptService);

  userService = inject(UserDataService);

  bubbleService = inject(BubbleService);

  userData$ = this.userDataService.userData$;

  addPrompt(bubbleText: string) {
    this.promptService.addNewPromptToChat(bubbleText, "user", []);

    this.chatGptService
      .askQuestion(bubbleText, this.chatGptService.temporalId)
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

        for (let q of response.additionalData.recommendation_bubbles) {
          this.bubbleService.addNewBubble(q, newChatonPromptId);
          console.log(q);
          console.log(this.bubbleService._bubble$.value);
        }
      });
  }

  addKnownData(data: object) {
    const mappedData = Object.entries(data).map(([key, value]) => ({
      key,
      value,
    }));

    this.userDataService.setUserData(mappedData);
  }

  ngOnInit() {
    this.chatGpt.getTemporalId().subscribe((temporalId: string) => {
      console.log("Temporal ID: ", temporalId);
      this.chatGpt.temporalId = temporalId;
    });
  }
}
