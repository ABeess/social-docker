import { Participant, User } from 'src/types/Base';

interface GenerateNameChatPrams {
  participants: Array<Participant>;
  type: string;
  owner: User;
  currentUserId: string;
  title?: string;
}

export const generateNameChat = ({ participants, type, owner, currentUserId, title }: GenerateNameChatPrams) => {
  const generateName = (prev: string, user: User) => `${prev} ${user.firstName} ${user.lastName},`;
  const messageName = title
    ? title
    : participants.reduce(
        (prev, { user }) =>
          type === 'groups' ? generateName(prev, user) : user.id === currentUserId ? prev : generateName(prev, user),
        ''
      );

  const avatarGroup = participants.reduce(
    (prev, { user }) =>
      type === 'private'
        ? user.id === currentUserId
          ? (owner?.avatar as string)
          : (user?.avatar as string)
        : user.id !== currentUserId
        ? (user.avatar as string)
        : prev,
    ''
  );

  return {
    name: messageName.slice(0, -1),
    avatarGroup: avatarGroup,
  };
};
