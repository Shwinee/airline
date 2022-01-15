var tm = new Time_manager();

function Time_manager() {
    this.min = 0;
    this.hour = 6;
    this.milhour = 6;

    this.am = true;

    this.day = true;

    this.days_left = 10;

    this.stringify = function() {
        let output = '';

        if (this.hour >= 6){
            if (this.am == true){
                output += '☀️ ';
                this.day = true;
            }else {
                output += '🌙 ';
                this.day = false;
            }
        }else if (this.hour <= 9){
            if (this.am == false){
                output += '☀️ ';
                this.day = true;
            }else {
                output += '🌙 ';
                this.day = false;
            }
        }
        
        output += this.hour + ':'
        
        if (this.min.toString().length != 2){
            output += '0';
            output += this.min;
        }else{
            output += this.min;
        }
        
        if (this.am == true){
            output += ' AM';
        }else {
            output += ' PM';
        }

        return output;
    }

    this.tick = function() {
        this.min++;
        if (this.min >= 60){
            this.min = 0;
            this.hour++;
            this.milhour++;
            if (this.hour >= 13){
                this.hour = 1;
                this.am = !this.am;
                if (this.am == true){
                    this.milhour = 0;
                    this.days_left -= 1;
                }
            }
        }
    }
}

var fancy_inters = [];

function setFancyInterval(func, time) {
  let obj = {
    func: func,
    time: time,
    ticks: 0,
    set: false
  }
  
  fancy_inters.push(obj);
}

function interval_check() {
  for (let i = 0; i < fancy_inters.length; i++) {
    if (fancy_inters[i].set == false) {
      fancy_inters[i].set = true;
      fancy_inters[i].ticks++;
      fancy_inters[i].time = fancy_inters[i].func(fancy_inters[i].ticks);
      
      if (fancy_inters[i].time > 0) {
        setTimeout(() => {
          fancy_inters[i].set = false;
        }, fancy_inters[i].time)
      }else {
        fancy_inters.splice(i, 1);
      }
    }
  }
}