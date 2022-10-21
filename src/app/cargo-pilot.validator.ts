import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Rebel, Starship, StarWarsApiService } from './star-wars-api.service';

@Injectable({
  providedIn: 'root',
})
export class CargoPilotValidator {
  private _starWarsApiService = inject(StarWarsApiService);

  checkForQualifiedPilot(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const { cargo, rebels } = control.value;
      if (!cargo || !rebels || !rebels.length) return of(null);

      const starshipUrls = this._getStarshipUrls(rebels);

      if (!(starshipUrls.length > 0)) {
        return of({ experiencedPilotRequired: this._cargoPilotError() });
      }
      return forkJoin(
        starshipUrls.map((url) => this._starWarsApiService.getStarship(url))
      ).pipe(
        map((results) => {
          const maxCargo = this._getMaxCargo(results);
          return maxCargo < cargo
            ? { experiencedPilotRequired: this._cargoPilotError(maxCargo) }
            : null;
        })
      );
    };
  }

  private _getStarshipUrls(rebels: Rebel[]): string[] {
    const starships = rebels.map((rebel) => rebel?.starships ?? [])
    return this._flatMap(starships, (starshipUrl) => starshipUrl);
  }

  private _getMaxCargo(starships: Starship[]): number {
    const sorted = starships.sort(
      (a, b) => a.cargo_capacity - b.cargo_capacity
    );

    return sorted.at(sorted.length - 1)?.cargo_capacity as number;
  }

  private _cargoPilotError(maxCargo?: number) {
    return `Your team needs a qualified pilot. Current Max Cargo: ${
      maxCargo ?? 0
    }`;
  }

  private _flatMap<T, U>(array: T[], mapFunc: (x: T) => U[]): U[] {
    return array.reduce(
      (cumulus: U[], next: T) => [...mapFunc(next), ...cumulus],
      <U[]>[]
    );
  }
}
