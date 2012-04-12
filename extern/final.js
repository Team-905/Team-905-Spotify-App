var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var m = sp.require('sp://import/scripts/api/models');
var player = models.player;
var v = sp.require("sp://import/scripts/api/views");
var xmlData; // Global var to hold Data
var trackInfo = []; //Global var to keep track info until it's displayed

$(document).ready(Constructor);

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// start constructors ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function Constructor(){

        console.log('Con_Started: loading app.');
		ShowTrackData();
        getPlaylistXML(Get_User_ID());
        createTimeline();
        AddToTimeline();
        PlayTimeline();



        		
		Constructor_Preload();

        console.log('Finished: loading app.');
}

function Constructor_Preload(){
	
	console.log('Con_Started: preloading stuff');
	
	SubButton();
    Cancel();
    DivEvent();
	DatePicker();
	HelpMe();
    TimelineNext();
	PlayerRefresh();
	CloseHelpMe();
	
	console.log('Finished: Preloading');
	
}

function Constructor_Playlist(){
	
	console.log('Con_Started: playlist constructor.');
	RemoveTracks();
	AddTracks();
	
	console.log('Finished: playlist constructor.');
}

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// end constructors /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function CreatePlaylist(){
	var playlist = new m.Playlist.fromURI('http://open.spotify.com/user/1117535795/playlist/59nkn5pKC1SMtRr5mG2JPm');
	playlist.subscribed = true;
	console.log(playlist.name);
	var PlayList = playlist.tracks;
	console.log(PlayList.length)
	var Lengte = PlayList.length;
	
	for( i=0; i < Lengte;i++){
		console.log(PlayList[i].data.name);
	}
}

function ReloadPage(){
	console.log('Started: ReloadPage');
	window.location.reload();
	console.log('Reloaded');
}

function ShowTrackData(){
	console.log('Started: ShowTrackData');
	var playerTrackInfo = player.track;

    if (playerTrackInfo == null) {
        $('h2').replaceWith("Er speelt momenteel geen nummer.");
    } else {
	var track = playerTrackInfo.data;
	$('h2').replaceWith("<h2> Track: "+ track.name + "<BR /> Album: " + track.album.name + " <BR />Artiest: " + track.album.artist.name + ". <BR /> URI/Locatie: " + track.uri + "</h2>");
    }
}

function Squares(){
	console.log('Started: Squares');
	var canvas = document.getElementById("canvas");
	
	if (canvas.getContext) {
		var ctx = canvas.getContext("2d");

		//define the colour of the square
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green";

		// Draw the outline of a square
		ctx.strokeRect(50,50,100,100);

		// Draw a square using the fillRect() method and fill it with the colour specified by the fillStyle attribute
		ctx.fillRect(200,50,100,100);

		// Draw a square using the rect() method
		ctx.rect(350,50,100,100);
		ctx.stroke();
		console.log('Squared!');
	}
}

function PlayTrack(uri){
	console.log('Started: PlayTrack');
	//var uri = 'spotify:track:4VUGq8KUTVv5YnMqU6nkDa';
	sp.trackPlayer.playTrackFromUri(uri, {
		onSuccess: function() { console.log("success SONG");} ,
		onFailure: function () { console.log("failure SONG");},
		onComplete: function () { console.log("complete SONG"); }
    });
	
}

function Get_User_ID(){
	
	console.log('Started: Get_User_ID');
	var ID = models.session.anonymousUserID;
        return ID;
}

function GetPlaylist(){
	
	console.log('Started: GetPlaylist');
	var Playlist = new m.Playlist.fromURI('http://open.spotify.com/user/1117535795/playlist/59nkn5pKC1SMtRr5mG2JPm');
	return Playlist
}

function RemoveTracks(){
	console.log('Started: RemoveTracks');
	var Playlist = GetPlaylist();
	var Tracks = Playlist.tracks;
	var TracksAmount = Tracks.length;

	for (i=0;i<TracksAmount;i++){
		var TrackURI = Tracks[i].data.uri;
		Playlist.remove(TrackURI);
	}	
}

