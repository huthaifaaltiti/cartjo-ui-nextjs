import { memo } from "react";
import CreateAdminUserForm from "./CreateAdminUserForm";

const CreateAdminUser = async () => {
  return <CreateAdminUserForm />;
};

export default memo(CreateAdminUser);
