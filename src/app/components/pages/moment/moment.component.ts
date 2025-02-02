import { Component, OnInit } from '@angular/core';
import { MomentService } from '../../../services/moment.service';
import { Moment } from '../../../Moment';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessagesService } from '../../../services/messages.service';
import { Router } from '@angular/router';
import { Comment } from '../../../Comment';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, ReactiveFormsModule],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.css',
})
export class MomentComponent implements OnInit {
  moment?: Moment;

  faTimes = faTimes;
  faEdit = faEdit;

  commentForm!: FormGroup;

  constructor(
    private momentService: MomentService,
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private router: Router,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.momentService
      .getMoment(id)
      .subscribe((item) => (this.moment = item.data));

    this.commentForm = new FormGroup({
      text: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });
  }

  get text() {
    return this.commentForm.get('text');
  }

  get username() {
    return this.commentForm.get('username');
  }

  async removeHandler(id: number) {
    if (id) {
      await this.momentService.removeMoment(id).subscribe();

      this.messagesService.add(`Momento excluído com sucesso!`);

      this.router.navigate(['/']);
    }
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.commentForm.invalid) {
      return;
    }

    const data: Comment = this.commentForm.value;
    data.momentId = this.moment!.id!; // Garantindo que momentId seja um número

    this.commentService.createComment(data).subscribe({
      next: (response) => {
        this.moment!.comments!.push(response.data);

        this.messagesService.add(`Comentário adicionado com sucesso!`);
        this.commentForm.reset();
        formDirective.resetForm();
      },
      error: (error) => {
        console.error('Erro ao adicionar comentário:', error);
      },
    });
  }
}
