import { Component, Inject, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { baseURL } from '../shared/baseurl';
import { expand, flyInOut } from '../animations/app.animation';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [flyInOut(),expand()],
})
export class HomeComponent implements OnInit {

  dish: Dish = new Dish;
  promotion: Promotion = new Promotion;
  leader: Leader = new Leader;
  errMessD!: string;
  errMessP!: string;
  errMessL!: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private leaderservice: LeaderService, 
    @Inject('BaseURL') private BaseURL:string) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish()
      .subscribe(dish => this.dish=dish,
        error => this.errMessD = <any>error);
    this.promotionservice.getFeaturedPromotion()
      .subscribe(promotion => this.promotion = promotion,
        error => this.errMessP = <any>error);
    this.leaderservice.getFeaturedLeader()
      .subscribe(leader=> this.leader = leader,
        error => this.errMessL = <any>error);
  }

}