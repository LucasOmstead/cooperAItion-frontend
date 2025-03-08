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
  @Input() payoffs!: number[][];
  @Input() players!: Player[];
  @Input() userGamesResults!: [number[], number[]][];
  @ViewChild('table') table!: ElementRef;
  @ViewChild('curPlayerName') curPlayerName!: ElementRef;


  matchResults: [number[], number[]][][] = []; //it's pretty nested. matchResults[i][j] = results between those players, which is stored as 2 lists, containing p1 and p2's actions. 
  scores: number[] = [];
  playerFinished = true;

  constructor() {
  }

  floor = Math.floor;
  ngOnInit(): void {
    console.log(this.players);
    this.scores = new Array(this.players.length).fill(0);

    //fill matchresults for all bots
    for (let i = 0; i < this.players.length; i++) {
      this.matchResults.push(Array(this.players.length).fill([]));
    }

    for (let i = 0; i < this.players.length-1; i++) {
      for (let j = 0; j < this.players.length-1; j++) {
          this.matchResults[i][j] = this.playGame(this.players[i], this.players[j])[0];   
      }
    }
    console.log(this.userGamesResults);
    for (let i = 0; i < this.players.length; i++) {
      this.matchResults[this.matchResults.length-1][i] = this.userGamesResults[i];
      this.matchResults[i][this.matchResults.length-1] = [this.userGamesResults[i][1], this.userGamesResults[i][0]]; 
    }


    //Playing against everything but yourself
    let players_copy = this.players.slice();
    let players_reordered: [Player, number][] = players_copy.map((p: Player, i) => {return [p, i]});
    for (let i = 0; i < this.players.length; i++) {
      let index = Math.floor(Math.random()*(players_reordered.length-i)+i); //randomly choose some element at an index >= and swap 'em
      let temp = players_reordered[i];
      players_reordered[i] = players_reordered[index];
      players_reordered[index] = temp;
    }
  }

  async userPlayGame(playersList: [Player, number][]) {
    for (let i = 0; i < this.players.length-1; i++) {
      this.matchResults[i][this.matchResults.length-1] = [[1], [1]];
      this.matchResults[this.matchResults.length-1][i] = [this.matchResults[i][this.matchResults.length-1][1], this.matchResults[i][this.matchResults.length-1][0]];
      let history = [[], []];
      let j = 0;
      while (true) {
        if ((j > 3 && Math.random() < .35) || j > 7) break;
      }
    }
  }

  ngAfterViewInit() {
    this.table.nativeElement.style['grid-template-columns'] = "1fr ".repeat(this.players.length+1);
    this.table.nativeElement.style['grid-template-rows'] = "1fr ".repeat(this.players.length+1);
  }


  

  //either plays game between any 2 players, or plays the game between You and another player
  //returns results of game, then score of each player
  playGame(p1: Player | null = null, p2: Player | null = null): [[number[], number[]], number, number] {
    if (p1 == null){return [[[], []], 0, 0];} 
    if (p2 == null) {return [[[], []], 0, 0];} //doesn't work when you check if either of them is null in one expression... c'mon typescript
    
    let past_moves: [number[], number[]] = [[], []];
    let score1 = 0;
    let score2 = 0;
    let i = 0;

    while (true) {
      let p1_action = p1.get_action(past_moves, i);
      let p2_action = p2.get_action([past_moves[1], past_moves[0]], i);
      score1 += this.payoffs[p1_action][p2_action];
      score2 += this.payoffs[p2_action][p1_action];
      past_moves[0].push(p1_action);
      past_moves[1].push(p2_action);
      i += 1;
      if (i > 3 && Math.random() < .35 || i > 7) break;
    }
    return [past_moves, score1, score2];
  }
}
