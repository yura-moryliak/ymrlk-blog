import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify',
  standalone: true
})
export class LinkifyPipe implements PipeTransform {

  transform(text: string | null | any, options?: { urlClass: string }): string {

    if (!text) {
      return '';
    }

    const urlRegex: RegExp = /(((https?:\/\/)|(www\.))[^\s]+)/g;

    return text.replace(urlRegex, (url: string) => {

      let hyperlink: string = url;

      if (!hyperlink.match('^https?:\\/\\/')) {
        hyperlink = 'http://' + hyperlink;
      }

      return `<a class="${ options?.urlClass }" href=${ hyperlink } target="_blank" rel="noopener noreferrer">${ url }</a>`
    })
  }

}
