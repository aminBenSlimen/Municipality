import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpamControllerService {

  constructor() {

  }
  checkForSpam(uuid, data): any {
    let syscreated_at = new Date();
    let userClaims = [];
    let d1 = syscreated_at.getFullYear() * 1000000 + (syscreated_at.getMonth() + 1) * 10000 +
      syscreated_at.getDate() * 100 + syscreated_at.getHours();

    //collect all user's claims
    for (var i = 0; i < data.length; i++) {
      if (data[i].uid == uuid) {
        userClaims.push(data[i]);
      }
    }




    let top5 = [];
    var cond = (userClaims.length <= 5) ? userClaims.length : 5;


    // Select the 5 recent Claims and Push them to the Top5 Array
    for (var i = 0; i < cond; i++) {
      let min = 0;
      userClaims.forEach(elm => {
        const hours = Number(elm.created_at.substring(11, 13));
        const day = Number(elm.created_at.substring(8, 11));
        const year = Number(elm.created_at.substring(0, 4));
        const month = Number(elm.created_at.substring(5, 7));

        let elmDate = year * 1000000 + month * 10000 + day * 100 + hours;
        if (elmDate > min && !this.containsObject(elmDate, top5)) {
          min = elmDate;
        }
      })
      top5.push(min);
    }

    if (Math.abs(d1 - (top5[0] + 1)) == 0)
      return 0;
    else if (top5.length < 3)
      return -1

    // the 5th Claim and the first Claim must be offceted by at least 24 Hours

    if (Math.abs(d1 - top5[top5.length - 1]) > 24)
      return -1
    else if (Math.abs(d1 - top5[top5.length - 1]) < 24) {
      return Math.abs(d1 - top5[top5.length - 1]);
    }
    else
      return -1
  }


  containsObject(obj, list) {
    for (var i = 0; i < list.length; i++)
      if (list[i] === obj)
        return true;

    return false;
  }
}
