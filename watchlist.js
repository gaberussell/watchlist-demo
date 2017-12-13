/**
 * Watchlist Demo
 *
 * @link   http://www.gaberussell.com/
 * @author Gabe Russell
 *
 */

// API URLs
var search_url = "http://api.tvmaze.com/search/shows?q=";
var shows_url = "http://api.tvmaze.com/shows/";

var watchlist = [];
var show_cache = [];

// Click handler for search button
function searchShows() {
	// Get contents of search box and query tvmaze API
	$.get(search_url + $('#searchBox').val(), function(response) { 
		// show results and add to cache
		listShows(response);
		cacheShows(response);
	});
}

// Populate show list from API data
function listShows(data) {
    var results_tmpl = $.templates("#resultsTmpl");
    var results_html = results_tmpl.render(data);
    $('#resultsBox').html(results_html);    
}

// Cache show details from search for reuse in watchlist, saving API hits
function cacheShows(data) {
	show_cache = [];
	for (item of data) {
		show_cache.push(item.show);
	}
}

// Get episode and cast list and popup a modal
function showDetails(id) {
	$.get(shows_url + id + '?embed[]=episodes&embed[]=cast', function(response) {
		var details_tmpl = $.templates("#detailsModalTmpl");
	    var details_html = details_tmpl.render(response);
	    $('#detailsModalContainer').html(details_html);  
		$('#detailsModal').modal();
	});
}

// Popup a modal with watchlist
function showWatchlist() {
	if (watchlist.length < 1) alert("Your watchlist is empty. Add some shows to get started!");
	else {
		$('#watchlistModal').modal();
	}
}

// Add show to watchlist from cache if it's not already there
function addWatchlist(id) {
	if (watchlist.findIndex(function(e){return e.id == id}) == -1) {
		show = $.grep(show_cache, function(e){return e.id == id})[0];
		show.watched = false;
		watchlist.push(show);
	}
	updateWatchlistModal();
}

// Remove show from watchlist
function removeWatchList(id) {
	watchlist = watchlist.filter(function(e){return e.id !== id});
	updateWatchlistModal();
}

// Update the watchlist view
function updateWatchlistModal() {
	var watchlist_tmpl = $.templates("#watchlistModalTmpl");
    var watchlist_html = watchlist_tmpl.render(watchlist);
    $('#watchlistModalContent').html(watchlist_html);  
}

// Handle "watched" checkbox clicks and update watchlist
function updateWatched(id,element) {
	index = watchlist.findIndex(function(e){return e.id == id});
	watchlist[index].watched = element.checked;
}

// Assign search handler to search button and enter key in text box
$(function() {
	$('#searchButton').click(searchShows);
	$('#searchBox').keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // enter key 
	  {
	    searchShows();
	    return false;  
	  }
	});   	
});