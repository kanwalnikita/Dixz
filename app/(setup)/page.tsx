import { initialProfile } from "@/lib/initial-profile";
import { db} from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";
 
 //int profile amd also as profile in the line no.18 had been in the comments 
interface Profile {
    id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }  
 
const SetupPage = async () => {
    const profile=await initialProfile() as Profile;

    const server=await db.server.findFirst({
        where:{
            members:{
                some:{ 
                    profileId :profile.id,
                }
            }
        }
    });
    if(server){
        return redirect(`/servers/${server.id}`);
    } 
    return <InitialModal/>
}

export default SetupPage;
 