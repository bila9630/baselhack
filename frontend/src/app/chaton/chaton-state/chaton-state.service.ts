import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatonStateService {
  changeState = new Subject<"talk" | "listen">();

  changeCurrentState(state: "talk" | "listen") {
    this.changeState.next(state);
  }
}
