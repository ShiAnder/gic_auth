"use client";

import { AddDetailsForm } from "@/components/add-details-form/AddDetailsForm";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();

  if (!user) {
    window.location.href = "/client";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <AddDetailsForm label="" user={user} />
    </div>
  );
};

export default ClientPage;