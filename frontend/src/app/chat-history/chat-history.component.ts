import { Component, inject } from "@angular/core";
import { PromptService } from "../prompt/service/prompt.service";
import { AsyncPipe } from "@angular/common";
import { tap } from "rxjs";
import { ChatonBotComponent } from "../chaton/chaton-bot/chaton-bot.component";

@Component({
  selector: "app-chat-history",
  standalone: true,
  imports: [AsyncPipe, ChatonBotComponent],
  templateUrl: "./chat-history.component.html",
  styleUrl: "./chat-history.component.scss",
})
export class ChatHistoryComponent {
  promptService = inject(PromptService);
  lastChatonMessageId = "";
  chatMessages$ = this.promptService.prompts$.pipe(
    tap((value) => {
      this.lastChatonMessageId =
        value.reverse().find((m) => (m.author = "chaton"))?.id || "";
    }),
  );
}
