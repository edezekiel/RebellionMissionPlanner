import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CargoPilotValidator } from './cargo-pilot.validator';
import { FormEffectDirective } from './directives/form-effect.directive';
import { Rebel } from './star-wars-api.service';

@Component({
  standalone: true,
  selector: 'app-mission-editor',
  imports: [ReactiveFormsModule, NgFor, JsonPipe, NgIf, FormEffectDirective],
  template: `
    <div class="mission-editor">
      <h1>Mission Editor</h1> 
      <form
        [formGroup]="missionEditor"
        appFormEffect="first"
        (ngSubmit)="dispatchRebels()"
        class="mission-editor__form"
      >
        <section>
          <div><label for="cargo">Expected Heist (kilograms): </label></div>
          <input
            id="cargo"
            type="number"
            formControlName="cargo"
            autocomplete="off"
          />
        </section>

        <section formArrayName="rebels">
          <h2>Rebels</h2>
          <div *ngFor="let rebel of rebels.controls; let i = index">
            <div><label for="rebel-{{ i }}">Rebel:</label></div>

            <select id="rebel-{{ i }}" [formControlName]="i">
              <option [ngValue]="null">Choose Rebel</option>
              <option *ngFor="let rebel of rebelAlliance" [ngValue]="rebel">
                {{ rebel.name }}
              </option>
            </select>
          </div>
          <section>
            <button type="button" (click)="addRebel()">
              + Add another rebel
            </button>
          </section>
        </section>

        <section>
          <div *ngIf="missionEditor.status === 'PENDING'">
            Validating team for qualified pilots...
          </div>
          <div
            *ngIf="
              missionEditor.invalid &&
              (missionEditor.dirty || missionEditor.touched)
            "
            class="alert"
          >
            <div
              *ngIf="missionEditor.errors?.['experiencedPilotRequired']"
              [style.color]="'red'"
            >
              {{ missionEditor.errors?.['experiencedPilotRequired'] }}
            </div>
          </div>
        </section>

        <section>
          <button
            [disabled]="
              !missionEditor.valid || missionEditor.status === 'PENDING'
            "
          >
            Dispatch Rebels
          </button>
        </section>
      </form>
    </div>
  `,
  styles: [
    `
      .mission-editor {
        display: flex;
        flex-direction: column;
        align-items: center;

        &__form {
          min-width: 50vw;
        }
      }

      section {
        margin: 2rem 0;
      }
    `,
  ],
  providers: [FormBuilder],
})
export class MissionEditorComponent {
  @Input() rebelAlliance: Rebel[] = [];

  private _fb = inject(FormBuilder);

  missionEditor = this._fb.group(
    {
      cargo: [, [Validators.required]],
      rebels: this._fb.array<Rebel | null>([null]),
    },
    { asyncValidators: [new CargoPilotValidator().checkForQualifiedPilot()] }
  );

  get rebels() {
    return this.missionEditor.get('rebels') as FormArray;
  }

  addRebel() {
    this.rebels.push(this._fb.control(null));
  }

  dispatchRebels() {
    alert('Dispatching Rebels to carry out the heist!');
  }
}
