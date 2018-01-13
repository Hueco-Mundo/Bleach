import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './request.interceptor';
import { LoggerInterceptor } from './logger.interceptor';
import { patchOperators } from './operators/index';
import { IS_LOGGED_IN, isLoggedIn } from './login-status.provider';


@NgModule({})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    // patch custom operators
    patchOperators();

    return {
      ngModule: CoreModule,
      providers: [
        AuthGuard,
        AuthService,
        {
          provide: IS_LOGGED_IN,
          useValue: isLoggedIn
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoggerInterceptor,
          multi: true
        }
      ]
    };
  }
}
