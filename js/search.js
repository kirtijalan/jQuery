$(function(){
  function fetchData(searchWords){
    var movie = searchWords.trim().replace(/[ ]/g,'%20');
    var url = 'http://www.omdbapi.com/?s='+movie;
    $.ajax({
      type: 'GET',
      url: url,
      success: function(data){
        console.log(data.Response);
        if(data.Response!=="False"){
          $("#searchResult").empty();
          $(".thumbnailsRow").empty();
          $("#searchResult").append('Search Results('+data.totalResults+'):');
          var numberofpages=Math.ceil(data.totalResults/data.Search.length);
          for(var i=1;i<=numberofpages;i++){
            $.ajax({
              type:'GET',
              url:url+'&page='+i,
              success:function(subdata){
                $.each(subdata.Search,function(k,rows)
                   {
                     if(rows.Poster=="N/A"){
                       if(rows.Type==="movie")
                         $(".thumbnailsRow").append('<div class="col-12"><div class="col-lg-4 col-md-4 col-sm-4"><div class="thumbnail"><div><img src="./../images/poster.jpg" id="posterImg"/></div><div class="label label-info" id="yearOfRelease"><span class="glyphicon glyphicon-film">'+rows.Year+'</span></div><div class="caption"><h3>'+rows.Title+'</h3></div></div></div></div>');
                         else {
                           $(".thumbnailsRow").append('<div class="col-12"><div class="col-lg-4 col-md-4 col-sm-4"><div class="thumbnail"><div><img src="./../images/poster.jpg" id="posterImg"/></div><div class="label label-info" id="yearOfRelease"><span class="glyphicon glyphicon-unchecked">'+rows.Year+'</span></div><div class="caption"><h3>'+rows.Title+'</h3></div></div></div></div>');
                         }
                     }
                     else{
                       if(rows.Type==="movie"){
                         $(".thumbnailsRow").append('<div class="col-12"><div class="col-lg-4 col-md-4 col-sm-4"><div class="thumbnail"><div><img src='+ rows.Poster +' id="posterImg"/></div ><div class="label label-info" id="yearOfRelease"><span class="glyphicon glyphicon-film">'+rows.Year+'</span></div><div class="caption"><h3>'+rows.Title+'</h3></div></div></div></div>');
                       }
                       else if(rows.Type==="series"){
                         $(".thumbnailsRow").append('<div class="col-12"><div class="col-lg-4 col-md-4 col-sm-4"><div class="thumbnail"><div><img src='+ rows.Poster +' id="posterImg"/></div ><div class="label label-info" id="yearOfRelease"><span class="glyphicon glyphicon-unchecked">'+rows.Year+'</span></div><div class="caption"><h3>'+rows.Title+'</h3></div></div></div></div>');
                       }

                     }

                   });
                   $(".post:gt(15)").hide();
                   paginate();
              }
            });

          }
        }
        else{
          alert(data.Error);        }
      },
      error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connected. Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.n' + jqXHR.responseText);
            }
        }
    });
  }
  $("#titleMovie").keypress(function(e) {
    if(e.which == 13) {
        var input = $("#titleMovie").val();
        fetchData(input);
        $("#search").slideUp(2000);
        $("#inputBlock").fadeOut();
        $("#searchForm").css("display","block");
    }
});
$("#searchBtn").on("click",function(){
  var input = $("#titleMovie").val();
  fetchData(input);
  $("#inputBlock").fadeOut();
  $("#search").slideUp(2000);
  $("#searchForm").css("display","block");
});
$("#searchFormBtn").on("click",function(){
  var input = $("#searchInput").val();
  fetchData(input);
});
  $("#searchInput").keypress(function(e) {
    if(e.which == 13) {
        var input = $("#searchInput").val();
        fetchData(input);
    }
});

function paginate(){
  //how much items per page to show
 var show_per_page = 15;
 //getting the amount of elements inside content div
 var number_of_items = $('.thumbnailsRow').children().length;
 console.log(number_of_items);
 //calculate the number of pages we are going to have
 var number_of_pages = Math.ceil(number_of_items/show_per_page);

 //set the value of our hidden input fields
console.log($('#current_page').val(0));
 console.log($('#show_per_page').val(show_per_page));
 var navigation_html = '<a class="previous_link pageNavLink" href="javascript:previous();">Prev</a>';
 var current_link = 0;
 while(number_of_pages > current_link){
   navigation_html += '<a class="page_link pageNavLink" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';
   current_link++;
 }
 navigation_html += '<a class="next_link pageNavLink" href="javascript:next();">Next</a>';

 $('#page_navigation').html(navigation_html);

 //add active_page class to the first page link
 $('#page_navigation .page_link:first').addClass('active');

 //hide all the elements inside content div
 $('.thumbnailsRow').children().css('display', 'none');

 //and show the first n (show_per_page) elements
 $('.thumbnailsRow').children().slice(0, show_per_page).css('display', 'block');

}

});



function previous(){

	new_page = parseInt($('#current_page').val()) - 1;
	//if there is an item before the current active link run the function
	if($('.active').prev('.page_link').length==true){
		go_to_page(new_page);
	}

}

function next(){
	new_page = parseInt($('#current_page').val()) + 1;
	//if there is an item after the current active link run the function
	if($('.active').next('.page_link').length==true){
		go_to_page(new_page);
	}

}
function go_to_page(page_num){
	//get the number of items shown per page
	var show_per_page = parseInt($('#show_per_page').val());

	//get the element number where to start the slice from
	start_from = page_num * show_per_page;

	//get the element number where to end the slice
	end_on = start_from + show_per_page;

	//hide all children elements of content div, get specific items and show them
	$('.thumbnailsRow').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');

	/*get the page link that has longdesc attribute of the current page and add active_page class to it
	and remove that class from previously active page link*/
	$('.page_link[longdesc=' + page_num +']').addClass('active').siblings('.active').removeClass('active');

	//update the current page input field
	$('#current_page').val(page_num);
}
