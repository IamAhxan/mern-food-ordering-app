import { useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { updateUser, isPending } = useUpdateMyUser();
  return (
    <div>
      <UserProfileForm onSave={updateUser} isLoading={isPending} />
    </div>
  );
};

export default UserProfilePage;
