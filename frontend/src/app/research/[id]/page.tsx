import axios from "axios";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Calendar,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobLog {
  id: string;
  message: string;
  step: string | null;
  timestamp: string;
}

interface ResearchData {
  id: string;
  topic: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  result: JSON;
  createdAt: string;
  updatedAt: string;
  JobLog: JobLog[];
}

const SpecificResearchTopic = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = await params;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}api/v1/research/${id}`
    );

    const research: ResearchData = data.data;

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "COMPLETED":
          return <CheckCircle className="h-5 w-5 text-green-600" />;
        case "FAILED":
          return <XCircle className="h-5 w-5 text-red-600" />;
        case "PROCESSING":
          return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
        default:
          return <Clock className="h-5 w-5 text-gray-600" />;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "COMPLETED":
          return "text-green-600 bg-green-50 border-green-200";
        case "FAILED":
          return "text-red-600 bg-red-50 border-red-200";
        case "PROCESSING":
          return "text-blue-600 bg-blue-50 border-blue-200";
        default:
          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    };

    const formatTimestamp = (timestamp: string) => {
      return new Date(timestamp).toLocaleString();
    };

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Button>
        </Link>

        <div className="border-border bg-secondary rounded-lg border p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-semibold text-foreground capitalize">
                {`Topic: ${research.topic}`}
              </h2>
              <span className="text-sm">{`Id: ${research.id}`}</span>
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

              {/* Date row */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatTimestamp(research.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border bg-secondary rounded-lg border p-6 space-y-4">
          <Tabs defaultValue="results" className="">
            <TabsList className="">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="results">
              {research.result && (
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground ">
                      Research Results
                    </h3>
                  </div>
                  <div className="bg-background rounded-md border p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono overflow-x-auto">
                      {typeof research.result === "string"
                        ? research.result
                        : JSON.stringify(research.result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              {research.status === "FAILED" && !research.result && (
                <div className="border-border bg-secondary rounded-lg border p-8 text-center space-y-4">
                  <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Research Failed
                    </h3>
                    <p className="text-muted-foreground">
                      The research run failed. Check the Logs tab for details.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="logs">
              {research.JobLog && research.JobLog.length > 0 && (
                <div className="border-border bg-secondary rounded-lg border p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Processing Logs
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {research.JobLog.map((log, index) => (
                      <div
                        key={log.id}
                        className="bg-background rounded-md border p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              Step {index + 1}
                            </span>
                            {log.step && (
                              <span className="text-sm font-medium text-foreground">
                                {log.step}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          {research.status === "PENDING" && (
            <div className="border-border bg-secondary rounded-lg border p-8 text-center space-y-4">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Research Pending
                </h3>
                <p className="text-muted-foreground">
                  Your research request is queued and will begin processing
                  shortly.
                </p>
              </div>
            </div>
          )}

          {research.status === "PROCESSING" && (
            <div className="border-border bg-secondary rounded-lg border p-8 text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Research in Progress
                </h3>
                <p className="text-muted-foreground">
                  Your research is currently being processed. Check the logs
                  above for real-time updates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research
            </Button>
          </Link>
        </div>
        <div className="border-border bg-secondary rounded-lg border p-8 text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Research Not Found
            </h3>
            <p className="text-muted-foreground">
              The research with ID {id} could not be found or there was an error
              loading it.
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default SpecificResearchTopic;
