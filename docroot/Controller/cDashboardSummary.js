 var restfulPathDashboard="/see_api/public/cds_result";
 var galbalDashboard=[];
 var galbalDataTemp = [];
 galbalDataTemp['galbalOrg'] = [];
 galbalDataTemp['extract'] = false;
 galbalDataTemp['All_KPI'] = {};
//# Generate Drop Down List
 var generateDropDownList = function(url,type,request,initValue){
 	var html="";
 	
 	if(initValue!=undefined){
 		html+="<option value=''>"+initValue+"</option>";
	}

 	$.ajax ({
 		url:url,
 		type:type ,
 		dataType:"json" ,
 		data:request,
 		headers:{Authorization:"Bearer "+tokenID.token},
 		async:false,
 		success:function(data){
 			try {
 			    if(Object.keys(data[0])[0] != undefined && Object.keys(data[0])[0] == "item_id"){
 			    	galbalDataTemp["item_id"] = [];
 			    	$.each(data,function(index,indexEntry){
 			    		galbalDataTemp["item_id"].push(indexEntry[Object.keys(indexEntry)[0]]);
 		 			});	
 			    }
 			}
 			catch(err) {
 			    console.log(err.message);
 			}

 			
 			$.each(data,function(index,indexEntry){
 				html+="<option value="+indexEntry[Object.keys(indexEntry)[0]]+">"+indexEntry[Object.keys(indexEntry)[1] == undefined  ?  Object.keys(indexEntry)[0]:Object.keys(indexEntry)[1]]+"</option>";	
 			});	

 		}
 	});	
 	return html;
 };
 var generateAccordionHTML = function(parent,data){
		var kpi_id = galbalDataTemp["item_id"];
		var accordionHtml = "";
		if(parent == "group1"){
			accordionHtml += "<div id='orgParent' class='panel panel-default sortableItem'>";
		}else{
			accordionHtml += "<div class='panel panel-default sortableItem'>";
		}
			
		accordionHtml += "	<div class='panel-heading' role='tab' id='headOrg-"+data['org_id']+"'>";
		accordionHtml += "		<h4 class='panel-title'>";
		accordionHtml += "			 <a class='collapsed' role='button' data-toggle='collapse' data-parent='#accordion' href='#bodyOrg-"+data['org_id']+"' aria-expanded='false' aria-controls='bodyOrg-"+data['org_id']+"' style='color: black;font-weight: bold;'>";
		accordionHtml += "<span class='fa fa-caret-right'></span> "+data['org_name']+"&emsp;";	
		if(parent == "group1"){
			accordionHtml += "<button id='btn_extract' type='button' class='btn btn-xs btn-white' style='margin-top: -6px;font-weight: 700;'> <i class='fa fa-plus-square' aria-hidden='true'></i> Expand</button>";
			accordionHtml += "<button id='btn_kpi' type='button' data-target='#ModalKPI' data-toggle='modal' class='btn btn-xs btn-white' style='margin-top: -6px;float: right;font-weight: 700;'> <i class='fa fa-table fa-table' aria-hidden='true'></i> All KPI</button>";
		}
		
		accordionHtml += "			</a>";	
		accordionHtml += "		</h4>";	
		accordionHtml += "	</div>";	
		accordionHtml += "	<div id='bodyOrg-"+data['org_id']+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='headOrg-"+data['org_id']+"'>";	
		accordionHtml += "		<div class='panel-body'>";
		//#Start Body Accordion
		
		//#btn next & previous kpi
		if(kpi_id[kpi_id.indexOf(parseInt($("#param_kpi_id").val()))-1] !=  undefined && parent == "group1"){
			accordionHtml += "			<span id='previous' class='arrow' data-previous='"+kpi_id[kpi_id.indexOf(parseInt($("#param_kpi_id").val()))-1]+"'></span>";
		}
		if(kpi_id[kpi_id.indexOf(parseInt($("#param_kpi_id").val()))+1] !=  undefined && parent == "group1"){
			accordionHtml += "			<span id='next' class='arrow' data-next='"+kpi_id[kpi_id.indexOf(parseInt($("#param_kpi_id").val()))+1]+"'></span>";	
		}
		
		accordionHtml += "			<div class='' style='height: auto;'>";
		accordionHtml += "				<div class='span4'>";
		accordionHtml += "				<div class='graphLTopHeader'>Perspective: "+data['perspective_name']+"</div>";
		accordionHtml += "					<div>";
		accordionHtml += "						<div class='graphLTop'>";
		accordionHtml += "							<div class='textGRaphTop'>Target</div>";
		accordionHtml += "							<div class='textGRaphTop'>"+addCommas(data['dual_chart']['data']['target'])+"</div>";
		accordionHtml += "						</div>";
		accordionHtml += "						<div class='graphLTop'>";
		accordionHtml += "							<div class='textGRaphTop'>Forecast</div>";
		accordionHtml += "							<div class='textGRaphTop'>"+addCommas(data['dual_chart']['data']['forecast'])+"</div>";
		accordionHtml += "						</div>";
		accordionHtml += "						<div class='graphLTop'>";
		accordionHtml += "							<div class='textGRaphTop'>Actual</div>";
		accordionHtml += "							<div class='textGRaphTop'>"+addCommas(data['dual_chart']['data']['actual_value'])+"</div>";
		accordionHtml += "						</div>";
		accordionHtml += "						<br style='clear: both'>";
		accordionHtml += "					</div>";
		accordionHtml += "					<div>";
		accordionHtml += "						<div id='chartOrgGauge-"+data['org_id']+"'></div>";
		accordionHtml += "					</div>";
		accordionHtml += "				</div>";	
		accordionHtml += "				</div>";
		accordionHtml += "				<div class='span8'>";
		accordionHtml += "					<div class='graphLTopHeader' style='margin-bottom: 3px;'>KPI: "+data['item_name']+"</div>";
		accordionHtml += "					<div id='chartOrgBar-"+data['org_id']+"'></div>";
		accordionHtml += "				</div>";
		accordionHtml += "			</div>";
		//#End Body Accordion
		accordionHtml += "		</div>";	
		accordionHtml += "</div>";

		return accordionHtml;
		//$("#accordion").append(accordionHtml);
		
}
 var generateChartGaugeFn = function(data){
	 var color = [];
	 $.each(data['dual_chart']['color_range'],function(index,indexEntry){
		 color.push({
			 "minValue":indexEntry['min_val'],
			 "maxValue":indexEntry['max_val'],
			 "code": "#"+indexEntry['color']
		 	});
	 });
		    var cSatScoreChart = new FusionCharts({
		        type: 'angulargauge',
			    dataLoadStartMessage: "Loading chart. Please wait",
			    baseChartMessageFont: "Arial",
			    baseChartMessageFontSize: "18",
			    baseChartMessageColor: "#FC0000",
		        renderAt:  "chartOrgGauge-"+data['org_id'],
		        width: '100%',
		        height: '200',
		        dataFormat: 'json',
		        dataSource: {
		            "chart": {
		                 "baseFontSize":"11",
		                 "captionFontSize":"14",
		                 "lowerLimit": "0",
		                 //"upperLimit": "120000",
		                 "gaugeFillMix": "{dark-30},{light-60},{dark-10}",
		                 "gaugeFillRatio": "15",
		                 "majorTMNumber": "4",
		                 "majorTMColor": "#333",
		                 "majorTMAlpha": "100",
		                 "majorTMHeight": "15",
		                 "majorTMThickness": "2",  
		                 "showValue": "1",
		                 "theme": "fint",
		                 "exportEnabled" :"0",
		                 "bgColor": "#ffffff",
		            },
		            "colorRange": {
		                "color": color
		            },
		            "dials": {
		                "dial": [{
		                    "value": (data['dual_chart']['data']['actual_value']/data['dual_chart']['data']['target'])*100
		                }]
		            },
		            "trendpoints": {
		                "point": [
		                    {
		                        "thickness": "3.5",
		                        "radius": "152",
		                        "innerRadius": "78",
		                        "alpha": "100"
		                    }
		                ]    
		            }
		        }
		}).render(); 
		
		
	 return false;
 };
 
 var generateChartBulletFn = function(id,data,color){
	    var revBulletChart = new FusionCharts({
	        type: 'hbullet',
	        renderAt: id,
	        width: '270',
	        height: '30',
	        dataFormat: 'json',
	        dataSource: {
	            "chart": {
	                "theme": "fint",
	                "lowerLimit": "1",
	                //"showPlotBorder":"1",
	                //"plotBorderColor":"#dedede",
	                "plotBorderThickness":"1",
	                //"plotFillColor": "#5b0101",
	                //"plotFillAlpha": "90",
	                "targetThickness": "4",
	                "targetColor": "#5b0101",
	                "showTickMarks":"0",
	                "showTickValues":"0",
	                "showValue":"0",
	                "chartBottomMargin": "0",
	                "chartTopMargin": "0",
	                "chartLeftMargin": "0",
	                "chartRightMargin": "0",
	                "gaugeFillMix": "{dark-30},{light-60},{dark-10}"
	            },
	            "colorRange": {
	                "color": color
	            },
	            "value": data,
	            "target": "100"
	        }
	    })
	    .render();
		
	 return false;
 };
 var generateChartBulletSparkFn = function(data){ 
	 $('.sparkline').sparkline('html', {
		 	type: 'bullet',
		 	width:'170',
		 	height: '20',
		 	targetWidth: '4',
		    targetColor: '#003f7f',
		    performanceColor: '#00007f',
		    rangeColors: data[0]['rangeColor']
		 } );
 };
 var generateChartBarFn = function(data){
	 var actual = [] ;
	 $.each(data['bar_chart']['data']['actual'],function(index,indexEntry){
		 actual.push({
			 "label":indexEntry['month'],
			 "value":indexEntry['value']
		 	});
	 });
	 
		    var revenueChart = new FusionCharts({
		        type: 'column2d',
		        dataLoadStartMessage: "Loading chart. Please wait",
			    baseChartMessageFont: "Arial",
			    baseChartMessageFontSize: "18",
			    baseChartMessageColor: "#FC0000",
		        renderAt: "chartOrgBar-"+data['org_id'],
		        width: '100%',
		        height: '250',
		        dataFormat: 'json',
		        dataSource: {
		            "chart": {
		               // "caption": "Monthly revenue for last year",
		               //"subCaption": "Harry's SuperMart",
		                "xAxisName": "Month",
		                "yAxisName": "YTD Actual",
		                //"numberPrefix": "$",
		                "showBorder": "0",
		                "paletteColors": "#0075c2",
		                "bgColor": "#ffffff",
		                "borderAlpha": "20",
		                "canvasBorderAlpha": "0",
		                "usePlotGradientColor": "0",
		                "plotBorderAlpha": "10",
		                "placevaluesInside": "1",
		                "rotatevalues": "1",
		                "valueFontColor": "#ffffff",                
		                "showXAxisLine": "1",
		                "xAxisLineColor": "#999999",
		                "divlineColor": "#999999",               
		                "divLineIsDashed": "1",
		                "showAlternateHGridColor": "0",
		                "subcaptionFontBold": "0",
		                "exportEnabled" :"0",
		                "subcaptionFontSize": "14"
		            },            
		            "data": actual,
		            "trendlines": [
		                {
		                    "line": [
		                        {
		                            "startvalue": data['bar_chart']['data']['target'],
		                            "color": "#1aaf5d",
		                            "valueOnRight": "1",
		                            "displayvalue": "Target"
		                        },{
		                            "startvalue": data['bar_chart']['data']['forecast'],
		                            "color": "#DC143C",
		                            "valueOnRight": "1",
		                            "displayvalue": "Forecast"
		                        }
		                    ]
		                }
		            ]
		        }
		    }).render();
		
	 return false;
 };
