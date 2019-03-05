<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ taglib uri="http://alloy.liferay.com/tld/aui" prefix="aui"%>
<%@ page import="javax.portlet.*"%>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ page import="com.liferay.portal.kernel.util.WebKeys" %>
<liferay-theme:defineObjects />
<portlet:defineObjects />

<% 

/*
PortletSession portletSession1 = renderRequest.getPortletSession();
portletSession1.setAttribute("password", "authenticated", PortletSession.APPLICATION_SCOPE);
String pwd = (String) portletSession1.getAttribute("password", PortletSession.APPLICATION_SCOPE);
out.print(pwd);
String password=PortalUtil.getUser(request).getPassword();
*/

String username = themeDisplay.getUser().getScreenName();
String password = (String)request.getSession().getAttribute(WebKeys.USER_PASSWORD);
layout = themeDisplay.getLayout();
plid = layout.getPlid();

%>
<input type="hidden" id="user_portlet" name="user_portlet" value="<%=username%>">
<input type="hidden" id="pass_portlet" name="pass_portlet" value="<%=password%>">
<input type="hidden" id="url_portlet" name="url_portlet" value="<%= renderRequest.getContextPath() %>">
<input type="hidden" id="plid_portlet" name="plid_portlet" value="<%= plid %>">

 <style>
	.aui #breadcrumbs {
   	 margin-bottom: 0px;
	}
		.aui .portlet-content, .aui .portlet-minimized .portlet-content-container {
 		 background-color: #fafafa;
	}

	.titlePanelSearch{
	    font-size: 14px;
	    font-weight: bold;
	    margin-left: 5px;
	    margin-right: 5px;
	    padding-top: 0px;
    }
    
    .breadcrumbs2{

		background: rgba(0, 0, 0, 0) linear-gradient(to bottom, #fff 0px, #f6f6f6 47%, #ededed 100%) repeat scroll 0 0;
	    border-radius: 0;
	    margin-bottom: 0;
	  	padding-bottom: 0px

}
.aui .ibox-title{
	min-height: 0px;
}

.aui .ibox-title label{
	padding-top: 5px;
}
/* Update by au */
.aui .btn {
	font-size: 14px;
 	padding: 4px 12px; 
	width: auto;
	margin-top: 0px;
	display: inline;
}
.aui select, .aui textarea, .aui input[type="text"], .aui input[type="password"], .aui input[type="datetime"], .aui input[type="datetime-local"], .aui input[type="date"], .aui input[type="month"], .aui input[type="time"], .aui input[type="week"], .aui input[type="number"], .aui input[type="email"], .aui input[type="url"], .aui input[type="search"], .aui input[type="tel"], .aui input[type="color"], .aui .uneditable-input {
    height: 30px;
    padding: none;
    font-size: 14px;
}
</style>

<!-- 
<iframe id="myIframe" src="" height="300px"   width="100%" scrolling="yes" frameborder="0"></iframe>
 -->
 
 
<div class='row-fluid'>
	<div id="slide_status" class='span12'>
		<div id="btnCloseSlide">×</div>
		<div id="slide_status_area"></div>
	</div>
</div>

<!--  #####################Content data here ######################-->
<div class="container1 app_url_hidden">
	<div class="row-fluid">
		<div class="span12">
			<div class="ibox float-e-margins">
				<div class="ibox-title">
					<div class='titlePanelSearch'>Calculate Salary</div>
				</div>
				<div class="ibox-content breadcrumbs2">
					<div class="row-fluid ">

						<div class="form-group pull-left span3"
							style="margin-left: 5px; margin-bottom: 3px;">
							<select id="dorpDownRaiseAppraisalYear"
								class="input form-control input-sm span12" data-toggle="tooltip"
								data-original-title="Appraisal Year" title="Appraisal Year">
								<!-- Generate by dropDrowPeriodFn() -->
							</select>
						</div>

						<div class="form-group pull-left span3"
							style="margin-left: 5px; margin-bottom: 3px;">
							<select id="dorpDownSalaryPeriod"
								class="input form-control input-sm span12" data-toggle="tooltip"
								data-original-title="Salary Period" title="Salary Period">
								<!-- Generate by dropDrowPeriodFn() -->
							</select>
						</div>

						<div class="form-group pull-right m-b-none "
							style="margin-bottom: 5px;">
							<button type="button" class="btn btn-info input-sm"
								name="btnCalRaiseAmount" id="btnCalRaiseSalary">
								<i class="glyphicon glyphicon-log-in"></i>&nbsp;Calculate Salary
							</button>
						</div>
					</div>
				</div>
				<!-- content end -->
			</div>
		</div>
	</div>
	<!-- end--row-fluid -->
</div>


<!-- Modal Confirm Start -->
<div aria-hidden="true" role="dialog" tabindex="-1" id="confrimModal"
	class="modal inmodal in"
	style="width: 400px; left: calc; display: none;">
	<div class="modal-dialog">
		<div class="modal-content  bounceInRight">
			<div class="modal-header">
				<button data-dismiss="modal" class="close" type="button"
					style="padding-top: 3px">
					<span aria-hidden="true"><i class='fa fa-times'></i></span>
				</button>
				<h5 class="modal-title">Please Confirm</h5>
			</div>
			<div class="modal-body">
				<!-- content start -->
				<!-- <h2><i class="fa fa fa-pencil-square-o icon-title"></i> ADD NEW GRADE</h2>
                <hr>
                 -->
				<!-- form start -->
				<div class="form-kpi-mangement">
					<div class="form-kpi-label" align="center">

						<label>Calculate Salary Confirm ?</label>
						<div id="inform_on_confirm" class='information'></div>
					</div>
				</div>

				<!-- form start -->
				<!-- content end -->
			</div>
			<div class="modal-footer">
				<div align="center">
					<button class="btn btn-success" id="btnConfirmOK" type="button">
						&nbsp;&nbsp;<i class="fa fa-check-circle"></i>&nbsp;&nbsp;Yes&nbsp;&nbsp;
					</button>
					&nbsp;&nbsp;
					<button data-dismiss="modal" class="btn btn-danger" type="button">
						<i class="fa fa-times-circle"></i>&nbsp;Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Modal Confirm End -->

 <!--  #####################Content data here ######################-->


 
 