import PayoutsClient from "./PayoutsClient";
import RequireAuth from "@/components/RequireAuth";

export default function PayoutsPage() {
  return (
    <RequireAuth>
      <PayoutsClient />
    </RequireAuth>
  );
}
