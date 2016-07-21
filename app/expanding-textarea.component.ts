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
  autoResize: boolean;

  @Input()
  rows: number;

  @Input()
  cols: number;

  hover: boolean;

  focus: boolean;

  rowsDefault: number;

  colsDefault: number;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.rowsDefault = this.rows;
    this.colsDefault = this.cols;
    this.resize();
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(e) {
    this.hover = true;
  }

  @HostListener('mouseout', ['$event'])
  onMouseout(e) {
    this.hover = false;
  }

  @HostListener('focus', ['$event'])
  onFocus(e) {
    this.focus = true;
  }

  @HostListener('blur', ['$event'])
  onBlur(e) {
    this.focus = false;
  }

  isDisabled() {
    return this.el.nativeElement.disabled;
  }

  @HostListener('keyup', ['$event'])
  onKeyup(e) {
    this.resize();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(e) {
    const keyCodeForEnter = 13;
    if (e.which === keyCodeForEnter || e.keyCode === keyCodeForEnter) {
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
