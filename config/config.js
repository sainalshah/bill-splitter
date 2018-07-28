module.exports =  {baseRent:292,
getCutoffDate: function(){
    var d = new Date();
    if(d.getDate > 10){
      d.setMonth(d.getMonth() + 1);
    }
    d.setDate(10);
    return d;
},
secretKey:"jlkfjdslkfjHlloHloo"}