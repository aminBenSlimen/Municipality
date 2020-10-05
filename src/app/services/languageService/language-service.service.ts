import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageServiceService {

  constructor(private translate: TranslateService, private storage: Storage) { }

  initLang() {
    let lang = 'en';
    this.storage.get("language").then(l => {
      if (l)
        lang = l;

      this.translate.use(lang)
    })
  }
  setLanguage(lang) {
    this.storage.set("language", lang);
    this.translate.use(lang)
  }
}
