"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Heart, MessageCircle, Send, Eye, EyeOff, Users, ThumbsUp, Flag } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

interface Post {
  id: string;
  author: string;
  content: string;
  category: string;
  date: string;
  likes: number;
  comments: Comment[];
  anonymous: boolean;
}

const defaultPosts: Post[] = [
  {
    id: "1",
    author: "Anonymous",
    content: "Has anyone else experienced brain fog getting worse before their period? I feel like I can't concentrate at all during that week.",
    category: "Symptoms",
    date: "2 hours ago",
    likes: 12,
    anonymous: true,
    comments: [
      { id: "c1", author: "Sarah M.", content: "Yes! I've noticed the same pattern. It usually clears up for me a day or two after my period starts.", date: "1 hour ago", likes: 5 },
      { id: "c2", author: "Lisa R.", content: "Completely normal. It's related to the drop in estrogen. I found that magnesium helps a bit.", date: "30 min ago", likes: 3 },
    ],
  },
  {
    id: "2",
    author: "Jennifer K.",
    content: "Just had my first appointment where I brought my Vindi report. My doctor was actually impressed! She said the data made it much easier to discuss treatment options.",
    category: "Success Stories",
    date: "5 hours ago",
    likes: 24,
    anonymous: false,
    comments: [
      { id: "c3", author: "Anonymous", content: "That's amazing! I'm planning to do the same for my next appointment.", date: "3 hours ago", likes: 7 },
    ],
  },
  {
    id: "3",
    author: "Anonymous",
    content: "What supplements have you found most helpful for night sweats? I've tried a few but nothing seems to work consistently.",
    category: "Questions",
    date: "1 day ago",
    likes: 8,
    anonymous: true,
    comments: [],
  },
];

const categories = ["All", "Symptoms", "Questions", "Success Stories", "Tips & Tricks", "Support"];

export default function CommunityPage() {
  const [posts, setPosts] = useState(defaultPosts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const filteredPosts = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something to share");
      return;
    }
    const post: Post = {
      id: String(Date.now()),
      author: anonymous ? "Anonymous" : "You",
      content: newPost,
      category: "Questions",
      date: "Just now",
      likes: 0,
      comments: [],
      anonymous,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost("");
    toast.success("Post created!");
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) {
      toast.error("Please write a comment");
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: String(Date.now()), author: "You", content: text, date: "Just now", likes: 0 },
              ],
            }
          : p
      )
    );
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    toast.success("Comment added!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-1">Connect with others on their perimenopause journey. Share, learn, and support each other.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Share with the Community</CardTitle>
            <CardDescription>Posts are anonymous by default for your privacy.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What's on your mind? Ask a question, share a tip, or start a discussion..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Switch id="anonymous" checked={anonymous} onCheckedChange={setAnonymous} />
                <Label htmlFor="anonymous" className="flex items-center gap-1 text-sm">
                  {anonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  Post anonymously
                </Label>
              </div>
              <Button onClick={handleCreatePost}>
                <Send className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "All" ? <Users className="h-4 w-4 mr-1" /> : null}
              {cat}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={post.anonymous ? "bg-muted" : "bg-brand-100 text-brand-700"}>
                        {post.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{post.author}</p>
                        {post.anonymous && (
                          <Badge variant="outline" className="text-[10px]">Anonymous</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{post.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <div className="flex items-center gap-4 w-full">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-500 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    {post.likes}
                  </button>
                  <button onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-brand-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    {post.comments.length}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors ml-auto">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </CardFooter>

              {showComments[post.id] && (
                <div className="px-6 pb-4">
                  <Separator className="mb-4" />
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 mb-4">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-muted">{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium">{comment.author}</p>
                          <span className="text-xs text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentText[post.id] || ""}
                      onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      rows={2}
                      className="flex-1"
                    />
                    <Button size="sm" className="self-end" onClick={() => handleAddComment(post.id)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Community Guidelines:</strong> This is a supportive space for women to share experiences. Content shared here is not medical advice. Always consult your healthcare provider. Be respectful, kind, and supportive.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
