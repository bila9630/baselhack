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
      message: "Hello! How can I help you today?",
      author: "chaton",
      id: ulid(),
    },
    {
      message: "I would like to know more about your services",
      author: "user",
      id: ulid(),
    },
    {
      message:
        "Sure! We offer a variety of services. What are you interested in?",
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
