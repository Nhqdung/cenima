export interface CommentReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[]; // userIds
}

export interface MovieComment {
  id: string;
  movieSlug: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating?: number; // 1 - 10 sao
  createdAt: string;
  likes: number;
  likedBy: string[]; // userIds
  replies: CommentReply[];
}

const COMMENTS_STORAGE_PREFIX = 'cinemora_comments_';

export const commentService = {
  // Lấy danh sách bình luận theo slug phim
  getComments(movieSlug: string): MovieComment[] {
    try {
      const data = localStorage.getItem(COMMENTS_STORAGE_PREFIX + movieSlug);
      if (data) {
        const parsed = JSON.parse(data);
        // Lọc bỏ bất kỳ comment mẫu cmt_1 cũ nếu còn sót lại trong cache máy người dùng
        const realComments = parsed.filter((c: MovieComment) => c.id !== 'cmt_1');
        return realComments;
      }
      return [];
    } catch {
      return [];
    }
  },

  // Đăng bình luận mới (Kèm đánh giá sao)
  addComment(
    movieSlug: string,
    user: { id: string; name: string; avatar?: string },
    content: string,
    rating?: number
  ): MovieComment[] {
    const list = this.getComments(movieSlug);
    const newComment: MovieComment = {
      id: 'cmt_' + Date.now(),
      movieSlug,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`,
      content: content.trim(),
      rating,
      createdAt: 'Vừa xong',
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updated = [newComment, ...list];
    try {
      localStorage.setItem(COMMENTS_STORAGE_PREFIX + movieSlug, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Trả lời (Reply) bình luận của người khác
  addReply(
    movieSlug: string,
    commentId: string,
    user: { id: string; name: string; avatar?: string },
    content: string
  ): MovieComment[] {
    const list = this.getComments(movieSlug);
    const target = list.find(c => c.id === commentId);
    if (!target) return list;

    const newReply: CommentReply = {
      id: 'rep_' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`,
      content: content.trim(),
      createdAt: 'Vừa xong',
      likes: 0,
      likedBy: []
    };

    target.replies.push(newReply);
    try {
      localStorage.setItem(COMMENTS_STORAGE_PREFIX + movieSlug, JSON.stringify(list));
    } catch {}
    return [...list];
  },

  // Thả cảm xúc / Tim (Like / Unlike) cho bình luận chính
  toggleLikeComment(movieSlug: string, commentId: string, userId: string): MovieComment[] {
    const list = this.getComments(movieSlug);
    const target = list.find(c => c.id === commentId);
    if (!target) return list;

    const hasLiked = target.likedBy.includes(userId);
    if (hasLiked) {
      target.likedBy = target.likedBy.filter(id => id !== userId);
      target.likes = Math.max(0, target.likes - 1);
    } else {
      target.likedBy.push(userId);
      target.likes += 1;
    }

    try {
      localStorage.setItem(COMMENTS_STORAGE_PREFIX + movieSlug, JSON.stringify(list));
    } catch {}
    return [...list];
  },

  // Thả tim cho bình luận trả lời (Reply)
  toggleLikeReply(movieSlug: string, commentId: string, replyId: string, userId: string): MovieComment[] {
    const list = this.getComments(movieSlug);
    const parent = list.find(c => c.id === commentId);
    if (!parent) return list;

    const reply = parent.replies.find(r => r.id === replyId);
    if (!reply) return list;

    const hasLiked = reply.likedBy.includes(userId);
    if (hasLiked) {
      reply.likedBy = reply.likedBy.filter(id => id !== userId);
      reply.likes = Math.max(0, reply.likes - 1);
    } else {
      reply.likedBy.push(userId);
      reply.likes += 1;
    }

    try {
      localStorage.setItem(COMMENTS_STORAGE_PREFIX + movieSlug, JSON.stringify(list));
    } catch {}
    return [...list];
  }
};
