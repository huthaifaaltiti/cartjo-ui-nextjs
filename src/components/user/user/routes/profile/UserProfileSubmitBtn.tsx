"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useTranslations } from "next-intl";

const UserProfileSubmitBtn = () => {
  const t = useTranslations();
  const { handleSubmitAll, isSubmitting } = useUserProfileContext();

  return (
    <Button
      onClick={handleSubmitAll}
      type="submit"
      aria-label="Submit"
      variant="default"
      disabled={isSubmitting}
      className="max-w-80 min-h-11"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t(
            "routes.user.layout.routes.profile.components.UserProfileSubmitBtn.loading"
          )}
        </>
      ) : (
        t(
          "routes.user.layout.routes.profile.components.UserProfileSubmitBtn.submit"
        )
      )}
    </Button>
  );
};

export default memo(UserProfileSubmitBtn);