var generateSubTableKPIFn = function(item,data){
	var ContentHTML = "";
	
	ContentHTML+="<table class='tableInside table-striped'>";
	ContentHTML+="	<thead>";
	ContentHTML+="		<tr>";
	ContentHTML+="			<th><div class='fontBold ' style='width:100px'>Target</div></th>";
	ContentHTML+="			<th><div class='fontBold ' style='width:100px'>Forecast</div></th>";
	ContentHTML+="			<th><div class='fontBold ' style='width:100px'>Actual</div></th>";
	ContentHTML+="		</tr>";
	ContentHTML+="	</thead>";
	ContentHTML+="	<tbody>";
	ContentHTML+="		<tr>";
	ContentHTML+="			<td>"+data['target']+"</td>";
	ContentHTML+="			<td>"+data['forecast']+"</td>";
	ContentHTML+="			<td>"+data['actual']+"</td>";
	ContentHTML+="		</tr>";
	ContentHTML+="		<tr>";
	ContentHTML+="			<td>%Target</td>";
	ContentHTML+="			<td colspan='2'><div id='perTarget-Item-"+item+"-Org-"+data['org_code']+"' class='sparkline'></div></td>";
	ContentHTML+="		</tr>";
	ContentHTML+="		<tr>";
	ContentHTML+="			<td>%Forecast</td>";
	ContentHTML+="			<td colspan='2'><div id='perForecast-Item-"+item+"-Org-"+data['org_code']+"' class='sparkline'></div></td>";
	ContentHTML+="		</tr>";
	ContentHTML+="	</tbody>";
	ContentHTML+="</table'>";
	//console.log(ContentHTML);
	return ContentHTML;
/* ### Ex.return ###
					<!-- table start -->
					<table class='tableInside table-striped'>
						<thead>
							<tr>
								<th><div class='fontBold '>Target</div></th>
								<th><div class='fontBold '>Forecast</div></th>
								<th><div class='fontBold '>Actual</div></th>
							</tr>
							
						</thead>
						<tbody>
							<tr>
								<td>4</td>
								<td>3.5</td>
								<td>3</td>
							</tr>
							<tr>
								<td>%Target</td>
								<td colspan='2'><div class='sparkline'></div></td>
								
							</tr>
							<tr>
								<td>%Forecast</td>
								<td colspan='2'><div class='sparkline'></div></td>
								
							</tr>
						</tbody>
					</table>
					<!-- table end -->
 */	
	
	
	
};
 var getDataFn = function(page,rpp){
		var year= $("#param_year").val();
		var period= $("#param_period").val();
		var app_lv= $("#param_app_lv").val();
		var org= $("#param_org_id").val();
		var kpi= $("#param_kpi_id").val();

		$.ajax({
			url : restfulURL+"/see_api/public/dashboard/content",
			type : "post",
			dataType : "json",
			data:{
				"year_id":year,
				"period_id":period,
				"level_id":app_lv,
				"org_id":org,
				"item_id":kpi		
			},
			headers:{Authorization:"Bearer "+tokenID.token},
			async:false,// w8 data 
			success : function(data) {
				galbalDashboard=data;
				listDashBoardFn(data);
				
			}
		});	
};

