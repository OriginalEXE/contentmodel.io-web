import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AvatarPropsInterface {
  picture?: string;
}

const Avatar: React.FC<AvatarPropsInterface> = ({ picture = '' }) => {
  if (picture === '') {
    return (
      <div className="w-full h-full flex rounded-full items-center justify-center bg-gray-300 text-gray-800 shadow-inner">
        <FontAwesomeIcon icon={['fas', 'user']} size="lg" fixedWidth />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center rounded-full bg-white relative">
      <img
        className="w-full h-full object-cover rounded-full"
        src={picture}
        alt="Avatar"
        referrerPolicy="no-referrer"
      />
      <div className="absolute h-full w-full top-0 left-0 shadow-inner rounded-full" />
    </div>
  );
};

export default Avatar;
