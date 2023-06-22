import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, ReactiveFormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {AccountBaseComponent} from '../../classes/account.base';
import {AvatarComponent} from '../../../_a_core/shared-components/avatar/avatar.component';
import {LoaderComponent} from '../../../_a_core/shared-components/loader/loader.component';
import {UserInterface} from '../../../_a_core/interfaces/user/user.interface';
import {AccountSocialProfilesStaticFormGroup} from '../../classes/account-social-profiles-static-form-group';
import {FormControlInputComponent} from '../../../_a_core/form-control-input/form-control-input.component';

@Component({
  selector: 'ym-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, AvatarComponent, LoaderComponent, ReactiveFormsModule, FormControlInputComponent],
})
export class SocialNetworksComponent extends AccountBaseComponent<{ socialProfiles: FormArray }> {

  socialProfiles!: FormArray;

  private fb: FormBuilder = inject(FormBuilder);

  protected saveChanges(): void {
    this.showLoader();

    const updateProfileSubscription: Subscription = this.usersService.updateSocialProfiles(this.form.value.socialProfiles).subscribe({
      next: (user: UserInterface): void => {
        this.usersService.updateUserState(user);
        this.hideLoader();
        this.toastService.success('Social profile updated successfully', 'Social profiles update')
      },
      error: (): void => {
        this.hideLoader();
        this.toastService.error('Something went wrong while updating social profiles', 'Social profiles update')
      }
    })

    this.subscriptions.add(updateProfileSubscription);
  }

  protected populateForm(): void {

    this.form = this.fb.group({
      socialProfiles: this.fb.array([
        AccountSocialProfilesStaticFormGroup.twitter,
        AccountSocialProfilesStaticFormGroup.facebook,
        AccountSocialProfilesStaticFormGroup.instagram,
        AccountSocialProfilesStaticFormGroup.tiktok,
        AccountSocialProfilesStaticFormGroup.github
      ])
    });

    this.socialProfiles = this.form.controls.socialProfiles as FormArray;
    this.socialProfiles.patchValue(this.user.socialProfiles as any);
  }
}
