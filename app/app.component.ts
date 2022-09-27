//our root app component
import { Component, NgModule, VERSION, OnChanges } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy } from '@angular/common';
import { animate, animateChild, query, style, transition, trigger, state } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <h2>Hello {{name}}</h2>
      <a routerLink="">Go to one</a>
      <a routerLink="two">Go to two</a>
      <div 
            style="background-color:pink"
            id="main-router-outlet">
        <router-outlet #outlet="outlet"></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `#main-router-outlet ::ng-deep > * {
        display: block;
      } `
  ]
})
export class AppComponent implements OnChanges {
  name: string;
  state = ''
  constructor() {
    this.name = `Angular! v${VERSION.full}`
  }

  ngOnChanges() {
    this.state = 'enter';
  }

  public prepareRoute(outlet) {
    return outlet.activatedRouteData['animation'] || '';
  }
}

@Component({
  template: `one component<br>more`
})
export class oneComponent {

}


@Component({
  template: `two component
  <div [@routeAnimations]="state" *ngFor="let s of dynamicContent|async">
  {{s}}
  </div>
  `,
  animations: [
    trigger('routeAnimations', [
      state('enter', style({ height: '*', width: '*' })),
      transition('* => enter', [
        style({
          height: '0px', width: '0px',
          opacity: 0
        }),
        animate('0.5s ease-in-out', style({
          height: '*', width: '*',
          opacity: 1
        }))
      ]),
    ]),
  ]
})
export class twoComponent {
  public dynamicContent: Observable<string[]>;
  state = '';
  ngOnInit() {
    this.dynamicContent = of(['foo', 'bar', 'baz'])
      .delay(200);
    this.dynamicContent.subscribe(x => this.state = 'enter');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([{
      path: '',
      component: oneComponent,
      data: {
        animation: 'one',
      }
    },
    {
      path: 'two',
      component: twoComponent,
      data: {
        animation: 'two',
      }
    }])
  ],
  declarations: [AppComponent, oneComponent, twoComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }