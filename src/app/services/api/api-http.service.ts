import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService<T> {

  constructor(private http: HttpClient) {
  }

  public post(url, formData: Blob | string | any): Observable<HttpResponse<T>> {
    console.log(formData);
    return this.http.post<HttpResponse<T>>(url, formData);
  }
}
