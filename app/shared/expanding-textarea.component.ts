import { Component, ElementRef, forwardRef, Input, Renderer, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// FIXME Make this accessible.

@Component({
  selector: 'pn-expanding-textarea',
  templateUrl: 'app/shared/expanding-textarea.component.html',
  styleUrls: ['app/shared/expanding-textarea.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ExpandingTextareaComponent),
    multi: true
  }]
})
export class ExpandingTextareaComponent implements ControlValueAccessor {
  private _value: any = '';
  private onTouchedCallback = () => {};
  private propagateChange = (_: any) => {};

  @Input() readonly = false;
  @Input() autofocus = false;

  @ViewChild('contentInput') private contentInput: ElementRef;

  constructor(private renderer: Renderer) {
  }

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.propagateChange(v);
    }
  }

  writeValue(value: any): void {
    if (typeof this.value !== 'undefined' && value !== this._value) {
      this._value = value;
    }
  }

  onBlur(): void {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  focus(): void {
    this.renderer.invokeElementMethod(this.contentInput.nativeElement, 'focus', []);
  }

}



