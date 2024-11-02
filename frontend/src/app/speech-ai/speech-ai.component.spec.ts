import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechAiComponent } from './speech-ai.component';

describe('SpeechAiComponent', () => {
  let component: SpeechAiComponent;
  let fixture: ComponentFixture<SpeechAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeechAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeechAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
