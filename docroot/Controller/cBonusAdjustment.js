var globalData="";
var galbalDataTemp=[]; 
//var phaseArray=[];
//var globalCount=0;
var username = "";
var password = "";

var dropDrowYearListFn = function(nameArea,id){
	if(nameArea==undefined){
		nameArea="";
	}
	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/year",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		success:function(data){
			var htmlOption="";
			$.each(data,function(index,indexEntry){
				if(index==0){
					htmlOption+="<option selected='selected' value="+indexEntry['appraisal_year']+">"+indexEntry['appraisal_year']+"</option>";
				}else{
					htmlOption+="<option value="+indexEntry['appraisal_year']+">"+indexEntry['appraisal_year']+"</option>";
				}
			});
			$("#AppraisalYear"+nameArea).html(htmlOption);
		}
	});
}

var dropDrowPeriodListFn = function(){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/period",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		data:{"appraisal_year":$("#AppraisalYear").val()},
		success:function(data){
			var htmlOption="";
			$.each(data,function(index,indexEntry){
				
				htmlOption+="<option value="+indexEntry['period_id']+">"+indexEntry['appraisal_period_desc']+"</option>";
			});
			$("#AppraisalPeriod").html(htmlOption);
		}
	});
}

var dropDrowAppraisalOrgLevelFn = function(id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/organization_level",
		type:"get",
		dataType:"json",
		async:false,
		data:{"individual_level":$("#AppraisalEmpLevel").val()},
		headers:{Authorization:"Bearer "+tokenID.token},
		success:function(data){
			var htmlOption="";
			htmlOption+="<option value=''>All Level</option>";
			$.each(data,function(index,indexEntry){
				htmlOption+="<option value="+indexEntry['level_id']+">"+indexEntry['appraisal_level_name']+"</option>";
			});
			$("#AppraisalOrgLevel").html(htmlOption);
		}
	});
}

var dropDrowAppraisalEmpLevelFn = function(id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/individual_level",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		success:function(data){
			var htmlOption="";
			htmlOption+="<option value=''>All Level</option>";
			$.each(data,function(index,indexEntry){

				if(id==indexEntry['level_id']){
					htmlOption+="<option selected='selected' value="+indexEntry['level_id']+">"+indexEntry['appraisal_level_name']+"</option>";
				}else{
					htmlOption+="<option value="+indexEntry['level_id']+">"+indexEntry['appraisal_level_name']+"</option>";
				}
			});
			$("#AppraisalEmpLevel").html(htmlOption);
		}
	});
}


var dropDrowOrgFn = function(){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/organization",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		data:{"individual_level":$("#AppraisalEmpLevel").val(),"organization_level":$("#AppraisalOrgLevel").val()},
		success:function(data){
			var htmlOption="";
			htmlOption+="<option value=''>All Organization</option>";
			$.each(data,function(index,indexEntry){
				htmlOption+="<option value="+indexEntry['org_id']+">"+indexEntry['org_name']+"</option>";
			});
			$("#organization").html(htmlOption);
		}
	});
}


var dropDrowFormTypeFn = function(id){
	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/form",
		type:"get",
		dataType:"json",
		async:true,
		headers:{Authorization:"Bearer "+tokenID.token},
		success:function(data){
			var htmlOption="";
			htmlOption+="<option value=''>All Form</option>";
			$.each(data,function(index,indexEntry){
				htmlOption+="<option value="+indexEntry['appraisal_form_id']+">"+indexEntry['appraisal_form_name']+"</option>";
			});
			$("#AppraisalForm").html(htmlOption);
		}
	});
}


