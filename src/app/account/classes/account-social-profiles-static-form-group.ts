import {FormControl, FormGroup} from '@angular/forms';

export class AccountSocialProfilesStaticFormGroup {

  public static twitter: FormGroup = new FormGroup({
    title: new FormControl('Twitter'),
    url: new FormControl('')
  });

  public static facebook: FormGroup = new FormGroup({
    title: new FormControl('Facebook'),
    url: new FormControl('')
  });

  public static instagram: FormGroup = new FormGroup({
    title: new FormControl('Instagram'),
    url: new FormControl('')
  });

  public static tiktok: FormGroup = new FormGroup({
    title: new FormControl('Tik Tok'),
    url: new FormControl('')
  });

  public static github: FormGroup = new FormGroup({
    title: new FormControl('Github'),
    url: new FormControl('')
  });
}
