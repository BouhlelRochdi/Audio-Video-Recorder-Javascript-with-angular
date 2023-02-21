import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import moment from "moment";
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';


interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class AudioRecordingService {

  mimeType = "audio/wav;codecs=opus";
  private _desiredSampRate!: BehaviorSubject<number>;
  SampRate!: number;
  stream!: MediaStream;
  recorder!: any;
  interval!: any;
  startTime!: any;
  _recorded = new Subject<RecordedAudioOutput>();
  _recordingTime = new Subject<string>();
  _recordingFailed = new Subject<string>();


  constructor() {
    this._desiredSampRate = new BehaviorSubject<number>(16*500)
    this._desiredSampRate.pipe(
      tap( sr => this.SampRate = sr)
    )
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }


  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
    this._recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(s => {
        this.stream = s;
        this.record();
      }).catch(error => {
        console.error(error)
        this._recordingFailed.next('');
      });

  }

  abortRecording() {
    this.stopMedia();
  }

  record() {
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: this.mimeType as any,
      numberOfAudioChannels: 1,
      desiredSampRate: this.SampRate
    });
    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }

  toString(value: any) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop((blob: any) => {
        if (this.startTime) {
          const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
          this.stopMedia();
          this._recorded.next({ blob: blob, title: mp3Name });
        }
      }, () => {
        this.stopMedia();
        this._recordingFailed.next('');
      });
    }
  }

  stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null as any;
      }
    }
  }
}
