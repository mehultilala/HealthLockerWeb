import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  constructor(private _httpClient: HttpClient) {}

  saveConversation(data: any): Observable<any> {
    return this._httpClient.post<any>(
      `${environment.serverUrl}/api/conversations/`,
      data
    );
  }
}
