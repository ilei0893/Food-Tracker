import { usda } from "@/lib/usda";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const data = await usda.listFoods({
      pageSize: searchParams.get("pageSize") ?? undefined,
      pageNumber: searchParams.get("pageNumber") ?? undefined,
    });
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
