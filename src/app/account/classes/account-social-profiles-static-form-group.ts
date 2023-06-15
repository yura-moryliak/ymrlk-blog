import {FormControl, FormGroup} from '@angular/forms';

export class AccountSocialProfilesStaticFormGroup {

  public static twitter: FormGroup = new FormGroup({
    title: new FormControl('Twitter'),
    link: new FormControl('')
  });

  public static facebook: FormGroup = new FormGroup({
    title: new FormControl('Facebook'),
    link: new FormControl('')
  });

  public static instagram: FormGroup = new FormGroup({
    title: new FormControl('Instagram'),
    link: new FormControl('')
  });

  public static tiktok: FormGroup = new FormGroup({
    title: new FormControl('Tik Tok'),
    link: new FormControl('')
  });

  public static github: FormGroup = new FormGroup({
    title: new FormControl('Github'),
    link: new FormControl('')
  });
}
