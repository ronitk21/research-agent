"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ExternalLinkIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface ResearchItem {
  id: string;
  topic: string;
  status: string;
}

const RecentResearch = () => {
  const [recentSearches, setRecentSearches] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}api/v1/research`
        );

        if (!response) throw new Error("Cannot Reach Backend");
        console.log("API Response:", response.data);
        setRecentSearches(response.data.data || []);
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
        <div>Loading...</div>
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
                    {`Status: ${item.status || "Unknown"}`}
                  </Button>
                  <Button variant={"outline"}>
                    <Link href={`/research/${item.id}`}>
                      <ExternalLinkIcon size={16} />
                    </Link>
                  </Button>
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
