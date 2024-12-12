"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { User, Trash2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { getStorageUrl } from "@/lib/utils/storageUtils";
import { supabase } from "@/lib/supabase/supabaseClient";
import type { Comment } from "@/lib/types/commentTypes";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/Textarea";

interface SoundKitCommentsProps {
  soundKitId: string;
}

export function SoundKitComments({ soundKitId }: SoundKitCommentsProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const maxLength = 240;

  const hasProfilePhoto = user?.user_metadata?.profile_photo_url;
  const profilePhotoUrl = hasProfilePhoto
    ? user.user_metadata.profile_photo_url.startsWith("http")
      ? user.user_metadata.profile_photo_url
      : getStorageUrl(user.user_metadata.profile_photo_url)
    : null;

  const fetchComments = useCallback(async () => {
    try {
      // First, get the comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("item_id", soundKitId)
        .eq("item_type", "sound_kit")
        .order("created_at", { ascending: false });

      if (commentsError) {
        console.error("Comments fetch error:", commentsError);
        throw commentsError;
      }

      // Then, for each comment, get the user data
      const commentsWithUsers = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("display_name, profile_photo_url")
            .eq("uuid", comment.user_id)
            .single();

          if (userError) {
            console.error("User fetch error:", userError);
            return {
              ...comment,
              user: undefined,
            };
          }

          return {
            ...comment,
            user: userData,
          };
        })
      );

      setComments(commentsWithUsers);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [soundKitId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      console.log("Attempting to post comment with data:", {
        content: comment.trim(),
        user_id: user.id,
        item_id: soundKitId,
        item_type: "sound_kit",
      });

      const { data, error } = await supabase
        .from("comments")
        .insert({
          content: comment.trim(),
          user_id: user.id,
          item_id: soundKitId,
          item_type: "sound_kit",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error posting comment:", {
          error,
          code: error.code,
          details: error.details,
          message: error.message,
          hint: error.hint,
        });
        toast.error(error.message || "Failed to post comment");
        return;
      }

      console.log("Successfully posted comment:", data);
      setComment("");
      toast.success("Comment posted successfully");
      fetchComments();
    } catch (error) {
      console.error(
        "Error posting comment:",
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error
      );
      toast.error("Failed to post comment. Please try again later.");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast.success("Comment deleted successfully");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div
            className={`w-10 h-10 relative rounded-full overflow-hidden bg-black/40 backdrop-blur-[6px] border border-white/20`}
          >
            {profilePhotoUrl ? (
              <Image
                src={profilePhotoUrl}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-200" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                user ? "Write a comment..." : "Please login to comment"
              }
              maxLength={maxLength}
              disabled={!user}
              className="w-full bg-[#1A1A1A] border-none rounded-lg p-3 text-white resize-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px]"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">
                {comment.length}/{maxLength}
              </span>
              <button
                type="submit"
                disabled={!comment.trim() || !user}
                className="h-10 px-6 bg-white text-black rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-gray-400 text-center py-8">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div
                className={`w-10 h-10 relative rounded-full overflow-hidden bg-black/40 backdrop-blur-[6px] border border-white/20`}
              >
                {comment.user?.profile_photo_url ? (
                  <Image
                    src={
                      comment.user.profile_photo_url.startsWith("http")
                        ? comment.user.profile_photo_url
                        : getStorageUrl(comment.user.profile_photo_url)
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-4 h-4 text-neutral-200" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-[#1A1A1A] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-white">
                        {comment.user?.display_name || "Anonymous"}
                      </span>
                      <span className="text-sm text-gray-400 ml-2">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-200">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
