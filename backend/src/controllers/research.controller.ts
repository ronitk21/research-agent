import { type Response, type Request } from "express";
import z from "zod";

import { researchTopicSchema } from "../lib/schema";
import prisma from "../lib/prisma";
import { researchQueue } from "../lib/queue";
import asyncHandler from "../lib/asyncHandler";
import ApiError from "../lib/ApiError";
import ApiResponse from "../lib/ApiResponse";

export const newTopicResearch = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = researchTopicSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new ApiError(400, "Invalid input data", errors);
    }

    const { topic } = parsed.data;

    const newJob = await prisma.researchJob.create({
      data: {
        topic,
        status: "PENDING",
      },
    });

    await researchQueue.add("process-research", { jobId: newJob.id });
    res
      .status(202)
      .json(new ApiResponse(202, newJob, "Research job created successfully"));
  }
);

export const getAllResearch = asyncHandler(
  async (req: Request, res: Response) => {
    const allSearch = await prisma.researchJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        topic: true,
        status: true,
        createdAt: true,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, allSearch, "Research jobs fetched successfully.")
      );
  }
);

export const getSpecificResearch = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      throw new ApiError(400, "Research ID is required");
    }

    const research = await prisma.researchJob.findUnique({
      where: {
        id,
      },
      include: {
        JobLog: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!research) {
      throw new ApiError(404, "Research job not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, research, "Research job fetched successfully")
      );
  }
);