var getOrgFn = function(data){
	galbalDataTemp['galbalOrg'] = [];
	  if(data[0]['org']!=undefined){
	   $.each(data[0]['org'],function(index,indexEntry){
		   
		galbalDataTemp['galbalOrg'].push({"org_code":indexEntry['org_code'],"org_name":indexEntry['org']});
	    //console.log(indexEntry['org']);
	   });
	   
	   listHeaderFn(galbalDataTemp['galbalOrg']);
	  }
	  
};

var getDataKPIFn = function(page,rpp){
	var year= $("#param_year").val();
	var period= $("#param_period").val();
	var app_lv= $("#param_app_lv").val();
	var org= $("#param_org_id").val();
	var kpi= $("#param_kpi_id").val();

	$.ajax({
		url : restfulURL+"/see_api/public/dashboard/all_content",
		type : "post",
		dataType : "json",
		data:{
			"year_id":year,
			"period_id":period,
			"level_id":app_lv,
			"org_id":org,
			"item_id":kpi		
		},
		headers:{Authorization:"Bearer "+tokenID.token},
		async:false,// w8 data 
		success : function(data) {
			
			galbalDataTemp['All_KPI']=data;
			getOrgFn(data);
			listDashBoardAllKPIFn(data);
			$("#ModalKPI").modal('show');
			$("#scrollOrg *").scrollTop(0).scrollLeft(0);
			$("#subTableKPI1").html($("#tableAllKPI1 > thead").clone()).show();
			$("#subTableKPI2").html($("#tableAllKPI2 > thead").clone()).show(); 
			
			$("#scrollOrg *").unbind( "mouseenter , mouseleave, scroll" );
			$( "#scrollSubOrg1" ).bind({
			  mouseenter: function() {
			   
			    //console.log("in");
			    $("#scrollSubOrg3").unbind( "scroll" );
			    $("#scrollSubOrg2").bind("scroll", function() {
			            
								    var offset = $(this).scrollTop();
								    //console.log(offset);
								    $('#scrollSubOrg3').scrollTop(offset);
							        $('#subTableKPI1').css('margin-top', offset);
							        $('#subTableKPI2').css('margin-top', offset);

								});
			    
			    
			  },
			  mouseleave: function() {
			    $("#scrollSubOrg2").unbind("scroll");
			    //console.log("out");
			    $("#scrollSubOrg3").bind("scroll", function() {
			             //$("#scrollSubOrg2").unbind( "scroll" );
								    var offset = $(this).scrollTop();
			         
								    $('#scrollSubOrg2').scrollTop(offset);
							        $('#subTableKPI1').css('margin-top', offset);
							        $('#subTableKPI2').css('margin-top', offset);

								});
			  }
			});


			$("#scrollSubOrg3").bind("scroll", function() {
								    var offset = $(this).scrollTop();
			         
								    $('#scrollSubOrg2').scrollTop(offset);
							        $('#subTableKPI1').css('margin-top', offset);
							        $('#subTableKPI2').css('margin-top', offset);

								});
			
			setTimeout(function(){ 
				
				generateChartBulletSparkFn(data);
				//$('.sparkline').show();
				$("body").mLoading('hide');
			}, 2000);
			
		}
	});	
};

 
 var searchAdvanceFn = function (year,period,app_lv,org,kpi) {
	//embed parameter start
		
		var htmlParam="";
		htmlParam+="<input type='hidden' class='paramEmbed' id='param_year' name='param_year' value='"+year+"'>";
		htmlParam+="<input type='hidden' class='paramEmbed' id='param_period' name='param_period' value='"+period+"'>";
		htmlParam+="<input type='hidden' class='paramEmbed' id='param_app_lv' name='param_app_lv' value='"+app_lv+"'>";
		htmlParam+="<input type='hidden' class='paramEmbed' id='param_org_id' name='param_org_id' value='"+org+"'>";
		htmlParam+="<input type='hidden' class='paramEmbed' id='param_kpi_id' name='param_kpi_id' value='"+kpi+"'>";
		$(".paramEmbed").remove();
		$("body").append(htmlParam);
		//embed parameter end
		getDataFn();
};
 
