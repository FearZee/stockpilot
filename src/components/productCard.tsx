import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { StockCoverageIndicator } from "./stockCoverageIndicator";
import { ImageWithFallback } from "./imageWithFallback";

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  image: string | null;
  dailySalesRate: number;
  stockCoverage: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-square relative bg-gray-50">
          <ImageWithFallback
            src={product.image ?? ""}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-medium truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              {formatPrice(product.price)}
            </span>
            <Badge variant="outline">{product.stock} auf Lager</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ø Verkäufe/Tag:</span>
              <span>{product.dailySalesRate.toFixed(1)}</span>
            </div>
            <StockCoverageIndicator daysRemaining={product.stockCoverage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
