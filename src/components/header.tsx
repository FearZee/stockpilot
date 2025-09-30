import { Package } from "lucide-react";

export const Header = () => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">StockPilot</h1>
              <p className="text-sm text-muted-foreground">
                Shopify Inventory Management Demo
              </p>
            </div>
          </div>
          {/* <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Aktualisiere..." : "Daten aktualisieren"}
          </Button> */}
        </div>
      </div>
    </div>
  );
};
