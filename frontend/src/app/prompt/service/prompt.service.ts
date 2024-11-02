import { Injectable } from "@angular/core";
import { PromtMessage } from "../interface/promt-message.interface";
import { BehaviorSubject } from "rxjs";
import { ulid } from "ulid";

@Injectable({
  providedIn: "root",
})
export class PromptService {
  private _prompts$ = new BehaviorSubject<PromtMessage[]>([
    {
      message: "Hello! Tell me about yourself, so I can help you better.",
      author: "chaton",
      id: ulid(),
    },
  ]);

  prompts$ = this._prompts$.asObservable();

  addNewPromptToChat(message: string, author: "user" | "chaton") {
    const newPrompt: PromtMessage = { message, author, id: ulid() };
    this._prompts$.next([...this._prompts$.value, newPrompt]);
    console.log(this._prompts$.value);
  }
}
