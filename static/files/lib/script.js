var clock = setInterval(function(){
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    
    var h_ = 360/12*h;
    var m_ = 360/60*m;
    var s_ = s*6;
    
    hours.style.transform = "translateY(-50%) rotate("+h_+"deg) ";
    minutes.style.transform = "translateY(-50%) rotate("+m_+"deg) ";
    seconds.style.transform = "translateY(-50%) rotate("+s_+"deg) ";

}, 1000);
console.log("Hello There")
