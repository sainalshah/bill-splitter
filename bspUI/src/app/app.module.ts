import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginService, AccessGuard } from './services/login.service';
import { BillService } from './services/bill.service';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from '../app.constants';
import { CustomInterceptor } from './services/login.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SidebarModule } from 'ng-sidebar';
import { RouterModule, Routes } from '@angular/router';
import {
  MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatTableModule
} from '@angular/material';

import {
  SocialLoginModule,
  AuthServiceConfig,
  FacebookLoginProvider,
} from 'angular-6-social-login';
import { LoginComponent } from './login/login.component';


// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1546507162034242')
      }
    ]);
  return config;
}
const appRoutes: Routes = [

  {
    path: 'login', component: LoginComponent,
    data: { requiresLogin: false },
    canActivate: [AccessGuard]
  },
  {
    path: 'my-bills', component: HomeComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    SidebarModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- change to true for debugging purposes only
    ),
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  providers: [LoginService, BillService, AccessGuard, Configuration,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
