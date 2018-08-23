import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private user: Object;
  title = 'Bill Splitter V3.0';
  private _opened: Boolean = false;

  private _modeNum: Number = 0;
  private _positionNum: Number = 0;
  private _dock: Boolean = false;
  private _closeOnClickOutside: Boolean = false;
  private _closeOnClickBackdrop: Boolean = false;
  private _showBackdrop: Boolean = false;
  private _animate: Boolean = true;
  private _trapFocus: Boolean = true;
  private _autoFocus: Boolean = true;
  private _keyClose: Boolean = false;
  private _autoCollapseHeight: number = null;
  private _autoCollapseWidth: number = null;

  private _MODES: Array<string> = ['over', 'push', 'slide'];
  private _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];
  constructor(private loginService: LoginService, private router: Router) { }
  ngOnInit() {
  }

  private _toggleSidebar() {
    this._opened = !this._opened;

  }

  private logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }

  private isLoggedIn() {
    return this.loginService.isLoggedIn();
  }
}

