import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiHttpService} from '../../services/api/api-http.service';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

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
  public uploadForm: FormGroup;
  public formData: FormData;
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer,
    private api: ApiHttpService<any>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.urlBlob = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.data.recordBlob.blob));
    this.uploadForm = this.formBuilder.group({
      audio: [this.urlBlob]
    });
  }

  enviar(): any {
    this.formData = new FormData();
    const file = new File([this.data.recordBlob], 'file', {
      type: this.data.recordBlob.type
    });
    this.formData.append('audio', file);
    this.api.post(environment.url.api.concat('/api/v1/speech-to-text'), this.data.recordBlob.blob)
      .subscribe(
        (response) => {
          this.dialogRef.close();
          this.router.navigate(['resposta'], {
            queryParams: {
              resposta: response
            }
          });
        },
        (error) => {
          this.dialogRef.close();
          this.router.navigate(['resposta'], {
            queryParams: {
              resposta: error
            }
          });
        }
      );
  }

  onFileSelect($event): void {
      if ($event.target.files.length > 0) {
        const file = $event.target.files[0];
        this.uploadForm.get('audio').setValue(file);
      }
  }
}
