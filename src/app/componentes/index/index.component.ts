import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AudioRecordingService} from '../../services/audio-recording.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalConfirmacaoComponent} from '../modal-confirmacao/modal-confirmacao.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  iconMicrophone = 'mic';
  microfoneForm = new FormControl('');
  isRecording = false;
  recordedTime;
  blobUrl;


  constructor(
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
    ) { }

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

  clearRecordedData(): void  {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
