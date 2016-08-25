// FIXME Adapted from https://github.com/primefaces/primeng/blob/master/components/inputtextarea/inputtextarea.ts.
// I need to credit etc. according to the Apache License Version 2.0.

// FIXME This works by counting newlines, but if the text just wraps due not to newlines but to
// wrapping, then it does not expand!

import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[pnExpandingTextarea]',
  host: {
    '[class.ui-inputtext]': 'true',
    '[class.ui-corner-all]': 'true',
    '[class.ui-state-default]': 'true',
    '[class.ui-widget]': 'true',
    '[class.ui-state-hover]': 'hover',
    '[class.ui-state-focus]': 'focus',
    '[class.ui-state-disabled]': 'isDisabled()',
    '[attr.rows]': 'rows',
    '[attr.cols]': 'cols'
  }
})
export class ExpandingTextarea implements OnInit {

  @Input()
  private autoResize: boolean;

  @Input()
  private rows: number;

  @Input()
  private cols: number;

  private hover: boolean;
  private focus: boolean;
  private rowsDefault: number;
  private colsDefault: number;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.rowsDefault = this.rows;
    this.colsDefault = this.cols;
    this.resize();
  }

  @HostListener('mouseover', ['$event'])
  private onMouseover(event: MouseEvent) {
    this.hover = true;
  }

  @HostListener('mouseout', ['$event'])
  private onMouseout(event: MouseEvent) {
    this.hover = false;
  }

  @HostListener('focus', ['$event'])
  private onFocus(event: FocusEvent) {
    this.focus = true;
  }

  @HostListener('blur', ['$event'])
  private onBlur(event: FocusEvent) {
    this.focus = false;
  }

  private isDisabled() {
    return this.el.nativeElement.disabled;
  }

  @HostListener('keyup', ['$event'])
  private onKeyup(event: KeyboardEvent) {
    this.resize();
  }

  @HostListener('keydown', ['$event'])
  private onKeydown(event: KeyboardEvent) {
    const keyCodeForEnter = 13;
    if (event.which === keyCodeForEnter || event.keyCode === keyCodeForEnter) {
      ++this.rows;
    }
  }

  private resize() {
    let linesCount = 0,
    lines = this.el.nativeElement.value.split('\n');

    for (let i = lines.length - 1; i >= 0 ; --i) {
      linesCount += Math.floor(lines[i].length / this.colsDefault + 1);
    }

    this.rows = ((linesCount >= this.rowsDefault) ? linesCount : this.rowsDefault);
  }
}
