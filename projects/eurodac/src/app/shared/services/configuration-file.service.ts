import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService, SharedConfig } from '@shared/services/configuration.service';
import { firstValueFrom, map, tap } from 'rxjs';
import { parse } from 'yamljs';

export interface IConfig extends SharedConfig {
  services: {
    auth: string;
    user: string;
    documentScanner: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationFileService implements ConfigurationService<IConfig> {
  private httpClient: HttpClient;
  private config!: IConfig;

  // Ho hem de fer així per evitar que inicialitzi els interceptors, ja que
  // sino s'inicialitzaria el authInteceptor i el AuthService, i mai funcionaria
  // el AuthMockService
  constructor(httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(httpBackend);
  }

  initialize(): Promise<any> {
    return firstValueFrom(
      this.httpClient
        .get('./config.yml', {
          headers: new HttpHeaders({
            'X-Skip-Auth': 'true',
          }),
          observe: 'body',
          responseType: 'text',
        })
        .pipe(map((yamlString) => parse(yamlString)))
        .pipe(
          tap((response: IConfig) => {
            console.log('Configuration loaded:', response);
            this.config = response;
          })
        )
    );
  }

  getConfig(): IConfig {
    return this.config;
  }
}
