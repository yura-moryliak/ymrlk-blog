import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Meta, MetaDefinition, Title} from '@angular/platform-browser';

import {PageMetaDataInterface} from '../interfaces/page-metadata.interface';
import {environment} from '../../../environments/environment.development';

export const defaultPageMetaData: PageMetaDataInterface = {
  title: 'Welcome to YMRLK',
  description: 'Simple blogging system for everyone who shares constructive thoughts',
  author: 'YMRLK',
  keywords: ['Yura Moryliak', 'blog', 'front-end developer', 'full-stack', 'Angular', 'NestJS'],
  type: 'website'
};

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  private titleService: Title = inject(Title);
  private meta: Meta = inject(Meta);
  private router: Router = inject(Router);


  setPageMetadata(metadata: Partial<PageMetaDataInterface>, index = true): void {
    const pageMedataData: PageMetaDataInterface = { ...defaultPageMetaData, ...metadata };
    const metaTags: MetaDefinition[] = this.generateMetaDefinitions(pageMedataData);

    this.meta.addTags([
      ...metaTags,
      { property: 'og:url', content: `${ environment.client.baseUrl }${ this.router.url }` },
      { name: 'robots', content: index ? 'index, follow' : 'noindex' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
    ]);

    this.titleService.setTitle(pageMedataData.title);

  }

  private generateMetaDefinitions(pageMedataData: PageMetaDataInterface): MetaDefinition[] {
    return [
      { name: 'title', content: pageMedataData.title },
      { name: 'og:title', content: pageMedataData.title },

      { name: 'description', content: pageMedataData.description },
      { name: 'og:description', content: pageMedataData.description },

      { name: 'author', content: pageMedataData.author },
      { name: 'og:author', content: pageMedataData.author },

      { name: 'keywords', content: pageMedataData.keywords.join(', ') },
      { name: 'og:type', content: pageMedataData.type },
    ]
  }
}
