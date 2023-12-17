

import moment from 'moment'
export function dateFormat(date) {

    if (date == undefined) {
      return "";
    }

    if(date.toString().length ==10)
    {
        date = parseInt(date+'000');
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }


export function dateFormatTable(row, column) {
    var date = row[column.property];
    if (date == undefined) {
      return "";
    }

    if(date.toString().length ==10)
    {
        date = parseInt(date+'000');
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }

  export function fenToYuanTable(row, column) {
    var amountInFen = row[column.property];
    return (amountInFen / 100).toFixed(2); // 将分转换为元，并保留两位小数
  }

