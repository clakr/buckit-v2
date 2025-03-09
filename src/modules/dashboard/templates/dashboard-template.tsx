import { supabase } from "@/supabase";
import { useNavigate } from "@tanstack/react-router";

export default function DashboardTemplate() {
  const navigate = useNavigate({ from: "/dashboard" });

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);

    navigate({
      to: "/",
      replace: true,
    });
  }

  return (
    <div>
      <button type="button" onClick={handleLogout}>
        {" "}
        logout{" "}
      </button>
      dashboard
    </div>
  );
}
