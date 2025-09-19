"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

const inputSchema = z.object({
  topic: z
    .string()
    .min(1, "Enter a valid topic")
    .max(100, "Topic must be less than 200 characters.")
    .trim(),
});

export default function ResearchForm() {
  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: { topic: "" },
  });

  const [isPending, startTransition] = useTransition();

  const suggestedTopics = [
    "Artificial Intelligence in healthcare",
    "Climate change solutions 2024",
    "Cryptocurrency market trends",
    "Remote work productivity tools",
    "Electric vehicle adoption rates",
  ];

  const handleSuggestionClick = (topic: string) => {
    form.setValue("topic", topic);
  };

  function onSubmit(values: z.infer<typeof inputSchema>) {
    startTransition(async () => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/research`, values)
        .then(() => {
          form.reset();
          toast.success("Research started successfully!");
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              toast.error(error.response.data.message || "Server error");
            } else if (error.request) {
              toast.error("Server not reachable.");
            } else {
              toast.error("Unexpected error occurred");
            }
          } else {
            console.error("❌ Unknown error:", error);
            toast.error("Unexpected error occurred");
          }
        });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full sm:w-4/5 lg:w-full"
      >
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base sm:text-lg">Topic</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., The future of renewable energy"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((topic, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(topic)}
                disabled={isPending}
                className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors disabled:opacity-50"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={isPending || !form.watch("topic")?.trim()}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Starting Research..." : "Start Research"}
        </Button>
      </form>
    </Form>
  );
}
