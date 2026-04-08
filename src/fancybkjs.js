// 8f1b0038d6d55b9956cc84d7d4f5e8d0
// refetchw=https://raw.githubusercontent.com/neruthes/fancybkjs/refs/heads/master/src/fancybkjs.js

class FancyBook {
    _config = {};
    RAM = {
        subjectsA: {},
        subjectsD: {},
        last_date: "1970-01-01",
        is_group_active: false,
        current_group_output_arr: [],
    };

    static create(input_config) {
        let staging = new FancyBook();
        const default_config = {
            currency: "$",
            negative_style: "-", // Possible values: "-", "()", "red"
            subject_names_mapping: {},
        };
        staging._config = { ...default_config, ...input_config };
        return staging;
    };


    import(subjectsA, subjectsD) {
        const __process_dict = function (dict) {
            const md2 = {};
            Object.keys(dict).forEach(key => md2[key] = dict[key] * 1e3);
            return md2;
        }
        this.RAM.subjectsA = __process_dict(subjectsA);
        this.RAM.subjectsD = __process_dict(subjectsD);
    };

    date(input_date) {
        this.RAM.last_date = input_date
    };

    __probe_subj(name, is_asset) {
        const dict = is_asset ? this.RAM.subjectsA : this.RAM.subjectsD;
        const anti_dict = !is_asset ? this.RAM.subjectsA : this.RAM.subjectsD;
        if (anti_dict[name] == undefined) {
            dict[name] = dict[name] || 0;
        } else {
            throw "EDUPSUBJ: The other side of the balance sheet must not have a same-name subject!";
        };
    };

    __commit_value_change(name, is_asset, amount) {
        this.__probe_subj(name, is_asset);
        const dict = is_asset ? this.RAM.subjectsA : this.RAM.subjectsD;
        dict[name] += amount; // We internally store 1000 times of real value to avoid float precision problems
    };

    static __super_sanitize_number(input_number) {
        return parseFloat(input_number.toFixed(3));
    };
    __get_subj_val(name, is_asset) {
        const dict = is_asset ? this.RAM.subjectsA : this.RAM.subjectsD;
        return FancyBook.__super_sanitize_number(dict[name] / 1000);
    };
    getA(name) { return this.__get_subj_val(name, true) };
    getD(name) { return this.__get_subj_val(name, false) };

    __write_transaction_output(input_date, subj1, subj2, amount, comment, amount2_polarity) {
        if (this.RAM.is_group_active) {
            this.RAM.current_group_output_arr.push({
                date: input_date, subj1, subj2, amount, amount2: amount * amount2_polarity, comment
            });
            return '';
        } else {
            return [input_date, subj1, subj2, amount, amount * amount2_polarity, comment].join(' | ');
        };
    };

    __render_number_negative_step2(input_str) {
        if (this._config.negative_style === "-") {
            return input_str
        };
        if (this._config.negative_style === "()") {
            return `(${input_str.replace('-', '')})`;
        };
        if (this._config.negative_style === "red") {
            return `<span style="color: red;">${input_str.replace('-', '-')}</span>`;
        };
        return 'CONFIG ERROR';
    };

