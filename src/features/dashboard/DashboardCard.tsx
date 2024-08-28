'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type DashboardCardProps = {
  description: string;
  title: string;
  Icon: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardCard({
  description,
  title,
  Icon,
  children,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
        </div>
        {Icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