var dropDrowPositionFn = function(id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/position_name",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		//data:{"Position":Position},
		success:function(data){
			var htmlOption="";
			$.each(data,function(index,indexEntry){
			
					htmlOption+="<option value="+indexEntry['position_id']+">"+indexEntry['position_name']+"</option>";				
			});
			$("#Position").html(htmlOption);
		}
	});
}
var refreshMultiPosition = function() {
	$("#Position").multiselect('refresh').multiselectfilter();
	$("#Position_ms").css({'width':'100%'});
	$(".ui-icon-check,.ui-icon-closethick,.ui-icon-circle-close").css({'margin-top':'3px'});
	$('input[name=multiselect_Position]').css({'margin-bottom':'5px'});
}
var appraisalStatusFn = function () {
    $.ajax({
        url: restfulURL + "/" + serviceName + "/public/bonus/advance_search/statusJudge",
        type: "get",
        dataType: "json",
        async: false,
        headers: { Authorization: "Bearer " + tokenID.token },
        success: function (data) {
        	var htmlOption="";
//			htmlOption+="<option value=''>All Status</option>";
            $.each(data, function (index, indexEntry) {
            	htmlOption += "<option value='" + indexEntry['stage_id'] + "'>" + indexEntry['status'] + "</option>";
            });
            $("#status").html(htmlOption);
        }
    });
}

//SearchAdvance
var searchAdvanceFn = function () {

    $("#embedParamSearch").empty();
    var embedParam = "";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_appraisal_level_id_org' name='embed_appraisal_level_id_org' value='" + $("#AppraisalOrgLevel").val()+"'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_appraisal_level_id_emp' name='embed_appraisal_level_id_emp' value='" + $("#AppraisalEmpLevel").val() + "'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_period_id' name='embed_period_id' value='" + $("#AppraisalPeriod").val()+"'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_position_id' name='embed_position_id' value='" + $("#Position").val() + "'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_emp_id' name='embed_emp_id' value='"+$("#EmpName_id").val()+"'>";
//    embedParam += "<input type='hidden' class='embed_param_search' id='embed_year_list' name='embed_year_list' value='" + $("#AppraisalYear").val() + "'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_organization' name='embed_organization' value='"+$("#organization").val()+"'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_status' name='embed_status' value='" + $("#status").val() + "'>";
    embedParam += "<input type='hidden' class='embed_param_search' id='embed_appraisal_form' name='embed_appraisal_form' value='" + $("#AppraisalForm").val() + "'>";

    $("#embedParamSearch").append(embedParam);
    
    to_action();
    getDataFn();
};

//Get Data
var getDataFn = function (page, rpp) {
    var position_id = [];
    
    var level_id_org = $("#embed_appraisal_level_id_org").val();
    var level_id_emp = $("#embed_appraisal_level_id_emp").val();
    var period_id = $("#embed_period_id").val();
    var emp_id = $("#embed_emp_id").val();
    var org_id = $("#embed_organization").val();
    var status = $("#embed_status").val();
    var form = $("#embed_appraisal_form").val();
    position_id.push($("#embed_position_id").val());
    
    var test ={
    		"level_id_org" : level_id_org,
    		"level_id_emp" : level_id_emp,
    		"period_id" : period_id,
    		"position_id" : position_id,
    		"emp_id" : emp_id,
    		"org_id" : org_id,
    		"status" : status,
    		"form" : form
    }
    
    console.log(test);
    
    $.ajax({
        url: restfulURL + "/" + serviceName + "/public/bonus/adjustment",
        type: "get",
        dataType: "json",
        async: true,
        headers: { Authorization: "Bearer " + tokenID.token },
        data: {
            "page": page,
            "rpp": rpp,
            "emp_level": level_id_emp,
            "org_level": level_id_org,
            "period_id": period_id,
            "position_id": position_id,        
            "org_id": org_id,
            "emp_id": emp_id,
            "stage_id": status
        },
        success: function (data) {
            listDataFn(data['data']);
            setThemeColorFn(tokenID.theme_color);
            globalData = data;
            paginationSetUpFn(globalData['current_page'], globalData['last_page'], globalData['last_page']);
        }
    });
};

var to_action = function () {
	var status = $("#embed_status").val();
    $.ajax({
        url: restfulURL + "/" + serviceName + "/public/bonus/adjustment/to_action",
        type: "get",
        dataType: "json",
        async: true,
        data: {"stage_id": status},
        headers: { Authorization: "Bearer " + tokenID.token },
        success: function (data) {
        	var htmlOption="";
            $.each(data, function (index, indexEntry) {
            	htmlOption += "<option value='" + indexEntry['stage_id'] + "'>" + indexEntry['to_action'] + "</option>";
            });
            $("#actionToAssign").html(htmlOption);
        }
    });
}

