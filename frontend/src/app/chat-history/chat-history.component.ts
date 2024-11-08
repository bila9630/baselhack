import { Component, EventEmitter, inject, Output } from "@angular/core";
import { PromptService } from "../prompt/service/prompt.service";
import { AsyncPipe } from "@angular/common";
import { tap } from "rxjs";
import { ChatonBotComponent } from "../chaton/chaton-bot/chaton-bot.component";
import { WritingPipe } from "../writing/writing.pipe";
import { MatIcon } from "@angular/material/icon";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatSuffix } from "@angular/material/form-field";
import { BubbleService } from "../bubble/bubble.service";

@Component({
  selector: "app-chat-history",
  standalone: true,
  imports: [
    AsyncPipe,
    ChatonBotComponent,
    WritingPipe,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatButton,
  ],
  templateUrl: "./chat-history.component.html",
  styleUrl: "./chat-history.component.scss",
})
export class ChatHistoryComponent {
  promptService = inject(PromptService);
  bubbleService = inject(BubbleService);
  lastChatonMessageId = "";

  @Output() explainQuestion = new EventEmitter<string[]>();

  @Output() answerFromBubble = new EventEmitter<string>();

  bubbles$ = this.bubbleService.bubble$;

  chatMessages$ = this.promptService.prompts$.pipe(
    tap((value) => {
      const newArray = [...value];
      this.lastChatonMessageId =
        newArray.reverse().find((m) => m.author === "chaton")?.id || "";

      setTimeout(() => {
        const chatonMessage = document.getElementById("chat");
        chatonMessage!.scrollTop = chatonMessage!.scrollHeight;
      }, 100);
    }),
  );
}
