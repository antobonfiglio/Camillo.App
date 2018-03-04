import { Component } from '@angular/core';

@Component({
  selector : 'pm-root',
  template : 
    `
    <div>
      <nav class='navbar navbar-default'>
          <div class='container-fluid' >
              <a class='navbar-brand' style='color: #1067ad;font-weight: bold' >{{pageTitle}}</a>
              <ul class='nav navbar-nav'>
                  <li><a [routerLink]="['/welcome']">Home</a></li>
                  <li><a [routerLink]="['/patients']">Patients</a></li>
                  <li><a [routerLink]="['/patient/0']">Add Patient</a></li>
              </ul>
          </div>
      </nav>
      <div class='container'>
          <router-outlet></router-outlet>
      </div>
  </div>
    `
})

export class AppComponent{
  pageTitle: string = 'Camillo';
}