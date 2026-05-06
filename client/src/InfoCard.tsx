import { Field, FieldDescription, FieldLegend } from "./components/ui/field";
import { FieldGroup } from "./components/ui/field";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "./lib/utils";
import type { ReactNode } from "react";

function InfoCard({
  title,
  refresh,
  session,
  isRefreshing,
  sessionInfo,
  children
}: {
  title: string;
  refresh: () => void;
  session: boolean;
  isRefreshing: boolean;
  sessionInfo: { name: string; value: string };
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" onClick={refresh}>
            <RefreshCw
              className={cn("size-3.5", isRefreshing && "animate-spin")}
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLegend>로그인 상태</FieldLegend>
            <FieldDescription>
              {session ? "로그인됨" : "로그인되지 않음"}
            </FieldDescription>
          </Field>
          <Field>
            <FieldLegend>{sessionInfo.name}</FieldLegend>
            <FieldDescription
              className="break-all line-clamp-1"
              title={sessionInfo.value}
            >
              {sessionInfo.value}
            </FieldDescription>
          </Field>
          {children && <>
            <Field>
            {children}
          </Field>
          </>}
          
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

export default InfoCard;
