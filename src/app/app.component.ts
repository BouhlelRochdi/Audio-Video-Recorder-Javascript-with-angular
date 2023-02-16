import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  @ViewChild('recordedSound') recordedSound!: ElementRef;
  @ViewChild('sound') sound!: ElementRef;

  videoElement!: HTMLAudioElement;
  recordSound!: HTMLVideoElement;
  // recordSound!: HTMLAudioElement;
  mediaRecorder!: any;
  recordedBlobs: Blob[] = [];
  isRecording: boolean = false;
  downloadUrl!: string;
  stream!: MediaStream | null;
  streamed!: MediaStream;
  hidden: boolean = true;

  // counter
  time: number = 0;
  display!: any;
  interval!: any;

  // Permissions navigator
  accessPermission!: BehaviorSubject<PermissionStatus>;

  constructor() { }

  async ngOnInit() {

  }

  async startRecording() {
    this.accessPermission = new BehaviorSubject(await navigator.permissions.query({ name: 'microphone' } as unknown as any))
    try {
      if(this.accessPermission.value.state == accessPermission.DENIED) 
      alert('you need to reset the permissions manually in order to use the recorder!')
    if (this.accessPermission.value.state == accessPermission.PROMPT || this.accessPermission.value.state == undefined) {
      this.streamed = await navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        });
      return
    }
    else {
      this.hidden = true;
      let options: any = { mimeType: 'audio/webm' };
      this.streamed = await navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        });
      this.videoElement = this.sound.nativeElement;
      this.recordSound = this.recordedSound.nativeElement;

      this.stream = this.streamed;
      this.videoElement.srcObject = this.stream;
      try {
        this.mediaRecorder = new MediaRecorder(this.streamed, options)
      } catch (err) {
        console.log(err);
      }
      this.mediaRecorder.start();
      this.startTimer();

      this.isRecording = !this.isRecording;
      await this.onDataAvailableEvent();
      await this.onStopRecordingEvent();
    }
      
    } catch (error) {
      console.log(error)
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.stopTimer()
      this.mediaRecorder.stop();
      this.isRecording = !this.isRecording;
      this.hidden = false;
    } else return;
  }

  async onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size < 8000) {
          console.log('event on data aivailable < 8000 :', event)

          this.stopTimer();
          this.recordedBlobs = [];
          this.hidden = true;
          console.log('hidden: ', this.hidden);
          console.log('Too low Data to save');

          // alert('Too low Data to save');
        } else
          if (event.data) {
            this.recordedBlobs.push(event.data);
          }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = async (event: Event) => {
        this.stopTimer();
        this.stopStreaming();
        if (this.recordedBlobs.length <= 0) {
          return;
        } else {
          const videoBuffer = new Blob(this.recordedBlobs, {
            // type: 'video/webm'
            type: 'audio/webm'
          });
          this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
          this.recordSound.src = this.downloadUrl;
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  stopStreaming() {
    let audioTrack = this.stream?.getAudioTracks()
    audioTrack?.forEach(element => {
      element.stop()
    });
    this.stream = null
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform(this.time)
    }, 1000);
  }

  transform(value: any): string {
    console.log('timer: ', value)
    let minutes: any = Math.floor(value / 60);
    value = value - minutes * 60;
    if (minutes < 10) minutes = '0' + minutes;
    if (value < 10) value = '0' + value
    return minutes + ':' + value;
  }

  stopTimer() {
    clearInterval(this.interval);
    this.time = 0;
    this.display = null;
  }
}

