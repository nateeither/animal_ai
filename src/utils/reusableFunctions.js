import moment from "moment";

export const verifyEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
        return false;
    }
    else {
        return true;
    }
}

export const convertDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toDateString({ month: "short", day: "numeric", year: "numeric" });
    const finalDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+)/, function(match, p1, p2, p3) {
        return `${p1} ${p2} ${p3}`;
    });

    return finalDate
}
 
export const getDatesDifference = (endDate) => {
    var now = moment(); //todays date
    var end = moment(endDate); // another date


    return end.diff(now, 'days')
}

export const nanoId = (function () {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charsLength = chars.length;
  
    return function (size = 12) {
      const values = [...crypto.getRandomValues(new Uint8Array(size))];
      let id = '';
      for (var i = size - 1; i >= 0; i--)
        id += chars[values[i] % charsLength];
      return id;
    };
})();
  
  