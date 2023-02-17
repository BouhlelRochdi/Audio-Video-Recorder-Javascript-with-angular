import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, first, Observable, of, tap } from 'rxjs';

export enum accessPermission {
  DENIED = 'denied',
  PROMPT = 'prompt',
  GRANTED = 'granted'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // To swith from using vanilla JS to recorderRtc library follow this link
  // https://stackblitz.com/edit/angular-audio-recorder?file=src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.component.ts,package.json,src%2Fapp%2Faudio-recording.service.ts

  title = 'projectTest';

  changedValue: string | boolean = '';
  v$!: Observable<string | boolean>;
  elem: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() { }

  async ngOnInit() {

  }

  getHiddenValue(event: any) {
    // this.changedValue = event
    console.log(event);
    
    this.elem.next(event)
    // this.changedValue = event
  }


}

