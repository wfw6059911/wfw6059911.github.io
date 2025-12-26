// 响应式列配置
export interface ColSpanConfig {
  xs: number;
  sm: number;
  md?: number;
  lg: number;
  xl?: number;
}

// 根据列数计算响应式配置
export const getColSpan = (columns: number): ColSpanConfig => {
  const colConfig: Record<number, ColSpanConfig> = {
    6: { xs: 24, sm: 12, md: 8, lg: 6, xl: 4 },
    4: { xs: 24, sm: 12, md: 8, lg: 6 },
    3: { xs: 24, sm: 12, lg: 8 },
  };
  return colConfig[columns] || colConfig[3];
};
