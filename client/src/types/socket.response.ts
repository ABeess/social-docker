import { Reply } from './Base';

export interface CommentSocketResponse {
  data: Comment | Reply;
  type: 'comment' | 'reply';
  postId: string;
}
