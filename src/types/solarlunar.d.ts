declare module 'solarlunar' {
  interface LunarData {
    lYear: number;       // 农历年份
    lMonth: number;      // 农历月份
    lDay: number;        // 农历日
    animal: string;      // 生肖
    monthCn: string;     // 农历月份中文（如：十月）
    dayCn: string;       // 农历日中文（如：廿三）
    cYear: number;       // 公历年份
    cMonth: number;      // 公历月份
    cDay: number;        // 公历日
    gzYear: string;      // 干支年
    gzMonth: string;     // 干支月
    gzDay: string;       // 干支日
    isToday: boolean;    // 是否为今天
    isLeap: boolean;     // 是否为闰月
    nWeek: number;       // 星期几（数字）
    ncWeek: string;      // 星期几（中文）
    isTerm: boolean;     // 是否为节气
    term: string;        // 节气名称
  }

  interface SolarLunar {
    solar2lunar(year: number, month: number, day: number): LunarData;
    lunar2solar(year: number, month: number, day: number, isLeap?: boolean): LunarData;
  }

  const solarLunar: SolarLunar;
  export default solarLunar;
}
