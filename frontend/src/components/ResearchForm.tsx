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

const inputSchema = z.object({
  topic: z.string().min(1, "Enter a valid topic"),
});

export default function ResearchForm() {
  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: { topic: "" },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof inputSchema>) {
    startTransition(async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/v1/research`,
          values
        );

        console.log(data);

        form.reset(); // reset after success
        // TODO: show toast instead of console.log
      } catch (error) {
        console.error(error);
        // TODO: replace with toast
      }
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
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
