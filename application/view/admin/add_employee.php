<?php
/**
 * Anna Thomas
 * s4927945@bournemouth.ac.uk
 * May 2017
 * Admin controller
 *
 * This class contains the HTML and JS for the add employee screen on the admin page
 *
 * Each function is lightly commented with the first few functions being more heavily commented due to time constraints
 * some degree of code repetition.
 *
 */
?>

<h2>Add Employee</h2>

<form id="addemmployeeform" class="pure-form pure-form-aligned">
    <fieldset>

        <div class="pure-control-group">
            <label for="firstname">First name:</label>
            <input type="text"  required id="firstname" name="firstname" placeholder="Enter first name">
        </div>

        <div class="pure-control-group">
            <label for="lastname">Last name:</label>
            <input type="text"  required id="lastname" name="lastname" placeholder="Enter last name">
        </div>

        <div class="pure-control-group">
            <label for="username">Username:</label>
            <input type="text" required id="username" name="username" placeholder="Choose username">
        </div>

        <div class="pure-control-group">
            <label for="password">Password:</label>
            <input type="password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,60}" id="password" name="password" placeholder="Choose password">
            <span class="pure-form-message-inline">One number and capital required, min length 8.</span>
        </div>

        <div class="pure-control-group">
            <label for="dayrate">Daily rate:</label>
            <input type="number" size="4" min="0" max="9999" required id="dayrate" name="dayrate" placeholder="Enter daily rate">
        </div>

        <div class="pure-control-group">
            <label for="usertype">Position:</label>
            <select required id="usertype" name="usertype">
                <option selected disabled value=''>Please choose</option>
                <option value='0'>Team Manager</option>
                <option value='1'>Project Manager</option>
                <option value='2'>Employee / Contractor</option>
                <option value='3'>Admin</option>
                <option value='4'>Finance Team</option>
            </select>
        </div>

        <div class="pure-control-group">
            <label for="permanent">Permanent employee:</label>
            <input type="radio" name="permanent" value="1" required> Yes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" name="permanent" value="0"> No
        </div>

        <div class="pure-control-group">
            <label for="taxid">Taxcode:</label>
            <select required id="taxid" name="taxid">
                <option selected disabled value=''>Please choose</option>
                <?php
                // for each through each tax code and generate the dropdown for different tax codes
                foreach ($taxcodes as $taxcode) {
                    $taxID = $taxcode['taxID'];
                    $taxCodeName = $taxcode['taxCodeName'];
                    print "<option value='$taxID'>$taxCodeName</option>";
                }
                ?>
            </select>
        </div>

        <div class="pure-controls">
            <input type="submit" value="Save" class="pure-button pure-button-primary" />
            <a class="pure-button" href="javascript:$(location).attr('href', '/admin');">Cancel</a>

            <span id="submit-error"></span>
        </div>

    </fieldset>
</form>

<script type="text/javascript">

    $("#addemmployeeform").submit(function (ev) {

        ev.preventDefault();

        // submit using AJAX
        var f = $("#addemmployeeform");
        $.post("/admin/do_add_employee", f.serialize(), function (result) {
            console.log(result["message"]);
            $("#submit-error").html(result["message"]);
            if (result["success"] == 1) {
                $(location).attr('href', '/admin');
            }
        });

    });

    $(document).ready(function () {
        $("#firstname").focus();
    });
</script>