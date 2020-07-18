import {Injectable} from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {

  private stream;
  private recorder;
  private interval;
  private startTime;

  // tslint:disable-next-line:variable-name
  private _recorded = new Subject<any>();
  // tslint:disable-next-line:variable-name
  private _recordingTime = new Subject<string>();
  // tslint:disable-next-line:variable-name
  private _recordingFailed = new Subject<string>();


  constructor() {
  }

  getRecordedBlob(): Observable<any> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  public startRecording(): any {
    if (this.recorder) {
      return;
    }
    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then((s) => {
        this.stream = s;
        this.record();
      })
      .catch((err) => {
        this._recordingFailed.next(err);
      });
  }

  abortRecording(): void {
    this.stopMedia();
  }

  private record(): any {

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm'
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value): string {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording(): any {

    if (this.recorder) {
      this.recorder.stop(
        (blob) => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
            this.stopMedia();
            this._recorded.next({blob, title: mp3Name});
            return blob;
          }
        }, () => {
          this.stopMedia();
          this._recordingFailed.next();
        });
    }
  }

  private stopMedia(): any {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }
}
