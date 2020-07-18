import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService<T> {

  constructor(private http: HttpClient) {
  }

  public post(url, data: Blob): Observable<HttpEvent<T>> {
    const formData = new FormData();
    const file = new File([data], 'file', {
      type: data.type
    });
    formData.append('file', file);

    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true
    };

    const req = new HttpRequest('POST', url, formData, options);
    return this.http.request(req);
  }
}
