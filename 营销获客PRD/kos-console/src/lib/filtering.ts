import type { Channel, Visitor } from "@/data/tourism";

export function filterVisitors(visitors: Visitor[], channel: Channel): Visitor[] {
  if (channel === "all") return visitors;
  return visitors.filter((visitor) => visitor.channel === channel);
}
