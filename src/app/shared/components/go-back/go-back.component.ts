import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-go-back',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './go-back.component.html',
  styleUrl: './go-back.component.scss'
})
export class GoBackComponent {

  constructor( private router: Router) {
  }

  /**
   * NAvegar a la pagina inicial o al listado
   */
  navigate(): void {
    this.router.navigate(['/']);
  }
}
