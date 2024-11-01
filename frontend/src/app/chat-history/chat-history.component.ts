import {Component, inject} from '@angular/core';
import {PromptService} from "../prompt/service/prompt.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: "app-chat-history",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./chat-history.component.html",
  styleUrl: "./chat-history.component.scss",
})
export class ChatHistoryComponent {
  promptService = inject(PromptService);
  chatMessages$ = this.promptService.prompts$;
}
