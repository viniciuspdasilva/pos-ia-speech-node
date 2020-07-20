import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resposta',
  templateUrl: './resposta.component.html',
  styleUrls: ['./resposta.component.scss']
})
export class RespostaComponent implements OnInit {
  falaTranscrita: any;

  constructor() { }

  ngOnInit(): void {
    this.falaTranscrita = 'Olá Tudo bem, isso é só um teste';
  }

}
