import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorderRtcComponent } from './recorder-rtc.component';

describe('RecorderRtcComponent', () => {
  let component: RecorderRtcComponent;
  let fixture: ComponentFixture<RecorderRtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RecorderRtcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecorderRtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
