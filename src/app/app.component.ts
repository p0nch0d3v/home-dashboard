import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { init, waitForInit } from './async-init';

import { AccuweatherService } from './accoweather/accuweather.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [AccuweatherService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private accuService = inject(AccuweatherService);

  @waitForInit
  ngOnInit(): void {
  }

  @init
  private async loadData() {
    const currentData = await this.accuService.getCurrent("Mexicali");
    console.log('loadData', currentData);
  }

  title = 'home-dashboard';
}
