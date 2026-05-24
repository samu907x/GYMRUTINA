"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, TrendingUp } from 'lucide-react';

interface CaloriesIndicatorProps {
  calorias: number;
  meta?: number;
}

export function CaloriesIndicator({ calorias, meta = 500 }: CaloriesIndicatorProps) {
  const porcentaje = Math.min((calorias / meta) * 100, 100);

  return (
    <Card className="border-border/50 bg-gradient-to-br from-accent/10 to-accent/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Flame className="w-4 h-4 text-accent" />
          </div>
          Calorías a quemar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold text-accent">{calorias}</span>
            <span className="text-lg text-muted-foreground ml-1">kcal</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Meta: {meta} kcal</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={porcentaje} className="h-3 bg-muted" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{porcentaje.toFixed(0)}% de tu meta</span>
            <span>{Math.max(0, meta - calorias)} kcal restantes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
