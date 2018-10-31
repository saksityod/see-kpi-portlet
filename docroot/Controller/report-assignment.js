var globalData="";
var galbalDataTemp=[]; 
var phaseArray=[];
var globalCount=0;
var username = "";
var password = "";
//Variable to store your files
var files;
var emailLinkAppraisal = false;

var getDataFn = function() {
	 $("body").mLoading('show'); //Loading
	var AppraisalYear= $("#AppraisalYear").val();
	var AppraisalPeriod= $("#AppraisalPeriod").val();
	var AppraisalEmpLevel= $("#AppraisalEmpLevel").val();
	var AppraisalOrgLevel= $("#AppraisalOrgLevel").val();
	var organization = $("#organization").val()==null ? '' : $("#organization").val().toString();
	var EmpName_id= $("#EmpName_id").val();
	var Position_id= $("#Position_id").val();
	var output_type = $("#output_type").val();
	var parameter = {};
	var template_name ="";
	  
	if (organization==''){
		 $("body").mLoading('hide'); //Loading
		callFlashSlide("Organization is Require !");
		return false;
	}

	parameter = {
			param_year: AppraisalYear,
			param_org_id: organization,
			param_period: AppraisalPeriod,
			param_position: Position_id,
			param_emp: EmpName_id,
			param_level_emp: AppraisalEmpLevel,
			param_level_org: AppraisalOrgLevel
		  };
	
	  var data = JSON.stringify(parameter);
	  var url_report_jasper = restfulURL+"/"+serviceName+"/public/generateAuth?template_name=report-appraisal-summary&token="+tokenID.token+"&template_format=xlsx&used_connection=1&inline=1&data="+data;
//			window.open(url_report_jasper,"_blank");
	
	 if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		 window.open(url_report_jasper,"_blank");
		} else {
			$('#iFrame_report').attr('src',url_report_jasper);
		}
		$("body").mLoading('hide'); //Loading
		return false;
	 
};


var dropDrowYearListFn = function(nameArea,id){
	if(nameArea==undefined){
		nameArea="";
	}
	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/appraisal/year_list_assignment",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		success:function(data){
			//var data=['à¸—à¸”à¸¥à¸­à¸‡à¸‡à¸²à¸™','à¸›à¸£à¸°à¸ˆà¸³à¸›à¸µ','à¸£à¸±à¸�à¸©à¸²à¸�à¸²à¸£'];
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
	
	dropDrowPeriodListFn($("#AppraisalYear").val());
}



var dropDrowPeriodListFn = function(year, id) { //period
  $.ajax({
    url: restfulURL + "/" + serviceName + "/public/appraisal/period_list",
    type: "get",
    dataType: "json",
    async: false,
    headers: {
      Authorization: "Bearer " + tokenID.token
    },
    data: {
      "appraisal_year": year
    },
    success: function(data) {
      var htmlOption = "";
      $.each(data, function(index, indexEntry) {
        if (id == indexEntry['period_id']) {
          htmlOption += "<option selected='selected' value=" + indexEntry['period_id'] + ">" + indexEntry['appraisal_period_desc'] + "</option>";
        } else {
          htmlOption += "<option value=" + indexEntry['period_id'] + ">" + indexEntry['appraisal_period_desc'] + "</option>";
        }
      });
      $("#AppraisalPeriod").html(htmlOption);
    }
  });
}


var dropDrowAppraisalEmpLevelFn = function(id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/appraisal/parameter/emp_level",
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
		    dropDrowIndividualOrgLevelFn($("#AppraisalEmpLevel").val());
		}
	});
	//dropDrowIndividualOrgLevelFn();
}

var dropDrowIndividualOrgLevelFn = function(id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/appraisal/parameter/org_level_individual",
		//url:restfulURL+"/"+serviceName+"/public/appraisal_assignment/al_list_emp_org",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		data:{"level_id": $("#AppraisalEmpLevel").val()},
		//data:{"emp_code":session_emp_code,"level_id":$("#AppraisalEmpLevel").val()},
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
			$("#AppraisalOrgLevel").html(htmlOption);
		}
	});
	dropDrowIndividualOrgFn();
}


