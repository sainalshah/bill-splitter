import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public Server = 'http://192.168.1.106:3000/';
    public ApiUrl = '';
    public ServerWithApiUrl = this.Server + this.ApiUrl;
}
