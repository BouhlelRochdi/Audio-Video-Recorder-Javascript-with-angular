import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'projectTest';
  @ViewChild('recordedSound') recordedSound!: ElementRef;
  @ViewChild('sound') sound!: ElementRef;

  videoElement!: HTMLVideoElement;
  recordSound!: HTMLVideoElement;
  mediaRecorder!: any;
  recordedBlobs!: Blob[];
  isRecording: boolean = false;
  downloadUrl!: string;
  stream!: MediaStream;
  hidden=true;

  constructor() {}

  async ngOnInit() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then(stream => {
        this.videoElement = this.sound.nativeElement;
        this.recordSound = this.recordedSound.nativeElement;

        this.stream = stream;
        this.videoElement.srcObject = this.stream;
      });
  }

  startRecording() {
    this.recordedBlobs = [];
    let options: any = { mimeType: 'video/webm' };

    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
    this.isRecording = !this.isRecording;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
    console.log('Recorded Blobs: ', this.recordedBlobs);
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      console.log('cannot play.');
      return;
    }
    this.recordSound.play();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.recordedBlobs, {
          // type: 'video/webm'
          type: 'audio/webm'
        });
        this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
        this.recordSound.src = this.downloadUrl;
      };
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit(){
    console.log('this.recordedSound: ', this.recordedSound);
    console.log('this.recordedSound.nativeElement: ', this.recordedSound.nativeElement);
  }
}