function GetNewTracks(){
	
	console.log('Started: GetNewTracks');
	var NewTracks = new Array();
        $(xmlData).find("track_uri").each(function(){
            NewTracks.push($(this).text());
        });
	return NewTracks;
}

function AddTracks(){
	
	console.log('Started: AddTracks');
	
	var NewTracks = GetNewTracks();
	var Playlist = GetPlaylist();
	var i = 0;
	
	while (i<TracksAmount()){
		var TrackURI = NewTracks[i];
		Playlist.add('spotify:track:' + TrackURI);
		i++;
	}
}

function getPlaylistXML(user_id,refresh){
    console.log("Started: processPlaylistXML");
    var base_url="http://student.cmi.hro.nl/0851729/prj3/ultify/ultify.php";

    if (refresh == 1 || xmlData == undefined)
    {
        $.get
        (
            base_url,
            {u:user_id},
            processPlaylistXML,
            "xml"
        );
    } 
    else 
    {
        processPlaylistXML(xmlData);
    }
}

function processPlaylistXML(xml){
    xmlData = xml;
    createTimeline();
}

function createTimeline()
{
    console.log('Started: createTimeline');
    var timeline = document.getElementById("timeline");
    var ctx = timeline.getContext("2d");
    
    ctx.beginPath();
    ctx.moveTo(0,50);
    ctx.lineTo(800,50);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FF3300";
    ctx.stroke();
    TrackData();
}
    
function createEntries()
{
    var entrys = TracksAmount();
    var entryMax = 5;
    var timeline = document.getElementById("timeline");
    var ctx = timeline.getContext("2d");
    var j = TimelineCal(0);
    //var k = TimelineCal(1);
    var i = 0;
    $("#timelineEntrys").empty();
    console.log("Started: createEntries");
    while (i < entryMax)
    {
            
            var spacing = (800 / entryMax) * i;
            var Entryspacing = (800 / entryMax) - 150;

            ctx.beginPath();
            ctx.moveTo(spacing,0);
            ctx.lineTo(spacing,50);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#FF3300";
            ctx.stroke();

            $("#timelineEntrys").append
            (
                '<div id="' + j + '"class="timelineEntry"><p>'
                +  trackInfo[j][0] +
                '</p><p>'
                +  trackInfo[j][1] +
                '</p></div>'
            );

            $("#timelineEntrys").add('.timelineEntry')
                                .css('margin-right', Entryspacing);
            
            i++;
            j++;
    }

}

function TimelineCal(Par)
{
        console.log("Started: TimelineCal");
        
        var pageID = $(".timelineEntry").last().attr('id');

        console.log("pageID = " + pageID + ", Par = " + Par);

        if (pageID !== undefined){
            if(Par == 0)
            {
                var i = pageID;

                console.log(i);

                return i;
            }

            else if(Par == 1)
            {
                var j = pageID + 5;

                console.log(j);

                return j;
            }

            else if(Par == 2)
            {
               
                createEntries();
            }
        }
        else
        {
           if(Par == 0)
            {

                return 0;
            }

            else if(Par == 1)
            {

                return 5;
            }

            else if(Par == 2)
            {
                pageID++;

                console.log(pageID);

                createEntries();
            }
        }
}

function TimelineNext()
{
    $("#TimelineNext").click(function()
        {
            TimelineCal(2);
        });
}

function TrackData(){

    if (trackInfo.length>0){
        trackInfo = [];
    }
    var TrackData = new Array();

    $(xmlData).find("track").each(function(){
        var track_uri = $(this).find("track_uri").text();

        m.Track.fromURI("spotify:track:"+track_uri,function(track){
            CheckData(track.name,track.album.artist.name,track.uri);
        });
    })
}

function CheckData(track,artist,uri){

    var temp = [track,artist,uri];
    trackInfo.push(temp);

    if (trackInfo.length == TracksAmount()){
        createEntries();
    } 
}

