/*
import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const profile = await currentProfilePages(req)
    const { messageId, serverId, channelId } = req.query
    const { content } = req.body

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID Missing' })
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID Missing' })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res.status(404).json({ error: 'Server Not Found' })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return res.status(404).json({ error: 'Channel Not Found' })
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res.status(404).json({ error: 'Member Not Found' })
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message Not Found' })
    }

    const isMessageOwner = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted...',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[MESSAGE_ID]', error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
*/

import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types'
import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

try {
  const profile = await currentProfilePages(req);
  const {content,fileUrl} = req.body;
  const {conversationId}= req.query;

  if(!profile){
    return res.status(401).json({error: "Unauthorized"});
  }
  if(!conversationId){
    return res.status(400).json({error: "Server ID is missing"});
  }
 
  if(!content){
    return res.status(400).json({error: "Content is missing"});
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId as string,
      OR: [
        {
          memberOne: {
            profileId: profile.id,
          },
        },
        {
          memberTwo: {
            profileId: profile.id,
          },
        },
      ],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });

  if(!conversation){
    return res.status(404).json({message: "Conversation not found"})
  }
 
  const member =
  conversation.memberOne.profileId === profile.id
    ? conversation.memberOne
    : conversation.memberTwo

if (!member) {
  return res.status(404).json({ message: 'Member Not Found' })
}

const message = await db.directMessage.create({
  data: {
    content,
    fileUrl,
    conversationId: conversationId as string,
    memberId: member.id,
  },
  include: {
    member: {
      include: {
        profile: true,
      },
    },
  },
})

const channelKey = `chat:${conversationId}:messages`

res?.socket?.server?.io?.emit(channelKey, message)

return res.status(200).json(message)
} catch (error) {
console.log('[DIRECT_MESSAGES_POST]', error)
return res.status(500).json({ message: 'Internal Error' })
}
}