var listHeaderFn=function(galbalOrg){
	 var htmlHeader1 = "";
	 var htmlHeader2 = "";
	 var htmlHeaderMain = "";
	 var htmlHeaderSummary1 = "";
	 var htmlHeaderSummary2 = "";
	 
	 htmlHeader1+="<th style='width:120px;'>";
	 htmlHeader1+="<div class='fontBold '> Perspective</div>";
	 htmlHeader1+="</th>";
	 
	 htmlHeader1+="<th style='width:237px;'>";
	 htmlHeader1+="<div class='fontBold '>KPI</div>";
	 htmlHeader1+="</th>";
	 
	 htmlHeader1+="<th style='width:60px;'>";
	 htmlHeader1+="<div class='fontBold '>UOM</div>";
	 htmlHeader1+="</th>";
	 
	 $.each(galbalOrg,function(index,indexEntry){
	  //console.log(indexEntry);
	  if(indexEntry['org_code']=="00"){
	   htmlHeaderMain+="<th style='min-width:323px;'>";
	    htmlHeaderMain+="<div class='fontBold fontCenter'>"+indexEntry['org_name']+"</div>";
	   htmlHeaderMain+="</th>";
	  }else{
	   htmlHeader2+="<th style='min-width:323px;'>";
	    htmlHeader2+="<div class='fontBold fontCenter'>"+indexEntry['org_name']+"</div>";
	   htmlHeader2+="</th>";
	  }
	 });
	 htmlHeaderSummary1+=htmlHeader1;
	 htmlHeaderSummary1+=htmlHeaderMain;
	 htmlHeaderSummary2+=htmlHeader2;
	 $("#listHeader1").html(htmlHeaderSummary1);
	 $("#listHeader2").html(htmlHeaderSummary2);
	 
	 
};

