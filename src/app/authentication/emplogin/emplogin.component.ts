import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { AuthRq } from '../models/authreq.model';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-emplogin',
  templateUrl: './emplogin.component.html',
  styleUrls: ['./emplogin.component.scss']
})
export class EmploginComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  private authRq: AuthRq = new AuthRq;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private store: InMemoryCache
  ) {
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/backend/dashboard/home']);
    // }
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });



  }

  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    console.log("ngAfterContentInit ");

    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.alertService.clear()
          this.alertService.success("Registration Successful!!");
        }
      });
    }, 0)

  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted = true;

    this.authRq.username = this.f.uname.value;
    this.authRq.password = this.f.password.value;

    this.loading = true;
    this.authService.loginUser(this.authRq)
      .pipe(first())
      .subscribe(
        data => {
          const role = this.store.getItem('USER_ROLE');
          // otp verification
          if (role && role === '111') {
            this.router.navigate(['/authentication/mfa']);
          } else {
            this.router.navigate(['/dashboard/branch-user']);
          }
        },
        error => {
          this.alertService.clear()
          this.alertService.error("Login Failed. Try Again");
          this.loading = false;
          this.submitted = false;
        });
  }
}
