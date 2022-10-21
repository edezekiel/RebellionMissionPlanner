import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Vehicle {
  cargo_capacity: number;
}

export interface Rebel {
  name: string;
  vehicles: Vehicle[];
}

@Injectable({
  providedIn: 'root',
})
export class StarWarsApiService {
  SWAPI_URL = 'https://swapi.dev/api/';

  private _http: HttpClient = inject(HttpClient);

  getPeople() {
    return this._http.get<{ results: Rebel[] }>(`${this.SWAPI_URL}/people/`);
  }
}
