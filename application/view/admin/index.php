<?php
/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This contains the html and JS for the admin's landing page. It is a mess at present due to time constraints.
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
?>
<h2 class="admin-index">Employees</h2>
<a class="pure-button admin-add-button" href="/admin/add_employee">Add</a>

<table id="employee-table" class="pure-table pure-table-horizontal">
    <thead>
    <tr>
        <th>Name</th>
        <th>Username</th>
        <th>Day rate</th>
        <th>Usertype</th>
        <th>Permanent</th>
        <th>Tax code</th>
        <th></th>
    </tr>
    </thead>

    <tbody>
    <?php


    foreach ($employees as $employee) {
        // For each through each employee and return a report-esque table of them
        $employeeID = $employee['employeeID'];
        $employeeFirstName = $employee['firstName'];
        $employeeLastName = $employee['lastName'];
        $employeeUsername = $employee['username'];
        $employeeDayRate = $employee['dayRate'];
        $employeeUserType = $employee['userType'];
        $employeePermanent = $employee['permanent'];
        $employeeTaxCodeName = $employee['taxCodeName'];
        print "
        <tr>
        <td>$employeeFirstName $employeeLastName</td>
        <td>$employeeUsername</td>
        <td>$employeeDayRate</td>";
        if ($employeeUserType == 0) {
            print "<td>Team Manager</td>";

        } elseif ($employeeUserType == 1) {
            print "<td>Project Manager</td>";

        } elseif ($employeeUserType == 2) {
            print "<td>Employee / Contractor</td>";

        } elseif ($employeeUserType == 3) {
            print "<td>Admin</td>";

        } else {
            print "<td>Finance Team</td>";
        }
        if ($employeePermanent == 1) {
            print "<td>Yes</td>";

        } else {
            print "<td>No</td>";
        }
        print "
        <td>$employeeTaxCodeName</td>
        <td><a class='pure-button button-xsmall' href='/admin/edit_employee/$employeeID'>edit</a></td>
    </tr>
    ";
}
?>
    </tbody>
</table>
<br>
<br>
<br>
<br>

<!-- ========================================================================== -->

<h2 class="admin-index">Tax codes</h2>
<a class="pure-button admin-add-button" href="/admin/add_taxcode">Add</a>

<table id="tax-table" class="pure-table pure-table-horizontal">
    <thead>
    <tr>
        <th>Tax Code</th>
        <th>Tax Rate</th>
        <th></th>
    </tr>
    </thead>

    <tbody>
    <?php
    // For each through each tax-code and return a report-esque table of them
    foreach ($taxcodes as $taxcode) {
        $taxID = $taxcode['taxID'];
        $taxCodeName = $taxcode['taxCodeName'];
        $taxRate = $taxcode['taxRate'];
        print   "<tr>
                    <td>$taxCodeName</td>
                    <td>$taxRate</td>
                    <td><a class='pure-button button-xsmall' href='/admin/edit_taxcode/$taxID'>edit</a></td>
                </tr>";
    }
    ?>
    </tbody>
</table>
<br>
<br>
<br>
<br>

<!-- ========================================================================== -->

<h2 class="admin-index">Clients</h2>
<a class="pure-button admin-add-button" href="/admin/add_client">Add</a>


<table id="client-table" class="pure-table pure-table-horizontal">
    <thead>
    <tr>
        <th>Name</th>
        <th>Contact</th>
        <th>Phone number</th>
        <th>Email</th>
        <th>Address</th>
        <th></th>
    </tr>
    </thead>

    <tbody>
    <?php
    // For each through each client and return a report-esque table of them
    foreach ($clients as $client) {
        $clientID = $client['clientID'];
        $clientName = $client['clientName'];
        $clientContactName = $client['clientContactName'];
        $clientPhoneNumber = $client['clientPhoneNumber'];
        $clientEmail = $client['clientEmail'];
        $clientAddress1 = $client['clientAddress1'];
        $clientAddress2 = $client['clientAddress2'];
        $clientPostCode = $client['clientPostCode'];

        print   "<tr>
                    <td>$clientName</td>
                    <td>$clientContactName</td>
                    <td>$clientPhoneNumber</td>
                    <td>$clientEmail</td>
                    <td>$clientAddress1, $clientAddress2, $clientPostCode</td>
                    <td><a class='pure-button button-xsmall' href='/admin/edit_client/$clientID'>edit</a></td>
                </tr>";
    }
    ?>
    </tbody>
</table>
<br>
<br>
<br>
<br>

<!-- ========================================================================== -->

<h2 class="admin-index">Projects</h2>
<a class="pure-button admin-add-button" href="/admin/add_project">Add</a>


<table id="project-table" class="pure-table pure-table-horizontal">
    <thead>
    <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Colour Code</th>
        <th>Client</th>
        <th></th>
    </tr>
    </thead>

    <tbody>
    <?php
    // For each through each project and return a report-esque table of them
    foreach ($projects as $project) {
        $projectID = $project['projectID'];
        $projectName = $project['projectName'];
        $projectDescription = $project['projectDescription'];
        $projectColour = $project['projectColour'];
        $projectClientName = $project['clientName'];

        print   "<tr>
                    <td>$projectName</td>
                    <td>$projectDescription</td>
                    <td><span style='color:$projectColour'>&#11044;</span></td>
                    <td>$projectClientName</td>
                    <td><a class='pure-button button-xsmall' href='/admin/edit_project/$projectID'>edit</a></td>
                </tr>";
        }
    ?>
    </tbody>
</table>

<script type="text/javascript">

    // Adds extra functionality to the employeee table
    $(document).ready(function() {
        $('#employee-table').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
                'print'
            ]
        } );
    } );
</script>

<script type="text/javascript">

    // Adds extra functionality to the tax table
    $(document).ready(function() {
        $('#tax-table').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
                'print'
            ]
        } );
    } );
</script>

<script type="text/javascript">

    // Adds extra functionality to the client table
    $(document).ready(function() {
        $('#client-table').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
                'print'
            ]
        } );
    } );
</script>

<script type="text/javascript">

    // Adds extra functionality to the project table
    $(document).ready(function() {
        $('#project-table').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
                'print'
            ]
        } );
    } );
</script>

<script type="text/javascript">

    $("#addemmployeeform").submit(function (ev) {

        ev.preventDefault();

        // submit using AJAX
        var f = $("#addemmployeeform");
        $.post("/admin/add_employee", f.serialize(), function (result) {
            console.log(result["message"]);
            $("#submit-error").html(result["message"]);
            if (result["success"] == 1) {
                location.reload();
            }
        });

    });

    $(document).ready(function () {
        $("#firstname").focus();
    });
</script>