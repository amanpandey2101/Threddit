"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReportButton from "../ReportButton";
import DeleteButton from "../DeleteButton";
import { Loader2 } from "lucide-react";

interface PostActionsProps {
  postId: string;
  postBody: string;
  postOwnerId: string;
}

export default function PostActions({
  postId,
  postBody,
  postOwnerId,
}: PostActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { messages, append, isLoading } = useChat({
    api: "/api/summarize",
  });

  const handleSummarize = () => {
    append({ role: "user", content: postBody });
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleSummarize}>
            Summarize
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>
          </DialogHeader>
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div>
              {messages[messages.length - 1]?.role === "assistant" &&
                messages[messages.length - 1].content}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ReportButton contentId={postId} />
      <DeleteButton
        contentOwnerId={postOwnerId}
        contentId={postId}
        contentType="post"
      />
    </div>
  );
} 