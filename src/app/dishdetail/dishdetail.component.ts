import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment'

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { visibility, flyInOut, expand } from '../animations/app.animation';

import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

  formErrors: any = {
    rating!: '',
    comment!: '',
    author!: ''
  };

  validationMessages: any = {
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
    },
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
    },
  };

  dishcopy!: Dish;
  dish!: Dish;
  dishIds!: string[];
  prev!: string;
  next!: string;
  errMess!: string;
  visibility = 'shown';

  @ViewChild('fform') commentFormDirective: any;
  commentForm: FormGroup = this.fb.group({});
  newComment: Comment = new Comment();
  

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder, 
    @Inject('BaseURL') private BaseURL:string) 
    { 
      this.createForm();
    }

    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2)]],
        rating: [ 5, [Validators.required]],
        comment: ['', [Validators.required, Validators.minLength(2)]],
      });

      this.commentForm.valueChanges.subscribe((data) => this.handleFormChange(data));
    }
    handleFormChange(data: any): void {
      if (!this.commentForm) { return; }
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          this.formErrors[field] = '';
          const control = this.commentForm.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
    }

  ngOnInit() {
    this.dishservice.getDishIds()
    .subscribe(
      dishIds => this.dishIds = dishIds,
      error => this.errMess = <any>error
      );
    this.route.params
    .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'},
        errmess => this.errMess = <any>errmess
    );
    
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit() {
    this.newComment = this.commentForm.value;
    this.newComment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.newComment);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author : '',
      rating : 5,
      comment: '',
    });
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = new Dish; this.dishcopy = this.dish; this.errMess = <any>errmess; });
  }

}