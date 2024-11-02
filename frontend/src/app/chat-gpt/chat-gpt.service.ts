import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatGptService {
  httpClient = inject(HttpClient);

  temporalId: string = "";

  getTemporalId(): Observable<string> {
    return this.httpClient.get(
      "https://baselbackend.vercel.app/application/new_temporal_id",
      {
        responseType: "text",
      },
    );
  }

  askQuestion(question: string, temporalId: string): Observable<any> {
    return this.httpClient.post(
      "https://baselbackend.vercel.app/application/chat/extract_data",
      { source: question, user_id: temporalId },
    );
  }
}