function TracksAmount(){
    console.log("Started: TracksAmount");
    var i = 0
    $(xmlData).find("track").each(function(){
        i++;
    })
    return i;
}

function DivEvent(){
    $("#timelineEntrys").on('click','.timelineEntry',function(){
            PlayTrack(trackInfo[this.id][2]);
            });
}

function HelpMe(){
	
	$("#HelpMeButton").click(function()
        {
            console.log('Started: Help Me');
            $("#canvas").hide();
            $("#timeline").hide();
            $("#timelineEntrys").hide();
            $("form").hide();
            $("#HelpMe").show();
        });
}

function CloseHelpMe(){
	
	$("#CloseHelpMeButton").click(function()
        {
            console.log('Started: Help Me');
            $("#canvas").hide();
            $("#timeline").show();
            $("#timelineEntrys").show();
            $("form").hide();
            $("#HelpMe").hide();
        });
}

function PlayPlaylist(){

	console.log("Started: PlayPlaylist");

	var uri = 'http://open.spotify.com/user/1117535795/playlist/59nkn5pKC1SMtRr5mG2JPm';

	models.player.play(uri);

}

function AddToTimeline()
{
        $("#AddToTimeline").click(function()
        {
            console.log('Started: AddToTimeline');
            $("#canvas").hide();
            $("#timeline").hide();
            $("#timelineEntrys").hide();
            $("form").show();
			CurrentDate();
        });
}

function SubButton()
{
    $("#SubButton").click(function()
    {
        console.log('Started: SubButton');
        var track = player.track;
        var full_t_uri = track.uri;
        // The track uri is given in the form:"spotify:track:2r97a73n56d0m.."
        // We need to split it up and select the important part
        var t_uri_array = full_t_uri.split(":");
        var t_uri = t_uri_array[2];
        var textcomment = $("textarea").val();
        var userid = Get_User_ID();
        var s_time = $("#TF_Date").val();
        var base_url = "http://student.cmi.hro.nl/0851729/prj3/ultify/ultify.php?u=";
        var get_url = base_url+userid;
        $.post(
        get_url,
        {track:t_uri,comment:textcomment,submit:"submit",time:s_time},
        // TODO: When we have a function to refresh timeline,
        // change this function
        function(data)
        {
            console.log(data);
        },
        "xml");
        $("#canvas").show();
        $("#timeline").show();
        $("#timelineEntrys").show();
        $("form").hide();
    });
}

function PlayTimeline()
{
    $("#PlayTimeline").click(function()
        {
             console.log('Started: PlayTimeline');
             Constructor_Playlist();
			PlayPlaylist();
        });
}

function PlayPlaylist(){
	
	console.log("Started: PlayPlaylist");
	
	var uri = 'http://open.spotify.com/user/1117535795/playlist/59nkn5pKC1SMtRr5mG2JPm';
	
	models.player.play(uri);
	
}

function Cancel()
{
    $("#Cancel").click(function()
        {
            console.log('Started: Cancel');
            $("#canvas").show();
            $("#timeline").show();
            $("#timelineEntrys").show();
            $("form").hide();
        });
}

function PlayerRefresh(){
	player.observe(models.EVENT.CHANGE, function (e){
			// Only update the page if the track changed
			ShowTrackData();
			console.log('Started: PlayerRefresh');
    });
}

function CurrentDate(){
	
	console.log('Started: CurrentDate');
	
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1
	var day = currentTime.getDate()
	var year = currentTime.getFullYear()

	if(day < 10){
		day = "0" + day;
		console.log("dag");
	}
	
	if(month < 10){
		month = "0" + month;
		console.log("month");
	}
	
	var CurrentDate = day + "/" + month + "/" + year;
	
	var DateCon = document.getElementById('datepicker');
	DateCon.value = CurrentDate;
	
	
}

function DatePicker(){
    $( "#datepicker" ).datepicker({
        dateFormat: "dd/mm/yy",
        altField: "#TF_Date",
        altFormat: "yy-mm-dd"
    });
}






















