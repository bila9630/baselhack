import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatGptService {
  httpClient = inject(HttpClient);

  temporalId: number = 0;

  isDone: boolean = false;

  pricePerYear: number = 0;

  getTemporalId(): Observable<string> {
    return this.httpClient.get(
      "https://baselbackend.vercel.app/application/new_temporal_id",
      {
        responseType: "text",
      },
    );
  }

  askQuestion(question: string, temporalId: number): Observable<any> {
    return this.httpClient
      .post("https://baselbackend.vercel.app/application/chat/extract_data", {
        source: question,
        user_id: temporalId,
      })
      .pipe(
        tap((data: any) => {
          this.pricePerYear = data?.additionalData?.price_per_year;
          this.isDone = !!data?.additionalData?.is_done;
        }),
      );
  }
}
