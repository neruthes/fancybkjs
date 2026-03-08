const fs = require('fs');
const FancyBook = require("../src/fancybkjs").FancyBook

let mybook = FancyBook.create({ currency: "USD", negative_style: "()" });
let book_output_stream = '';


book_output_stream += mybook.group(function () {
    mybook.date("2015-02-01")
    mybook.expand(null, "BankDeposit/BOA", "Equity/Input/Alice", 5000, "Initial shareholder investment");
    mybook.expand(null, "BankDeposit/WF", "Equity/Input/Bob", 3000, "Initial shareholder investment");
    mybook.shrink(null, "BankDeposit/WF", "Equity/Spent", 7999, "Office rent lease");
});

book_output_stream += `<h2>Balance Sheet Snapshot</h2>`;
book_output_stream += mybook.dump_balance_sheet();




let final_html = `<html>
<head>
    <title>Example: SomeCorp1</title>
    <style>
        html, body {
            font-size: 14px;
        }
        h1 { padding: 60px 0 30px; }
        h2 { border-bottom: 1px solid #999; padding: 10px 0 10px; margin: 40px 0 20px; }
        table th {
            text-align: left;
        }
        table.table-loglines { width: 100%; overflow: scroll; }
        th, td { padding: 3px 11px; }
        th.th-subj1, th.th-subj2 { width: 10.5rem; }
        th.th-amount1, th.th-amount2 { width: auto; text-align: right; }
        table, tr {
            border: 1px solid #999;
            border-collapse: collapse;
        }
        .tabular-nums, td { font-variant-numeric: tabular-nums; }
        td.col-comment { font-size: 0.8em; }
        td.col-amount1, td.col-amount2 { text-align: right; }
    </style>
</head>
<body>
${book_output_stream}
</body>
</html>`
fs.writeFileSync(process.argv[1] + '.html', final_html);
