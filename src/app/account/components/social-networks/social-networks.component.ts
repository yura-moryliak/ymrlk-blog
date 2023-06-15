import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, ReactiveFormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {ToastrService} from 'ngx-toastr';

import {AccountBase} from '../../classes/account.base';
import {AvatarComponent} from '../../../core/shared-components/avatar/avatar.component';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';
import {UsersService} from '../../../core/services/users.service';
import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {AccountSocialProfilesStaticFormGroup} from '../../classes/account-social-profiles-static-form-group';
import {LoaderService} from '../../../core/shared-components/loader/services/loader.service';

@Component({
  selector: 'ym-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, AvatarComponent, LoaderComponent, ReactiveFormsModule],
})
export class SocialNetworksComponent extends AccountBase<{ socialProfiles: FormArray }> {

  socialProfiles!: FormArray;

  private fb: FormBuilder = inject(FormBuilder);
  private userService: UsersService = inject(UsersService);
  private toastService: ToastrService = inject(ToastrService);
  private loaderService: LoaderService = inject(LoaderService);

  protected saveChanges(): void {
    this.loaderService.show();

    const updateProfileSubscription: Subscription = this.userService.updateSocialProfiles(this.form.value.socialProfiles).subscribe({
      next: (user: UserInterface): void => {
        this.userService.updateUserState(user);
        this.loaderService.hide();
        this.toastService.success('Social profile updated successfully', 'Social profile update')
      },
      error: (): void => {
        this.loaderService.hide();
        this.toastService.error('Something went wrong while updating social profiles', 'Social profile update')
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
