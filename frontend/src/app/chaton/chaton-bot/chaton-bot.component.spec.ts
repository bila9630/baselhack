import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatonBotComponent } from './chaton-bot.component';

describe('ChatonBotComponent', () => {
  let component: ChatonBotComponent;
  let fixture: ComponentFixture<ChatonBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatonBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatonBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
