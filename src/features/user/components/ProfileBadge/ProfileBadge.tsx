import { User } from '@/src/generated/fragments';
import Avatar from '@/src/shared/components/Avatar/Avatar';

type ProfileBadgeProps = {
  user: Pick<User, 'name' | 'picture'>;
  className?: string;
  avatarClassName?: string;
  nameClassName?: string;
};

const ProfileBadge: React.FC<ProfileBadgeProps> = (props) => {
  const {
    user,
    className = '',
    avatarClassName = '',
    nameClassName = '',
  } = props;

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-8 mr-2 ${avatarClassName}`}>
        <Avatar {...user} />
      </div>
      <p
        className={`text-base font-medium whitespace-nowrap overflow-ellipsis overflow-hidden ${nameClassName}`}
      >
        {user.name}
      </p>
    </div>
  );
};

export default ProfileBadge;