var listDataFn = function(data){
	var htmlHTML="";
	var edit_flag = "";
	
	if(data.length==0) {
		htmlHTML +="<tr>";
		htmlHTML +="<td colspan=\"10\">";
		htmlHTML +="<div style='margin-top: 40px;margin-bottom: 40px;font-weight: bold;color: #e04747;' align='center'>No Data to Display.</div>";
		htmlHTML +="</td>";
		htmlHTML +="</tr";
		$("#list_empjudege").html(htmlHTML);
		$(".head_adjust").hide();
		return;
	}
	
	$.each(data,function (index, indexEntry) {
		
		if(indexEntry['edit_flag']==0) {
			edit_flag = "disabled";
		} else {
			edit_flag = "";
		}
		
		if(index==0) {
			indexEntry['edit_flag'] = 0;
			$("#score_name1").text(indexEntry['result_score_name1']);
			$("#score_name2").text(indexEntry['result_score_name2']);
		}
		
            htmlHTML += " <tr class=\"control-calculate\">";
            htmlHTML += " <td style=\"text-align: center;\">";
            htmlHTML += " <input style=\"margin-bottom: 5px;\" type=\"checkbox\" class=\"select-check\" id=\""+indexEntry['emp_result_id']+"\" edit_flag=\""+indexEntry['edit_flag']+"\" style=\"margin-top:-3px;\">";
            htmlHTML += " </td>";
            htmlHTML += " <td style=\"text-align: center;\">";
            htmlHTML += " "+indexEntry['emp_code']+"";
            htmlHTML += " </td>";
            htmlHTML += " <td><div style=\"margin-left: 5px;\">";
            htmlHTML += " "+indexEntry['emp_name']+"";
            htmlHTML += " </div></td>";
            htmlHTML += " <td style=\"text-align: center;\">";
            htmlHTML += " "+indexEntry['appraisal_level_name']+"";
            htmlHTML += " </td>";
            htmlHTML += " <td style=\"text-align: center;\">";
            htmlHTML += " "+indexEntry['org_name']+"";
            htmlHTML += " </td>";
            htmlHTML += " <td style=\"text-align: center;\">";
            htmlHTML += " "+indexEntry['position_name']+"";
            htmlHTML += " </td>";
            htmlHTML += " <td style=\"text-align: center;\">";
            htmlHTML += " "+indexEntry['status']+"";
            htmlHTML += " </td>";
            htmlHTML += " <td style=\"text-align: right;\">";
            htmlHTML += " <input disabled type='number' min=\"0\" style=\"text-align: right;\" class='form-control input-sm span12' value='"+indexEntry['result_score1']+"'/>";
            htmlHTML += " </td>";
            htmlHTML += " <td class=\"data-percent\">";
            htmlHTML += " <input "+edit_flag+" type='number' min=\"0.00\" max=\"100.00\" style=\"text-align: right;\" class='form-control input-sm span12 percent' total_adjust_result_score='"+indexEntry['result_score1']+"' value='"+indexEntry['percent_adjust']+"'/>";
            htmlHTML += " </td>";
            htmlHTML += " <td class=\"data-score\">";
            htmlHTML += " <input "+edit_flag+" type='number' min=\"0.00\" max=\"100.00\" style=\"text-align: right;\" class='form-control input-sm span12 score' total_adjust_result_score='"+indexEntry['result_score1']+"' value='"+indexEntry['result_score2']+"'/>";
            htmlHTML += " </td>";
            htmlHTML += " </tr>";

	});
	
	$("#list_empjudege").html(htmlHTML);
	
	$(".head_adjust").show();
	$("#statusSelectAll").prop('checked', false);
	$('#statusSelectAll').click(function () {
        if ($('#statusSelectAll').prop('checked')) {
            $(".select-check").prop('checked', true);
        } else {
            $(".select-check").prop('checked', false);;
        }
    });
	
	if(edit_flag=='disabled') {
		$("#adjust_percent,#btnAdjust").attr('disabled');
	} else {
		$("#adjust_percent,#btnAdjust").removeAttr('disabled');
	}
	
	if($("#actionToAssign").val()==null || $("#actionToAssign").val()==undefined) {
    	$("#btnSubmit").attr("disabled");
    } else {
    	$("#btnSubmit").removeAttr("disabled");
    }
	
	calculatePercentKeyup();
};