var listDashBoardFn = function(data){
	 
	 $("#accordion").empty();
	 $("#accordion").hide();
	 html = "";
	 $.each(data , function(inedx,indexEntry){
		 html+=generateAccordionHTML(inedx,indexEntry);
	 });
	 $("#accordion").html(html);
	 
	 
	 $.each(data , function(inedx,indexEntry){
//		 generateChartGaugeFn(indexEntry);
//		 generateChartBarFn(indexEntry);
		 $.when(generateChartGaugeFn(indexEntry),generateChartBarFn(indexEntry)).then(function() {
				    //console.log(inedx+" Loading Chart: Success");
		});
	 });
	 

		// Add minus icon for collapse element which is open by default
	    $(".collapse.in").each(function(){
	    	$(this).siblings(".panel-heading").find(".fa").addClass("fa-caret-down").removeClass("fa-caret-right");
	    });
	    
	    // Toggle plus minus icon on show hide of collapse element
	    $(".collapse").on('show.bs.collapse', function(){
	    	$(this).prev().css({"background": "#"+tokenID.theme_color});
	    	$(this).parent().css({"border-color": "#"+tokenID.theme_color});
	    	$(this).parent().find(".fa").removeClass("fa-caret-right").addClass("fa-caret-down");
	    	$("#btn_kpi").find(".fa").removeClass("fa-caret-down").addClass("fa-table");
	    }).on('hide.bs.collapse', function(){
	    	$(this).parent().css({"border-color": "#c5c5c5"});
	    	$(this).prev().css({"background": "#f6f6f6"});
	    	$(this).parent().find(".fa").removeClass("fa-caret-down").addClass("fa-caret-right");
	    	$("#btn_kpi").find(".fa").removeClass("fa-caret-right").addClass("fa-table");
	    });


	    //Open Parent Org

			$("#next").off("click");
			$("#next").on("click",function() {
				  //console.log("Next KPI : "+$(this).attr("data-next"));

				  			searchAdvanceFn(
									$("#param_year").val(),
									$("#param_period").val(),
									$("#param_app_lv").val(),
									$("#param_org_id").val(),
									$(this).attr("data-next"));
				  			$("#accordion").show();
				  			$("#accordion").children().children().next().eq(0).collapse('show');
				  			return false;
				  
				});
			$("#previous").off("click");
			$("#previous").on("click",function() {
				  //console.log("Next Previous : "+$(this).attr("data-previous"));
				  			
				  			searchAdvanceFn(
									$("#param_year").val(),
									$("#param_period").val(),
									$("#param_app_lv").val(),
									$("#param_org_id").val(),
									$(this).attr("data-previous"));
				  			$("#accordion").show();
				  			$("#accordion").children().children().next().eq(0).collapse('show');;
				  			return false;
				  	
				});
			$("#btn_extract").off("click");
			$("#btn_extract").click(function(event){
				  event.stopPropagation();
				  if(galbalDataTemp['extract'] == true){
					  //console.log(galbalDataTemp['extract']);
				    $("#btn_extract").find(".fa").removeClass("fa-minus-square").addClass("fa-plus-square");
				    
				    $("#accordion").children().children().next().collapse('hide');
				    galbalDataTemp['extract'] = false;
				  }
				  else if(galbalDataTemp['extract'] == false){
					  //console.log(galbalDataTemp['extract']);
					  $("#btn_extract").find(".fa").removeClass("fa-plus-square").addClass("fa-minus-square");
					  $("#btn_kpi").find(".fa").removeClass("fa-plus-square").addClass("fa-table");
					    $("#accordion").children().children().next().collapse('show');
					    galbalDataTemp['extract'] = true;
				  }
				});
			$("#btn_kpi").off("click");
			$("#btn_kpi").click(function(event){
				  event.stopPropagation();
				  event.preventDefault();
				  $("#ModalKPI").modal('hide');
				  getDataKPIFn();
				  
				  $("body").mLoading();
//				  document.body.scrollTop = 0;
//				  document.documentElement.scrollTop = 0;
				  $('html, body').animate({
				        scrollTop: $("#ModalKPI").offset().top
				    }, 0);
				  

				  
				  //http://localhost/see_api/public/dashboard/all_content
				});
			$( "#accordion" ).sortable({
				 // revert: true
				 items: '.sortableItem:not(#orgParent)'
				});
			$('#accordion').disableSelection();
 };
