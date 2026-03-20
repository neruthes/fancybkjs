const fs = require('fs');
const FancyBook = require("../src/fancybkjs").FancyBook

let mybook = FancyBook.create({ currency: "USD", negative_style: "()" });
let book_output_stream = '';
let accumulated_typst_code = `#set text(size: 11pt, font: ("Noto Sans CJK SC",))`;





mybook.import({
    '银行存款/招商01': 0,
    '现金/收银柜台': 0,
    '现金/董事备用金': 0,
    '应收账款/其他': 0,
    '库存': 0,
    // '在建工程': 0,
    // '长期债权/名义价值': 0,
    // '长期债权/计提减值': 0,
}, {
    
    '实收资本/缴纳总量/张三': 0,
    '实收资本/缴纳总量/李四': 0,
    '实收资本/消耗总量': 0,
    '资本公积': 0,

    // '当期股东垫付/张三': 0,
    // '当期股东垫付/李四': 0,

    '应付账款/其他': 0,
    '应付账款/房东A': 0,

    '@本期营业/收入/主营业务': 0,
    '@本期营业/收入/其他': 0,
    '@本期营业/支出/成本': 0,
    '@本期营业/支出/管理费用': 0,
    '@本期营业/支出/其他': 0,

    '@结算用临时科目/本期毛利': 0,
    '@结算用临时科目/本期所得税': 0,
    '@结算用临时科目/本期净利': 0,

    // '权益净值': 0,
    '未分配利润': 0,
    '待发分红': 0,
})




book_output_stream += `<h1>Example: Shop2</h1>`;
let active_pro_group_obj = null;
let active_balsh_snapshot_obj = ''



active_pro_group_obj = mybook.pro_group(function () {
    mybook.date("2015-02-18")
    mybook.expand(null, "银行存款/招商01", "实收资本/缴纳总量/张三", 150000, "扩表：股东出资");
    mybook.expand(null, "银行存款/招商01", "实收资本/缴纳总量/李四", 50000, "扩表：股东出资");
    mybook.transferD(null, "@本期营业/支出/成本", "应付账款/房东A", 4200, "产生店铺租金，2015-03");

    mybook.expand(null, "库存", "应付账款/供应商B", 830, "扩表：赊账进货");
    mybook.expand(null, "银行存款/招商01", "@本期营业/收入/主营业务", 5800, "扩表：销售商品所得");
    mybook.shrink(null, "库存", "@本期营业/支出/成本", 830, "缩表：结转销售成本");
    mybook.shrink(null, "银行存款/招商01", "应付账款/供应商B", 830, "缩表：支付货款");

    mybook.date("2015-03-09")
    mybook.shrink(null, "银行存款/招商01", "应付账款/房东A", 4200, "缩表：实际支付租金");
    mybook.shrink(null, "银行存款/招商01", "@本期营业/支出/管理费用", 225, "缩表：支付清洁费");
});
book_output_stream += active_pro_group_obj.html;
book_output_stream += active_pro_group_obj.typst_pre;
accumulated_typst_code += active_pro_group_obj.typst;


book_output_stream += `<h2>资产负债表快照</h2>`;
active_balsh_snapshot_obj = mybook.pro_dump_balance_sheet();
book_output_stream += active_balsh_snapshot_obj.html;
accumulated_typst_code += active_balsh_snapshot_obj.typst;


// 年终决算
active_pro_group_obj = mybook.pro_group(function () {
    mybook.date("2015-12-31");
    mybook.transferD(null, "@本期营业/收入/主营业务", "@结算用临时科目/本期毛利", mybook.getD("@本期营业/收入/主营业务"), "结算...")
    mybook.transferD(null, "@本期营业/支出/成本", "@结算用临时科目/本期毛利", mybook.getD("@本期营业/支出/成本"), "结算...")
    mybook.transferD(null, "@本期营业/支出/管理费用", "@结算用临时科目/本期毛利", mybook.getD("@本期营业/支出/管理费用"), "结算...")
    mybook.transferD(null, "@结算用临时科目/本期毛利", "@结算用临时科目/本期所得税", 27.25, "结算...")
    mybook.shrink(null, "银行存款/招商01", "@结算用临时科目/本期所得税", 27.25, "缩表：缴纳企业所得税")
    mybook.transferD(null, "@结算用临时科目/本期毛利", "@结算用临时科目/本期净利", 517.75, "结算...")
    mybook.transferD(null, "@结算用临时科目/本期净利", "未分配利润", 517.75, "结算...")
    mybook.transferD(null, "未分配利润", "待发分红", 217.75, "分红决议")
    mybook.transferD(null, "未分配利润", "资本公积", 300, "资本公积")
    mybook.shrink(null, "银行存款/招商01", "待发分红", 117.25, "缩表：实发分红（张三）")
    mybook.shrink(null, "银行存款/招商01", "待发分红", 100.00, "缩表：实发分红（李四）")
});
book_output_stream += active_pro_group_obj.html;
book_output_stream += active_pro_group_obj.typst_pre;
accumulated_typst_code += active_pro_group_obj.typst;


book_output_stream += `<h2>资产负债表快照</h2>`;
active_balsh_snapshot_obj = mybook.pro_dump_balance_sheet();
book_output_stream += active_balsh_snapshot_obj.html;
accumulated_typst_code += active_balsh_snapshot_obj.typst;










let final_html = `<html>
<head>
    <title>Example: Shop2</title>
    <style>
        <style>
        html, body {
            font-size: 10px;
        }
        h1 { padding: 60px 0 30px; }
        h2 { border-bottom: 1px solid #999; padding: 10px 0 10px; margin: 40px 0 20px; }
        table th {
            text-align: left;
        }
        table.table-loglines { width: 100%; overflow: scroll; }
        th, td { padding: 3px 11px; }
        th.th-date { width: 7em; }
        th.th-subj1, th.th-subj2 { width: 20rem; }
        th.th-amount1, th.th-amount2 { width: 6em; text-align: right; }
        table, tr {
            border: 1px solid #999;
            border-collapse: collapse;
        }
        .tabular-nums, td { font-variant-numeric: tabular-nums; }
        td.col-comment { font-size: 0.8em; width: auto; }
        td.col-amount1, td.col-amount2 { text-align: right; }
    </style>
    </style>
</head>
<body>
${book_output_stream}
</body>
</html>`
fs.writeFileSync(process.argv[1] + '.html', final_html);


fs.writeFileSync(process.argv[1] + '.typ', accumulated_typst_code);




/*
    node examples/shop2zh.js
    w=y ntypstpro examples/shop2zh.js.typ
*/
