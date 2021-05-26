import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactFormGroup = this.formBuilder.group({
      contact: this.formBuilder.group({
        userName: ['', [Validators.required]],
        userEmail: ['', [Validators.required]],
        message: ['', [Validators.required]],
      }),
    });
  }

  get userName() {
    return this.contactFormGroup.get('contact.userName');
  }
  get userEmail() {
    return this.contactFormGroup.get('contact.userEmail');
  }
  get message() {
    return this.contactFormGroup.get('contact.message');
  }

  sendEmail(e: Event) {
    e.preventDefault();
    emailjs
      .sendForm(
        'SERVICE_ID',
        'TEMPLATE_ID',
        e.target as HTMLFormElement,
        'USER_ID'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result.text);
          alert('Your request is submitted. \n We will get back to you soon.');
          this.contactFormGroup.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  onSubmit(e: Event) {
    if (this.contactFormGroup.invalid) {
      this.contactFormGroup.markAllAsTouched();
    } else {
      this.sendEmail(e);
    }
  }
}
