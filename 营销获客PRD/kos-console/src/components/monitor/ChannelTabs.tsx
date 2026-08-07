import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { channels, type Channel } from "@/data/tourism";

export function ChannelTabs({ value, onValueChange }: { value: Channel; onValueChange: (value: Channel) => void }) {
  return <Tabs value={value} onValueChange={(next) => onValueChange(next as Channel)}><TabsList className="h-8 w-full justify-start overflow-x-auto bg-muted/70"><TabsTrigger value="all">全部</TabsTrigger>{channels.filter((channel) => channel.id !== "all").map((channel) => <TabsTrigger key={channel.id} value={channel.id}>{channel.label}</TabsTrigger>)}</TabsList></Tabs>;
}
