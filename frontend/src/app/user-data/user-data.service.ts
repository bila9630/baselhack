import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserData } from "./user.interface";

@Injectable({
  providedIn: "root",
})
export class UserDataService {
  _userData$ = new BehaviorSubject<UserData[]>([]);

  userData$ = this._userData$.asObservable();

  setUserData(userData: UserData[]) {
    this._userData$.next(userData);
  }
}
