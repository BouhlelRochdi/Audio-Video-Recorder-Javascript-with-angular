import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, first, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // To swith from using vanilla JS to recorderRtc library follow this link
  // https://stackblitz.com/edit/angular-audio-recorder?file=src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.component.ts,package.json,src%2Fapp%2Faudio-recording.service.ts

  title = 'projectTest';

  constructor() { }

  async ngOnInit() {

  }

}

