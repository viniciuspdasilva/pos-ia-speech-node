import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiHttpService} from '../../services/api/api-http.service';
import { environment } from '../../../environments/environment';

export interface DialogData {
  recordBlob: any;
}

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.scss']
})

export class ModalConfirmacaoComponent implements OnInit {
  urlBlob: any;
  public formData = new FormData();
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer,
    private api: ApiHttpService<any>
  ) {}

  ngOnInit(): void {
    this.urlBlob = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.data.recordBlob.blob));
  }

  enviar(): any {
    this.api.post(environment.url.api.concat('/api/speech/audio'), this.data.recordBlob)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
