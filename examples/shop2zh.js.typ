#set text(size: 11pt, font: ("Noto Sans CJK SC",))
#block(breakable: true, {
set text(size: 9.0pt, number-width: "tabular")
let render_transaction(dat, subj1, am1, subj2, am2, comment) = box(inset: (bottom: -0.3mm),table(
    inset: 0mm,
    columns:(6em, 3fr, 2fr, 3fr, 2fr, 4fr), gutter: 2mm, align: (left, left, right, left, right, left), stroke: none,
    dat, subj1, am1, subj2, am2, text(size:0.75em, comment),
))
  render_transaction("2015-02-18", "银行存款/招商01", "150000.00", "实收资本/缴纳总量/张三", "150000.00", "扩表：股东出资")
  render_transaction("2015-02-18", "银行存款/招商01", "50000.00", "实收资本/缴纳总量/李四", "50000.00", "扩表：股东出资")
  render_transaction("2015-02-18", "@本期营业/支出/成本", "4200.00", "应付账款/房东A", "(4200.00)", "产生店铺租金，2015-03")
  render_transaction("2015-02-18", "库存", "830.00", "应付账款/供应商B", "830.00", "扩表：赊账进货")
  render_transaction("2015-02-18", "银行存款/招商01", "5800.00", "@本期营业/收入/主营业务", "5800.00", "扩表：销售商品所得")
  render_transaction("2015-02-18", "库存", "(830.00)", "@本期营业/支出/成本", "(830.00)", "缩表：结转销售成本")
  render_transaction("2015-02-18", "银行存款/招商01", "(830.00)", "应付账款/供应商B", "(830.00)", "缩表：支付货款")
  render_transaction("2015-03-09", "银行存款/招商01", "(4200.00)", "应付账款/房东A", "(4200.00)", "缩表：实际支付租金")
  render_transaction("2015-03-09", "银行存款/招商01", "(225.00)", "@本期营业/支出/管理费用", "(225.00)", "缩表：支付清洁费")
})

