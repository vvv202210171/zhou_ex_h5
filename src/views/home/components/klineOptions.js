import i18n from '@/i18n/index'
// k线图配置
export function getKlineOption() {
  return {
    Type: '历史K线图',
    Language: i18n.locale || 'EN',
    SplashTitle: 'loading...',
    // 窗口指标
    Windows: [
      { Index: '均线', Modify: false, Change: false },
      { Index: 'VOL', Modify: false, Change: false }
      // { Index: "RSI", Modify: false, Change: false }
    ],
    // Symbol: '600000.sh',
    IsAutoUpdate: false,
    AutoUpdateFrequency: 3000, // 数据更新频率 ms

    IsShowRightMenu: false, // 右键菜单
    IsApiPeriod: true, // 使用Api计算周期

    IsClickShowCorssCursor: true, // 手势点击出现十字光标
    IsCorssOnlyDrawKLine: true, // 十字光标在K线中间
    CorssCursorTouchEnd: true, // 手势离开屏幕十字光标自动隐藏
    EnableScrollUpDown: true, // 允许手势上下操作滚动页面
    CorssCursorInfo: { Left: 0, Right: 2, Bottom: 1, IsShowCorss: true }, // 十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内
    StepPixel: 10, // 控制拖拽速度
    ZoomStepPixel: 20, // 控制拖拽速度

    KLine: {
      DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
      Right: 1, // 复权 0 不复权 1 前复权 2 后复权
      Period: 0, // 周期 0 日线 1 周线 2 月线 3 年线
      MaxReqeustDataCount: 1000, // 日线数据最近1000天
      MaxRequestMinuteDayCount: 15, // 分钟数据最近15天
      PageSize: 50, // 一屏显示多少数据
      IsShowTooltip: false, // 是否显示K线提示信息
      RightSpaceCount: 8
    },
    // 标题设置
    KLineTitle: {
      IsShowName: false, // 不显示股票名称
      IsShowSettingInfo: false // 不显示周期/复权
    },
    // 边框
    Border: {
      Left: 1, // 左边间距
      Right: 1, // 右边间距
      Top: 0,
      Bottom: 20
    },
    // 子框架设置
    Frame: [
      { SplitCount: 4, IsShowLeftText: false, Custom: [{ Type: 0 }], SplitType: 1 },
      { SplitCount: 2, IsShowLeftText: false, Height: 6 },
      { SplitCount: 3, IsShowLeftText: false }
    ],

    ExtendChart: [{ Name: 'KLineTooltip' }] // tooltip十字光标提示信息
  }
}

// 分时图配置
export function getKMinuteOption() {
  return {
    Type: '历史K线图',
    Language: i18n.locale || 'EN',
    SplashTitle: 'loading...',

    // 窗口指标
    Windows: [
      { Index: 'EMPTY', Modify: false, Change: false, TitleHeight: 0 },
      { Index: 'VOL', Modify: false, Change: false }
    ],
    // Symbol: '600000.sh',
    IsAutoUpdate: false,
    AutoUpdateFrequency: 3000, // 数据更新频率 ms

    IsShowRightMenu: false, // 右键菜单
    IsApiPeriod: true, // 使用Api计算周期

    IsClickShowCorssCursor: true, // 手势点击出现十字光标
    IsCorssOnlyDrawKLine: true, // 十字光标在K线中间
    CorssCursorTouchEnd: true, // 手势离开屏幕十字光标自动隐藏
    EnableScrollUpDown: true, // 允许手势上下操作滚动页面
    CorssCursorInfo: { Left: 0, Right: 2, Bottom: 1, IsShowCorss: true }, // 十字光标刻度设置 Left, Right, Bottom十字光标刻度显示设置 0=不显示 1=现在在框外 2=显示在框内
    StepPixel: 10,
    ZoomStepPixel: 10, // 控制拖拽速度

    KLine: {
      DragMode: 1, // 拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
      Right: 1, // 复权 0 不复权 1 前复权 2 后复权
      Period: 4, // 周期 0 日线 1 周线 2 月线 3 年线
      MaxReqeustDataCount: 1000, // 日线数据最近1000天
      MaxRequestMinuteDayCount: 15, // 分钟数据最近15天
      PageSize: 100, // 一屏显示多少数据
      IsShowTooltip: false, // 是否显示K线提示信息
      DrawType: 4
    },
    // 标题设置
    KLineTitle: {
      IsShowName: false, // 不显示股票名称
      IsShowSettingInfo: false // 不显示周期/复权
    },
    // 边框
    Border: {
      Left: 3, // 左边间距
      Right: 3, // 右边间距
      Top: 20,
      Bottom: 20
    },
    // 子框架设置
    Frame: [
      { SplitCount: 4, IsShowLeftText: false, Custom: [{ Type: 0 }] },
      { SplitCount: 2, IsShowLeftText: false, Height: 6 },
      { SplitCount: 3, IsShowLeftText: false }
    ],

    ExtendChart: [{ Name: 'KLineTooltip' }] // tooltip十字光标提示信息
  }
}

// 周期菜单配置
export function getPeriodMenu() {
  // ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引
  return [
    { Name: i18n.t('tradeLang.lang8'), Period: 4, Type: -1, Min: 1, periodName: '1min' },
    { Name: i18n.t('tradeLang.lang9'), Period: 4, Type: 0, Min: 1, periodName: '1min' },
    { Name: i18n.t('tradeLang.lang10'), Period: 6, Type: 0, Min: 15, periodName: '15min' },
    { Name: i18n.t('tradeLang.lang11'), Period: 8, Type: 0, Min: 60, periodName: '60min' }

  ]
}

export function getMorePeriod() {
  return [
    { Name: i18n.t('tradeLang.lang9a'), Period: 5, Type: 0, Min: 5, periodName: '5min' },
    { Name: i18n.t('tradeLang.lang10a'), Period: 7, Type: 0, Min: 30, periodName: '30min' },
    { Name: i18n.t('tradeLang.lang12'), Period: 12, Type: 0, Min: 240, periodName: '4hour' },
    { Name: i18n.t('tradeLang.lang13'), Period: 0, Type: 1, Min: 1440, periodName: '1day' },
    { Name: i18n.t('tradeLang.lang13a'), Period: 1, Type: 2, Min: 10080, periodName: '1week' }
  ]
}
// 指标菜单配置
export function getIndexMenu() {
  // ID=指标ID Name=菜单显示的名字  WindowIndex=切换指标对应的窗口索引
  return [
    { Name: 'KDJ', ID: 'KDJ', WindowIndex: 1 },
    { Name: 'MACD', ID: 'MACD', WindowIndex: 2 },
    { Name: 'RSI', ID: 'RSI', WindowIndex: 1 },
    { Name: 'BOLL', ID: 'BOLL', WindowIndex: 0 },
    { Name: 'VOL', ID: 'VOL', WindowIndex: 1 },
    { Name: '均线', ID: '均线', WindowIndex: 0 }
  ]
}
