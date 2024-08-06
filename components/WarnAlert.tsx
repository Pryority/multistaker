import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function WarnAlert({ message }: { message: string }) {
  return (
    <div className="p-4">
      <Alert className="border-amber-500 text-amber-600">
        <TriangleAlert
          color="#d97706"
          className="h-4 w-4 bg-clip-text text-transparent"
        />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
