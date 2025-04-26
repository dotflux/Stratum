import { useUser } from "../Home";

const Account = () => {
  const { user } = useUser();
  return (
    <div>
      <h1 className="text-white text-2xl text-center relative">
        {user?.username}
      </h1>
    </div>
  );
};

export default Account;
