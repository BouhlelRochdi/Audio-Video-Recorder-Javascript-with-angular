import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { accessPermission } from '../enum/access.recorder.enum';
import { RecorderService } from '../services/recorder.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'lib-recorder',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [RecorderService],
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  title = 'recorder-component';
  @ViewChild('recordedSound') recordedSound!: ElementRef;
  @ViewChild('sound') sound!: ElementRef;

  videoElement!: HTMLAudioElement;
  // recordSound!: HTMLVideoElement;
  recordSound!: HTMLAudioElement;
  mediaRecorder!: MediaRecorder;
  recordedBlobs: Blob[] = [];
  isRecording: boolean = false;
  downloadUrl!: string;
  streamed!: MediaStream | null;
  hidden: boolean = true;

  empty: boolean = true

  // counter
  time: number = 0;
  display!: string | null;
  interval!: any;

  // Permissions navigator
  accessPermission!: BehaviorSubject<PermissionStatus>;

  constructor(
    private ngzone: NgZone,
    private recorderService: RecorderService
  ) { }

  async ngOnInit() {

  }

  async startRecording() {
    console.log('!! recording start !!');

    this.accessPermission = new BehaviorSubject(await navigator.permissions.query({ name: 'midi' } as unknown as any))
    try {
      if (this.accessPermission.value.state == accessPermission.DENIED)
        alert('you need to reset the permissions manually in order to use the recorder!')
      if (this.accessPermission.value.state == accessPermission.PROMPT || this.accessPermission.value.state == undefined) {
        console.log('!! access prompt !!');
        this.streamed = await navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: false,
          });
      }
      else {
        console.log('!! we are in !!');
        this.hidden = true;
        let options: any = { mimeType: 'audio/webm' };
        this.streamed = await navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: false,
          });
        this.videoElement = this.sound.nativeElement;
        this.recordSound = this.recordedSound.nativeElement;

        // this.stream = this.streamed;
        this.videoElement.srcObject = this.streamed;
        try {
          this.mediaRecorder = new MediaRecorder(this.streamed, options)
        } catch (err) {
          console.log(err);
        }
        this.startTimer();
        this.mediaRecorder.start();

        this.isRecording = !this.isRecording;
        await this.onDataAvailableEvent();
        await this.onStopRecordingEvent();
      }

    } catch (error) {
      console.log(error)
    }
  }

  async getStream() {
    this.streamed = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      });
  }

  stopRecording() {
    if (this.isRecording) {
      this.stopTimer()
      this.mediaRecorder.stop();
      this.isRecording = !this.isRecording;
      this.hidden = false;
      this.empty = false;
    }
  }

  async onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data.size < 8000) {
          this.stopTimer();
          this.ngzone.run(() => {
            this.hidden = true;
            this.empty = true;
            this.recordedBlobs = [];
          })
          // alert('Too low Data to save');
        } else
          if (event.data) {
            this.recordedBlobs = [];
            this.recordedBlobs.push(event.data);
            this.empty = false;
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
        if (this.recordedBlobs.length > 0) {
          const videoBuffer = new Blob(this.recordedBlobs, {
            // type: 'video/webm'
            type: 'audio/wav'
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
    let audioTrack = this.streamed?.getAudioTracks()
    audioTrack?.forEach(element => {
      element.stop()
    });
    this.streamed = null
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

  sendRecord() {
    let formData: FormData = new FormData();
    formData.append('voice', this.recordedBlobs[0])
    this.recorderService.sendVoiceRecord(formData).subscribe()
  }
}
