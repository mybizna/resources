import accounting from "accounting";

import fetchComponent from "@/utils/fetchComponent";

const currencyOptions = {
    symbol: "$",
    decimal: ".",
    thousand: ",",
    format: "",
};

const dateFormat = "d/m/Y";

export default {
    __(value, type) {
        return value;
    },
    currencyUSD(value) {
        return "$" + value;
    },
    toCurrency(value) {
        if (typeof value !== "number") {
            return value;
        }
        var formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 4,
        });
        return formatter.format(value);
    },
    uppercase(val) {
        if (typeof val === "string") {
            return val.toUpperCase();
        }
        return val;
    },
    money(val) {
        if (typeof val === "number") {
            return `${val.toFixed(2)}`;
        }
    },
    formatAmount(val, prefix = false) {
        if (val < 0) {
            return prefix
                ? `Cr. ${this.moneyFormat(Math.abs(val))}`
                : `${this.moneyFormat(Math.abs(val))}`;
        }

        return prefix
            ? `Dr. ${this.moneyFormat(val)}`
            : `${this.moneyFormat(Math.abs(val))}`;
    },

    formatDBAmount(val, prefix = false) {
        if (val < 0) {
            return `(-) ${this.moneyFormat(Math.abs(val))}`;
        }

        return this.moneyFormat(val);
    },

    showAlert(type, message) {
        this.$swal({
            position: "center",
            type: type,
            title: message,
            showConfirmButton: false,
            timer: 1500,
        });
    },

    getFileName(path) {
        // eslint-disable-next-line no-useless-escape
        return path.replace(/^.*[\\\/]/, "");
    },

    decodeHtml(str) {
        const regex = /^[A-Za-z0-9 ]+$/;

        if (regex.test(str)) {
            return str;
        }

        const txt = document.createElement("textarea");
        txt.innerHTML = str;

        return txt.value;
    },

    moneyFormat(number) {
        return accounting.formatMoney(number, currencyOptions);
    },

    moneyFormatwithDrCr(value) {
        var DrCr = null;

        if (value.indexOf("Dr") > 0) {
            DrCr = "Dr ";
        } else if (value.indexOf("Dr") === -1) {
            DrCr = "Cr ";
        }

        const money = accounting.formatMoney(value, currencyOptions);

        return DrCr + money;
    },

    noFulfillLines(lines, selected) {
        let nofillLines = false;

        for (const item of lines) {
            if (!Object.prototype.hasOwnProperty.call(item, selected)) {
                nofillLines = true;
            } else {
                nofillLines = false;
                break;
            }
        }

        return nofillLines;
    },

    formatDate(d) {
        if (!d) {
            return "";
        }

        var date = new Date(d),
            month = date.getMonth() + 1,
            day = date.getDate(),
            year = date.getFullYear();

        if (month.toString().length < 2) {
            month = "0" + month;
        }

        if (day.toString().length < 2) {
            day = "0" + day;
        }

        switch (dateFormat) {
            case "d/m/Y": // -- 31/12/2020
                return [day, month, year].join("/");

            case "m/d/Y": // -- 12/31/2020
                return [month, day, year].join("/");

            case "m-d-Y": // -- 12-31-2020
                return [month, day, year].join("-");

            case "d-m-Y": // -- 31-12-2020
                return [day, month, year].join("-");

            case "Y-m-d": // -- 2020-12-31
                return [year, month, day].join("-");

            case "d.m.Y": // -- 31.12.2020
                return [day, month, year].join(".");

            default:
                return date.toDateString().replace(/^\S+\s/, "");
        }
    },

    fetchComponent(comp_path) {
        if (Array.isArray(comp_path)) {
            comp_path =
                //"assets/" +
                comp_path[0] + "/admin/" + comp_path[1] + "/" + comp_path[2];
        }

        try {
            return fetchComponent(comp_path);
        } catch (error) {
            throw new Error(`Error raised on file ${comp_path}`);
        }
    },

    formatNumber(n) {
        var ending = ["k", "m", "b", "t"];

        var n_str = n.toString();

        if (n_str.length < 4) {
            return n;
        } else {
            //return n_str[0] + ending[Math.floor((n_str.length - 1) / 3) - 1];
            return `${n_str[0]}${n_str[1] != "0" ? `.${n_str[1]}` : ""}${ending[Math.floor((n_str.length - 1) / 3) - 1]}`;
        }
    },

    pathParamHelper(path_list) {
        var first_ucword =
            path_list[0].charAt(0).toUpperCase() + path_list[0].slice(1);
        var second_ucword =
            path_list[1].charAt(0).toUpperCase() + path_list[1].slice(1);
        var side_selector = "";
        var path_side_selector = "";
        var dotted_side_selector = "";
        var underscore_side_selector = "";

        var side_selector_ucword =
            side_selector.charAt(0).toUpperCase() + side_selector.slice(1);

        var reqular_const = {
            path_arr: path_list,
            path: path_side_selector + path_list[0] + "/" + path_list[1],
            dotted: dotted_side_selector + path_list[0] + "." + path_list[1],
            underscore:
                underscore_side_selector + path_list[0] + "_" + path_list[1],
            connected: side_selector_ucword + first_ucword + second_ucword,
        };

        if (window.is_backend) {
            reqular_const.path =
                path_side_selector + path_list[0] + "/admin/" + path_list[1];
            reqular_const.dotted =
                dotted_side_selector + path_list[0] + ".admin." + path_list[1];
        }

        return reqular_const;
    },

    formInputProcessorHelper(field, t) {
        var select_name = "";
        var input_field = {};

        if (field.type) {
            var input_fields_arr = [
                "",
                "text",
                "password",
                "reset",
                "color",
                "date",
                "email",
                "month",
                "number",
                "range",
                "search",
                "tel",
                "time",
                "url",
                "week",
            ];

            if (input_fields_arr.indexOf(field.type) > 0) {
                input_field["type"] = "input";
                input_field["inputType"] = field.type;
            } else {
                input_field["type"] = field.type;
            }
        }

        if (field.name) {
            select_name = field.name + "_list";
            var tmp_label = field.name
                .replace("_id", "")
                .replace("_", " ")
                .replace(/\w\S*/g, function (word) {
                    return (
                        word.charAt(0).toUpperCase() +
                        word.substr(1).toLowerCase()
                    );
                });

            input_field["id"] = field.name.toLowerCase();
            input_field["label"] = tmp_label;
            input_field["model"] = field.name.toLowerCase();
            input_field["placeholder"] = "Your " + tmp_label;
        }

        if (field.type === "selectrecord") {
            input_field["type"] = "select";

            input_field["values"] = [];
        } else if (field.type === "yesno") {
            input_field["type"] = "switch";
            input_field["textOn"] = "Yes";
            input_field["textOff"] = "No";
            input_field["valueOn"] = 1;
            input_field["valueOff"] = 0;
        } else if (field.type === "selectyesno") {
            input_field["type"] = "select";

            input_field["values"] = [
                {
                    id: 1,
                    name: "Yes",
                },
                {
                    id: 0,
                    name: "No",
                },
            ];
        }

        if (field.id) {
            input_field["id"] = field.id;
        }

        if (field.label) {
            input_field["label"] = field.label;
        }

        if (field.model) {
            input_field["model"] = field.model;
        }

        if (field.placeholder) {
            input_field["placeholder"] = field.placeholder;
        }

        if (field.styleClasses) {
            input_field["styleClasses"] = field.styleClasses;
        }

        if (field.featured) {
            input_field["featured"] = field.featured;
        }

        if (field.required) {
            input_field["required"] = field.required;
        }

        if (field.readonly) {
            input_field["readonly"] = field.readonly;
        }

        if (field.disabled) {
            input_field["disabled"] = field.disabled;
        }

        if (field.values) {
            input_field["values"] = field.values;
        }

        if (field.visible) {
            var function_str =
                "(function (model) { \
                return model && " +
                field.visible +
                ";\
            })";

            input_field["visible"] = eval(function_str);
        }

        return input_field;
    },

    saveRecordHelper(this_var, path_param, return_url) {
        const t = this_var;

        var path = (t.model.id) ? path_param.path + '/' + t.model.id : path_param.path;

        window.axios.post(path, t.model).then((response) => {
            var tmpitem = response.data;

            if (Object.prototype.hasOwnProperty.call(tmpitem, "record")) {
                t.record = tmpitem.record;

                t.$notify({
                    title: 'Saving Action',
                    text: 'Record Saved Successfully',
                    type: 'success',
                    speed: 1000,
                    duration: 6000
                });
            }

        });
    },

    fetchOptionsHelper(this_var, listName, path_param, field_list) {
        const t = this_var;
        t.show_delete_btn = false;
        t.loading_message = "Fetching Data. Please Wait...";

        window.axios
            .post(path_param.path, {
                field_list: field_list,
            })
            .then((response) => {
                if (response.data) {
                    var returned_data = [];

                    response.data.forEach(function (tmpitem) {
                        var string_name = "";

                        field_list.forEach(function (single_field) {
                            if (single_field != "id") {
                                string_name =
                                    string_name + tmpitem[single_field] + ": ";
                            }
                        });

                        returned_data.push({
                            id: tmpitem["id"],
                            name: string_name,
                        });
                    });

                    var fiel = this_var.schema.fields.find(
                        (field) => field.model === listName
                    );
                    fiel.values = returned_data;

                    //t.select_list[listName] = returned_data;
                    //t.$set(t.select_list, listName, returned_data);
                }
            });
    },

    fetchRecordHelper(
        this_var,
        path_param,
        fields,
        query_str,
        return_to
    ) {
        const t = this_var;
        t.show_delete_btn = false;
        t.loading_message = "Fetching Data. Please Wait...";

        const tmp_return_to = return_to || false;

        if (!t.id && query_str === "") {
            return;
        }

        window.axios.get(path_param.path + "/" + t.id).then((response) => {
            if (response.data) {
                var tmpitem = response.data.record;

                if (!tmp_return_to) {

                    Object.keys(t.model).forEach(function (key, index) {
                        if (Object.prototype.hasOwnProperty.call(tmpitem, key)) {
                            t.model[key] = tmpitem[key];
                        }
                    });
                } else {
                    t[tmp_return_to] = tmpitem;
                }
            }
        });
    },

    fetchRecordsHelper(this_var, path_param, table_fields) {
        const t = this_var;
        t.show_delete_btn = false;
        t.loading_message = "Fetching Data. Please Wait...";

        var data = {
            s: {},
            f: table_fields,
            limit: t.pagination.limit,
            offset:
                t.pagination.page == 1
                    ? 0
                    : t.pagination.page * t.pagination.limit - t.pagination.limit,
        };

        //Get Filtered Data from Store.
        var search_data = {};
        var search_ope = {};

        try {
            var path_params = t.$store.state.system.search_path_params;
            search_data = t.$store.state.system.search[path_params[0]][path_params[1]];

            if (typeof search_data === 'object' && search_data !== null) {
                for (const [key, value] of Object.entries(search_data)) {
                    data["s"][key] = { str: value };

                    if (Object.prototype.hasOwnProperty.call(search_ope, key)) {
                        data["s"][key]['ope'] = search_ope[key];
                    }
                }
            }

        } catch (error) {
            // Pass
        }


        window.axios
            .get(path_param.path, {
                params: data,
            })
            .then((response) => {
                if (response.data) {

                    if (!response.data.error) {
                        t.items = response.data.records;

                        if (t.items.length < 1) {
                            t.show_delete_btn = false;
                            t.loading_message = "No Data Available.";
                        } else {
                            if (t.pagination) {
                                t.pagination.pages =
                                    t.pagination.limit >= response.data.total
                                        ? 1
                                        : Math.floor(
                                            response.data.total /
                                            t.pagination.limit
                                        );
                                t.pagination.total = response.data.total;
                            }

                            t.show_delete_btn = true;
                        }
                    } else {
                        t.$notify({
                            title: 'Fetching Records',
                            text: response.data.message,
                            type: 'error',
                            speed: 1000,
                            duration: 12000
                        });
                    }

                    //t.postProcessing(t, search_fields);
                }
            });
    },

    async deleteRecordHelper(this_var, path_param, ids) {
        const t = this_var;
        var results = [];

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            await window.axios.delete(path_param.path + "/" + id).then((response) => {
                t.$notify({
                    title: 'Deleting Action',
                    text: response.data.message,
                    type: 'error',
                    speed: 1000,
                    duration: 6000
                });
                results.push({ id: id, result: response.data });
            });


        }

        return results;
    },


};
