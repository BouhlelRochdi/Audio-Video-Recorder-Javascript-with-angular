import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioRecordingService } from '../services/audioRecording.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-recorder-rtc',
  standalone: true,
  imports: [CommonModule],
  providers: [AudioRecordingService],
  templateUrl: './recorder-rtc.component.html',
  styleUrls: ['./recorder-rtc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecorderRtcComponent {

  @ViewChild('videoElement') videoElement: any;
  video!: HTMLVideoElement;
  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;

  audioRecordedTime!: any;
  audioBlobUrl!: any;
  audioBlob!: any;
  audioName!: any;


  constructor(
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
  ) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time: any) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data: any) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
  }

  ngOnInit() {
  }

  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
      this.video = this.videoElement.nativeElement;
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, this.audioRecordingService.mimeType, this.audioName);
  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);

    // this.getData(blob)
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  getData(audioFile: any) {
    var reader = new FileReader();
    reader.onload = (event) => {
    };
    reader.readAsDataURL(audioFile);
  }
}