    __render_number(input_number) {
        let result = (input_number / 1000).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        }).replace('$', '');
        if (input_number < 0) {
            result = this.__render_number_negative_step2(result);
        }
        return result;
    };

    __render_group_arr_typst(arr) {
        let output_string = `
#block(breakable: true, {
set text(size: 9.0pt, number-width: "tabular")
let render_transaction(dat, subj1, am1, subj2, am2, comment) = box(inset: (bottom: -0.3mm),table(
    inset: 0mm,
    columns:(6em, 3fr, 2fr, 3fr, 2fr, 4fr), gutter: 2mm, align: (left, left, right, left, right, left), stroke: none,
    dat, subj1, am1, subj2, am2, text(size:0.75em, comment),
))\n`;
        output_string += arr.map(node => {
            return `  render_transaction("${node.date}", "${node.subj1}", "${this.__render_number(node.amount)}", "${node.subj2}", "${this.__render_number(node.amount2)}", "${node.comment}")`;
        }).join('\n');
        output_string += `\n})`;
        return output_string;
    };

    __render_group_arr_html(arr) {
        let output_string = `<table class="table-loglines">
            <thead>
                <tr>
                    <th class="th-date">Date</th>
                    <th class="th-subj1">Subject 1</th>
                    <th class="th-amount1">Amount 1</th>
                    <th class="th-subj2">Subject 2</th>
                    <th class="th-amount2">Amount 2</th>
                    <th class="th-comment">Comment</th>
                </tr>
            </thead>
        <tbody>`;
        output_string += arr.map(node => {
            return `<tr>
                    <td class="col-date">${node.date}</td>
                    <td class="col-subj1">${node.subj1}</td>
                    <td class="col-amount1">${this.__render_number(node.amount)}</td>
                    <td class="col-subj2">${node.subj2}</td>
                    <td class="col-amount2">${this.__render_number(node.amount2)}</td>
                    <td class="col-comment">${node.comment}</td>
            </tr>`;
        }).join('\n');
        output_string += `</tbody></table>`;
        return output_string;
    };

    group(callback) {
        this.RAM.is_group_active = true;
        callback();
        this.RAM.is_group_active = false;
        let output_string = this.__render_group_arr_html(this.RAM.current_group_output_arr);
        this.RAM.current_group_output_arr = [];
        return output_string;
    };

    // The pro version returns a multi-format dictionary
    pro_group(callback) {
        this.RAM.is_group_active = true;
        callback();
        this.RAM.is_group_active = false;
        let output_string_html = this.__render_group_arr_html(this.RAM.current_group_output_arr);
        let output_string_typst = this.__render_group_arr_typst(this.RAM.current_group_output_arr);
        this.RAM.current_group_output_arr = [];
        return {
            html: output_string_html,
            typst: output_string_typst,
            typst_pre: `<pre style="padding: 1em; background: rgba(122, 122, 122, 0.06); border: 1px solid #666;">\n${output_string_typst}\n</pre>`,
        };
    };

    expand(input_date, subj1, subj2, amount, comment) {
        if (input_date) { this.date(input_date); };
        this.__commit_value_change(subj1, true, amount * 1e3);
        this.__commit_value_change(subj2, false, amount * 1e3);
        return this.__write_transaction_output(this.RAM.last_date, subj1, subj2, amount * 1e3, comment, 1);
    };

    shrink(input_date, subj1, subj2, amount, comment) {
        return this.expand(input_date, subj1, subj2, -amount, comment);
    };


    __any_transfer(is_asset, input_date, subj1, subj2, amount, comment) {
        if (input_date) { this.date(input_date); };
        this.__commit_value_change(subj1, is_asset, -amount * 1e3);
        this.__commit_value_change(subj2, is_asset, amount * 1e3);
        return this.__write_transaction_output(this.RAM.last_date, subj1, subj2, amount * 1e3, comment, -1);
    };
    transferA(input_date, subj1, subj2, amount, comment) {
        return this.__any_transfer(true, input_date, subj1, subj2, amount, comment);
    };
    transferD(input_date, subj1, subj2, amount, comment) {
        return this.__any_transfer(false, input_date, subj1, subj2, amount, comment);
    };



    __render_balance_sheet_table_from_dict__typst(input_dict) {
        const raw_subjects_list = Object.keys(input_dict);
        const subjects_tree = [];

        // 1. Helper to find or create a node in the tree
        const getOrCreateNode = (parentArray, name) => {
            let node = parentArray.find(n => n.name === name);
            if (!node) {
                node = { name, value: 0, children: [] };
                parentArray.push(node);
            }
            return node;
        };

        // 2. Build the Tree
        raw_subjects_list.forEach(path => {
            if (path.includes('/')) {
                const parts = path.split('/');
                let currentLevel = subjects_tree;
                parts.forEach(part => {
                    let node = getOrCreateNode(currentLevel, part);
                    node.value += input_dict[path];
                    currentLevel = node.children;
                });
            }
        });

        // 3. Helper to render tree rows (Typst syntax)
        const renderTreeRows = (nodes, depth = 0) => {
            return nodes.map(node => {
                const indent = depth > 0 ? `#h(${depth * 2}em)` : "";
                const row = `  [${indent}#"${node.name}"], [${this.__render_number(node.value)}],\n`;
                return row + renderTreeRows(node.children, depth + 1);
            }).join('');
        };

        // 4. Handle simple subjects
        const renderSimpleRows = () => {
            return raw_subjects_list
                .filter(path => !path.includes('/'))
                .map(path => `  [#"${path}"], [${this.__render_number(input_dict[path])}],\n`)
                .join('');
        };

        // 5. Construct the final Typst table
        // columns: (1fr, auto) makes the first column expand and the second fit the text
        // align: (left, right) sets alignment per column
        return `
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
${renderTreeRows(subjects_tree)}${renderSimpleRows()}
)
`;
    }

    // ----- BEGIN GEMINI CODE -----
    __render_balance_sheet_table_from_dict__html(input_dict) {
        const raw_subjects_list = Object.keys(input_dict);
        const subjects_tree = [];

        // 1. Helper to find or create a node in the tree
        const getOrCreateNode = (parentArray, name) => {
            let node = parentArray.find(n => n.name === name);
            if (!node) {
                node = { name, value: 0, children: [] };
                parentArray.push(node);
            }
            return node;
        };

        // 2. Build the Tree for subjects with slashes
        raw_subjects_list.forEach(path => {
            if (path.includes('/')) {
                const parts = path.split('/');
                let currentLevel = subjects_tree;
                let node;

                parts.forEach(part => {
                    node = getOrCreateNode(currentLevel, part);
                    node.value += input_dict[path]; // Accumulate values up the tree
                    currentLevel = node.children;
                });
            }
        });

        // 3. Helper to render tree rows recursively
        const renderTreeRows = (nodes, depth = 0) => {
            // style="padding-left: ${depth * 20}px"
            return nodes.map(node => `
            <tr>
                <td><span ></span>${(new Array(depth).fill("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;").join(''))}${node.name}</td>
                <td style="text-align: right;">${this.__render_number(node.value)}</td>
            </tr>
            ${renderTreeRows(node.children, depth + 1)}
        `).join('');
        };

        // 4. Handle simple subjects (no slash) in original order
        const renderSimpleRows = () => {
            return raw_subjects_list
                .filter(path => !path.includes('/'))
                .map(path => `
                <tr>
                    <td>${path}</td>
                    <td style="text-align: right;">${this.__render_number(input_dict[path] / 1.000)}</td>
                </tr>
            `).join('');
        };

        return `
        <table style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th style="text-align: right;">Value</th>
                </tr>
            </thead>
            <tbody>
                ${renderTreeRows(subjects_tree)}
                ${renderSimpleRows()}
            </tbody>
        </table>`;
    };
    // ----- END GEMINI CODE -----

    dump_balance_sheet(format) {
        if (format === 'html') {
            let s01 = this.__render_balance_sheet_table_from_dict__html(this.RAM.subjectsA);
            let s02 = this.__render_balance_sheet_table_from_dict__html(this.RAM.subjectsD);
            return `<div>
                <div style="float: left; margin-right: 2em;">${s01}</div>
                <div style="float: left;">${s02}</div>
                <div style="clear: both"></div>
            </div>`;
        }

        if (format === 'typst') {
            let s01 = this.__render_balance_sheet_table_from_dict__typst(this.RAM.subjectsA);
            let s02 = this.__render_balance_sheet_table_from_dict__typst(this.RAM.subjectsD);
            return `\n\n#block({
    set table()
    box(baseline: 100%, width: 49%, box[${s01}])
    h(1fr)
    box(baseline: 100%, width: 49%, box[${s02}])
})`;
        }

    };

    pro_dump_balance_sheet() {
        return {
            html: this.dump_balance_sheet('html'),
            typst: this.dump_balance_sheet('typst'),
        }
    }
}






module.exports = {
    FancyBook
}