var listDashBoardAllKPIFn = function(data){

	var htmlData1="";
	var htmlData3="";
	 $.each(data,function(index,indexEntry){
	  var htmlData2="";
	  htmlData1+="<tr>";
	  htmlData3+="<tr>";
	   htmlData1+="<td>"+indexEntry['perspective']+"</td>";
	   htmlData1+="<td>"+indexEntry['item']+"</td>";
	   htmlData1+="<td>"+indexEntry['uom']+"</td>";
	   
	   //loop here..
	   $.each(indexEntry['org'],function(index2,indexEntry2){
	   
	   if(indexEntry2['org_code']=="00"){
	    
	    htmlData2+="<td>"; 
	    htmlData2+="<table class='tableInside table-striped'>";
	    htmlData2+="<thead>";
	    htmlData2+="<tr>";
	    htmlData2+="<th><div class='fontBold ' style='min-width:100px'>Target</div></th>";
	    htmlData2+="<th><div class='fontBold '  style='min-width:100px'>Forecast</div></th>";
	    htmlData2+="<th><div class='fontBold ' style='min-width:100px'>Actual</div></th>";
	      htmlData2+="</tr>";
	     htmlData2+="</thead>";
	     htmlData2+="<tbody>";
	      htmlData2+="<tr>";
	      htmlData2+="<td >"+addCommas(indexEntry2['target'])+"</td>";
	      htmlData2+="<td>"+addCommas(indexEntry2['forecast'])+"</td>";
	      htmlData2+="<td>"+addCommas(indexEntry2['actual'])+"</td>";
	      htmlData2+="</tr>";
	      htmlData2+="<tr>";
	      htmlData2+="<td>%Target</td>";
	      htmlData2+="<td colspan='2'><div class='sparkline' id='perTarget"+index+"-Item-"+indexEntry['item_id']+"-Org-"+indexEntry2['org_code']+"'>"+indexEntry2['percent_target_str']+"</div></td>";
	      htmlData2+="</tr>";
	      htmlData2+="<tr>";
	      htmlData2+="<td>%Forecast</td>";
	      htmlData2+="<td colspan='2'><div class='sparkline' id='perForecast"+index+"-Item-"+indexEntry['item_id']+"-Org-"+indexEntry2['org_code']+"'>"+indexEntry2['percent_forecast_str']+"</div></td>";  
	      htmlData2+="</tr>";
	     htmlData2+="</tbody>";
	    htmlData2+="</table>";
	    htmlData2+="</td>";
	    
	   }else{
	    
	    
	    htmlData3+="<td>"; 
	    htmlData3+="<table class='tableInside table-striped'>";
	    htmlData3+="<thead>";
	     htmlData3+="<tr>";
	      htmlData3+="<th><div class='fontBold ' style='min-width:100px;'>Target</div></th>";
	      htmlData3+="<th><div class='fontBold ' style='min-width:100px;'>Forecast</div></th>";
	      htmlData3+="<th><div class='fontBold ' style='min-width:100px;'>Actual</div></th>";
	      htmlData3+="</tr>";
	    htmlData3+="</thead>";
	     htmlData3+="<tbody>";
	      htmlData3+="<tr>";
	      htmlData3+="<td>"+indexEntry2['target']+"</td>";
	      htmlData3+="<td>"+indexEntry2['forecast']+"</td>";
	      htmlData3+="<td>"+indexEntry2['actual']+"</td>";
	      htmlData3+="</tr>";
	      htmlData3+="<tr>";
	       htmlData3+="<td>%Target</td>";
	       htmlData3+="<td colspan='2'><div class='sparkline' id='perTarget"+index+"-Item-"+indexEntry['item_id']+"-Org-"+indexEntry2['org_code']+"'>"+indexEntry2['percent_target_str']+"</div></td>";
	      htmlData3+="</tr>";
	      htmlData3+="<tr>";
	       htmlData3+="<td>%Forecast</td>";
	       htmlData3+="<td colspan='2'><div class='sparkline' id='perForecast"+index+"-Item-"+indexEntry['item_id']+"-Org-"+indexEntry2['org_code']+"'>"+indexEntry2['percent_forecast_str']+"</div></td>";   
	      htmlData3+="</tr>";
	      htmlData3+="</tbody>";
	    htmlData3+="</table>";
	    htmlData3+="</td>";
	    
	   }
	   
	   });
	   htmlData1+=htmlData2;
	   //htmlData1+=htmlData3;
	   //loop
	  htmlData1+="</tr>";
	  htmlData3+="</tr>";
	  
	  
	 });
	 
	 $("#listData1").html(htmlData1);
	 $("#listData2").html(htmlData3);
	 
	 //..loop chart
/*	 $.each(data,function(index,indexEntry){
		 $.each(indexEntry['org'],function(index2,indexEntry2){
			 generateChartBulletFn("perTarget"+index+"-Item-"+indexEntry['item_id']+"-Org-"+indexEntry2['org_code'],indexEntry2['percent_target'],indexEntry['color']);
			 generateChartBulletFn("perForecast"+index+"-Item-"+indexEntry['item_id']+"-Org-"+indexEntry2['org_code'],indexEntry2['percent_forecast'],indexEntry['color']);
		 });
	 });
*/	  
	 
};
 $(document).ready(function(){
	var username = $('#user_portlet').val();
	 var password = $('#pass_portlet').val();
	 if(username!="" && username!=null & username!=[] && username!=undefined ){
	 	
	 	if(connectionServiceFn(username,password)==false){
	 		return false;
	 	}
	 	//Generate DropDown List
		$("#year").html(generateDropDownList(restfulURL+"/see_api/public/dashboard/year_list","GET"));
		$("#period").html(generateDropDownList(restfulURL+"/see_api/public/dashboard/period_list","POST",{"appraisal_year":$("#year").val()}));
		$("#apprasiaLevel").html(generateDropDownList(restfulURL+"/see_api/public/appraisal/al_list","GET"));
		$("#organization").html(generateDropDownList(restfulURL+"/see_api/public/dashboard/org_list","POST",{"appraisal_level":$("#apprasiaLevel").val()}));
		$("#kpi").html((generateDropDownList(restfulURL+"/see_api/public/dashboard/kpi_list","POST",{"appraisal_level":$("#apprasiaLevel").val(),"org_id":$("#organization").val()})));
		
		//#Change Param Function
		$("#year").change(function(){$("#period").html(generateDropDownList(restfulURL+"/see_api/public/dashboard/period_list","POST",{"appraisal_year":$("#year").val()}));});
		$("#apprasiaLevel").change(function(){$("#organization").html(generateDropDownList(restfulURL+"/see_api/public/dashboard/org_list","POST",{"appraisal_level":$("#apprasiaLevel").val()}));$("#organization").change();});
		$("#organization").change(function(){$("#kpi").html((generateDropDownList(restfulURL+"/see_api/public/dashboard/kpi_list","POST",{"appraisal_level":$("#apprasiaLevel").val(),"org_id":$("#organization").val()})));});
		
		
		
		$("#btnSearchAdvance").click(function(){
			searchAdvanceFn(
					$("#year").val(),
					$("#period").val(),
					$("#apprasiaLevel").val(),
					$("#organization").val(),
					$("#kpi").val());
			$("#accordion").show();
			$("#accordion").children().children().next().eq(0).collapse('show');;
			return false;
		});
		

		
		$(".app_url_hidden").show();
		
		//binding tooltip start
		 $('[data-toggle="tooltip"]').css({"cursor":"pointer"});
		 $('[data-toggle="tooltip"]').tooltip({
			 html:true
		 });
		//binding tooltip end
		 $(".lfr-hudcrumbs").removeClass("lfr-hudcrumbs");
	 }
 });
 

 
 
 
 
 