import ResearchForm from "@/components/ResearchForm";

export default function Home() {
  return (
    <div className="border max-w-3xl mx-auto flex flex-col items-center justify-start mt-12 sm:mt-16 space-y-8 sm:space-y-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter text-center">
        AI Research Agent
      </h1>
      <ResearchForm />
    </div>
  );
}
