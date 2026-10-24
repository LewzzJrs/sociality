import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  avatarUrl: string | null;
  className?: string;
};

export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("size-12", className)}>
      <AvatarImage src={avatarUrl ?? undefined} alt="" />
      <AvatarFallback className="bg-neutral-900 text-md font-bold text-foreground">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}