import { ReactNode } from "react";
import { Panel } from "@/components/ui/panel";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Panel className="border-dashed p-10 text-center">
      <div className="mx-auto max-w-md">
        <p className="text-lg font-medium text-ink">{title}</p>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </Panel>
  );
}
