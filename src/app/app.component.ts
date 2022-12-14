import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { MissionEditorComponent } from './mission-editor.component';
import { StarWarsApiService } from './star-wars-api.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [MissionEditorComponent, AsyncPipe, CommonModule],
  template: `
    <div class="container">
      <ng-container
        *ngIf="rebelAlliance$ | async as rebelAlliance; else loading"
      >
        <app-mission-editor
          [rebelAlliance]="rebelAlliance"
        ></app-mission-editor>
      </ng-container>
      <ng-template #loading><div>Loading...</div></ng-template>
      <div></div>
    </div>
  `,
  styles: [
    `
      .container {
        margin-top: 2rem;
      }
    `,
  ],
})
export class AppComponent {
  rebelAlliance$ = inject(StarWarsApiService)
    .getPeople()
    .pipe(map((result) => result.results));
}
