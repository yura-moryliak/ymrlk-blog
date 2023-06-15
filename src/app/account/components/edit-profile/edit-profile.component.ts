import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {Subscription} from 'rxjs';

import {AccountBaseComponent} from '../../classes/account.base';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';
import {AccountEditProfileFormInterface} from '../../interfaces/account-edit-profile-form.interface';
import {AvatarComponent} from '../../../core/shared-components/avatar/avatar.component';
import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {LinkifyPipe} from '../../../core/pipes/linkify.pipe';

@Component({
  selector: 'ym-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, LoaderComponent, ReactiveFormsModule, AvatarComponent, LinkifyPipe]
})
export class EditProfileComponent extends AccountBaseComponent<AccountEditProfileFormInterface> {

  @ViewChild('avatarComponent', { static: true, read: AvatarComponent })
  avatarComponent!: AvatarComponent;

  bioMaxLength = 1024;

  uploadPicture(event: Event): void {
    const filesList: FileList = (event.target as HTMLInputElement).files as FileList;

    if (!filesList[0]) {
      return;
    }

    let file: File | null = filesList[0];

    const uploadPictureSubscription: Subscription = this.usersService.uploadProfileAvatar(file).subscribe({
      next: (user: UserInterface): void => {
        this.user = user;
        this.avatarComponent.source = <string>user.avatarSrc;
        this.usersService.updateUserState(user);
        this.toastService.success('Picture uploaded successfully', 'Upload picture');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error.message, 'Upload picture');
        file = null;
      }
    });

    this.subscriptions.add(uploadPictureSubscription);
  }

  deletePicture(): void {
    const deletePictureSubscription: Subscription = this.usersService.deleteProfileAvatar(<string>this.user.avatarSrc).subscribe({
      next: (user: UserInterface): void => {
        this.user = user;
        this.usersService.updateUserState(user);
        this.toastService.success('Picture deleted successfully', 'Delete picture');
      },
      error: () => this.toastService.error('Something went wrong while deleting picture', 'Delete picture')
    });

    this.subscriptions.add(deletePictureSubscription);
  }

  protected saveChanges(): void {
    const updateProfileSubscription: Subscription = this.usersService.updateProfile(this.form.value as Partial<UserInterface>).subscribe({
      next: (user: UserInterface): void => {
        this.user = user;
        this.usersService.updateUserState(user);
        this.toastService.success('Profile deleted successfully', 'Update profile');
        this.loaderService.hide();
      },
      error: (): void => {
        this.toastService.error('Something went wrong while updating profile', 'Update profile');
        this.loaderService.hide();
      }
    });

    this.subscriptions.add(updateProfileSubscription);
  }

  protected populateForm(): void {
    this.form = new FormGroup<AccountEditProfileFormInterface>({
      location: new FormControl(this.user.location || ''),
      bio: new FormControl(this.user.bio || '', Validators.maxLength(this.bioMaxLength))
    });
  }
}
