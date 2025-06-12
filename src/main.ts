import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LucideAngularModule } from 'lucide-angular';
import { importProvidersFrom } from '@angular/core';
import { Search, Plus, Bell, Settings } from 'lucide';
import { MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    importProvidersFrom(
      LucideAngularModule.pick({
        Search,
        Plus,
        Bell,
        Settings
      }),
      MatNativeDateModule
    )
  ]
}).catch(err => console.error(err));