var dropDrowIndividualOrgFn = function(appraisalLevelId,id){
	
	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/appraisal/parameter/org_individual",
		//url:restfulURL+"/"+serviceName+"/public/"+service_url_Check+"",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		//data:{"level_id":$("#AppraisalOrgLevel").val(),"emp_code":session_emp_code,"level_id_emp":$("#AppraisalEmpLevel").val()},
		data:{"emp_level":$("#AppraisalEmpLevel").val(), "org_level":$("#AppraisalOrgLevel").val()},
		success:function(data){
			var htmlOption="";
			$.each(data,function(index,indexEntry){
				if(id==indexEntry['org_id']){
					htmlOption+="<option value="+indexEntry['org_id']+">"+indexEntry['org_name']+"</option>";
				}else{
					htmlOption+="<option value="+indexEntry['org_id']+">"+indexEntry['org_name']+"</option>";
				}
			});
			$("#organization").html(htmlOption);
		}
	});
}



var dropDrowAppraisalOrgLevelFn = function(id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/appraisal/parameter/org_level",
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
			$("#AppraisalOrgLevel").html(htmlOption);
		}
	});
		dropDrowIndividualOrgFn($("#AppraisalOrgLevel").val());
}



var dropDrowOrgFn = function(appraisalLevelId,id){

	$.ajax({
		url:restfulURL+"/"+serviceName+"/public/org",
		type:"get",
		dataType:"json",
		async:false,
		headers:{Authorization:"Bearer "+tokenID.token},
		data:{"level_id":appraisalLevelId},
		success:function(data){
			var htmlOption="";
			$.each(data,function(index,indexEntry){
				if(id==indexEntry['org_id']){
					htmlOption+="<option value="+indexEntry['org_id']+">"+indexEntry['org_name']+"</option>";
				}else{
					htmlOption+="<option value="+indexEntry['org_id']+">"+indexEntry['org_name']+"</option>";
				}
			});
			$("#organization").html(htmlOption);
		}
	});
}

var refreshMultiOrganization = function() {
	$("#organization").multiselect('refresh').multiselectfilter();
	$("#organization_ms").css({'width':'100%'});
	$(".ui-icon-check,.ui-icon-closethick,.ui-icon-circle-close").css({'margin-top':'3px'});
	$('input[name=multiselect_organization]').css({'margin-bottom':'5px'});
}



