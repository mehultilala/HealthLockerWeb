import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../common/services/app.service';
import { ConversationService } from '../common/services/conversation.service';
import { AuthService } from '../common/services/auth.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
})
export class ContactusComponent implements OnInit, OnDestroy {
  ef!: FormGroup;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    public _appService: AppService,
    private _conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.buildEnquiryForm();
  }

  buildEnquiryForm() {
    let user = this._authService.user;

    let name = user?.name || null;
    let email = user?.email || null;
    let phone = user?.phone || null;

    this.ef = this._formBuilder.group({
      type: ['Enquiry'],
      name: [name, [Validators.minLength(3)]],
      email: [email, [Validators.email]],
      phone: [phone, [Validators.pattern(/^\d{5,20}$/)]],
      content: [null, [Validators.required, Validators.minLength(20)]],
    });
  }

  submitEnquiry() {
    if (this.ef.invalid) {
      this._appService.args$.next([
        'Please enter valid details!',
        'warn',
        '2000',
      ]);
      return;
    }

    this._conversationService.saveConversation(this.ef.value).subscribe({
      next: (response: any) => {
        this._appService.args$.next([
          'Enquiry submitted successfully!',
          'success',
          '3000',
        ]);
        this.buildEnquiryForm();
      },
      error: (err: any) => {
        this._appService.args$.next(['Something went wrong!', 'error', '2000']);
      },
    });
  }

  ngOnDestroy() {}
}
