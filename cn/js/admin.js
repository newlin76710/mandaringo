function tab_door(par,cont,small_a,small_cont){

$(par +" "+"li").hover(
  function () {
    $(this).addClass("active");	
  },
  function () {
    $(this).removeClass("active");
  }
);


$(small_a).hover(
  function () {
    $(small_cont).attr("style","display:block");
  },
  function () {
    $(small_cont).attr("style","display:none");
  }
);

$(cont).click(
  function () {
    $(par +" "+"li").removeClass("active");

  }
);




}
