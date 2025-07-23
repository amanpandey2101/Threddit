"use client";

import * as React from "react";
import { ImageIcon, Sparkles, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createPost } from "@/action/createPost";
import { useChat } from "@ai-sdk/react";
import dynamic from 'next/dynamic'
import type { MDXEditorMethods } from '@mdxeditor/editor'

const Editor = dynamic(() => import('./Editor'), { ssr: false })

function CreatePostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [titleChanged, setTitleChanged] = useState(false);
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const subreddit = searchParams.get("subreddit");
  const { append, isLoading: isAiLoading } = useChat({
    api: "/api/generate",
    onFinish: (message) => {
      const newContent = message.content;
      setBody(newContent);
      editorRef.current?.setMarkdown(newContent);
    },
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);

  if (!subreddit) {
    return (
      <div className="text-center p-4">
        <p>Please select a community first</p>
      </div>
    );
  }

  const handleGenerate = () => {
    if (title) {
      setBody("");
      editorRef.current?.setMarkdown("");
      append({ role: "user", content: title });
    } else {
      setErrorMessage("Please enter a title first");
    }
  };

  const handleSuggestTitles = async () => {
    const prompt = title;
    if (prompt) {
      setIsSuggesting(true);
      setErrorMessage("");
      try {
        const response = await fetch("/api/suggest-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to get title suggestions");
      } finally {
        setIsSuggesting(false);
      }
    } else {
      setErrorMessage("Please write a title or some content first");
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    if (!titleChanged) {
      setOriginalTitle(title);
    }
    setTitle(suggestion);
    setTitleChanged(true);
  };

  const handleUndoTitle = () => {
    setTitle(originalTitle);
    setTitleChanged(false);
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Post title is required");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      let imageBase64: string | null = null;
      let fileName: string | null = null;
      let fileType: string | null = null;

      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
        fileName = imageFile.name;
        fileType = imageFile.type;
      }

      const result = await createPost({
        title: title.trim(),
        subredditSlug: subreddit,
        body: body.trim() || undefined,
        imageBase64: imageBase64,
        imageFilename: fileName,
        imageContentType: fileType,
      });

      resetForm();
      console.log("Finished creating post", result);

      if ("error" in result && result.error) {
        setErrorMessage(result.error);
      } else {
        router.push(`/community/${subreddit}`);
      }
    } catch (err) {
      console.error("Failed to create post", err);
      setErrorMessage("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setErrorMessage("");
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
      <form onSubmit={handleCreatePost} className="space-y-4 mt-2">
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <div className="flex items-center">
              {titleChanged && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUndoTitle}
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Undo
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSuggestTitles}
                disabled={isSuggesting}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isSuggesting
                  ? "..."
                  : suggestions.length > 0
                  ? "Reload Suggestions"
                  : "Suggest Titles"}
              </Button>
            </div>
          </div>
          <Input
            id="title"
            name="title"
            placeholder="Title of your post"
            className="w-full focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleChanged(false);
              setSuggestions([]);
            }}
            required
            maxLength={300}
          />
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.map((s, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="body" className="text-sm font-medium">
              Body (optional)
            </label>
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                disabled={isAiLoading}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isAiLoading ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
          </div>
          <Suspense fallback={<div>Loading editor...</div>}>
    
            <div className="w-full overflow-y-auto rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <Editor
                editorRef={editorRef}
                onChange={(md) => setBody(md)}
                markdown={body}
                className="w-full h-96 overflow-auto"
              />
            </div>
          </Suspense>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image (optional)</label>

          {imagePreview ? (
            <div className="relative w-full h-64 mx-auto">
              <Image
                src={imagePreview}
                alt="Post preview"
                fill
                className="object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="post-image"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    Click to upload an image
                  </p>
                </div>
                <input
                  id="post-image"
                  name="post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Post"}
        </Button>
      </form>
    </div>
  );
}

export default CreatePostForm;