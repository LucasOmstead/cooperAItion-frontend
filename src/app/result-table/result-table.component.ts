import { ViewChild, Component, ElementRef, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchViewComponent } from "../match-view/match-view.component";

import {PastMoves, Player, Defector, Cooperator, GrimTrigger, RandomChooser, TitForTat, TwoTitForTat, NiceTitForTat, SuspiciousTitForTat, ModelPlayer, You} from'../services/game.service';


@Component({
  selector: 'app-result-table',
  standalone: true,
  imports: [CommonModule, MatchViewComponent],
  templateUrl: './result-table.component.html',
  styleUrl: './result-table.component.scss'
})

//So what we need is to:
//Play a game between every pair of players
//res should be stored in 3d array (2d for which players, 1d for res)
//At the end, display a number in each cell of the table; when the user hovers over the number they can see the match history (stored in table)

export class GameComponent implements OnInit, AfterViewInit {
  //playerMap stores the number of each type of agent in the environment. Payoffs stores the payoff matrix; payoffs[i][j] = reward for player 1 if he makes action i and p2 makes action j
  //model stores the model returned from the backend
  @Input() scores: number[] = [];
  @Input() players: Player[] = [];
  @Input() payoffs: number[][] = [];
  @Input() matchResults: [number[], number[]][][] = []; //it's pretty nested. matchResults[i][j] = results between those players, which is stored as 2 lists, containing p1 and p2's actions. 

  @ViewChild('table') table!: ElementRef;
  @ViewChild('curPlayerName') curPlayerName!: ElementRef;


  
  playerFinished = true;

  constructor() {
  }

  floor = Math.floor;
  ngOnInit(): void {
    // console.log(this.matchResults);
  }

  ngAfterViewInit() {
    this.table.nativeElement.style['grid-template-columns'] = "1fr ".repeat(this.players.length+1);
    this.table.nativeElement.style['grid-template-rows'] = "1fr ".repeat(this.players.length+1);
  }
}
