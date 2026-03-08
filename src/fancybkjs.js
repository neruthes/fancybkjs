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
        dict[name] = dict[name] || 0;
    };

    __commit_value_change(name, is_asset, amount) {
        this.__probe_subj(name, is_asset);
        const dict = is_asset ? this.RAM.subjectsA : this.RAM.subjectsD;
        dict[name] += amount; // We internally store 1000 times of real value to avoid float precision problems
    };

    static __super_sanitize_number(input_number) {
        return parseFloat((input_number).toFixed(3))
    }
    __get_subj_val(name, is_asset) {
        const dict = is_asset ? this.RAM.subjectsA : this.RAM.subjectsD;
        return FancyBook.__super_sanitize_number(dict[name] / 1000);
    };
    getA(name) { return __get_subj_val(name, true) };
    getD(name) { return __get_subj_val(name, false) };

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

    __render_number__negative(input_number) {
        if (this._config.negative_style === "-") {
            return (input_number).toFixed(2);
        };
        if (this._config.negative_style === "()") {
            return (input_number).toFixed(2).replace("-", "(") + ")";
        };
        if (this._config.negative_style === "red") {
            return `<span style="color: red;">${(input_number).toFixed(2)}</span>`;
        };
        return 'CONFIG ERROR';
    };

    __render_number(input_number) {
        if (input_number < 0) {
            return this.__render_number__negative(input_number / 1000);
        } else {
            return (input_number / 1000).toFixed(2);
        };
    };

    __render_group_arr(arr) {
        let output_string = `<table>
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
        let output_string = this.__render_group_arr(this.RAM.current_group_output_arr);
        this.RAM.current_group_output_arr = [];
        return output_string;
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
        this.__commit_value_change(subj1, is_asset, amount * 1e3);
        return this.__write_transaction_output(this.RAM.last_date, subj1, subj2, amount * 1e3, comment, -1);
    };
    transferA(input_date, subj1, subj2, amount, comment) {
        return this.__any_transfer(true, input_date, subj1, subj2, amount, comment);
    };
    transferD(input_date, subj1, subj2, amount, comment) {
        return this.__any_transfer(false, input_date, subj1, subj2, amount, comment);
    };


    // __render_balance_sheet_table_from_dict(input_dict) {
    //     // NOTE: input_dict is like: {"Capital/Input/Alice": 20, "Capital/Input/Bob": 30, "Capital/Spent": -40, "OtherPayable": 10}
    //     let raw_subjects_list = Object.keys(input_dict);
    //     let subjects_tree = [ // Here is an example...
    //         {
    //             name: "Capital", value: 10, children: [
    //                 { name: "Input", value: 50, children: [
    //                     { name: "Alice", value: 20, children: [] },
    //                     { name: "Alice", value: 30, children: [] },
    //                 ] },
    //                 { name: "Spent", value: 50, children: [] },
    //             ]
    //         }
    //     ]
    //     // TODO: Parse input_dict and generate subjects_tree (only subjects with names containing slash) and finally render a table to show nested subjects on the tree and the remaining simple subjects in `raw_subjects_list` as in the original order

    //     return `<table>
    //         <tbody>
    //         // TODO...
    //         </tbody>
    //     </table>`;
    // };


    // START OF GEMINI CODE
    __render_balance_sheet_table_from_dict(input_dict) {
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
                <td><span ></span>${(new Array(depth).fill("└&nbsp;").join(''))}${node.name}</td>
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
    // END OF GEMINI CODE

    dump_balance_sheet() {
        let s01 = this.__render_balance_sheet_table_from_dict(this.RAM.subjectsA);
        let s02 = this.__render_balance_sheet_table_from_dict(this.RAM.subjectsD);
        return `<div>
            <div style="float: left; margin-right: 2em;">${s01}</div>
            <div style="float: left;">${s02}</div>
            <div style="clear: both"></div>
        </div>`;
    };
}






module.exports = {
    FancyBook
}
