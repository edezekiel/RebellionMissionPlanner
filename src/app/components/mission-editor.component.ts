import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-mission-editor',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="missionEditor">
      <input formControlName="cargo" />
    </form>
  `,
  providers: [FormBuilder],
})
export class MissionEditorComponent {
  private _fb = inject(FormBuilder);

  missionEditor = this._fb.group({
    cargo: [],
  });
}
