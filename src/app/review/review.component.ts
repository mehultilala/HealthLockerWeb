import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../common/services/app.service';
import { ConversationService } from '../common/services/conversation.service';
import { AuthService } from '../common/services/auth.service';

export interface StarStyle {
  star: number;
  text: string;
  color: string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    public _appService: AppService,
    private _conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.buildFeedbackForm();
  }

  feedBackForm!: FormGroup;

  stars: StarStyle[] = [
    { star: 1, text: 'Extremely dissatisfied', color: '#FF0000' },
    { star: 2, text: 'Somewhat dissatisfied', color: '#FF0000' },
    { star: 3, text: 'Neither satisfied nor dissatisfied', color: '#F5BB00' },
    { star: 4, text: 'Somewhat satisfied', color: '#0BAF00' },
    { star: 5, text: 'Extremely satisfied', color: '#0BAF00' },
  ];
  rating: number = -1;
  hoverStar: number = -1;

  countStar(rating: number) {
    this.rating = rating;
    this.feedBackForm.controls['rating'].setValue(rating);
  }

  buildFeedbackForm() {
    this.feedBackForm = this._formBuilder.group({
      type: ['Feedback'],
      content: [null],
      rating: [this.rating],
    });
  }

  submitFeedback() {
    if (
      !this.feedBackForm.controls['rating'].value ||
      this.feedBackForm.controls['rating'].value < 1 ||
      this.feedBackForm.controls['rating'].value > 5
    ) {
      this._appService.args$.next(['Please select rating!', 'warn', '2000']);
      return;
    }

    this._conversationService
      .saveConversation(this.feedBackForm.value)
      .subscribe({
        next: (response: any) => {
          this._appService.args$.next([
            'Thank you for your valuable feedback.',
            'success',
            '3000',
          ]);
          this.buildFeedbackForm();
        },
        error: (err: any) => {
          this._appService.args$.next([
            'Something went wrong!',
            'error',
            '2000',
          ]);
        },
      });
  }

  ngOnDestroy() {}
}
