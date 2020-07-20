import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AudioRecordingService} from '../../services/audio-recording.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalConfirmacaoComponent} from '../modal-confirmacao/modal-confirmacao.component';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../environments/environment';
import {ApiHttpService} from '../../services/api/api-http.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  iconMicrophone = 'mic';
  microfoneForm: FormGroup;
  isRecording = false;
  recordedTime;
  blobUrl;


  constructor(
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private api: ApiHttpService<any>
  ) {
  }

  ngOnInit(): void {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrl = data.stream;
    });

    this.microfoneForm = this.fb.group({
      text: ['']
    });
  }


  open(): void {
    this.dialog.open(ModalConfirmacaoComponent, {
      data: this.blobUrl
    });
  }
  emitRecord(): void{
    if (!this.isRecording) {
      this.isRecording = true;
      this.iconMicrophone = 'mic_none';
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording(): void  {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording(): void  {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.iconMicrophone = 'mic';
      this.isRecording = false;
      this.audioRecordingService.getRecordedBlob().subscribe((data) => {
        this.dialog.open(ModalConfirmacaoComponent, {
          data: {
            recordBlob: data
          }
        });
      });

    }
  }

  clearRecordedData(): void {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  enviar(): void {
    const body = {
      text: this.microfoneForm.get('text').value
    };
    this.api.post(environment.url.api.concat('/api/v1/text-to-speech'), body)
      .subscribe(
        (response) => {
          console.log(response);
          this.dialog.open(ModalConfirmacaoComponent, {
            data: {
              recordBlob: response.data
            }
          });

        },
        (error) => {
          console.log(error);
        }
      );
  }
}
