import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../core/auth/auth.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private authService: AuthService = inject(AuthService);

  public link: string = '';
  ngOnInit() {
    this.link = this.authService.getLoggedIn() ? '/choice' : '/signup';
  }
}