#block({
    set table()
    box(baseline: 100%, width: 49%, box[
#table(
  columns: (1fr, auto),
  inset: 0pt,
  gutter: 2mm,
  align: (left, right),
  stroke: none,
  table.header(
    [*Subject*], [*Value*],
  ),
  table.hline(),
  table.cell(inset: 1mm, []), [],
  [#"银行存款"], [200545.00],
  [#h(2em)#"招商01"], [200545.00],
  [#"现金"], [0.00],
  [#h(2em)#"收银柜台"], [0.00],
  [#h(2em)#"董事备用金"], [0.00],
  [#"应收账款"], [0.00],
  [#h(2em)#"其他"], [0.00],
  [#"库存"], [0.00],

)
])
    h(1fr)
    box(baseline: 100%, width: 49%, box[
#table(
  columns: (1fr, auto),
  inset: 0pt,
  gutter: 2mm,
  align: (left, right),
  stroke: none,
  table.header(
    [*Subject*], [*Value*],
  ),
  table.hline(),
  table.cell(inset: 1mm, []), [],
  [#"实收资本"], [200000.00],
  [#h(2em)#"缴纳总量"], [200000.00],
  [#h(4em)#"张三"], [150000.00],
  [#h(4em)#"李四"], [50000.00],
  [#h(2em)#"消耗总量"], [0.00],
  [#"应付账款"], [0.00],
  [#h(2em)#"其他"], [0.00],
  [#h(2em)#"房东A"], [0.00],
  [#h(2em)#"供应商B"], [0.00],
  [#"@本期营业"], [545.00],
  [#h(2em)#"收入"], [5800.00],
  [#h(4em)#"主营业务"], [5800.00],
  [#h(4em)#"其他"], [0.00],
  [#h(2em)#"支出"], [(5255.00)],
  [#h(4em)#"成本"], [(5030.00)],
  [#h(4em)#"管理费用"], [(225.00)],
  [#h(4em)#"其他"], [0.00],
  [#"@结算用临时科目"], [0.00],
  [#h(2em)#"本期毛利"], [0.00],
  [#h(2em)#"本期所得税"], [0.00],
  [#h(2em)#"本期净利"], [0.00],
  [#"资本公积"], [0.00],
  [#"未分配利润"], [0.00],
  [#"待发分红"], [0.00],

)
])
})
#block(breakable: true, {
set text(size: 9.0pt, number-width: "tabular")
let render_transaction(dat, subj1, am1, subj2, am2, comment) = box(inset: (bottom: -0.3mm),table(
    inset: 0mm,
    columns:(6em, 3fr, 2fr, 3fr, 2fr, 4fr), gutter: 2mm, align: (left, left, right, left, right, left), stroke: none,
    dat, subj1, am1, subj2, am2, text(size:0.75em, comment),
))
  render_transaction("2015-12-31", "@本期营业/收入/主营业务", "5800.00", "@结算用临时科目/本期毛利", "(5800.00)", "结算...")
  render_transaction("2015-12-31", "@本期营业/支出/成本", "(5030.00)", "@结算用临时科目/本期毛利", "5030.00", "结算...")
  render_transaction("2015-12-31", "@本期营业/支出/管理费用", "(225.00)", "@结算用临时科目/本期毛利", "225.00", "结算...")
  render_transaction("2015-12-31", "@结算用临时科目/本期毛利", "27.25", "@结算用临时科目/本期所得税", "(27.25)", "结算...")
  render_transaction("2015-12-31", "银行存款/招商01", "(27.25)", "@结算用临时科目/本期所得税", "(27.25)", "缩表：缴纳企业所得税")
  render_transaction("2015-12-31", "@结算用临时科目/本期毛利", "517.75", "@结算用临时科目/本期净利", "(517.75)", "结算...")
  render_transaction("2015-12-31", "@结算用临时科目/本期净利", "517.75", "未分配利润", "(517.75)", "结算...")
  render_transaction("2015-12-31", "未分配利润", "217.75", "待发分红", "(217.75)", "分红决议")
  render_transaction("2015-12-31", "未分配利润", "300.00", "资本公积", "(300.00)", "资本公积")
  render_transaction("2015-12-31", "银行存款/招商01", "(117.25)", "待发分红", "(117.25)", "缩表：实发分红（张三）")
  render_transaction("2015-12-31", "银行存款/招商01", "(100.00)", "待发分红", "(100.00)", "缩表：实发分红（李四）")
})

#block({
    set table()
    box(baseline: 100%, width: 49%, box[
#table(
  columns: (1fr, auto),
  inset: 0pt,
  gutter: 2mm,
  align: (left, right),
  stroke: none,
  table.header(
    [*Subject*], [*Value*],
  ),
  table.hline(),
  table.cell(inset: 1mm, []), [],
  [#"银行存款"], [200300.50],
  [#h(2em)#"招商01"], [200300.50],
  [#"现金"], [0.00],
  [#h(2em)#"收银柜台"], [0.00],
  [#h(2em)#"董事备用金"], [0.00],
  [#"应收账款"], [0.00],
  [#h(2em)#"其他"], [0.00],
  [#"库存"], [0.00],

)
])
    h(1fr)
    box(baseline: 100%, width: 49%, box[
#table(
  columns: (1fr, auto),
  inset: 0pt,
  gutter: 2mm,
  align: (left, right),
  stroke: none,
  table.header(
    [*Subject*], [*Value*],
  ),
  table.hline(),
  table.cell(inset: 1mm, []), [],
  [#"实收资本"], [200000.00],
  [#h(2em)#"缴纳总量"], [200000.00],
  [#h(4em)#"张三"], [150000.00],
  [#h(4em)#"李四"], [50000.00],
  [#h(2em)#"消耗总量"], [0.00],
  [#"应付账款"], [0.00],
  [#h(2em)#"其他"], [0.00],
  [#h(2em)#"房东A"], [0.00],
  [#h(2em)#"供应商B"], [0.00],
  [#"@本期营业"], [0.00],
  [#h(2em)#"收入"], [0.00],
  [#h(4em)#"主营业务"], [0.00],
  [#h(4em)#"其他"], [0.00],
  [#h(2em)#"支出"], [0.00],
  [#h(4em)#"成本"], [0.00],
  [#h(4em)#"管理费用"], [0.00],
  [#h(4em)#"其他"], [0.00],
  [#"@结算用临时科目"], [0.00],
  [#h(2em)#"本期毛利"], [0.00],
  [#h(2em)#"本期所得税"], [0.00],
  [#h(2em)#"本期净利"], [0.00],
  [#"资本公积"], [300.00],
  [#"未分配利润"], [0.00],
  [#"待发分红"], [0.50],

)
])
})