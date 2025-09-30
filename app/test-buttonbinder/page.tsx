"use client";

import ButtonBinder from "@/components/system/ButtonBinder";
import { BUTTON_INTENTS } from "@/config/button-intents";

export default function TestButtonBinderPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">ButtonBinder Test</h1>
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Test Toast Error</h2>
        <ButtonBinder
          intentKey="test-error"
          intent={{ type: "action", id: "test-error-action" }}
        >
          Test Error Toast
        </ButtonBinder>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Test Navigation</h2>
        <ButtonBinder
          intentKey="test-nav"
          intent={{ type: "nav", to: "/" }}
        >
          Go Home
        </ButtonBinder>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Test Auth Required</h2>
        <ButtonBinder
          intentKey="test-auth"
          intent={{ type: "action", id: "save", requiresAuth: true }}
        >
          Auth Required Action
        </ButtonBinder>
      </div>
    </div>
  );
}
