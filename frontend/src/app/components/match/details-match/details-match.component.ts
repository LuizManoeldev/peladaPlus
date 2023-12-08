import {Component, ElementRef, Renderer2, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatchService} from "../../../shared/services/match.service"
import {Match} from "../../../shared/model/match";
import {Jogador} from "../../../shared/model/jogador";
import { ChangeDetectorRef } from '@angular/core';
import {MatchFirestoreService} from "../../../shared/services/match-firestore.service";
@Component({
  selector: 'app-details-match',
  templateUrl: './details-match.component.html',
  styleUrls: ['./details-match.component.scss']
})
export class DetailsMatchComponent {
  match: Match = new Match()
  jogador: Jogador = new Jogador('', false, 0)
  scores = [1, 2, 3, 4, 5]

  displayedColumns = ['nome', 'capitao', 'score', 'actions']
  constructor(private MatchService: MatchFirestoreService,
              private router: Router,
              private route: ActivatedRoute,
              private el: ElementRef,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') // chega ate o component por um router. Por aqui puxa os dados dessa rota
    // @ts-ignore - ignorar que possivelmente pode ser null
    this.MatchService.readById(id).subscribe(match => {
      this.match = match;
    })
  }




  addJogador(){
    const object = {
      "nome": this.jogador.nome,
      "capitao": this.jogador.capitao,
      "score": this.jogador.score
    }

    this.match.jogadores = this.match.jogadores.concat(object)
    this.cdr.detectChanges();
    this.MatchService.update(this.match).subscribe(()=> {
    })
    this.jogador = new Jogador('', false, 0)
  }

  deleteJogador(nome: string){
    // @ts-ignore
    this.match.jogadores = this.match.jogadores.filter(jogador => jogador.nome !== nome);
    this.cdr.detectChanges();
    this.MatchService.update(this.match).subscribe(()=> {
    })
  }

  isCapitan() {
    this.jogador.capitao = true;
    this.cdr.detectChanges();
  }
}
