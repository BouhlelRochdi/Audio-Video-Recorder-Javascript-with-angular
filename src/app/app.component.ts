import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  // recordSound!: HTMLVideoElement;
  recordSound!: HTMLAudioElement;
  mediaRecorder!: any;
  recordedBlobs: Blob[] = [];
  isRecording: boolean = false;
  downloadUrl!: string;
  stream!: MediaStream;
  hidden: boolean = true;

  // counter
  time: number = 0;
  display!: any;
  interval!: any;

  constructor() { }

  async ngOnInit() {
  }

  async startRecording() {
    this.hidden = true;
    let options: any = { mimeType: 'audio/webm' };


    let stream = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      });
    this.videoElement = this.sound.nativeElement;
    this.recordSound = this.recordedSound.nativeElement;

    this.stream = stream;
    this.videoElement.srcObject = this.stream;
    try {
      this.startTimer();
      this.mediaRecorder = await new MediaRecorder(this.stream, options)
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start();

    this.isRecording = !this.isRecording;
    await this.onDataAvailableEvent();
    await this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    this.hidden = false;
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      alert('cannot play.');
      return;
    }
    this.recordSound.play();
  }

  async onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
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
        const videoBuffer = await new Blob(this.recordedBlobs, {
          // type: 'video/webm'
          type: 'audio/webm'
        });
        this.downloadUrl = await window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
        this.recordSound.src = this.downloadUrl;
        this.pauseTimer()
      };
    } catch (error) {
      console.log(error);
    }
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
    console.log('value: ', value)
    let minutes: any = Math.floor(value / 60);
    value  = value - minutes * 60;
    if(minutes <10) minutes = '0'+ minutes;
    if(value < 10) value = '0'+ value 
    return minutes + ':' + value;
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}