var calculatePercentKeyup = function() {
	$("#adjust_percent").keyup(function() {
		if (Number(this.value) > 100) {
	      this.value = 100;
	    }
	});
	
	$("#list_empjudege").find('.percent').keyup(function() {
		if (Number(this.value) > 100) {
			this.value = 100;
		}
		var percent = this.value;
		var adjust_result_score = Number($(this).attr("total_adjust_result_score"));
		var total = (percent/100)*adjust_result_score;
		
		console.log(total,'percent');
		$(this).closest('.control-calculate').find('.data-score').find('.score').val(total.toFixed(2));
		console.log((percent/100)*adjust_result_score);
	});
		
	$("#list_empjudege").find('.score').keyup(function() {
		var score = Number($(this).val());
		var adjust_result_score = Number($(this).attr("total_adjust_result_score"));
		var total = (score*100)/adjust_result_score;
		
		console.log(total,'score');
		$(this).closest('.control-calculate').find('.data-percent').find('.percent').val(total.toFixed(2));
		console.log((score*100)/adjust_result_score);
	});

	$("#btnAdjust").click(function() {
		var adjust_percent = Number($("#adjust_percent").val());
		var element_percent = $("#tableBonusAdjustment").find("#list_empjudege").find(".data-percent").find(".percent");
		element_percent.val(adjust_percent);
		
		$.each(element_percent.get(),function(index,indexEntry) {
			var percent = Number($(indexEntry).val());
			var adjust_result_score = Number($(indexEntry).attr("total_adjust_result_score"));
			var total = (percent/100)*adjust_result_score;
			
			console.log(total,'btnAdjust');
			$(this).closest('.control-calculate').find('.data-score').find('.score').val(total.toFixed(2));
			console.log((percent/100)*adjust_result_score);
		});
	});
}

var callFlashSlideBody =function(text,id,flashType){
	if(flashType=="error") {
		if(id!=undefined){
			$(id).html(text).show();
		}else{
			$("#information").html(text).show();
		}
	} else {
		if(id!=undefined){
			$(id).html(text).show();
		}else{
			$("#information").html(text).show();
		}
		setTimeout(function(){
			if(id!=undefined){
				$(id).hide("slow");
			}else{
				$("#information").hide("slow");
			}
		},3000);
	}
	
 	$(".btnCloseWarning").css({
 		"color": "red",
	    "cursor": "pointer",
	    "font-size": "16px",
	    "font-weight": "bold",
	    "margin-right": "5px",
	    "position": "relative",
	    "right": "20px",
	    "text-align": "right"
 	});
 	
 	$(".btnCloseWarning").click(function() {
 		$("#information").hide("slow");
 	});
}

var validationFn = function(data) {
	var btnClose="<span class=\"btnCloseWarning\">×</span>";
 	var validate = "";
 	var count = 0;
 	$.each(data, function(index, indexEntry) {

 		if (index != undefined) {
 			for (var key in indexEntry) {
 			    if (indexEntry.hasOwnProperty(key)) {
		 			if (count == 0) {
		 				validate += "<div style=\"display: flex; justify-content: space-between;\">";
		 				validate += "<span><font color='red'>* </font>" + indexEntry[key] + "</span>";
		 				validate += "<span>" + btnClose + "</span>";
		 				validate += "</div>";
		 			} else {
		 				validate += "<div><font color='red'>* </font> " + indexEntry[key] + " </div>";
		 			}
		 			
		 			count++;
 			    }
 			    
 			}
 		}

 	});
 	
 	callFlashSlideBody(validate,"#information","error");
}

