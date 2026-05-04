import prisma from "@/lib/db";

export type CodegenHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function loadRecentProjectHistory(projectId: string, limit = 5): Promise<CodegenHistoryMessage[]> {
  const messages = await prisma.message.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return messages
    .map((message) => ({
      role: (message.role === "ASSISTANT" ? "assistant" : "user") as CodegenHistoryMessage["role"],
      content: message.content,
    }))
    .reverse();
}
