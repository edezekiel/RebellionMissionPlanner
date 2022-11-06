import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { filter, map, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { Rebel } from '../star-wars-api.service';

type Code = 'first' | 'second';

@Directive({
  selector: '[appFormEffect]',
  standalone: true,
})
export class FormEffectDirective implements OnInit, OnDestroy {
  @Input() set appFormEffect(code: Code) {
    this._handleCodeChange(code);
  }

  private _subscription = new Subscription();
  private readonly _formChanges$$ = new Subject<{
    cargo: number | null;
    rebels: Array<Rebel | null>;
  }>();
  private readonly _formChanges$ = this._formChanges$$.asObservable();

  private readonly _notDarthVader = this._formChanges$.pipe(
    map(({ rebels }) => rebels.map((r) => r && r.name).indexOf('Darth Vader')),
    filter((index) => index !== -1),
    tap((index) => this._rebels.removeAt(index, { emitEvent: false }))
  );

  private readonly _resetCargo$ = this._formChanges$.pipe(
    map(({ cargo }) => cargo),
    filter((cargo) => !!(cargo && cargo > 10000000000)),
    tap((cargo) => this._cargo?.reset({ emitEvent: false }))
  );

  private readonly _resetRebels = this._formChanges$.pipe(
    map(({ rebels }) => rebels),
    filter((rebels) => !!(rebels && rebels.length > 5)),
    tap(() => {
      this._rebels?.clear({ emitEvent: false });
      this._rebels?.push(new FormControl(null));
    })
  );

  private _form?: FormGroup;
  private get _rebels() {
    return this._form?.get('rebels') as FormArray;
  }
  private get _cargo() {
    return this._form?.get('cargo') as AbstractControl;
  }

  constructor(private readonly _formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this._form = this._formGroupDirective.form;
    this._form.valueChanges
      .pipe(map(() => this._form?.getRawValue()))
      .subscribe((changes) => this._formChanges$$.next(changes));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private _handleCodeChange(code: string) {
    this._resetSubscription();
    this._subscription.add(this._notDarthVader.subscribe());
    switch (code) {
      case 'first':
        this._subscription.add(this._resetCargo$.subscribe());
        break;
      case 'second':
        this._subscription.add(this._resetRebels.subscribe());
        break;
      default:
        break;
    }
  }

  private _resetSubscription() {
    this._subscription.unsubscribe();
    this._subscription = new Subscription();
  }
}
