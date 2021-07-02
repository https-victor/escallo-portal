import { useParams } from 'react-router-dom';

const Profile = (): any => {
  const { userId } = useParams();
  return (
    <div>
      <h1>Profile: {userId}</h1>
    </div>
  );
};

export default Profile;
