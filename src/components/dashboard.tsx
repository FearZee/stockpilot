"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DashboardProps {
  totalProducts: number;
  lowStockCount: number;
  critStockCount: number;
  averageDSR: number;
  salesData: Array<{ date: string; sales: number }>;
}

export function Dashboard({
  totalProducts,
  lowStockCount,
  critStockCount,
  averageDSR,
  salesData,
}: DashboardProps) {
  const criticalStockPercentage = (
    (lowStockCount / totalProducts) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Gesamt Produkte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-products">
              {totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aktive Produkte im Shop
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Ø Verkäufe/Tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="average-dsr">
              {isNaN(averageDSR) ? 0 : averageDSR.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Durchschnittliche Daily Sales Rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Niedriger Bestand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold" data-testid="low-stock-count">
                {lowStockCount}
              </div>
              <Badge variant="destructive" className="text-xs">
                {criticalStockPercentage}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Produkte mit &lt;14 Tage Reichweite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Kritischer Bestand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className="text-2xl font-bold"
                data-testid="crit-stock-count"
              >
                {critStockCount}
              </div>
              <Badge variant="destructive" className="text-xs">
                {criticalStockPercentage}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Produkte mit &lt;7 Tage Reichweite
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verkäufe der letzten 7 Tage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="sales-data">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} Verkäufe`, "Anzahl"]}
                  labelFormatter={(label) => `Datum: ${label}`}
                />
                <Bar
                  dataKey="sales"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
