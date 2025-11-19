import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigurationService, SharedConfig } from '@shared/services/configuration.service';
import { firstValueFrom, map, tap } from 'rxjs';
import { parse } from 'yamljs';

export interface IConfig extends SharedConfig {
  backend: SharedConfig['backend'] & {
    scannerApiUrl: string;
    atenasApiUrl: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationFileService implements ConfigurationService<IConfig> {
  private readonly httpClient = inject(HttpClient);

  private config!: IConfig;

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
