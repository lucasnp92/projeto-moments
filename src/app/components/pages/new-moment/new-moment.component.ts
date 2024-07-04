import { Component } from '@angular/core';
import { MomentFormComponent } from '../../moment-form/moment-form.component';
import { Moment } from '../../../Moment';
import { MomentService } from '../../../services/moment.service';
import { MessagesService } from '../../../services/messages.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-new-moment',
  standalone: true,
  imports: [MomentFormComponent],
  templateUrl: './new-moment.component.html',
  styleUrl: './new-moment.component.css',
})
export class NewMomentComponent implements OnInit {
  btnText = 'Compartilhar!';
  image?: File;

  constructor(
    private momentService: MomentService,
    private messagesService: MessagesService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    this.image = file;
  }

  async createHandler(moment: Moment) {
    const formData = new FormData();

    formData.append('title', moment.title);
    formData.append('description', moment.description);

    if (moment.image) {
      formData.append('image', moment.image);
    }

    await this.momentService.createMoment(formData).subscribe();
    this.messagesService.add(`Momento adicionado com sucesso!`);

    this.router.navigate(['/']);
  }
}
