import { Component } from '@angular/core';
import { MissionEditorComponent } from './components/mission-editor.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [MissionEditorComponent],
  template: `<app-mission-editor></app-mission-editor>`,
})
export class AppComponent {}
