import { JsonPipe, NgFor } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Rebel } from '../services/star-wars-api.service';

@Component({
  standalone: true,
  selector: 'app-mission-editor',
  imports: [ReactiveFormsModule, NgFor, JsonPipe],
  template: `
    <form [formGroup]="missionEditor">
      <label for="cargo">Cargo: </label>
      <input id="cargo" formControlName="cargo" />

      <div formArrayName="rebels">
        <h2>Rebels</h2>
        <button type="button" (click)="addRebel()">+ Add another rebel</button>

        <div *ngFor="let rebel of rebels.controls; let i = index">
          <label for="rebel-{{ i }}">Rebel:</label>

          <select
            (change)="changeRebel($event)"
            id="rebel-{{ i }}"
            [formControlName]="i"
          >
            <option [ngValue]="null">Choose Rebel</option>
            <option *ngFor="let rebel of rebelAlliance" [ngValue]="rebel">
              {{ rebel.name }}
            </option>
          </select>
        </div>
      </div>
    </form>
  `,
  providers: [FormBuilder],
})
export class MissionEditorComponent {
  @Input() rebelAlliance: Rebel[] = [];

  private _fb = inject(FormBuilder);

  missionEditor = this._fb.group({
    cargo: 0,
    rebels: this._fb.array<Rebel | null>([null]),
  });

  get rebels() {
    return this.missionEditor.get('rebels') as FormArray;
  }

  addRebel() {
    this.rebels.push(this._fb.control({ name: 'test', vehicles: [] }));
  }

  changeRebel(event: any) {
    console.log(event);
  }
}
