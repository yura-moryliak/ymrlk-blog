import {Component, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {ToastrService} from 'ngx-toastr';

import {AccountBase} from '../../account.base';
import {LoaderComponent} from '../../../core/shared-components/loader/loader.component';
import {AccountEditProfileFormInterface} from '../../interfaces/account-edit-profile-form.interface';
import {AvatarComponent} from '../../../core/shared-components/avatar/avatar.component';
import {UsersService} from '../../../core/services/users.service';
import {UserInterface} from '../../../core/interfaces/user/user.interface';
import {LoaderService} from '../../../core/shared-components/loader/services/loader.service';

@Component({
  selector: 'ym-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, LoaderComponent, ReactiveFormsModule, AvatarComponent],
})
export class EditProfileComponent extends AccountBase<AccountEditProfileFormInterface> {

  @ViewChild('avatarComponent', { static: true, read: AvatarComponent })
  avatarComponent!: AvatarComponent;

  bioMaxLength = 1024;

  private toastService: ToastrService = inject(ToastrService);
  private loaderService: LoaderService = inject(LoaderService);
  private usersService: UsersService = inject(UsersService);

  uploadPicture(event: Event): void {
    const filesList: FileList = (event.target as HTMLInputElement).files as FileList;

    if (!filesList[0]) {
      return;
    }

    const file: File = filesList[0];
    this.usersService.uploadProfileAvatar(file).subscribe({
      next: (user: UserInterface): void => {
        this.user = user;
        this.avatarComponent.source = <string>user.avatarSrc;
        this.usersService.updateUserState(user);
        this.toastService.success('Picture uploaded successfully', 'Avatar picture upload');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error.message, 'Avatar picture upload')
      }
    });
  }

  deletePicture(): void {
    this.usersService.deleteProfileAvatar(<string>this.user.avatarSrc).subscribe({
      next: (user: UserInterface): void => {
        this.user = user;
        this.usersService.updateUserState(user);
        this.toastService.success('Picture deleted successfully', 'Avatar picture deletion');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error.error.message, 'Avatar picture deletion');
      }
    });
  }

  protected saveChanges(): void {
    this.loaderService.show();

    this.usersService.updateProfile(this.form.value as Partial<UserInterface>).subscribe({
      next: (user: UserInterface): void => {
        this.user = user;
        this.usersService.updateUserState(user);
        this.toastService.success('profile deleted successfully', 'Update profile');
        this.loaderService.hide();
      },
      error: (error: HttpErrorResponse): void => {
        this.toastService.error(error.error.message, 'Update profile');
        this.loaderService.hide();
      }
    })
  }

  protected populateForm(): void {
    this.form = new FormGroup({
      location: new FormControl(this.user.location || ''),
      bio: new FormControl(this.user.bio || '', Validators.maxLength(this.bioMaxLength))
    });
  }
}
