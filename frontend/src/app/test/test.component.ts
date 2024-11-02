import { Component } from '@angular/core';
import { SpeechAiComponent } from '../speech-ai/speech-ai.component';
import { VisualComponent } from '../visual/visual.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone: true,
  imports: [SpeechAiComponent, VisualComponent]
})
export class TestComponent {
}
