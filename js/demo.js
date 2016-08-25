


EventModel = Backbone.Model.extend(
	{
		validation:
		{
			hostname: {required:true, msg: "Please enter the person's name."},
			venue: {required:true, msg: "Please enter the person's phone number."},
			email:
			[
				{required:true, msg: "Please enter the person's email address."},
				{pattern:"email", msg: "Please enter a valid email address"}
			]
		}
	});
	
EventCollection = Backbone.Collection.extend(
	{
		model: EventModel
	});

	
AddEventView = Backbone.ModalView.extend(
	{
		name: "AddEventView",
		model: EventModel,
		templateHtml:
			"<div class='modal-header'>Start a new event</div>" +
			"<form>" +
                "<table class='compact'>" +
                    "<tr><td>" +
				        "<label for='title'>Event Title</label>" +
                        "</td><td>" +
				        "<input type='text' id='title' required />" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='type'>Event Type</label>" +
                        "</td><td>" +
				        "<input type='text' id='type' required />" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='name'>Event Host</label>" +
                        "</td><td>" +
				        "<input type='text' id='name' required />" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='email'>Email</label>" +
                       "</td><td>" +
				        "<input type='text' id='email' required />" +
                    "</td></tr>" +
					"<tr><td>" +
				        "<label for='startDate'>Event Start Date</label>" +
                        "</td><td>" +
				        "<input type='datetime-local' id='startDate' required />" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='endDate'>Event End Date</label>" +
                        "</td><td>" +
				        "<input type='datetime-local' id='startDate' />" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='location'>Event Location</label>" +
                        "</td><td>" +
				        "<input type='text' id='location' required/>" +
                    "</td></tr>" +
                    "<tr><td>" +
				        "<label for='keywords'>Message from the host</label>" +
                        "</td><td>" +
				        "<input type='text' id='keywords' />" +
                    "</td></tr>" +
                    "<tr><td></td><td>" +
				        "<input id='addEventButton' type='submit' value='Add event' />" +
                    "</td></tr>" +
                "</table>" +
			"</form>",
		initialize:
			function()
			{
				_.bindAll( this, "render");
				this.template = _.template( this.templateHtml);
				Backbone.Validation.bind( this,  {valid:this.hideError, invalid:this.showError});
			},
		events:
			{
			     "change #email": "validateEmail",
				"submit form": "addEvent"
			},
		getCurrentFormValues:
			function()
			{
				var newStartDate = $("#startDate").val().toString().split('T')[0];
                var d = new Date(newStartDate);
                var stDate = (d.getMonth() + 1)+'/'+ (d.getDate() + 1) + '/' + d.getFullYear() ;
				return {
					title: $("#title").val(),
					name: $("#name").val(),
					email: $("#email").val(),
					location: $("#location").val(),
				     type: $("#type").val(),
				     startDate: stDate,
				    //startDate: $("#startDate").val().toString().split('T')[0],
				    time : $("#startDate").val().toString().split('T')[1]}
			},
		validateEmail:
			function()
			{
				this.model.set( {email: $("#email").val()});
			},
		hideError:
			function(  view, attr, selector)
			{
				var $element = view.$form[attr];
				
				$element.removeClass( "error");
				$element.parent().find( ".error-message").empty();
			},
		showError:
			function( view, attr, errorMessage, selector)
			{
				var $element = view.$form[attr];
				
				$element.addClass( "error");
				var $errorMessage = $element.parent().find(".error-message");
				if( $errorMessage.length == 0)
				{
					$errorMessage = $("<div class='error-message'></div>");
					$element.parent().append( $errorMessage);
				}
				
				$errorMessage.empty().append( errorMessage);
			},
		addEvent:
			function( event)
			{
				event.preventDefault();
				/*$.ajax({
        url: 'https://niceto.firebaseio.com/events.json',
        dataType: 'jsonp',
        success: function(data){
        	//console.log(data);
          var events = [];
        	for (var i=0; i< data.length; i++){
            if(data[i].deleted_flg === 0){
              events.push(data[i]);
            }
          }
          //console.log(books);

        	new View( events );

        }
    });*/

var eventsRef = new Firebase('https://niceto.firebaseio.com/events/');
//var count = 0;
eventsRef.on("value", function(snapshot) {
  
  console.log(snapshot.val().length);

  var count =  ((snapshot.val().length) - 1);
  count = count + 1;
  console.log(count);
  var newName = $("#name").val();
  console.log(newName);
  var newLoc = $("#location").val();
  console.log(newLoc);
  var newEmail = $("#email").val();
  console.log(newEmail);
  var newTitle = $("#title").val();
  console.log(newTitle);
  var newType = $("#type").val();
  console.log(newType);
  var newStartDate = $("#startDate").val().toString().split('T')[0];
  var d = new Date(newStartDate);
  var stDate = (d.getMonth() + 1)+'/'+ (d.getDate() + 1) + '/' + d.getFullYear() ;
  console.log(newStartDate);
  console.log(stDate);
  
  var ref = eventsRef.child(count);
 //ref.set({'name':'Mark','email':'zuckerberg@gmail.com','location':'Palo Alto','deleted_flg': 0});
  //console.log(ref);
  if((newEmail != " ") && (newName != " ") && (newLoc != " ") && (newTitle != " ") && (newType != " ") && (newStartDate != " ")){
ref.set({'name': newName,'email': newEmail,'location': newLoc,'deleted_flg': 0,'title': newTitle,'type': newType, 'startDate': newStartDate});
}
else{
  alert("All fields are compulsory");
}

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


				
				if( this.model.set( this.getCurrentFormValues()))
				{
					this.hideModal();
					_events.add( this.model);
				}
			},
			
		render:
			function()
			{
				$(this.el).html( this.template());
				
				this.$form = {
					title: $("#title").val(),
					name: $("#name").val(),
					email: $("#email").val(),
					location: $("#location").val(),
				     type: $("#type").val(),
				     startDate: $("#startDate").val(),
				     time: $("#startDate").val()}
					
				return this;
			}
	});

	
EventItemView = Backbone.View.extend(
	{
		templateHtml:
            "<div><span><strong>{{title}}</strong></span><br/>Hosted by: <span>{{name}}</span><br /><em><img src='css/images/mail.png'/>{{email}}</em><br /><em><img src='css/images/map.png'/>{{location}}</em><em>{{type}}</em><br/><em><img src='css/images/date.png'/> {{startDate}} at {{time}} hrs </em><button><img src='css/images/delete.png'></button></div>",
		tagName: "li",
		initialize:
			function()
			{
				this.template = _.template( this.templateHtml);
			},
		render:
			function()
			{
				$(this.el).html( this.template( this.model.toJSON()));
				return this;
			}
	});

EventListView = Backbone.View.extend(
	{
		initialize:
			function()
			{
				this.collection.bind("add", this.renderNewEvent, this);
				this.collection.bind("remove", this.render, this);
			},
		render:
			function()
			{
				var events = [];
				this.collection.each(
					function( model)
					{
						var view = new EventItemView( {model : model});
						events.push( view.render().el);
						//console.log(events);
					});

				$(this.el).append( events);
				return this;
			},
		renderNewEvent:
			function( eventModel)
			{
				var html = new EventItemView( {model : eventModel}).render().el;
				$(this.el).append( html);
			}
	});

var placeSearch, autocomplete;

function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('venue')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', function(){
          fillInAddress(autocomplete,'')
        });

      }

      function fillInAddress(autocomplete,unique) {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }


