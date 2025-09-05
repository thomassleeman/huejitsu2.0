// Design system creation page
// Main interface for building design systems

import { DesignSystemBuilder } from "@/components/builder/DesignSystemBuilder";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function CreatePage() {
  return (
    <DashboardLayout>
      <DesignSystemBuilder />
    </DashboardLayout>
  );
}
