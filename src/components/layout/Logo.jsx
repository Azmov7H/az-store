import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/logo.png" alt="Logo" />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
    </div>
  )
}
