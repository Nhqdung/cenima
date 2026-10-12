import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  Heart, 
  Send, 
  Reply, 
  Lock, 
  AlertCircle
} from 'lucide-react';
import { commentService, type MovieComment } from '../../services/commentService';
import type { UserProfile } from '../../lib/auth';
import { useLanguage } from '../../context/LanguageContext';

interface MovieCommentsSectionProps {
  movieSlug: string;
  movieTitle: string;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const MovieCommentsSection: React.FC<MovieCommentsSectionProps> = ({
  movieSlug,
  currentUser,
  onOpenAuth
}) => {
  const { t, language } = useLanguage();
  const [comments, setComments] = useState<MovieComment[]>(() => 
    commentService.getComments(movieSlug)
  );

  useEffect(() => {
    setComments(commentService.getComments(movieSlug));
  }, [movieSlug]);

  const [newContent, setNewContent] = useState('');
  const [userRating, setUserRating] = useState<number>(10);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  // State quản lý việc trả lời comment
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Xử lý gửi bình luận chính
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    if (!newContent.trim()) {
      setErrorMsg(language === 'en' ? 'Please enter your review!' : 'Vui lòng nhập nội dung đánh giá phim!');
      return;
    }

    const updated = commentService.addComment(
      movieSlug,
      { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
      newContent,
      userRating
    );
    setComments(updated);
    setNewContent('');
  };

  // Xử lý gửi phản hồi (Reply)
  const handlePostReply = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    if (!replyContent.trim()) return;

    const updated = commentService.addReply(
      movieSlug,
      commentId,
      { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
      replyContent
    );
    setComments(updated);
    setReplyContent('');
    setReplyingToId(null);
  };

  // Xử lý thích bình luận chính
  const handleToggleLike = (commentId: string) => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    const updated = commentService.toggleLikeComment(movieSlug, commentId, currentUser.id);
    setComments(updated);
  };

  // Xử lý thích câu trả lời
  const handleToggleLikeReply = (commentId: string, replyId: string) => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    const updated = commentService.toggleLikeReply(movieSlug, commentId, replyId, currentUser.id);
    setComments(updated);
  };

  return (
    <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-midnight-950/80 border border-white/10 p-5 sm:p-8 backdrop-blur-xl space-y-6">
        
        {/* Tiêu đề & Thống kê */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {t.commentsTitle}
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {comments.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.shareThoughts}
              </p>
            </div>
          </div>
        </div>

        {/* Khung viết bình luận */}
        {currentUser ? (
          <form onSubmit={handlePostComment} className="space-y-3.5 bg-midnight-900/90 p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-red-500/30 bg-midnight-800 shrink-0">
                  <img 
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-white">{currentUser.name}</span>
              </div>

              {/* Bộ chọn đánh giá sao */}
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 font-medium mr-1">{t.score}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-0.5 hover:scale-125 transition-transform"
                      title={`${star}/10 ${language === 'en' ? 'stars' : 'sao'}`}
                    >
                      <Star 
                        className={`w-3.5 h-3.5 transition-colors ${
                          star <= (hoverRating || userRating)
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono ml-1.5">
                  {hoverRating || userRating}/10 ★
                </span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={t.writeCommentPlaceholder}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-midnight-950 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition resize-none"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/30 transition flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.submitComment}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-midnight-900/60 border border-white/5 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">
              {t.loginToCommentTitle}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {t.loginToCommentDesc}
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 transition"
              >
                {t.signInNow}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
              >
                {t.createAccount}
              </button>
            </div>
          </div>
        )}

        {/* Danh sách bình luận */}
        <div className="space-y-4 pt-2">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              {t.noCommentsYet}
            </div>
          ) : (
            comments.map((cmt) => {
              const isLiked = currentUser ? cmt.likedBy.includes(currentUser.id) : false;
              const isReplying = replyingToId === cmt.id;

              return (
                <div key={cmt.id} className="p-4 sm:p-5 rounded-2xl bg-midnight-900/40 border border-white/5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-midnight-800 shrink-0">
                        <img src={cmt.userAvatar} alt={cmt.userName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">{cmt.userName}</span>
                          {cmt.rating && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-mono">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {cmt.rating}/10
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{cmt.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Nội dung bình luận */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-12">
                    {cmt.content}
                  </p>

                  {/* Thanh tương tác Like & Reply */}
                  <div className="flex items-center gap-4 pl-12 text-xs">
                    <button
                      onClick={() => handleToggleLike(cmt.id)}
                      className={`flex items-center gap-1.5 transition ${
                        isLiked ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-400'
                      }`}
                      title={currentUser ? (isLiked ? (language === 'en' ? 'Unlike' : 'Bỏ thích') : (language === 'en' ? 'Like' : 'Thích')) : (language === 'en' ? 'Login to like' : 'Đăng nhập để thích')}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                      <span>{cmt.likes > 0 ? cmt.likes : (language === 'en' ? 'Like' : 'Thích')}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth('login');
                          return;
                        }
                        setReplyingToId(isReplying ? null : cmt.id);
                        setReplyContent('');
                      }}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{t.reply}</span>
                    </button>
                  </div>

                  {/* Form trả lời (Reply form) */}
                  {isReplying && (
                    <form 
                      onSubmit={(e) => handlePostReply(cmt.id, e)} 
                      className="ml-12 mt-2 p-3 rounded-xl bg-midnight-950 border border-white/10 space-y-2 animate-fade-in"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`${language === 'en' ? 'Reply to' : 'Trả lời bình luận của'} ${cmt.userName}...`}
                        className="w-full px-3 py-2 bg-midnight-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingToId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                        >
                          {t.cancel}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition"
                        >
                          {t.sendReply}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Danh sách các câu trả lời (Replies) */}
                  {cmt.replies && cmt.replies.length > 0 && (
                    <div className="ml-12 mt-3 space-y-2.5 border-l-2 border-white/10 pl-3">
                      {cmt.replies.map((rep) => {
                        const isRepLiked = currentUser ? rep.likedBy.includes(currentUser.id) : false;
                        return (
                          <div key={rep.id} className="p-2.5 rounded-xl bg-midnight-950/60 border border-white/5 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-midnight-800 shrink-0">
                                <img src={rep.userAvatar} alt={rep.userName} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs font-bold text-slate-200">{rep.userName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{rep.createdAt}</span>
                            </div>
                            <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                              {rep.content}
                            </p>
                            <div className="pl-8 pt-0.5">
                              <button
                                onClick={() => handleToggleLikeReply(cmt.id, rep.id)}
                                className={`flex items-center gap-1 text-[11px] transition ${
                                  isRepLiked ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-400'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isRepLiked ? 'fill-red-500' : ''}`} />
                                <span>{rep.likes > 0 ? rep.likes : (language === 'en' ? 'Like' : 'Thích')}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