$(document).ready(function() {

  var username = $('#user_portlet').val();
  var password = $('#pass_portlet').val();
  var plid = $('#plid_portlet').val();
  if (username != "" && username != null & username != [] && username != undefined) {

    if (connectionServiceFn(username, password, plid) == false) {
      return false;
    }
    $('[data-toggle="tooltip"]').css({
      "cursor": "pointer"
    });
    $('[data-toggle="tooltip"]').tooltip({
      html: true
    });

    var dataClearParam = [{
        'id': '#Position',
        'val': ""
      },
      {
        'id': '#Position_id',
        'val': ""
      },
      {
        'id': '#EmpName',
        'val': ""
      },
      {
        'id': '#EmpName_id',
        'val': ""
      }
    ];

    var dataSetParam = [{
        'id': '#Position',
        'val': "" + cMain_position_name + ""
      },
      {
        'id': '#Position_id',
        'val': cMain_position_id
      },
      {
        'id': '#EmpName',
        'val': "" + cMain_emp_name + "(" + session_emp_code + ")"
      },
      {
        'id': '#EmpName_id',
        'val': cMain_emp_id
      },
      {
        'id': '#AppraisalEmpLevel',
        'val': "" + cMain_level_id + ""
      }
    ];

    // run list
    dropDrowYearListFn();
    dropDrowAppraisalEmpLevelFn();
    dropDrowAppraisalOrgLevelFn();
    
    
    $("#AppraisalYear").change(function() {
        dropDrowPeriodListFn($(this).val());
      });
    
    $("#AppraisalEmpLevel").change(function() {
      clearParamSearch(dataClearParam); // in cMain.js
      dropDrowIndividualOrgLevelFn($(this).val());
      refreshMultiOrganization();
    });

    $("#AppraisalOrgLevel").change(function() {
      clearParamSearch(dataClearParam); // in cMain.js
      dropDrowIndividualOrgFn($(this).val());
      refreshMultiOrganization();
    });

    $("#organization").change(function() {
      clearParamSearch(dataClearParam); // in cMain.js
    });
    
    setParamSearch(dataSetParam); // in cMain.js

    //Auto complete Start
    $("#Position").autocomplete({
      source: function(request, response) {
        $.ajax({

          url: restfulURL + "/" + serviceName + "/public/appraisal/parameter/auto_position_list",
          type: "post",
          dataType: "json",
          async: false,
          headers: {
            Authorization: "Bearer " + tokenID.token
          },
          data: {
            "emp_code": request.term
          },
          data: {
            "position_name": request.term,
            "emp_name": ($("#EmpName_id").val() == "" ? "" : $("#EmpName").val().split("(")[0]),
            "org_id_multi": $("#organization").val()==null ? "" : $("#organization").val().toString()
          },

          //async:false,
          headers: {
            Authorization: "Bearer " + tokenID.token
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('Error: ' + xhr.responseText);
          },
          success: function(data) {

            response($.map(data, function(item) {
              return {
                label: item.position_name,
                value: item.position_name,
                position_id: item.position_id

              };
            }));

          },
          beforeSend: function() {
            $("body").mLoading('hide');
          }

        });
      },
      select: function(event, ui) {
        $("#Position").val(ui.item.value);
        $("#Position_id").val(ui.item.position_id);
        galbalDataTemp['position_name'] = ui.item.label;
        galbalDataTemp['position_id'] = ui.item.position_id;
        return false;
      },
      change: function(e, ui) {


        if ($("#Position").val() == galbalDataTemp['position_name']) {
          $("#Position_id").val(galbalDataTemp['position_id']);
        } else if (ui.item != null) {
          $("#Position_id").val(ui.item.position_id);
        } else {
          $("#Position_id").val("");
        }
      }
    });
		
    var empNameAutoCompelteChangeToPositionName = function(name) {
      $.ajax({
        url: restfulURL + "/" + serviceName + "/public/appraisal/parameter/auto_position_list",
        type: "post",
        dataType: "json",
        async: false,
        headers: {
          Authorization: "Bearer " + tokenID.token
        },
        data: {
          "emp_name": name
        },
        success: function(data) {
          if (data.length !== 0) {
            $("#Position_id").val(data[0].position_id);
            $("#Position").val(data[0].position_name);
            galbalDataTemp['position_name'] = data[0].position_name;
            galbalDataTemp['position_id'] = data[0].position_id;
          }
        }
      });
    }

    $("#EmpName").autocomplete({

      source: function(request, response) {
        $.ajax({
          url: restfulURL + "/" + serviceName + "/public/appraisal/parameter/auto_emp_list",
          type: "GET",
          dataType: "json",
          data: {
            "emp_name": request.term,
            "emp_code": session_emp_code,
            "org_id_multi": $("#organization").val()==null ? "" : $("#organization").val().toString(),
            "level_id": $("#AppraisalEmpLevel").val()
          },
          //async:false,
          headers: {
            Authorization: "Bearer " + tokenID.token
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('Error: ' + xhr.responseText);
          },
          success: function(data) {
            console.log(data)
            response($.map(data, function(item) {
              return {
                label: item.emp_name + "(" + item.emp_code + ")",
                value: item.emp_name,
                emp_id: item.emp_id,
                emp_code: item.emp_code
              };
            }));

          },
          beforeSend: function() {
            $("body").mLoading('hide');
          }

        });
      },
      select: function(event, ui) {
        $("#EmpName").val(ui.item.label);
        $("#EmpName_id").val(ui.item.emp_id);
        galbalDataTemp['EmpName'] = ui.item.label;
        galbalDataTemp['EmpName_id'] = ui.item.emp_id;
        empNameAutoCompelteChangeToPositionName(ui.item.value);
        return false;
      },
      change: function(e, ui) {
        if ($("#EmpName").val() == galbalDataTemp['EmpName']) {
          $("#EmpName_id").val(galbalDataTemp['EmpName_id']);
        } else if (ui.item != null) {
          $("#EmpName_id").val(ui.item.emp_id);
        } else {
          $("#EmpName_id").val("");

        }

      }
    });

    $("#btnExport").click(function(){
    	getDataFn();
	});
    
    $(".app_url_hidden").show();
		
  }
  

  $("#organization").multiselect({minWidth:'100%;'}).multiselectfilter();
  refreshMultiOrganization();
});
