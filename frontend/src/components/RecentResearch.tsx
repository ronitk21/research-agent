"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ExternalLinkIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface ResearchItem {
  id: string;
  topic: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

const RecentResearch = () => {
  const [recentSearches, setRecentSearches] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/research`
        );

        if (!data) throw new Error("Cannot Reach Backend");
        setRecentSearches(data.data || []);
      } catch (error) {
        console.error("Error fetching recent searches:", error);
        setRecentSearches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSearches();
  }, []);

  if (loading) {
    return (
      <div className="w-full sm:w-4/5 lg:w-full text-left mt-10 flex flex-col gap-4">
        <h1 className="text-2xl tracking-tighter font-bold">Recent Research</h1>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="border-border bg-secondary/10 rounded-md border py-4 px-7 flex items-center justify-between"
            >
              <div className="flex flex-col items-start gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex justify-between items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-4/5 lg:w-full text-left mt-10 flex flex-col gap-4">
      <h1 className="text-2xl tracking-tighter font-bold">Recent Research</h1>
      <div className="flex flex-col gap-4">
        {recentSearches.length === 0 ? (
          <div className="text-muted-foreground">No recent research found.</div>
        ) : (
          recentSearches.map((item) => {
            return (
              <div
                key={item.id}
                className="border-border bg-secondary rounded-md border py-4 px-7 flex items-center justify-between"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-light">{item.id}</span>
                  <p className="font-medium text-md">{`Topic: ${item.topic}`}</p>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    variant={"secondary"}
                    className={
                      item.status === "COMPLETED"
                        ? "text-green-600"
                        : item.status === "FAILED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {item.status || "Unknown"}
                  </Button>

                  <Link href={`/research/${item.id}`}>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentResearch;
