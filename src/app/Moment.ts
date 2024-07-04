export interface Moment {
  id?: number;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  update_at: string;
  comments?: [{ text: string; username: string }];
}
