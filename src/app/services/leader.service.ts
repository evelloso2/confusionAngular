import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  public getLeaders():Observable<Leader[]>{
    return of(LEADERS).pipe(delay(2000));
  }

  public getLeader(id: string): Observable<Leader> {
    return of(LEADERS.filter((leader)=> leader.id===id)[0]).pipe(delay(2000));
  }

  public getFeaturedLeader(): Observable<Leader>{
    return of(LEADERS.filter((leader)=> leader.featured === true)[0]).pipe(delay(2000));
  }
}
