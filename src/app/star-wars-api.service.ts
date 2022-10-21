import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

interface StarshipDTO {
  cargo_capacity: string;
}
export interface Starship {
  cargo_capacity: number;
}

export interface Rebel {
  name: string;
  starships: string[];
}

@Injectable({
  providedIn: 'root',
})
export class StarWarsApiService {
  private readonly _SWAPI_URL = 'https://swapi.dev/api/';

  private _http: HttpClient = inject(HttpClient);

  getPeople() {
    return this._http.get<{ results: Rebel[] }>(`${this._SWAPI_URL}/people/`);
  }

  getStarship(starshipUrl: string) {
    return this._http
      .get<StarshipDTO>(starshipUrl)
      .pipe(map((starship) => this._parseCargoCapacity(starship)));
  }

  private _parseCargoCapacity(starship: StarshipDTO): Starship {
    return {
      ...starship,
      cargo_capacity: parseInt(starship.cargo_capacity) || 0,
    };
  }
}