var insertFn = function() {
	var stage_id = $("#actionToAssign").val();
	var detail = [];
	$.each($(".control-calculate").get(),function(index,indexEntry){
		if($(indexEntry).find('.select-check').prop('checked') && $(indexEntry).find('.select-check').attr('edit_flag')==1) {
			detail.push({
				emp_result_id		: $(indexEntry).find('.select-check').attr('id'),
				percent_adjust		: $(indexEntry).find('.data-percent').find('.percent').val(),
				adjust_result_score	: $(indexEntry).find('.data-score').find('.score').val()
			});
		}
	});
	
    $.ajax({
        url: restfulURL + "/" + serviceName + "/public/bonus/adjustment",
        type: "post",
        dataType: "json",
        async: true,
        data: {
        	"stage_id": stage_id,
        	"detail": detail
        },
        headers: { Authorization: "Bearer " + tokenID.token },
        success: function (data) {
        	if(data['status']==200) {
        		getDataFn();
        		callFlashSlide($(".lt-insert-successfully").val());
        	} else if(data['status']==400) {
        		validationFn(data['data']);
        	}
        }
    });
}


$(document).ready(function() {

	username = $('#user_portlet').val();
	password = $('#pass_portlet').val();
	var plid = $('#plid_portlet').val();

	if(username!="" && username!=null & username!=[] && username!=undefined ) {
		if(connectionServiceFn(username,password,plid)==true) {
	
			dropDrowYearListFn();
			dropDrowPeriodListFn();
			dropDrowFormTypeFn();
			dropDrowAppraisalEmpLevelFn();
			dropDrowAppraisalOrgLevelFn();
			dropDrowOrgFn();
			dropDrowPositionFn();
			appraisalStatusFn();
			
			$("#AppraisalYear").change(function(){
				dropDrowPeriodListFn();
			});
			
			$("#AppraisalEmpLevel").change(function() {
				dropDrowAppraisalOrgLevelFn();
				dropDrowOrgFn();
			});
			
			$("#AppraisalOrgLevel").change(function() {
				dropDrowOrgFn();
			});
			
			$("#Position").multiselect({minWidth:'100%;'}).multiselectfilter();
			  refreshMultiPosition();
			
			$("#EmpName").autocomplete({
		        source: function (request, response) {
		        	$.ajax({
						 url:restfulURL+"/"+serviceName+"/public/bonus/advance_search/employee_name",
						 type:"GET",
						 dataType:"json",
						 data:{
							 "employee_name":request.term,
							 "organization_id":$("#organization").val(),
							 "individual_level":$("#AppraisalEmpLevel").val()
							 },
						//async:false,
						 headers:{Authorization:"Bearer "+tokenID.token},
		                 error: function (xhr, textStatus, errorThrown) {
		                        console.log('Error: ' + xhr.responseText);
		                    },
						 success:function(data){
								response($.map(data, function (item) {
		                            return {
		                                label: item.emp_name+"("+item.emp_code+")",
		                                value: item.emp_name,
		                                emp_id: item.emp_id
		                            };
		                        }));
							
						},
						beforeSend:function(){
							$("body").mLoading('hide');	
						}
						
						});
		        },
				select:function(event, ui) {
					$("#EmpName").val(ui.item.label);
		            $("#EmpName_id").val(ui.item.emp_id);
		            galbalDataTemp['EmpName'] = ui.item.label;
		            galbalDataTemp['EmpName_id']= ui.item.emp_id;
		            return false;
		        },change: function(e, ui) {
					if ($("#EmpName").val() == galbalDataTemp['EmpName']) {
						$("#EmpName_id").val(galbalDataTemp['EmpName_id']);
					} else if (ui.item != null){
						$("#EmpName_id").val(ui.item.emp_id);
					} else {
						$("#EmpName_id").val("");
					}
		         }       
		    });
			
			//Search Start
		    $("#btnSearchAdvance").click(function () {
		        searchAdvanceFn();
		        $(".countPagination").val(10);
		        $("#rpp").remove();
		        $("#search_result").show();
		    });
		    
		    $("#btnSubmit").click(function() {
		    	insertFn();
		    });
		    
		    //binding tooltip start
		    $('[data-toggle="tooltip"]').css({"cursor":"pointer"});
		    $('[data-toggle="tooltip"]').tooltip({
		    	 html:true
		    });
		    
		    $("#advanceSearchAppraisalGroup").show();
		}
	}
});