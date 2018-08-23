import { map } from 'rxjs/operators';

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Configuration } from '../../app.constants';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import {
    AuthService,
    FacebookLoginProvider
} from 'angular-6-social-login';

@Injectable()
export class LoginService {

    public static token: String;
    public userData: any;
    private user = new BehaviorSubject(null);
    currUser = this.user.asObservable();
    private actionUrl: string;

    constructor(private http: HttpClient, private _configuration: Configuration, private socialAuthService: AuthService) {
        this.actionUrl = _configuration.ServerWithApiUrl + 'auth/login';
        this.currUser.subscribe(user => {
            this.userData = user;
            console.log('login user from app component on init', this.userData);
        });
    }

    public async signIn<T>() {

        const loginUser = await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.updateUser(loginUser);
        console.log('calling url', this.actionUrl);
        console.log('user', loginUser);
        const res = await this.http.post(this.actionUrl, loginUser).toPromise();
        console.log(res);
        LoginService.token = res['token'];
        return LoginService.token;
    }

    public updateUser(user: Object) {
        this.user.next(user);
    }
    public isLoggedIn() {
        console.log('checking user logged in', this.userData != null);
        return this.userData != null;
    }
    public logout() {
        this.updateUser(null);
    }
}


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if (!req.headers.has('Content-Type')) {
        //     req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        // }
        console.log('setting credentials', LoginService.token);
        req = req.clone({
            setHeaders: {
                'x-access-token': `${LoginService.token}`
            }
        });
        // console.log(JSON.stringify(req.headers));
        return next.handle(req);
    }
}

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const requiresLogin = route.data.requiresLogin || false;
        if (requiresLogin && !this.loginService.isLoggedIn()) {
            // Check that the user is logged in...
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}
