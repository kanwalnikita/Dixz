
"use client"; // ✅ Ensure this is at the top

import { useState } from "react"; // ✅ Import useState AFTER "use client"
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal();
    const [open, setOpen] = useState(false); // ✅ N

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 
                dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => {
                            setOpen(false); // ✅ N
                            onOpen("invite", { server });
                        }}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Invite people
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {
                            setOpen(false);
                            onOpen("editServer", { server });
                        }}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {
                            setOpen(false);
                            onOpen("members", { server });
                        }}
                        className="px-3 py-2 text-sm cursor-pointer"
                    >
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() =>{
                            setOpen(false);
                        onOpen('createChannel', { server });
                        }}
                        className='px-3 py-2 text-sm cursor-pointer justify-between'
                    >
                        Create Channel
                       <PlusCircle className='h-4 w-4 ml-auto' />
                </DropdownMenuItem>
                )}
                {isModerator && <DropdownMenuSeparator />}
                {isAdmin && (
          <DropdownMenuItem
            onClick={() => {
                setOpen(false);
            onOpen('deleteServer', { server });
            }}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer justify-between'
          >
            Delete Server
            <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )} 
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {
                            setOpen(false);
                            onOpen("leaveServer", { server });
                        }}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
