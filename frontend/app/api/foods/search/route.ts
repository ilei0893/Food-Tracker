import { usda } from "@/lib/usda";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  try {
    const data = await usda.searchFoods(query, {
      pageSize: searchParams.get("pageSize") ?? undefined,
      pageNumber: searchParams.get("pageNumber") ?? undefined,
    });
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
