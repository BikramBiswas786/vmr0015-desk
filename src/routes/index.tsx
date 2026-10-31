import { WorkDesk } from "@/components/desk/WorkDesk";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: WorkDesk });
