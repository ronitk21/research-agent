"use client";

import React, { use } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Activity,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from "swr";

interface JobLog {
  id: string;
  message: string;
  step: string | null;
  timestamp: string;
}

interface Article {
  title: string;
  summary: string;
  url: string;
  source: string;
  keywords?: string[];
}

interface ResearchData {
  id: string;
  topic: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  result: Article[];
  createdAt: string;
  updatedAt: string;
  JobLog: JobLog[];
}

interface SpecificResearchTopicProps {
  params: Promise<{ id: string }>;
}

const fetcher = async (url: string) => {
  const { data } = await axios.get(url, { timeout: 10000 });
  return data.data;
};

const SpecificResearchTopic = ({ params }: SpecificResearchTopicProps) => {
  const { id } = use(params);

  const {
    data: research,
    error,
    isLoading,
    mutate,
  } = useSWR<ResearchData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/research/${id}`,
    fetcher,
    {
      refreshInterval: (data) => {
        if (!data) return 0;
        return data.status === "PENDING" || data.status === "PROCESSING"
          ? 2000
          : 0;
      },

      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      keepPreviousData: true,
    }
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "PROCESSING":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-700 bg-green-100 border-green-300";
      case "FAILED":
        return "text-red-700 bg-red-100 border-red-300";
      case "PROCESSING":
        return "text-blue-700 bg-blue-100 border-blue-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6 ">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary/10 rounded-lg border p-6 space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="bg-secondary/10 rounded-lg border p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Button>
        </Link>

        {/* 7. Fixed: Better error state */}
        <div className="bg-secondary rounded-lg border p-8 text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Research Not Found</h3>
            <p className="text-muted-foreground">
              {error || `The research with ID "${id}" could not be found.`}
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={() => mutate()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/">
                <Button>Start New Research</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Button>
        </Link>
        <Button
          onClick={() => mutate()}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="bg-secondary rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground break-words">
              {research.topic}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <p>{`ID: ${research.id}`}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                research.status
              )}`}
            >
              {getStatusIcon(research.status)}
              {research.status}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(research.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Fixed: Better tabs styling */}
      <div className="bg-secondary rounded-lg border p-6">
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Logs ({research.JobLog?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="mt-6">
            {research.result &&
            Array.isArray(research.result) &&
            research.result.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Found {research.result.length} relevant articles
                </p>

                <div className="grid gap-6">
                  {research.result.map((article: Article, index: number) => (
                    <div
                      key={index}
                      className="bg-background rounded-lg border p-6 space-y-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-foreground leading-tight flex-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>

                      <p className="text-foreground leading-relaxed">
                        {article.summary}
                      </p>

                      {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.keywords.map(
                            (keywords: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md border"
                              >
                                {keywords}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Source:{" "}
                        <span className="font-medium">{article.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    No Results Available
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {research.status === "FAILED"
                      ? "Research failed to complete. Check the logs for details."
                      : research.status === "COMPLETED"
                      ? "Research completed but no relevant articles were found."
                      : "Research is still in progress."}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            {research.JobLog && research.JobLog.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Processing Timeline</h3>
                </div>

                <div className="space-y-3">
                  {research.JobLog.map((log, index) => (
                    <div
                      key={log.id}
                      className="bg-background rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          {log.step && (
                            <span className="text-sm font-medium text-primary">
                              {log.step}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No logs available yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SpecificResearchTopic;
